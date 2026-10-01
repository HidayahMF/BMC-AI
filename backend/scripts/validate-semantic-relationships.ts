import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getSqlServerPool, closeSqlServer } from '../src/config/sqlserver.js';

const root = join(process.cwd(), '..', 'semantic', 'catalog');
const boundedLimit = Number(process.env.SEMANTIC_VALIDATION_SAMPLE_SIZE ?? 10000);
const pool = await getSqlServerPool();
const checks: Array<Record<string, unknown>> = [];
try {
  const headerDetail = await pool.request().input('limit', boundedLimit).query(`WITH sample AS (SELECT TOP (@limit) d.PRNo FROM dbo.PRDetail d WHERE NULLIF(LTRIM(RTRIM(d.PRNo)), '') IS NOT NULL), marked AS (SELECT s.PRNo, CASE WHEN h.PRNo IS NULL THEN 0 ELSE 1 END AS matched FROM sample s LEFT JOIN dbo.PURC_PURCHREQUEST_HED h ON LTRIM(RTRIM(h.PRNo))=LTRIM(RTRIM(s.PRNo))) SELECT COUNT_BIG(*) AS sampleSize, SUM(matched) AS matched, SUM(CASE WHEN matched=0 THEN 1 ELSE 0 END) AS unmatched, 0 AS nullCount FROM marked`);
  const material = await pool.request().input('limit', boundedLimit).query(`WITH sample AS (SELECT TOP (@limit) d.MaterialID FROM dbo.PRDetail d WHERE d.MaterialID IS NOT NULL), marked AS (SELECT s.MaterialID, CASE WHEN m.Materialid IS NULL THEN 0 ELSE 1 END AS matched FROM sample s LEFT JOIN dbo.PURC_MATCATALOG m ON LTRIM(RTRIM(CONVERT(varchar(100),m.Materialid)))=LTRIM(RTRIM(CONVERT(varchar(100),s.MaterialID)))) SELECT COUNT_BIG(*) AS sampleSize, SUM(matched) AS matched, SUM(CASE WHEN matched=0 THEN 1 ELSE 0 END) AS unmatched, 0 AS nullCount FROM marked`);
  const normalize = (row: Record<string, unknown>, from: string, to: string, evidence: string) => { const sampleSize = Number(row.sampleSize ?? 0); const matched = Number(row.matched ?? 0); const matchRate = sampleSize ? matched / sampleSize : 0; return { from, to, sampleSize, matched, unmatched: Number(row.unmatched ?? 0), nullCount: Number(row.nullCount ?? 0), matchRate, confidence: matchRate >= 0.99 ? 'CONFIRMED_BY_DATA' : matchRate >= 0.9 ? 'PROBABLE' : 'UNKNOWN', evidence }; };
  checks.push(normalize(headerDetail.recordset[0] ?? {}, 'dbo.PRDetail.PRNo', 'dbo.PURC_PURCHREQUEST_HED.PRNo', 'BOUNDED_DATA_MATCH'));
  checks.push(normalize(material.recordset[0] ?? {}, 'dbo.PRDetail.MaterialID', 'dbo.PURC_MATCATALOG.Materialid', 'BOUNDED_DATA_MATCH_WITH_NORMALIZED_TEXT'));
  await mkdir(root, { recursive: true }); await writeFile(join(root, 'relationship-validation.json'), JSON.stringify({ generatedAt: new Date().toISOString(), persisted: 'derived-statistics-only', checks }, null, 2)); console.log(JSON.stringify({ checks, rawValuesPersisted: 0 }, null, 2));
} finally { await closeSqlServer(); }
