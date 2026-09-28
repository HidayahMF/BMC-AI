import sql from 'mssql'
import { getSqlServerPool } from '../../config/index.js'
import { env } from '../../config/env.js'

type Customer = { id: number; name: string | null; alias: string | null }
type Source = { database: string; table: string }

export const searchCustomer = async (query: string) => {
  const pool = await getSqlServerPool()
  const request = pool.request()
  request.input('query', sql.NVarChar(255), `%${query.trim()}%`)
  const result = await request.query<Customer>(`SELECT TOP (${env.DB_MAX_ROWS}) CustomerID AS id, CustomerName AS name, Alias AS alias
    FROM dbo.SLS_CUSTOMER
    WHERE CustomerName LIKE @query OR Alias LIKE @query
    ORDER BY CustomerName`)
  return {
    items: result.recordset,
    sources: [{ database: 'SQLSERVER', table: 'dbo.SLS_CUSTOMER' }] satisfies Source[],
  }
}
