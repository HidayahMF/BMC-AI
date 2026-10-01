import type { SemanticPlan } from './schema.js';
import { extractPrNumber, materialSearchTerms } from './deterministic-plan.js';

export function normalizePurchaseRequestPlan(plan: SemanticPlan, message: string): SemanticPlan {
  if (plan.entity === 'material_requirement') return plan;
  if (plan.entity !== 'purchase_request') return plan;
  const terms = materialSearchTerms(message);
  const prNumber = extractPrNumber(message);
  const filters = plan.filters.filter((filter) => filter.field !== 'material_description' && filter.field !== 'pr_number');
  return { ...plan, filters: [...(prNumber ? [{ field: 'pr_number', operator: 'contains' as const, value: prNumber }] : []), ...(terms.length ? [{ field: 'material_description', operator: 'contains_all' as const, value: terms }] : []), ...filters] };
}
