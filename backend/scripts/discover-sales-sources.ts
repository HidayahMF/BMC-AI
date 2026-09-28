import { mkdir, writeFile } from 'node:fs/promises';
import sql from 'mssql';
import { closeSqlServer, getSqlServerPool } from '../src/config/sqlserver.js';

type ObjectRow = { schemaName: string; objectName: string; objectType: 'TABLE' | 'VIEW'; rows: number };
type ColumnRow = { schemaName: string; objectName: string; columnName: string; dataType: string; isNullable: string; ordinal: number };
type DateSummary = { column: string; minValue: string | null; maxValue: string | null };
type Candidate = ObjectRow & { flags: string[]; dateColumns: DateSummary[]; columns: ColumnRow[]; sample: Record<string, unknown>[]; dependencies: string[]; score: number };

const domain = /sales|salesorder|order|sls_|po|delivery|product|forecast/i;
const columnDomain = /customer|cust|po|order|sales|part|product|material|qty|quantity|date|tanggal|status|delivery/i;
const dateType = /date|datetime|smalldatetime|time/i;
const penalty = /backup|old|temp|tmp|bak|archive|trial|copy/i;
const identifier = (value: string) => `[${value.replace(/]/g, ']]')}]`;
const qualified = (schema: string, name: string) => `${identifier(schema)}.${identifier(name)}`;

async function queryCount(pool: sql.ConnectionPool, object: ObjectRow) {
  try {
    const result = await pool.request().query<{ rows: number }>(`SELECT COUNT_BIG(*) AS rows FROM ${qualified(object.schemaName, object.objectName)}`);
    return Number(result.recordset[0]?.rows ?? 0);
  } catch {
    return 0;
  }
}

