import { mkdir, writeFile } from 'node:fs/promises';
import sql from 'mssql';
import { closeSqlServer, getSqlServerPool } from '../src/config/sqlserver.js';

const q = (value: string) => `[${value.replace(/]/g, ']]')}]`;
const safePattern = (value: string | null) => value ? `${value.slice(0, 4)}... (${value.length} chars)` : 'null';

try {
  const pool = await getSqlServerPool();
  const lines = ['# FG Transaction Semantics', '', 'Read-only validation anchored to real Hino Sales ProductID values. Transaction/document values are summarized.', ''];
  const types = await pool.request().query<{ transactionType: string | null; rows: number; earliest: string | null; latest: string | null; totalQty: number | null; positiveRows: number; negativeRows: number }>(`SELECT JenisTransaksi AS transactionType,COUNT_BIG(*) AS rows,MIN(Tanggal) AS earliest,MAX(Tanggal) AS latest,SUM(Qty) AS totalQty,SUM(CASE WHEN Qty>0 THEN 1 ELSE 0 END) AS positiveRows,SUM(CASE WHEN Qty<0 THEN 1 ELSE 0 END) AS negativeRows FROM dbo.Transaksi_Stok_Fg GROUP BY JenisTransaksi ORDER BY rows DESC`);
  lines.push('## JenisTransaksi', '', '| Type | Rows | Earliest | Latest | Exploratory Qty Sum | Positive | Negative |', '|---|---:|---|---|---:|---:|---:|');
  for (const row of types.recordset) lines.push(`| ${row.transactionType ?? 'NULL'} | ${row.rows} | ${row.earliest ?? 'null'} | ${row.latest ?? 'null'} | ${row.totalQty ?? 'null'} | ${row.positiveRows} | ${row.negativeRows} |`);
  lines.push('', 'No business label is assigned from the value name alone.', '');

  const samples = await pool.request().query<{ transactionType: string | null; productId: string | null; qty: number | null; date: string | null; unit: string | null; line: string | null; refNo: string | null; warehouse: string | null; location: string | null }>(`WITH ranked AS (SELECT JenisTransaksi AS transactionType,ProductId AS productId,Qty AS qty,Tanggal AS date,Satuan AS unit,LineProduksi AS line,RefNo AS refNo,Warehouse AS warehouse,Location AS location,ROW_NUMBER() OVER(PARTITION BY JenisTransaksi ORDER BY Tanggal DESC,IdTransaksi DESC) AS rn FROM dbo.Transaksi_Stok_Fg) SELECT transactionType,productId,qty,date,unit,line,refNo,warehouse,location FROM ranked WHERE rn<=5 ORDER BY transactionType,date DESC`);
  lines.push('## Bounded Samples per JenisTransaksi', '');
  for (const row of samples.recordset) lines.push(`- ${row.transactionType ?? 'NULL'}: ProductID=${row.productId ?? 'null'}, Qty=${row.qty ?? 'null'}, date=${row.date ?? 'null'}, unit=${row.unit ?? 'null'}, line=${row.line ?? 'null'}, ref=${safePattern(row.refNo)}, warehouse=${row.warehouse ?? 'null'}, location=${row.location ?? 'null'}`);
  lines.push('');

  const dimensions = await pool.request().query<{ dimension: string; value: string | null; rows: number }>(`SELECT 'LineProduksi' AS dimension,CONVERT(varchar(255),LineProduksi) AS value,COUNT_BIG(*) AS rows FROM dbo.Transaksi_Stok_Fg GROUP BY LineProduksi UNION ALL SELECT 'Warehouse',CONVERT(varchar(255),Warehouse),COUNT_BIG(*) FROM dbo.Transaksi_Stok_Fg GROUP BY Warehouse UNION ALL SELECT 'JenisTransaksi',CONVERT(varchar(255),JenisTransaksi),COUNT_BIG(*) FROM dbo.Transaksi_Stok_Fg GROUP BY JenisTransaksi ORDER BY dimension,rows DESC`);
  lines.push('## Transaction Dimensions', '');
  for (const row of dimensions.recordset.slice(0, 80)) lines.push(`- ${row.dimension}: ${row.value ?? 'NULL'} (${row.rows} rows)`);
  lines.push('');

  const dependency = await pool.request().query<{ referencingType: string; referencingObject: string; definition: string | null }>(`SELECT o.type_desc AS referencingType,o.name AS referencingObject,OBJECT_DEFINITION(o.object_id) AS definition FROM sys.sql_expression_dependencies d JOIN sys.objects o ON o.object_id=d.referencing_id WHERE d.referenced_id=OBJECT_ID(N'dbo.Transaksi_Stok_Fg')`);
  lines.push('## Database Writers/References', '', `- Referencing modules: ${dependency.recordset.length}`);
  for (const row of dependency.recordset) lines.push(`- ${row.referencingType} ${row.referencingObject}: definition available=${row.definition ? 'yes' : 'no'}`);
  lines.push('- No procedure was executed; definitions were metadata-only.', '');

  const products = await pool.request().query<{ productId: string }>(`SELECT DISTINCT TOP (5) d.ProductID AS productId FROM dbo.SLS_SALESORDER_HED_NEW h JOIN dbo.SLS_SALESORDER_NEW d ON d.IDheader=CONVERT(varchar(50),h.Id) WHERE h.CustomerID=5 AND d.ProductID IS NOT NULL ORDER BY d.ProductID`);
  lines.push('## Hino Product Traces', '');
  for (const product of products.recordset) {
    const result = await pool.request().input('productId', sql.NVarChar(100), product.productId).query<{ transactionType: string | null; rows: number; earliest: string | null; latest: string | null; qty: number | null; units: number }>(`SELECT JenisTransaksi AS transactionType,COUNT_BIG(*) AS rows,MIN(Tanggal) AS earliest,MAX(Tanggal) AS latest,SUM(Qty) AS qty,COUNT(DISTINCT Satuan) AS units FROM dbo.Transaksi_Stok_Fg WHERE CONVERT(varchar(100),ProductId)=@productId GROUP BY JenisTransaksi`);
    lines.push(`- ProductID ${product.productId}: ${result.recordset.map((row) => `${row.transactionType ?? 'NULL'}=${row.rows} rows, qty=${row.qty ?? 'null'}, ${row.earliest ?? 'null'}..${row.latest ?? 'null'}, units=${row.units}`).join('; ') || 'no FG transactions'}`);
  }
  lines.push('');

  const comparison = await pool.request().query<{ salesLines: number; equal: number; lower: number; higher: number; noDelivery: number; ambiguous: number }>(`WITH sales AS (SELECT TOP (50) d.ID AS salesDetailId,h.CustomerID,h.PONo,d.ProductID,d.Qty AS salesQty FROM dbo.SLS_SALESORDER_HED_NEW h JOIN dbo.SLS_SALESORDER_NEW d ON d.IDheader=CONVERT(varchar(50),h.Id) WHERE h.CustomerID=5 ORDER BY h.PODate DESC,h.Id DESC,d.ID), deliveries AS (SELECT h.CustomerID,COALESCE(NULLIF(LTRIM(RTRIM(h.PONo)),''),NULLIF(LTRIM(RTRIM(d.NoPO)),'')) AS po,d.ProductID,SUM(CONVERT(decimal(28,6),d.Qty)) AS deliveryQty,COUNT(DISTINCT h.Id) AS deliveryHeaders FROM dbo.SLS_DELIVERYORDER_HED_NEW h JOIN dbo.SLS_DELIVERYORDER_NEW d ON d.HedId=h.Id GROUP BY h.CustomerID,COALESCE(NULLIF(LTRIM(RTRIM(h.PONo)),''),NULLIF(LTRIM(RTRIM(d.NoPO)),'')),d.ProductID), joined AS (SELECT s.salesDetailId,s.salesQty,COUNT(dl.deliveryHeaders) AS candidates,MAX(dl.deliveryQty) AS deliveryQty FROM sales s LEFT JOIN deliveries dl ON dl.CustomerID=s.CustomerID AND dl.po=s.PONo AND CONVERT(varchar(100),dl.ProductID)=CONVERT(varchar(100),s.ProductID) GROUP BY s.salesDetailId,s.salesQty) SELECT COUNT(*) AS salesLines,SUM(CASE WHEN candidates=0 THEN 1 ELSE 0 END) AS noDelivery,SUM(CASE WHEN candidates>1 THEN 1 ELSE 0 END) AS ambiguous,SUM(CASE WHEN candidates=1 AND deliveryQty=salesQty THEN 1 ELSE 0 END) AS equal,SUM(CASE WHEN candidates=1 AND deliveryQty<salesQty THEN 1 ELSE 0 END) AS lower,SUM(CASE WHEN candidates=1 AND deliveryQty>salesQty THEN 1 ELSE 0 END) AS higher FROM joined`);
  const row = comparison.recordset[0]; lines.push('## Sales Qty vs Delivery Qty', '', `- Sales lines tested: ${row?.salesLines ?? 0}`, `- Exact cumulative equal: ${row?.equal ?? 0}`, `- Delivery lower than Sales: ${row?.lower ?? 0}`, `- Delivery higher than Sales: ${row?.higher ?? 0}`, `- No delivery candidate: ${row?.noDelivery ?? 0}`, `- Ambiguous delivery candidate: ${row?.ambiguous ?? 0}`, '- This is evidence only; no delivered/remaining formula is enabled.', '');
  lines.push('## Classification Status', '', '- Production receipt transaction type: NOT CONFIRMED.', '- `Transaksi_Stok_Fg` remains a stock/FG transaction candidate until `JenisTransaksi` and writer semantics prove production completion.', '- Safe label at this stage: FG transaction / stock movement, not Good Production Quantity.', '- Production capability level: 0 pending confirmed actual output event.', '');
  await mkdir(new URL('../../docs/', import.meta.url), { recursive: true }); await writeFile(new URL('../../docs/fg-transaction-semantics.md', import.meta.url), lines.join('\n'), 'utf8'); console.log(lines.join('\n'));
} finally { await closeSqlServer(); }
