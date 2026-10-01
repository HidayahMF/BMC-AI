import type { SemanticPlan } from './schema.js';
import { getEntity, type SemanticEntity, type SemanticField } from './catalog.js';
import { assertFieldAllowed } from './policy.js';
export type ResolvedPlan = { plan: SemanticPlan; entity: SemanticEntity; fields: Map<string, SemanticField> };
function sourceFor(field: SemanticField, object: string): SemanticField {
  const source = field.physicalSources?.find((candidate) => candidate.physicalObject === object && ['CONFIRMED_BY_SCHEMA', 'CONFIRMED_BY_CODE', 'CONFIRMED_BY_DATA', 'CONFIRMED_BY_HUMAN'].includes(candidate.confidence));
  return source ? { ...field, physicalObject: source.physicalObject, physicalColumn: source.physicalColumn, confidence: source.confidence, evidence: [...(field.evidence ?? []), ...source.evidence] } : field;
}
export function resolvePlan(plan: SemanticPlan): ResolvedPlan {
  const entity = getEntity(plan.entity); if (!entity) throw new Error('Data tersebut belum memiliki semantic mapping yang tervalidasi.');
  const aggregateAliases = new Set(plan.aggregates.map((aggregate) => aggregate.as));
  const names = [...plan.select, ...plan.metrics.map((metric) => metric.field), ...plan.aggregates.map((aggregate) => aggregate.field), ...plan.groupBy, ...plan.filters.map((filter) => filter.field), ...plan.sort.map((sort) => sort.field).filter((field) => !aggregateAliases.has(field))]; const fields = new Map<string, SemanticField>();
  const sourceSets = names.map((name) => entity.fields[name]?.physicalSources?.map((source) => source.physicalObject) ?? [entity.fields[name]?.physicalObject]).filter((sources): sources is string[] => Boolean(sources));
  const commonSource = [...new Set(sourceSets.flat())].find((source) => sourceSets.every((sources) => sources.includes(source)));
  for (const name of names) { const field = entity.fields[name]; if (!field) throw new Error(`Unknown semantic field: ${name}`); if (entity.fieldQueryability?.[name] === false || (!entity.queryable && field.queryable !== true)) throw new Error(`Semantic field is not queryable: ${name}`); assertFieldAllowed(field); fields.set(name, commonSource ? sourceFor(field, commonSource) : field); }
  return { plan, entity: commonSource ? { ...entity, baseObject: commonSource } : entity, fields };
}
