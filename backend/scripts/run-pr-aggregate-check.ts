import { closeSqlServer } from '../src/config/sqlserver.js';
import { executeSemanticPlan } from '../src/semantic/executor.js';
import { semanticPlanSchema } from '../src/semantic/schema.js';

const plan = semanticPlanSchema.parse({ mode: 'LIVE_QUERY', entity: 'purchase_request', select: ['material_description'], metrics: [], aggregates: [{ function: 'sum', field: 'quantity', as: 'total_quantity' }], groupBy: ['material_description'], filters: [], sort: [{ field: 'total_quantity', direction: 'desc' }], limit: 5, offset: 0 });
try { const result = await executeSemanticPlan(plan); console.log(JSON.stringify({ entity: result.entity, rowCount: result.rowCount, columns: result.columns, status: 'PASS' })); } catch (error) { console.log(JSON.stringify({ status: 'FAIL', errorCode: error instanceof Error ? error.name : 'QUERY_ERROR' })); } finally { await closeSqlServer(); }
