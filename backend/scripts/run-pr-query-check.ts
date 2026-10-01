import { executeSemanticPlan } from '../src/semantic/executor.js';
import { closeSqlServer } from '../src/config/sqlserver.js';

const queries = [
  { label: 'monitor qty 3', filters: [{ field: 'material_description', operator: 'contains' as const, value: 'monitor' }, { field: 'quantity', operator: 'eq' as const, value: 3 }] },
  { label: 'laptop ASUS qty 5', filters: [{ field: 'material_description', operator: 'contains' as const, value: 'laptop' }, { field: 'material_description', operator: 'contains' as const, value: 'ASUS' }, { field: 'quantity', operator: 'eq' as const, value: 5 }] }
];
for (const query of queries) {
  try {
    const result = await executeSemanticPlan({ mode: 'LIVE_QUERY', entity: 'purchase_request', select: ['pr_number', 'material_description', 'quantity'], metrics: [], aggregates: [], groupBy: [], filters: query.filters, sort: [], limit: 100, offset: 0 });
    console.log(JSON.stringify({ query: query.label, status: 'PASS', rowCount: result.rowCount }));
  } catch (error) {
    console.log(JSON.stringify({ query: query.label, status: 'FAIL', reason: error instanceof Error ? error.message : 'QUERY_ERROR' }));
  }
}
await closeSqlServer();
