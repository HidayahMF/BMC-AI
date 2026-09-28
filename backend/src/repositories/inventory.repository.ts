import sql from 'mssql';
import { getSqlServerPool } from '../config/sqlserver.js';
import { env } from '../config/env.js';
export class InventoryRepository {
  async searchMaterial(query: string) { const pool = await getSqlServerPool(); const request = pool.request(); request.input('query', sql.NVarChar(100), `%${query.trim()}%`); const result = await request.query(`SELECT TOP (${env.DB_MAX_ROWS}) RTRIM(Materialid) AS materialCode, MaterialName AS materialName, UoM AS uom, Stockid AS stockId, MaterialType AS materialType FROM dbo.PURC_MATCATALOG WHERE Materialid LIKE @query OR MaterialName LIKE @query ORDER BY MaterialName`); return result.recordset; }
  async getStockStatus(materialQuery: string) { const pool = await getSqlServerPool(); const request = pool.request(); request.input('query', sql.VarChar(100), `%${materialQuery.trim()}%`); const result = await request.query(`SELECT TOP (${env.DB_MAX_ROWS}) RTRIM(s.Materialid) AS materialCode, s.MaterialName AS materialName, s.Quantity AS quantity, s.UoM AS uom, s.Stockid AS stockId, s.OwnerId AS ownerId FROM dbo.SumMatStock s WHERE s.Materialid LIKE @query OR s.MaterialName LIKE @query ORDER BY s.MaterialName, s.OwnerId, s.Stockid`); return result.recordset; }
}
