import sql from 'mssql';
import { getSqlServerPool } from '../config/sqlserver.js';
import { env } from '../config/env.js';
import type { Customer } from '../types/business.js';
import { businessCache } from '../utils/cache.js';

export class CustomerRepository {
  async searchCustomer(query: string): Promise<Customer[]> {
    const key = `customer:${query.trim().toLowerCase()}`; const cached = businessCache.get<Customer[]>(key); if (cached) return cached;
    const pool = await getSqlServerPool(); const request = pool.request();
    request.input('query', sql.NVarChar(255), `%${query.trim()}%`);
    const result = await request.query<Customer>(`SELECT TOP (${env.DB_MAX_ROWS}) CONVERT(varchar(50), CustId) AS code, CustomerName AS name, CAST(NULL AS nvarchar(255)) AS alias FROM dbo.MAS_CUSTOMER WHERE CustomerName LIKE @query ORDER BY CustomerName`);
    return businessCache.set(key, result.recordset, 5 * 60 * 1000);
  }
  async getCustomerByCode(code: string): Promise<Customer | null> {
    const pool = await getSqlServerPool(); const request = pool.request(); request.input('code', sql.VarChar(50), code.trim());
    const result = await request.query<Customer>(`SELECT TOP (1) CONVERT(varchar(50), CustId) AS code, CustomerName AS name, CAST(NULL AS nvarchar(255)) AS alias FROM dbo.MAS_CUSTOMER WHERE CONVERT(varchar(50), CustId) = @code`);
    return result.recordset[0] ?? null;
  }
}
