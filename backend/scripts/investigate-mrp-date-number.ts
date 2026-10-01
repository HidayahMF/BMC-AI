import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { closeSqlServer, getSqlServerPool } from '../src/config/sqlserver.js';

const root = join(process.cwd(), '..', 'semantic', 'catalog');
const pool = await getSqlServerPool();

try {
  const datePatternSql = `
    SELECT
      CASE
        WHEN MRPDate IS NULL THEN 'NULL'
        WHEN MRPDate LIKE '[0-9][0-9]/[0-9][0-9]/[0-9][0-9][0-9][0-9]' THEN 'NN/NN/NNNN'
        WHEN MRPDate LIKE '[0-9][0-9]-[0-9][0-9]-[0-9][0-9][0-9][0-9]' THEN 'NN-NN-NNNN'
        WHEN MRPDate LIKE '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]' THEN 'NNNN-NN-NN'
        WHEN MRPDate LIKE '[0-9][0-9][0-9][0-9][0-9][0-9]' THEN 'NNNNNN'
        ELSE 'OTHER'
      END AS pattern,
      COUNT_BIG(*) AS row_count
    FROM dbo.PURCH_MRP
    GROUP BY CASE
      WHEN MRPDate IS NULL THEN 'NULL'
      WHEN MRPDate LIKE '[0-9][0-9]/[0-9][0-9]/[0-9][0-9][0-9][0-9]' THEN 'NN/NN/NNNN'
      WHEN MRPDate LIKE '[0-9][0-9]-[0-9][0-9]-[0-9][0-9][0-9][0-9]' THEN 'NN-NN-NNNN'
      WHEN MRPDate LIKE '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]' THEN 'NNNN-NN-NN'
      WHEN MRPDate LIKE '[0-9][0-9][0-9][0-9][0-9][0-9]' THEN 'NNNNNN'
      ELSE 'OTHER'
    END
    ORDER BY row_count DESC`;
  const patterns = (await pool.request().query(datePatternSql)).recordset.map((row: Record<string, unknown>) => ({ pattern: row.pattern, rowCount: Number(row.row_count ?? 0) }));

  const grouping = (await pool.request().query(`SELECT COUNT_BIG(*) AS document_count, MIN(row_count) AS min_rows, MAX(row_count) AS max_rows, AVG(CONVERT(float,row_count)) AS average_rows, SUM(CASE WHEN row_count=1 THEN 1 ELSE 0 END) AS single_row_documents, SUM(CASE WHEN row_count>1 THEN 1 ELSE 0 END) AS multi_row_documents FROM (SELECT MRPNo, COUNT_BIG(*) AS row_count FROM dbo.PURCH_MRP WHERE MRPNo IS NOT NULL GROUP BY MRPNo) grouped`)).recordset[0] as Record<string, unknown>;
  const nullContext = (await pool.request().query(`SELECT COUNT_BIG(*) AS null_mrp_no_rows, COUNT(DISTINCT Tipe) AS distinct_tipe, SUM(CASE WHEN Status IS NULL THEN 1 ELSE 0 END) AS null_status, SUM(CASE WHEN MRPDate IS NULL THEN 1 ELSE 0 END) AS null_mrp_date, COUNT(DISTINCT DepartId) AS distinct_departments FROM dbo.PURCH_MRP WHERE MRPNo IS NULL`)).recordset[0] as Record<string, unknown>;

  const modules = (await pool.request().query<{ objectName: string; typeDescription: string; definition: string }>(`SELECT o.name AS objectName, o.type_desc AS typeDescription, m.definition FROM sys.sql_modules m JOIN sys.objects o ON o.object_id=m.object_id WHERE m.definition LIKE '%MRPDate%' OR m.definition LIKE '%MonthDate%'`)).recordset;
  const codeEvidence = modules.map((row) => ({ object: row.objectName, type: row.typeDescription, operations: { select: /\bSELECT\b/i.test(row.definition), where: /\bWHERE\b/i.test(row.definition), groupBy: /\bGROUP\s+BY\b/i.test(row.definition), orderBy: /\bORDER\s+BY\b/i.test(row.definition), convert: /\bCONVERT\s*\(/i.test(row.definition), cast: /\bCAST\s*\(/i.test(row.definition), datePart: /\bDATEPART\s*\(/i.test(row.definition) }, contextCount: (row.definition.match(/MRPDate|MonthDate/gi) ?? []).length }));

  const report = {
    generatedAt: new Date().toISOString(),
    source: 'dbo.PURCH_MRP',
    datePatterns: patterns,
    mrpNoGrouping: { documentCount: Number(grouping.document_count ?? 0), minRows: Number(grouping.min_rows ?? 0), maxRows: Number(grouping.max_rows ?? 0), averageRows: Number(grouping.average_rows ?? 0), singleRowDocuments: Number(grouping.single_row_documents ?? 0), multiRowDocuments: Number(grouping.multi_row_documents ?? 0) },
    nullMrpNoContext: { rows: Number(nullContext.null_mrp_no_rows ?? 0), distinctTipe: Number(nullContext.distinct_tipe ?? 0), nullStatus: Number(nullContext.null_status ?? 0), nullMrpDate: Number(nullContext.null_mrp_date ?? 0), distinctDepartments: Number(nullContext.distinct_departments ?? 0) },
    codeEvidence,
    decisions: { mrpNumber: { meaning: 'business document/group identifier candidate', confidence: 'PROBABLE', queryable: false }, mrpDate: { meaning: 'UNRESOLVED_DATE_OR_PERIOD', semanticField: null, confidence: 'UNKNOWN', queryable: false }, qty: { meaning: 'UNRESOLVED', queryable: false } },
    security: { rawRowsPersisted: false, databaseMutation: false, geminiInvolved: false }
  };
  await mkdir(root, { recursive: true });
  await writeFile(join(root, 'mrp-date-number-evidence.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ datePatterns: report.datePatterns, mrpNoGrouping: report.mrpNoGrouping, codeReferences: report.codeEvidence.length }, null, 2));
} finally {
  await closeSqlServer();
}
