import { closeSqlServer } from '../src/config/sqlserver.js';
import { executeSemanticPlan } from '../src/semantic/executor.js';
import { deterministicSemanticPlan } from '../src/semantic/deterministic-plan.js';

const plan = deterministicSemanticPlan('MRP material bearing apa aja?'); if (!plan) throw new Error('MRP plan unavailable');
console.log(JSON.stringify({ entity: plan?.entity, filters: plan?.filters, select: plan?.select }));
try { const result = await executeSemanticPlan(plan, 'mrp-material-check'); console.log(JSON.stringify({ status: 'PASS', rowCount: result.rowCount, columns: result.columns })); } catch (error) { const value = error as { name?: string; message?: string; stage?: string; errorCode?: string; details?: unknown }; console.log(JSON.stringify({ status: 'FAIL', name: value.name, message: value.message, stage: value.stage, errorCode: value.errorCode, details: value.details })); } finally { await closeSqlServer(); }
