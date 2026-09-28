import { mkdir, writeFile } from 'node:fs/promises';
import { closeSqlServer, getSqlServerPool } from '../src/config/sqlserver.js';

const productionName = /produksi|production|prd|ppc|plan|casting|furnace|mould|mold|core|trim|shoot|finish|output|actual/i;
const productionColumn = /part|product|material|btno|customer|cust|po|order|qty|quantity|date|tanggal|actual|output|plan|production|mould|mold|uom|unit|satuan|machine|mesin/i;
const quote = (value: string) => `[${value.replace(/]/g, ']]')}]`;
type ObjectRow = { schemaName: string; objectName: string; objectType: string; rows: number };
type ColumnRow = { schemaName: string; objectName: string; objectType: string; columnName: string; dataType: string };

try {
  const pool = await getSqlServerPool();
  const metadata = await pool.request().query<ColumnRow>(`SELECT s.name AS schemaName,o.name AS objectName,CASE WHEN o.type='V' THEN 'VIEW' ELSE 'TABLE' END AS objectType,c.name AS columnName,t.name AS dataType FROM sys.objects o JOIN sys.schemas s ON s.schema_id=o.schema_id JOIN sys.columns c ON c.object_id=o.object_id JOIN sys.types t ON t.user_type_id=c.user_type_id WHERE o.type IN ('U','V') ORDER BY s.name,o.name,c.column_id`);
  const objects = [...new Map(metadata.recordset.filter((column) => column.schemaName === 'dbo' && (productionName.test(column.objectName) || productionColumn.test(column.columnName))).map((column) => [`${column.schemaName}.${column.objectName}`, { schemaName: column.schemaName, objectName: column.objectName, objectType: column.objectType, rows: 0 }])).values()] as ObjectRow[];
  for (const object of objects) { try { const result = await pool.request().query<{ rows: number }>(`SELECT COUNT_BIG(*) AS rows FROM ${quote(object.schemaName)}.${quote(object.objectName)}`); object.rows = Number(result.recordset[0]?.rows ?? 0); } catch { object.rows = 0; } }
  objects.sort((a, b) => b.rows - a.rows || a.objectName.localeCompare(b.objectName));
  const lines = ['# Production Data Lineage', '', 'Dynamic read-only discovery of production-like tables/views. No production metric or formula is enabled.', '', '## Objects', '', '| Object | Type | Rows | Domain columns |', '|---|---|---:|---|'];
  for (const object of objects) { const columns = metadata.recordset.filter((column) => column.schemaName === object.schemaName && column.objectName === object.objectName); lines.push(`| ${object.schemaName}.${object.objectName} | ${object.objectType} | ${object.rows} | ${columns.filter((column) => productionColumn.test(column.columnName)).map((column) => `${column.columnName} (${column.dataType})`).join(', ') || 'none'} |`); }
  lines.push('', '## Populated Candidates', '');
  for (const object of objects.filter((item) => item.rows > 0).slice(0, 30)) lines.push(`- ${object.schemaName}.${object.objectName}: ${object.rows} rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.`);
  lines.push('', '## Conclusion', '', '- Production actual source: not confirmed.', '- Sales Part -> Production bridge: candidate validation is documented separately in business-link-validation.md.', '- No achievement, remaining, reject, downtime, or ETA formula is implemented.');
  await mkdir(new URL('../../docs/', import.meta.url), { recursive: true }); await writeFile(new URL('../../docs/production-data-lineage.md', import.meta.url), lines.join('\n'), 'utf8'); console.log(`Discovered ${objects.length} production-like objects; ${objects.filter((object) => object.rows > 0).length} populated.`);
} finally { await closeSqlServer(); }
