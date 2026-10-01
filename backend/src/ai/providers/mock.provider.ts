import { parseIntent } from '../intents/parser.js';
import type { IntentProvider } from './intent-provider.js';
import { semanticPlanSchema, type SemanticPlan } from '../../semantic/schema.js';
import { deterministicSemanticPlan } from '../../semantic/deterministic-plan.js';
export class MockAIProvider implements IntentProvider {
  async parseIntent(message: string) { return parseIntent(undefined, message); }
  async answerKnowledge(message: string, excerpts: string[]) { return excerpts.length ? `Knowledge approved untuk "${message}" tersedia di dokumentasi.` : 'Knowledge approved tidak ditemukan.'; }
  async parseSemanticPlan(message: string): Promise<SemanticPlan> { return deterministicSemanticPlan(message) ?? semanticPlanSchema.parse({ mode: 'LIVE_QUERY', entity: 'sales_order', select: ['order_number', 'part_number', 'quantity'], metrics: [], aggregates: [], groupBy: [], filters: [], sort: [], limit: 100, offset: 0 }); }
}
