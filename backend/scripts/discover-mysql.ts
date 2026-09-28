import { mkdir, writeFile } from 'node:fs/promises';
import { getMysqlPool, closeMysql } from '../src/config/mysql.js';
const keywords = ['production','produksi','planning','plan','sales','order','delivery','customer','stock','inventory','warehouse','material','machine','mesin','reject','quality','shift','downtime','purchase','vendor'];
try {
  const pool = getMysqlPool();
  const [tables] = await pool.query(`SELECT TABLE_NAME, TABLE_TYPE FROM information_schema.tables WHERE TABLE_SCHEMA = DATABASE() ORDER BY TABLE_NAME`);
  const [columns] = await pool.query(`SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, COLUMN_KEY, IS_NULLABLE FROM information_schema.columns WHERE TABLE_SCHEMA = DATABASE() ORDER BY TABLE_NAME, ORDINAL_POSITION`);
  const rows = tables as Array<{ TABLE_NAME: string; TABLE_TYPE: string }>;
  const columnRows = columns as Array<{ TABLE_NAME: string; COLUMN_NAME: string; DATA_TYPE: string; COLUMN_KEY: string; IS_NULLABLE: string }>;
  const relevant = rows.filter((row) => keywords.some((keyword) => row.TABLE_NAME.toLowerCase().includes(keyword)));
  await mkdir(new URL('../../docs/', import.meta.url), { recursive: true });
  const lines = ['# MySQL Discovery', '', `Database: configured office (metadata only)`, `Total tables discovered: ${rows.length}`, '', '## Relevant Shortlist', ''];
  for (const table of relevant) { const cols = columnRows.filter((column) => column.TABLE_NAME === table.TABLE_NAME); lines.push(`### ${table.TABLE_NAME}`, `- Type: ${table.TABLE_TYPE}`, `- Columns: ${cols.map((column) => `${column.COLUMN_NAME} (${column.DATA_TYPE}${column.COLUMN_KEY === 'PRI' ? ', PK' : ''})`).join(', ')}`, ''); }
  await writeFile(new URL('../../docs/mysql-discovery.md', import.meta.url), lines.join('\n'), 'utf8'); console.log(`Discovered ${rows.length} tables; documented ${relevant.length} keyword matches.`);
} finally { await closeMysql(); }
