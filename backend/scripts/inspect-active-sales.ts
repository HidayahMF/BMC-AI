import sql from 'mssql';
import { closeSqlServer, getSqlServerPool } from '../src/config/sqlserver.js';

const targets = ['SLS_SALESORDER_HED_NEW', 'SLS_SALESORDER_NEW', 'SLS_DELIVERYORDER_HED_NEW', 'SLS_DELIVERYORDER_NEW', 'FINV_MONITOR_LISTDELIVERY', 'FINV_AR_SALES', 'vw_sls_order', 'vw_sls_order1', 'MAS_KATALOG_SALES'];
const hinoIds = [492, 566, 561, 126, 565, 26];
const id = (value: string) => `[${value.replace(/]/g, ']]')}]`;
const qname = (name: string) => `[dbo].${id(name)}`;
type Column = { objectName: string; columnName: string; dataType: string };

try {
  const pool = await getSqlServerPool();
  const request = pool.request(); targets.forEach((target, i) => request.input(`n${i}`, sql.NVarChar, target));
  const metadata = await request.query<Column>(`SELECT o.name AS objectName, c.name AS columnName, t.name AS dataType FROM sys.objects o JOIN sys.columns c ON c.object_id=o.object_id JOIN sys.types t ON t.user_type_id=c.user_type_id WHERE SCHEMA_NAME(o.schema_id)='dbo' AND o.name IN (${targets.map((_, i) => `@n${i}`).join(',')}) ORDER BY o.name,c.column_id`);
  const byObject = new Map<string, Column[]>(); for (const column of metadata.recordset) byObject.set(column.objectName, [...(byObject.get(column.objectName) ?? []), column]);
  for (const target of targets) {
    const columns = byObject.get(target) ?? [];
    console.log(`\n## ${target}`);
    console.log(columns.map((column) => `${column.columnName}:${column.dataType}`).join(', '));
    const names = new Set(columns.map((column) => column.columnName.toLowerCase()));
    const customer = ['customerid', 'custid', 'customer_id', 'cust_id', 'customername'].find((name) => names.has(name));
    const orderNumber = ['nomor', 'sono', 'noso', 'orderno', 'pono', 'po_no', 'no_po', 'documentno'].find((name) => names.has(name));
    const date = columns.find((column) => /date|datetime|smalldatetime/i.test(column.dataType) && /order|po|tanggal|tgl|input|create|invoice|delivery/i.test(column.columnName));
    const part = columns.find((column) => /part|product|material/i.test(column.columnName));
    const qty = columns.find((column) => /qty|quantity/i.test(column.columnName));
    const selected = [customer, orderNumber, date?.columnName, part?.columnName, qty?.columnName].filter((value): value is string => Boolean(value));
    if (!selected.length) continue;
    try { const sample = await pool.request().query<Record<string, unknown>>(`SELECT TOP (5) ${selected.map(id).join(', ')} FROM ${qname(target)}`); console.log('sample columns:', selected.join(', '), 'rows:', JSON.stringify(sample.recordset)); } catch (error) { console.log('sample error:', error instanceof Error ? error.message : String(error)); }
    if (customer && /^cust/i.test(customer)) {
      try { const hino = await pool.request().query<Record<string, unknown>>(`SELECT TOP (20) ${selected.map(id).join(', ')} FROM ${qname(target)} WHERE ${id(customer)} IN (${hinoIds.join(',')}) OR LOWER(CONVERT(varchar(255), ${id(customer)})) LIKE '%hino%'`); console.log('hino rows:', JSON.stringify(hino.recordset)); } catch (error) { console.log('hino error:', error instanceof Error ? error.message : String(error)); }
    }
  }
  const view = await pool.request().query<{ definition: string | null }>(`SELECT OBJECT_DEFINITION(OBJECT_ID(N'dbo.SLSV_PO_DO_DELIVERY')) AS definition`); console.log('\n## SLSV_PO_DO_DELIVERY definition\n', view.recordset[0]?.definition ?? 'null');
  const customerQuery = await pool.request().query<Record<string, unknown>>(`SELECT TOP (100) 'SLS_CUSTOMER' AS source, CustomerID AS customerId, CustomerName AS customerName FROM dbo.SLS_CUSTOMER WHERE CustomerName LIKE '%Hino%' OR Alias LIKE '%Hino%' OR Alias1 LIKE '%Hino%' UNION ALL SELECT TOP (100) 'MAS_CUSTOMER', CustId, CustomerName FROM dbo.MAS_CUSTOMER WHERE CustomerName LIKE '%Hino%'`);
  console.log('\n## Hino customer masters\n', JSON.stringify(customerQuery.recordset));
  for (const source of ['SLS_CUSTOMER', 'MAS_CUSTOMER']) {
    const customerTable = source === 'SLS_CUSTOMER' ? 'SLS_CUSTOMER' : 'MAS_CUSTOMER';
    const customerKey = source === 'SLS_CUSTOMER' ? 'CustomerID' : 'CustId';
    const headerQuery = await pool.request().query<Record<string, unknown>>(`SELECT TOP (20) h.Id, h.Nomor, h.PONo, h.PODate, h.CustomerID, c.CustomerName, d.ID AS detailId, d.ProductID, d.Qty, d.PartNumber, d.Description FROM dbo.SLS_SALESORDER_HED_NEW h JOIN dbo.${customerTable} c ON c.${customerKey}=h.CustomerID LEFT JOIN dbo.SLS_SALESORDER_NEW d ON d.IDheader=CONVERT(varchar(50),h.Id) WHERE c.CustomerName LIKE '%Hino%' ORDER BY h.PODate DESC, h.Id DESC`);
    console.log(`\n## New Sales Hino via ${customerTable}\n`, JSON.stringify(headerQuery.recordset));
  }
  const integrity = await pool.request().query<Record<string, unknown>>(`WITH headers AS (SELECT TOP (20) h.Id, h.CustomerID FROM dbo.SLS_SALESORDER_HED_NEW h ORDER BY h.PODate DESC, h.Id DESC), details AS (SELECT d.ID, d.IDheader, d.ProductID FROM dbo.SLS_SALESORDER_NEW d), headerStats AS (SELECT h.Id, CASE WHEN c.CustId IS NOT NULL THEN 1 ELSE 0 END AS validMasCustomer, CASE WHEN sc.CustomerID IS NOT NULL THEN 1 ELSE 0 END AS validSlsCustomer, CASE WHEN EXISTS (SELECT 1 FROM details d WHERE d.IDheader=CONVERT(varchar(50),h.Id)) THEN 1 ELSE 0 END AS hasDetail FROM headers h LEFT JOIN dbo.MAS_CUSTOMER c ON c.CustId=h.CustomerID LEFT JOIN dbo.SLS_CUSTOMER sc ON sc.CustomerID=h.CustomerID), sampleDetails AS (SELECT DISTINCT d.ID, d.ProductID FROM headers h JOIN details d ON d.IDheader=CONVERT(varchar(50),h.Id)), productStats AS (SELECT COUNT_BIG(*) AS matchedProducts FROM sampleDetails d JOIN dbo.MAS_KATALOG_SALES k ON CONVERT(varchar(50),k.Id)=d.ProductID) SELECT COUNT_BIG(*) AS headersTested, SUM(validMasCustomer) AS validMasCustomer, SUM(validSlsCustomer) AS validSlsCustomer, SUM(hasDetail) AS headersWithDetail, (SELECT matchedProducts FROM productStats) AS matchedProducts, (SELECT COUNT_BIG(*) FROM sampleDetails) AS detailRows FROM headerStats`);
  console.log('\n## New Sales bounded integrity\n', JSON.stringify(integrity.recordset));
  const delivery = await pool.request().query<Record<string, unknown>>(`WITH headers AS (SELECT TOP (20) h.Id, h.CustomerID FROM dbo.SLS_DELIVERYORDER_HED_NEW h ORDER BY h.Tanggal DESC, h.Id DESC) SELECT COUNT_BIG(DISTINCT h.Id) AS deliveryHeadersTested, COUNT_BIG(DISTINCT CASE WHEN c.CustId IS NOT NULL THEN h.Id END) AS validCustomers, COUNT_BIG(DISTINCT CASE WHEN d.HedId IS NOT NULL THEN h.Id END) AS headersWithDetail, COUNT_BIG(d.Id) AS detailRows, COUNT_BIG(CASE WHEN s.Id IS NOT NULL THEN d.Id END) AS salesHeaderMatches FROM headers h LEFT JOIN dbo.MAS_CUSTOMER c ON c.CustId=h.CustomerID LEFT JOIN dbo.SLS_DELIVERYORDER_NEW d ON d.HedId=h.Id LEFT JOIN dbo.SLS_SALESORDER_HED_NEW s ON s.Nomor=d.SalesNomor`);
  console.log('\n## New Delivery bounded integrity\n', JSON.stringify(delivery.recordset));
} finally { await closeSqlServer(); }
