import sql from 'mssql';
import { getSqlServerPool } from '../config/sqlserver.js';
import { env } from '../config/env.js';
import type { Order, SalesOrderItem } from '../types/business.js';
import { businessCache } from '../utils/cache.js';

type OrderRow = { id: number; orderNumber: string | null; customerPoNumber: string | null; orderDate: string | null; customerCode: string; customerName: string | null; customerAlias: string | null; status: string | null; deliveryFrom: string | null; deliveryTo: string | null; productId: string | null; productCode: string | null; productDescription: string | null; quantity: number | null; unit: string | null };

function mapOrders(rows: OrderRow[]): Order[] {
  const grouped = new Map<number, Order>();
  for (const row of rows) {
    const order = grouped.get(row.id) ?? { id: row.id, orderNumber: row.orderNumber, customerPoNumber: row.customerPoNumber, orderDate: row.orderDate, customer: { code: row.customerCode, name: row.customerName ?? '', alias: row.customerAlias }, status: row.status === null ? null : Number.isNaN(Number(row.status)) ? null : Number(row.status), deliveryFrom: row.deliveryFrom, deliveryTo: row.deliveryTo, totalLines: 0, items: [] };
    if (row.productId !== null || row.productCode !== null || row.quantity !== null) { const item: SalesOrderItem = { productId: row.productId === null ? null : Number(row.productId), productCode: row.productCode ?? row.productId, productDescription: row.productDescription, quantity: row.quantity, unit: row.unit }; order.items.push(item); order.totalLines = order.items.length; }
    grouped.set(row.id, order);
  }
  return [...grouped.values()];
}

const base = `SELECT h.Id AS id, h.Nomor AS orderNumber, h.PONo AS customerPoNumber, h.PODate AS orderDate, CONVERT(varchar(50), h.CustomerID) AS customerCode, c.CustomerName AS customerName, CAST(NULL AS nvarchar(255)) AS customerAlias, h.status, h.TglDelFrom AS deliveryFrom, CAST(NULL AS date) AS deliveryTo, d.ProductID AS productId, d.PartNumber AS productCode, d.Description AS productDescription, d.Qty AS quantity, CAST(NULL AS varchar(20)) AS unit FROM dbo.SLS_SALESORDER_HED_NEW h LEFT JOIN dbo.SLS_SALESORDER_NEW d ON d.IDheader = CONVERT(varchar(50), h.Id) LEFT JOIN dbo.MAS_KATALOG_SALES k ON CONVERT(varchar(50), k.Id) = d.ProductID LEFT JOIN dbo.MAS_CUSTOMER c ON c.CustId = h.CustomerID`;

export class SalesRepository {
  async getCustomerOrders(customerCode: string, dateFrom?: string, dateTo?: string, limit = env.DB_MAX_ROWS) {
    const pool = await getSqlServerPool(); const request = pool.request(); request.input('limit', sql.Int, Math.min(limit, env.DB_MAX_ROWS)); request.input('customerCode', sql.VarChar(50), customerCode); let filter = ' WHERE CONVERT(varchar(50), h.CustomerID) = @customerCode'; if (dateFrom && dateTo) { request.input('dateFrom', sql.Date, dateFrom); request.input('dateTo', sql.Date, dateTo); filter += ' AND h.PODate >= @dateFrom AND h.PODate < DATEADD(day, 1, @dateTo)'; } const result = await request.query<OrderRow>(`${base.replace('SELECT ', 'SELECT TOP (@limit) ')}${filter} ORDER BY h.PODate DESC, h.Nomor, d.ID`); return mapOrders(result.recordset);
  }
  async searchOrder(query: string) { const pool = await getSqlServerPool(); const request = pool.request(); const trimmedQuery = query.trim(); const normalizedQuery = trimmedQuery.replace(/[\s/-]/g, '').toUpperCase(); request.input('limit', sql.Int, env.DB_MAX_ROWS); request.input('query', sql.NVarChar(255), `%${trimmedQuery}%`); request.input('normalizedQuery', sql.NVarChar(255), `%${normalizedQuery}%`); const normalized = (column: string) => `REPLACE(REPLACE(REPLACE(UPPER(LTRIM(RTRIM(${column}))), '/', ''), ' ', ''), '-', '')`; const result = await request.query<OrderRow>(`${base.replace('SELECT ', 'SELECT TOP (@limit) ')} WHERE h.Nomor LIKE @query OR h.PONo LIKE @query OR ${normalized('h.Nomor')} LIKE @normalizedQuery OR ${normalized('h.PONo')} LIKE @normalizedQuery OR CONVERT(varchar(50), h.Id) = @query ORDER BY h.PODate DESC, h.Nomor, d.ID`); return mapOrders(result.recordset); }
  async getOrderDetails(orderNo: string) { const key = `sales-detail:${orderNo.trim().toLowerCase()}`; const cached = businessCache.get<Order[]>(key); if (cached) return cached; const pool = await getSqlServerPool(); const request = pool.request(); request.input('limit', sql.Int, env.DB_MAX_ROWS); request.input('orderNo', sql.NVarChar(100), orderNo.trim()); const result = await request.query<OrderRow>(`${base.replace('SELECT ', 'SELECT TOP (@limit) ')} WHERE h.Nomor = @orderNo OR h.PONo = @orderNo OR CONVERT(varchar(50), h.Id) = @orderNo ORDER BY d.ID`); return businessCache.set(key, mapOrders(result.recordset), 45 * 1000); }
  async getLatestCustomerOrders(customerCode: string, limit = env.DB_MAX_ROWS) { return this.getCustomerOrders(customerCode, undefined, undefined, limit); }
}
