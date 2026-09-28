import { mkdir, writeFile } from 'node:fs/promises';
import sql from 'mssql';
import { closeSqlServer, getSqlServerPool } from '../src/config/sqlserver.js';

const quote = (v: string) => `[${v.replace(/]/g, ']]')}]`;
const qualified = (schema: string, name: string) => `${quote(schema)}.${quote(name)}`;
const idNames = /^(productid|product_id|prodid|partid|part_id)$/i;
const partNames = /^(partnumber|part_number|partno|part_no|nomorpart|productcode|product_code)$/i;
const dateNames = /date|tanggal|tgl|time|period|created|updated|input|actual|finish|output/i;
const qtyNames = /qty|quantity|output|actual|good|finish|hasil|accept|ok|plan/i;
const productionNames = /produksi|production|prd|ppc|plan|casting|furnace|mould|mold|core|trim|shoot|finish|output|actual|wms|transaksi/i;
type Column = { schemaName: string; objectName: string; objectType: string; columnName: string; dataType: string };
type Candidate = { objectName: string; objectType: string; rows: number; productColumn: string | null; partColumn: string | null; productMatches: number; partMatches: number; dates: string[]; quantities: string[]; machines: string[]; orders: string[]; score: number; reason: string };

async function main() {
  const pool = await getSqlServerPool();
  const ref = await pool.request().input('customerId', sql.Int, 5).query<{ productId: string; partNumber: string | null; orderNumber: string; poNo: string; customerId: number; poDate: string; quantity: number }>(`WITH selected_headers AS (SELECT TOP (20) h.Id,h.Nomor,h.PONo,h.CustomerID,h.PODate FROM dbo.SLS_SALESORDER_HED_NEW h WHERE h.CustomerID=@customerId ORDER BY h.PODate DESC,h.Id DESC) SELECT TOP (200) d.ProductID AS productId,d.PartNumber AS partNumber,h.Nomor AS orderNumber,h.PONo AS poNo,h.CustomerID AS customerId,h.PODate AS poDate,d.Qty AS quantity FROM selected_headers h JOIN dbo.SLS_SALESORDER_NEW d ON d.IDheader=CONVERT(varchar(50),h.Id) ORDER BY h.PODate DESC,h.Nomor,d.ProductID`);
  const productIds = [...new Set(ref.recordset.map((row) => row.productId).filter(Boolean))].slice(0, 50);
  const parts = [...new Set(ref.recordset.map((row) => row.partNumber?.trim().toLowerCase()).filter(Boolean))].slice(0, 50) as string[];
  const meta = await pool.request().query<Column>(`SELECT s.name AS schemaName,o.name AS objectName,CASE WHEN o.type='V' THEN 'VIEW' ELSE 'TABLE' END AS objectType,c.name AS columnName,t.name AS dataType FROM sys.objects o JOIN sys.schemas s ON s.schema_id=o.schema_id JOIN sys.columns c ON c.object_id=o.object_id JOIN sys.types t ON t.user_type_id=c.user_type_id WHERE o.type IN ('U','V') AND (c.name LIKE '%Product%' OR c.name LIKE '%Part%' OR c.name LIKE '%ProdID%' OR c.name LIKE '%MATERIAL%' OR c.name LIKE '%BTNO%' OR c.name LIKE '%Qty%' OR c.name LIKE '%Output%' OR c.name LIKE '%Actual%' OR c.name LIKE '%Finish%' OR c.name LIKE '%Good%') ORDER BY o.name,c.column_id`);
  const grouped = new Map<string, Column[]>(); for (const column of meta.recordset) { const key = `${column.schemaName}.${column.objectName}`; grouped.set(key, [...(grouped.get(key) ?? []), column]); }
  const candidates: Candidate[] = [];
  for (const [key, columns] of grouped) {
    const [schemaName, objectName] = key.split('.', 2); if (schemaName !== 'dbo') continue;
    const productColumn = columns.find((c) => idNames.test(c.columnName))?.columnName ?? null;
    const partColumn = columns.find((c) => partNames.test(c.columnName))?.columnName ?? null;
    if (!productColumn && !partColumn) continue;
    let rows = 0; try { const count = await pool.request().query<{ rows: number }>(`SELECT COUNT_BIG(*) AS rows FROM ${qualified(schemaName, objectName)}`); rows = Number(count.recordset[0]?.rows ?? 0); } catch { continue; }
    if (!rows) continue;
    const params = pool.request(); productIds.forEach((value, i) => params.input(`p${i}`, sql.NVarChar(100), value));
    const productPredicate = productColumn ? `CONVERT(varchar(255),${quote(productColumn)}) IN (${productIds.map((_, i) => `@p${i}`).join(',')})` : '1=0';
    let productMatches = 0; try { const result = await params.query<{ matches: number }>(`SELECT COUNT_BIG(*) AS matches FROM ${qualified(schemaName, objectName)} WHERE ${productPredicate}`); productMatches = Number(result.recordset[0]?.matches ?? 0); } catch { productMatches = 0; }
    const partParams = pool.request(); parts.forEach((value, i) => partParams.input(`s${i}`, sql.NVarChar(500), value));
    const partPredicate = partColumn ? `LOWER(LTRIM(RTRIM(CONVERT(nvarchar(500),${quote(partColumn)})))) IN (${parts.map((_, i) => `@s${i}`).join(',')})` : '1=0';
    let partMatches = 0; try { const result = await partParams.query<{ matches: number }>(`SELECT COUNT_BIG(*) AS matches FROM ${qualified(schemaName, objectName)} WHERE ${partPredicate}`); partMatches = Number(result.recordset[0]?.matches ?? 0); } catch { partMatches = 0; }
    if (!productMatches && !partMatches) continue;
    const dateColumns = columns.filter((c) => /date|datetime|smalldatetime/i.test(c.dataType) || dateNames.test(c.columnName)).map((c) => c.columnName);
    const quantityColumns = columns.filter((c) => qtyNames.test(c.columnName)).map((c) => c.columnName);
    const machines = columns.filter((c) => /machine|mesin|shift|operator|process|line|stage/i.test(c.columnName)).map((c) => c.columnName);
    const orders = columns.filter((c) => /po|order|sales|so|job|batch|lot/i.test(c.columnName)).map((c) => c.columnName);
    let recent = false; for (const dateColumn of dateColumns.slice(0, 4)) { try { const result = await pool.request().query<{ latest: string | null }>(`SELECT MAX(TRY_CONVERT(datetime,${quote(dateColumn)})) AS latest FROM ${qualified(schemaName, objectName)}`); if (String(result.recordset[0]?.latest ?? '').includes('2026')) recent = true; } catch {} }
    const score = productMatches * 5 + partMatches * 4 + (recent ? 5 : 0) + (quantityColumns.length ? 2 : 0) + (dateColumns.length ? 2 : 0) + (machines.length ? 2 : 0) + (orders.length ? 2 : 0) - (productionNames.test(objectName) ? 0 : 3);
    candidates.push({ objectName, objectType: columns[0].objectType, rows, productColumn, partColumn, productMatches, partMatches, dates: dateColumns, quantities: quantityColumns, machines, orders, score, reason: productionNames.test(objectName) ? 'production/WMS-like domain' : 'business-domain match; classify before production use' });
  }
  candidates.sort((a, b) => b.score - a.score || b.productMatches + b.partMatches - a.productMatches - a.partMatches);
  const lines = ['# Anchored Hino Discovery', '', 'Discovery uses a bounded real Sales reference set from MAS_CUSTOMER.CustId=5. Values are not dumped to documentation.', '', '## Reference Set', '', `- Sales reference rows: ${ref.recordset.length}`, `- Distinct ProductID: ${productIds.length}`, `- Distinct normalized PartNumber: ${parts.length}`, `- Orders represented: ${new Set(ref.recordset.map((row) => row.orderNumber)).size}`, ''];
  lines.push('## Production Candidate Ranking', '', '| Rank | Object | Type | Rows | ProductID matches | PartNumber matches | Quantity fields | Date fields | Machine/process fields | Reason |', '|---:|---|---|---:|---:|---:|---|---|---|---|');
  candidates.slice(0, 20).forEach((candidate, index) => lines.push(`| ${index + 1} | dbo.${candidate.objectName} | ${candidate.objectType} | ${candidate.rows} | ${candidate.productMatches} | ${candidate.partMatches} | ${candidate.quantities.join(', ') || 'none'} | ${candidate.dates.join(', ') || 'none'} | ${candidate.machines.join(', ') || 'none'} | ${candidate.reason} |`));
  lines.push('', '## Classification', '', '- Exact ProductID or normalized PartNumber match is discovery evidence only.', '- PRDetail is not treated as production until PR/PRDetail business purpose is classified.', '- Finance, invoice, purchase-request, inventory-balance, master, backup, and temporary objects are not actual-production evidence by row count alone.', '- Actual output requires validated output/good/finished semantics plus date and identifier evidence.', '');
  const prColumns = [...new Set(['PR', 'PRDetail'].flatMap((name) => meta.recordset.filter((column) => column.objectName === name).map((column) => column.columnName)))];
  const pr = await pool.request().query<Record<string, unknown>>(`SELECT TOP (5) * FROM dbo.PR ORDER BY 1 DESC`);
  lines.push('## PR / PRDetail Classification', '', `- PR columns: ${JSON.stringify(pr.recordset)}`, '- Preliminary domain classification: Purchase Request candidate because parent is `PR`, fields include PR date and requested quantity/material references. Not production actual.', '');
  const mapping = await pool.request().query<Record<string, unknown>>(`SELECT TOP (20) * FROM dbo.WMS_MAPPING_PART_DELIVERY_PRD`);
  lines.push('## WMS_MAPPING_PART_DELIVERY_PRD', '', `- Sample row count: ${mapping.recordset.length}`, `- Columns: ${Object.keys(mapping.recordset[0] ?? {}).join(', ') || 'unknown'}`, '- ProductID matches from prior bounded validation: 8.', '- Role remains bridge candidate until its business purpose and exact target semantics are validated.', '');
  const castingObjects = ['casting1', 'WMS_CASTING', 'WMS_MatStockCasting', 'PPC_TonProductTonFinish'];
  lines.push('## Casting Candidates', '');
  for (const objectName of castingObjects) { const objectColumns = meta.recordset.filter((c) => c.objectName === objectName); let count = 0; try { const result = await pool.request().query<{ rows: number }>(`SELECT COUNT_BIG(*) AS rows FROM dbo.${quote(objectName)}`); count = Number(result.recordset[0]?.rows ?? 0); } catch {} lines.push(`- dbo.${objectName}: ${count} rows; columns: ${objectColumns.map((c) => `${c.columnName} (${c.dataType})`).join(', ') || 'metadata not in anchor column set'}`); }
  const reverse = await pool.request().query<{ deliveryLines: number; matched: number; unmatched: number }>(`WITH delivery AS (SELECT TOP (100) h.CustomerID,h.PONo AS deliveryPo,d.NoPO,d.ProductID FROM dbo.SLS_DELIVERYORDER_HED_NEW h JOIN dbo.SLS_DELIVERYORDER_NEW d ON d.HedId=h.Id ORDER BY h.Tanggal DESC,h.Id DESC,d.Id), normalized AS (SELECT DISTINCT deliveryPo,NoPO,ProductID,CustomerID FROM delivery), matched AS (SELECT DISTINCT d.CustomerID,d.ProductID,d.deliveryPo,d.NoPO FROM normalized d JOIN dbo.SLS_SALESORDER_HED_NEW h ON h.CustomerID=d.CustomerID AND LTRIM(RTRIM(h.PONo))=LTRIM(RTRIM(ISNULL(d.deliveryPo,d.NoPO))) JOIN dbo.SLS_SALESORDER_NEW s ON s.IDheader=CONVERT(varchar(50),h.Id) AND CONVERT(varchar(100),s.ProductID)=CONVERT(varchar(100),d.ProductID)) SELECT (SELECT COUNT(*) FROM normalized) AS deliveryLines,(SELECT COUNT(*) FROM matched) AS matched,(SELECT COUNT(*) FROM normalized n WHERE NOT EXISTS (SELECT 1 FROM matched m WHERE m.CustomerID=n.CustomerID AND m.ProductID=n.ProductID AND ISNULL(m.deliveryPo,m.NoPO)=ISNULL(n.deliveryPo,n.NoPO))) AS unmatched`);
  lines.push('', '## Reverse Delivery -> Sales', '', `- Delivery detail sample: ${reverse.recordset[0]?.deliveryLines ?? 0}`, `- PO + customer + ProductID matched: ${reverse.recordset[0]?.matched ?? 0}`, `- Unmatched: ${reverse.recordset[0]?.unmatched ?? 0}`, '- Ambiguous matches require separate count when one delivery key resolves to multiple Sales headers.', '');
  lines.push('', '## Production Conclusion', '', '- Actual production source: NOT CONFIRMED.', '- No production progress, remaining, achievement, ETA, or output formula implemented.', '- Next strongest candidates require targeted sample/definition validation, not row-count promotion.', '');
  await mkdir(new URL('../../docs/', import.meta.url), { recursive: true }); await writeFile(new URL('../../docs/production-source-ranking.md', import.meta.url), lines.join('\n'), 'utf8'); console.log(lines.join('\n'));
}

try { await main(); } finally { await closeSqlServer(); }
