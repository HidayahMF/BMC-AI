import sql from 'mssql';
import { closeSqlServer, getSqlServerPool } from '../src/config/sqlserver.js';

try {
  const pool = await getSqlServerPool();
  const result = await pool.request().query<Record<string, number | string>>(`
    WITH sales AS (
      SELECT TOP (100) h.CustomerID, LTRIM(RTRIM(h.PONo)) AS po, d.ProductID, d.ID AS salesDetailId,
        h.Id AS headerId, d.Qty AS salesQty, d.PODelFrom, d.PODelTo, h.status
      FROM dbo.SLS_SALESORDER_HED_NEW h
      JOIN dbo.SLS_SALESORDER_NEW d ON d.IDheader=CONVERT(varchar(50),h.Id)
      WHERE h.CustomerID=5 AND NULLIF(LTRIM(RTRIM(h.PONo)),'') IS NOT NULL AND d.ProductID IS NOT NULL
      ORDER BY h.PODate DESC,h.Id DESC,d.ID
    ), deliveries AS (
      SELECT h.CustomerID, LTRIM(RTRIM(COALESCE(NULLIF(h.PONo,''),NULLIF(d.NoPO,'')))) AS po,
        d.ProductID, d.Id AS deliveryDetailId, h.Id AS deliveryHeaderId, d.Qty AS deliveryQty, h.Tanggal
      FROM dbo.SLS_DELIVERYORDER_HED_NEW h JOIN dbo.SLS_DELIVERYORDER_NEW d ON d.HedId=h.Id
    ), dg AS (
      SELECT CustomerID,po,ProductID,COUNT(*) AS deliveryRows,SUM(CONVERT(decimal(28,6),deliveryQty)) AS deliveryQty
      FROM deliveries GROUP BY CustomerID,po,ProductID
    ), sg AS (
      SELECT CustomerID,po,ProductID,COUNT(*) AS salesLines,SUM(CONVERT(decimal(28,6),salesQty)) AS salesQty
      FROM sales GROUP BY CustomerID,po,ProductID
    ), individual AS (
      SELECT s.salesDetailId,s.salesQty,COALESCE(d.deliveryQty,0) AS deliveryQty
      FROM sales s LEFT JOIN dg d ON d.CustomerID=s.CustomerID AND d.po=s.po AND CONVERT(varchar(100),d.ProductID)=CONVERT(varchar(100),s.ProductID)
    ), grouped AS (
      SELECT s.salesLines,s.salesQty,COALESCE(d.deliveryRows,0) AS deliveryRows,COALESCE(d.deliveryQty,0) AS deliveryQty
      FROM sg s LEFT JOIN dg d ON d.CustomerID=s.CustomerID AND d.po=s.po AND CONVERT(varchar(100),d.ProductID)=CONVERT(varchar(100),s.ProductID)
    )
    SELECT 'individual' AS method, SUM(CASE WHEN deliveryQty=salesQty THEN 1 ELSE 0 END) AS exact, SUM(CASE WHEN deliveryQty<salesQty THEN 1 ELSE 0 END) AS lower, SUM(CASE WHEN deliveryQty>salesQty THEN 1 ELSE 0 END) AS higher, COUNT(*) AS rows, NULL AS singleSalesGroups, NULL AS multiSalesGroups, NULL AS singleDeliveryGroups, NULL AS repeatedDeliveryGroups FROM individual
    UNION ALL
    SELECT 'grouped', SUM(CASE WHEN deliveryQty=salesQty THEN 1 ELSE 0 END), SUM(CASE WHEN deliveryQty<salesQty THEN 1 ELSE 0 END), SUM(CASE WHEN deliveryQty>salesQty THEN 1 ELSE 0 END), COUNT(*), SUM(CASE WHEN salesLines=1 THEN 1 ELSE 0 END), SUM(CASE WHEN salesLines>1 THEN 1 ELSE 0 END), SUM(CASE WHEN deliveryRows=1 THEN 1 ELSE 0 END), SUM(CASE WHEN deliveryRows>1 THEN 1 ELSE 0 END) FROM grouped;
  `);
  console.log(JSON.stringify(result.recordset, null, 2));
} finally { await closeSqlServer(); }
