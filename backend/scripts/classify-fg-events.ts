import { mkdir, writeFile } from 'node:fs/promises';
import sql from 'mssql';
import { closeSqlServer, getSqlServerPool } from '../src/config/sqlserver.js';

const q = (v: string) => `[${v.replace(/]/g, ']]')}]`;
try {
  const pool = await getSqlServerPool();
  const lines = ['# FG Event Classification', '', 'Read-only classification of Transaksi_Stok_Fg K/D values. Labels remain UNKNOWN unless supported by source evidence.', ''];
  const meta = await pool.request().query<{ objectName: string; objectType: string; columnName: string }>(`SELECT o.name AS objectName,CASE WHEN o.type='V' THEN 'VIEW' WHEN o.type='P' THEN 'PROCEDURE' WHEN o.type='TR' THEN 'TRIGGER' ELSE o.type END AS objectType,c.name AS columnName FROM sys.objects o LEFT JOIN sys.columns c ON c.object_id=o.object_id WHERE (c.name LIKE '%JenisTrans%' OR c.name LIKE '%Transaction%' OR c.name LIKE '%Transaksi%') OR o.name LIKE '%JENISTRANS%' OR o.name LIKE '%TRANS%' ORDER BY o.name,c.column_id`);
  lines.push('## Transaction-code metadata candidates', '', ...meta.recordset.slice(0, 120).map((row) => `- ${row.objectType} ${row.objectName}${row.columnName ? `.${row.columnName}` : ''}`), '');
  const values = await pool.request().query<{ type: string; refPrefix: string | null; refLength: number | null; rows: number; totalQty: number | null; minDate: string; maxDate: string; warehouse: string | null; line: string | null }>(`WITH refs AS (SELECT JenisTransaksi AS type,RefNo,Qty,Tanggal,Warehouse,LineProduksi FROM dbo.Transaksi_Stok_Fg), grouped AS (SELECT type,LEFT(CONVERT(varchar(255),RefNo),4) AS refPrefix,MAX(LEN(CONVERT(varchar(255),RefNo))) AS refLength,COUNT_BIG(*) AS rows,SUM(Qty) AS totalQty,MIN(Tanggal) AS minDate,MAX(Tanggal) AS maxDate,Warehouse AS warehouse,LineProduksi AS line FROM refs GROUP BY type,LEFT(CONVERT(varchar(255),RefNo),4),Warehouse,LineProduksi) SELECT TOP (100) * FROM grouped ORDER BY rows DESC`);
  lines.push('## Event values and RefNo patterns', '', '| Type | Ref prefix | Ref max length | Rows | Qty sum | Min date | Max date | Warehouse | Line |', '|---|---|---:|---:|---:|---|---|---|---|');
  for (const row of values.recordset) lines.push(`| ${row.type ?? 'NULL'} | ${row.refPrefix ?? 'NULL'} | ${row.refLength ?? 'null'} | ${row.rows} | ${row.totalQty ?? 'null'} | ${row.minDate} | ${row.maxDate} | ${row.warehouse ?? 'NULL'} | ${row.line ?? 'NULL'} |`);
  lines.push('');
  const samples = await pool.request().query<{ type: string; productId: string; qty: number; date: string; refNo: string | null; transactionKind: string | null; description: string | null }>(`WITH ranked AS (SELECT JenisTransaksi AS type,ProductId AS productId,Qty AS qty,Tanggal AS date,RefNo AS refNo,JenisTransaksi AS transactionKind,Keterangan AS description,ROW_NUMBER() OVER(PARTITION BY JenisTransaksi ORDER BY Tanggal DESC,IdTransaksi DESC) AS rn FROM dbo.Transaksi_Stok_Fg) SELECT type,productId,qty,date,refNo,transactionKind,description FROM ranked WHERE rn<=5 ORDER BY type,date DESC`);
  lines.push('## Bounded event samples', '');
  for (const row of samples.recordset) lines.push(`- type=${row.type}; product=${row.productId}; qty=${row.qty}; date=${row.date}; ref=${row.refNo ? `${row.refNo.slice(0, 4)}...` : 'NULL'}; description=${row.description ? row.description.slice(0, 80) : 'NULL'}`);
  lines.push('');
  const refs = await pool.request().query<{ type: string; refNo: string | null }>(`SELECT TOP (20) JenisTransaksi AS type,RefNo FROM dbo.Transaksi_Stok_Fg WHERE RefNo IS NOT NULL ORDER BY Tanggal DESC,IdTransaksi DESC`);
  lines.push('## RefNo dependency probes', '');
  for (const row of refs.recordset) {
    const ref = String(row.refNo); const result = await pool.request().input('ref', sql.NVarChar(255), ref).query<{ objectName: string; rows: number }>(`SELECT 'Transaksi_Stok_Fg' AS objectName,COUNT_BIG(*) AS rows FROM dbo.Transaksi_Stok_Fg WHERE CONVERT(nvarchar(255),RefNo)=@ref UNION ALL SELECT 'SLS_DELIVERYORDER_NEW',COUNT_BIG(*) FROM dbo.SLS_DELIVERYORDER_NEW WHERE NoDNS=@ref OR NoPO=@ref OR SalesNomor=@ref UNION ALL SELECT 'SLS_SALESORDER_HED_NEW',COUNT_BIG(*) FROM dbo.SLS_SALESORDER_HED_NEW WHERE Nomor=@ref OR PONo=@ref`);
    lines.push(`- ${row.type} ${ref.slice(0, 4)}...: ${result.recordset.map((item) => `${item.objectName}=${item.rows}`).join(', ')}`);
  }
  lines.push('', '## Decision', '', '- K: PROBABLE outgoing stock/event movement because bounded descriptions contain `Keluar ke`, but destination semantics are not confirmed.', '- D: PROBABLE incoming FG transaction from a production line because all five rows are positive, have `LineProduksi=MP L`, and descriptions contain `Masuk dari LineMP L`.', '- D is a production-receipt candidate, not yet CONFIRMED, because writer/source event and good-vs-reject semantics remain unproven.', '- Good output quantity: NOT CONFIRMED.', '');
  await mkdir(new URL('../../docs/', import.meta.url), { recursive: true }); await writeFile(new URL('../../docs/fg-event-classification.md', import.meta.url), lines.join('\n'), 'utf8'); console.log(lines.join('\n'));
} finally { await closeSqlServer(); }