async function main() {
  const pool = await getSqlServerPool();
  const metadata = await pool.request().query<ObjectRow>(`SELECT s.name AS schemaName, o.name AS objectName, CASE WHEN o.type = 'V' THEN 'VIEW' ELSE 'TABLE' END AS objectType, CAST(0 AS bigint) AS rows FROM sys.objects o JOIN sys.schemas s ON s.schema_id = o.schema_id WHERE o.type IN ('U', 'V') AND (o.name LIKE '%SALES%' OR o.name LIKE '%ORDER%' OR o.name LIKE '%SLS[_]%' OR o.name LIKE '%PO%' OR o.name LIKE '%DELIVERY%' OR o.name LIKE '%PRODUCT%' OR o.name LIKE '%FORECAST%') ORDER BY o.name`);
  const columns = await pool.request().query<ColumnRow>(`SELECT s.name AS schemaName, o.name AS objectName, c.name AS columnName, t.name AS dataType, c.is_nullable AS isNullable, c.column_id AS ordinal FROM sys.objects o JOIN sys.schemas s ON s.schema_id = o.schema_id JOIN sys.columns c ON c.object_id = o.object_id JOIN sys.types t ON t.user_type_id = c.user_type_id WHERE o.type IN ('U', 'V') ORDER BY o.name, c.column_id`);
  const byObject = new Map<string, ColumnRow[]>();
  for (const column of columns.recordset) { const key = `${column.schemaName}.${column.objectName}`; byObject.set(key, [...(byObject.get(key) ?? []), column]); }
  const objects: ObjectRow[] = [];
  for (const object of metadata.recordset) {
    const objectColumns = byObject.get(`${object.schemaName}.${object.objectName}`) ?? [];
    if (domain.test(object.objectName) || objectColumns.some((column) => columnDomain.test(column.columnName))) objects.push({ ...object, rows: await queryCount(pool, object) });
  }
  objects.sort((a, b) => b.rows - a.rows || a.objectName.localeCompare(b.objectName));

  const candidates: Candidate[] = [];
  for (const object of objects) {
    const objectColumns = byObject.get(`${object.schemaName}.${object.objectName}`) ?? [];
    const dates: DateSummary[] = [];
    for (const column of objectColumns.filter((item) => dateType.test(item.dataType) && /date|tanggal|period|created|updated|input|order|po|delivery|invoice|terima/i.test(item.columnName)).slice(0, 12)) {
      try {
        const result = await pool.request().query<{ minValue: string | null; maxValue: string | null }>(`SELECT MIN(${identifier(column.columnName)}) AS minValue, MAX(${identifier(column.columnName)}) AS maxValue FROM ${qualified(object.schemaName, object.objectName)} WHERE ${identifier(column.columnName)} IS NOT NULL`);
        dates.push({ column: column.columnName, minValue: result.recordset[0]?.minValue ?? null, maxValue: result.recordset[0]?.maxValue ?? null });
      } catch { dates.push({ column: column.columnName, minValue: null, maxValue: null }); }
    }
    const scoreParts = [object.rows > 0 ? 'HAS_ROWS' : 'EMPTY', dates.some((date) => date.maxValue !== null) ? 'HAS_DATE_DATA' : 'NO_DATE_DATA', object.objectType === 'VIEW' ? 'VIEW' : 'TABLE', penalty.test(object.objectName) ? 'NAME_PENALTY' : ''];
    const score = (object.rows > 0 ? 2 : 0) + (dates.some((date) => date.maxValue !== null) ? 2 : 0) + (object.objectType === 'VIEW' ? 1 : 0) - (penalty.test(object.objectName) ? 1 : 0);
    const sampleColumns = objectColumns.filter((column) => columnDomain.test(column.columnName)).slice(0, 12).map((column) => identifier(column.columnName));
    let sample: Record<string, unknown>[] = [];
    if (object.rows > 0 && sampleColumns.length) { try { const result = await pool.request().query<Record<string, unknown>>(`SELECT TOP (5) ${sampleColumns.join(', ')} FROM ${qualified(object.schemaName, object.objectName)}`); sample = result.recordset; } catch { sample = []; } }
    let dependencies: string[] = [];
    try { const result = await pool.request().input('schemaName', sql.NVarChar, object.schemaName).input('objectName', sql.NVarChar, object.objectName).query<{ referencedSchema: string; referencedObject: string }>(`SELECT DISTINCT rs.name AS referencedSchema, ro.name AS referencedObject FROM sys.sql_expression_dependencies d JOIN sys.objects so ON so.object_id = d.referencing_id JOIN sys.schemas ss ON ss.schema_id = so.schema_id LEFT JOIN sys.objects ro ON ro.object_id = d.referenced_id LEFT JOIN sys.schemas rs ON rs.schema_id = ro.schema_id WHERE ss.name = @schemaName AND so.name = @objectName AND ro.name IS NOT NULL`); dependencies = result.recordset.map((row) => `${row.referencedSchema}.${row.referencedObject}`); } catch { dependencies = []; }
    candidates.push({ ...object, flags: scoreParts.filter(Boolean), dateColumns: dates, columns: objectColumns, sample, dependencies, score });
  }

  const view = candidates.find((candidate) => candidate.schemaName === 'dbo' && candidate.objectName === 'SLSV_PO_DO_DELIVERY');
  let viewDefinition: string | null = null;
  if (view) { try { const result = await pool.request().input('schemaName', sql.NVarChar, view.schemaName).input('objectName', sql.NVarChar, view.objectName).query<{ definition: string | null }>(`SELECT OBJECT_DEFINITION(OBJECT_ID(QUOTENAME(@schemaName) + '.' + QUOTENAME(@objectName))) AS definition`); viewDefinition = result.recordset[0]?.definition ?? null; } catch { viewDefinition = null; } }
  const lines = ['# Sales Source Discovery', '', 'Read-only SQL Server metadata and bounded samples. No credentials or full transaction dumps are written.', '', '## Candidate Objects', '', '| Object | Type | Approx rows | Latest observed date | Flags | Score |', '|---|---|---:|---|---|---:|'];
  for (const candidate of candidates) { const latest = candidate.dateColumns.filter((date) => date.maxValue).map((date) => `${date.column}: ${date.maxValue}`).join('; ') || 'none'; lines.push(`| ${candidate.schemaName}.${candidate.objectName} | ${candidate.objectType} | ${candidate.rows} | ${latest} | ${candidate.flags.join(', ')} | ${candidate.score} |`); }
  lines.push('', '## Strongest Candidates', '');
  for (const candidate of candidates.filter((item) => item.rows > 0).sort((a, b) => b.score - a.score || b.rows - a.rows).slice(0, 10)) {
    lines.push(`### ${candidate.schemaName}.${candidate.objectName}`, '', `- Type: ${candidate.objectType}`, `- Rows: ${candidate.rows}`, `- Flags: ${candidate.flags.join(', ')}`, `- Dependencies: ${candidate.dependencies.join(', ') || 'none discovered'}`, `- Date coverage: ${candidate.dateColumns.filter((date) => date.minValue || date.maxValue).map((date) => `${date.column}=${date.minValue ?? 'null'}..${date.maxValue ?? 'null'}`).join(', ') || 'none'}`, `- Domain columns: ${candidate.columns.filter((column) => columnDomain.test(column.columnName)).map((column) => `${column.columnName} (${column.dataType})`).join(', ') || 'none'}`, '- Sample: bounded TOP (5), values intentionally omitted from documentation', '');
  }
  lines.push('## SLSV_PO_DO_DELIVERY', '', view ? `- Rows: ${view.rows}` : '- Object not found', `- Definition available: ${viewDefinition ? 'yes' : 'no'}`, `- Dependencies: ${view?.dependencies.join(', ') || 'none discovered'}`, '- Semantic interpretation remains UNKNOWN until source definition and real sample are validated.', '', '## Selection Status', '', '- No source is promoted automatically by this discovery script.', '- A source is CONFIRMED only after data recency, dependency/legacy evidence, customer linkage, product/part linkage, and bounded real transaction validation agree.', '- Existing empty `SLS_SALESORDER_HED`, `SLS_SALESORDER`, and `SLS_PRODUCT` remain INACTIVE/EMPTY candidates.');
  await mkdir(new URL('../../docs/', import.meta.url), { recursive: true });
  await writeFile(new URL('../../docs/sales-source-discovery.md', import.meta.url), lines.join('\n'), 'utf8');
  console.log(`Discovered ${candidates.length} Sales-domain objects; documented ${candidates.filter((candidate) => candidate.rows > 0).length} non-empty candidates.`);
}

try { await main(); } finally { await closeSqlServer(); }
