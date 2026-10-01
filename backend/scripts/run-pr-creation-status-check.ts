import { closeSqlServer } from '../src/config/sqlserver.js';
import { deterministicSemanticPlan } from '../src/semantic/deterministic-plan.js';
import { executeSemanticPlan } from '../src/semantic/executor.js';

const messages = [
  'MRP material yang belum dibuat PR apa aja?',
  'MRP material yang sebagian sudah dibuat PR apa aja?',
  'MRP material yang sudah dibuat PR semua apa aja?',
  'MRP bearing yang sebagian sudah dibuat PR apa aja?'
];

try {
  for (const message of messages) {
    const plan = deterministicSemanticPlan(message);
    if (!plan) throw new Error(`No semantic plan for ${message}`);
    const result = await executeSemanticPlan(plan, 'pr-creation-status-acceptance');
    console.log(JSON.stringify({ message, status: result.rowCount > 0 ? 'SUCCESS' : 'ZERO_RESULTS', sourceMode: 'LIVE_BACKEND', rowCount: result.rowCount }));
  }
} finally {
  await closeSqlServer();
}
