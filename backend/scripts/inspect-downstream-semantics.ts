import { mkdir, writeFile } from 'node:fs/promises';
import { closeSqlServer, getSqlServerPool } from '../src/config/sqlserver.js';

const q = (v: string) => `[${v.replace(/]/g, ']]')}]`;
try {
  const pool = await getSqlServerPool();
  const objects = ['WMSV_STOEndSumOwner', 'SumMatStock', 'WMS_MAPPING_PART_DELIVERY_PRD', 'Transaksi_Stok_Fg', 'PPC_TonProductTonFinish', 'WMS_CASTING', 'casting1', 'PR', 'PRDetail'];
  const lines = ['# Downstream Semantic Validation', '', 'Read-only targeted inspection anchored to real Hino Sales ProductID/PartNumber references.', ''];
  for (const object of objects) {
    const definition = await pool.request().query<{ definition: string | null }>(`SELECT OBJECT_DEFINITION(OBJECT_ID(N'dbo.${object}')) AS definition`);
    let rows = 0; try { const result = await pool.request().query<{ rows: number }>(`SELECT COUNT_BIG(*) AS rows FROM dbo.${q(object)}`); rows = Number(result.recordset[0]?.rows ?? 0); } catch {}
    const columns = await pool.request().query<{ columnName: string; dataType: string }>(`SELECT c.name AS columnName,t.name AS dataType FROM sys.columns c JOIN sys.types t ON t.user_type_id=c.user_type_id WHERE c.object_id=OBJECT_ID(N'dbo.${object}') ORDER BY c.column_id`);
    lines.push(`## dbo.${object}`, '', `- Rows: ${rows}`, `- Columns: ${columns.recordset.map((column) => `${column.columnName} (${column.dataType})`).join(', ') || 'none'}`, `- Definition: ${definition.recordset[0]?.definition ? definition.recordset[0].definition.replace(/\s+/g, ' ').slice(0, 1000) : 'not a view or unavailable'}`, '');
  }
  const sample = await pool.request().query<Record<string, unknown>>(`SELECT TOP (20) * FROM dbo.WMS_MAPPING_PART_DELIVERY_PRD ORDER BY id`);
  lines.push('## WMS Mapping Bounded Sample', '', `- Rows inspected: ${sample.recordset.length}`, `- Columns: ${Object.keys(sample.recordset[0] ?? {}).join(', ')}`, '- Values omitted from documentation.', '');
  const finished = await pool.request().query<{ productMatches: number; rows: number }>(`WITH parts AS (SELECT DISTINCT TOP (50) ProductID FROM dbo.SLS_SALESORDER_NEW WHERE ProductID IS NOT NULL) SELECT COUNT_BIG(*) AS rows,COUNT_BIG(CASE WHEN f.ProductId IS NOT NULL THEN 1 END) AS productMatches FROM dbo.Transaksi_Stok_Fg f JOIN parts p ON CONVERT(varchar(100),f.ProductId)=p.ProductID`);
  lines.push('## Finished-Goods Candidate', '', `- Transaksi_Stok_Fg matching Sales ProductID rows: ${finished.recordset[0]?.productMatches ?? 0} of ${finished.recordset[0]?.rows ?? 0}`, '- This is stock/transaction evidence, not yet confirmed production output.', '');
  await mkdir(new URL('../../docs/', import.meta.url), { recursive: true }); await writeFile(new URL('../../docs/downstream-semantic-validation.md', import.meta.url), lines.join('\n'), 'utf8'); console.log(lines.join('\n'));
} finally { await closeSqlServer(); }
