import { describe, expect, it } from 'vitest';
import { semanticPlanSchema } from '../src/semantic/schema.js';
import { resolvePlan } from '../src/semantic/resolver.js';
import { compilePlan } from '../src/semantic/compiler.js';
import { SemanticRuntimeError } from '../src/semantic/executor.js';
import { classifyPrCreationStatus } from '../src/semantic/pr-lifecycle.js';

describe('semantic query engine', () => {
  it('represents runtime failures with safe stage metadata only', () => {
    const error = new SemanticRuntimeError('sql_execution', 'EREQUEST', { entity: 'purchase_request', sqlErrorNumber: 208 });
    expect(error.stage).toBe('sql_execution');
    expect(error.errorCode).toBe('EREQUEST');
    expect(error.details).toEqual({ entity: 'purchase_request', sqlErrorNumber: 208 });
    expect(error.message).not.toMatch(/SELECT|monitor|@p0/i);
  });
  it('validates an abstract plan and parameterizes values', () => {
    const plan = semanticPlanSchema.parse({ mode: 'LIVE_QUERY', entity: 'sales_order', select: ['order_number'], filters: [{ field: 'order_number', operator: 'contains', value: 'Hino' }], limit: 50 });
    const query = compilePlan(resolvePlan(plan));
    expect(query.text).not.toMatch(/Hino/);
    expect(query.text).not.toMatch(/SELECT \*/i);
    expect(query.text).toContain('@p0');
    expect(query.params.some((parameter) => parameter.value === '%Hino%')).toBe(true);
  });
  it('compiles contains_all as parameterized AND predicates', () => {
    const plan = semanticPlanSchema.parse({ mode: 'LIVE_QUERY', entity: 'purchase_request', select: ['pr_number'], filters: [{ field: 'material_description', operator: 'contains_all', value: ['laptop', 'HP'] }], limit: 50 });
    const query = compilePlan(resolvePlan(plan));
    expect(query.text).toContain('MaterialName LIKE @p00 AND MaterialName LIKE @p01');
    expect(query.text).not.toMatch(/laptop|HP/);
    expect(query.params.map((parameter) => parameter.value)).toEqual(expect.arrayContaining(['%laptop%', '%HP%']));
  });
  it('compiles temporal year and month predicates with validation guards', () => {
    const month = semanticPlanSchema.parse({ mode: 'LIVE_QUERY', entity: 'material_requirement', select: ['material_code'], filters: [{ field: 'mrp_created_date', operator: 'year_month_equals', value: '2026-09' }] });
    const year = semanticPlanSchema.parse({ mode: 'LIVE_QUERY', entity: 'material_requirement', select: ['material_code'], filters: [{ field: 'mrp_created_date', operator: 'year_equals', value: '2026' }] });
    expect(compilePlan(resolvePlan(month)).text).toContain("LEN(MRPDate) = 7");
    expect(compilePlan(resolvePlan(month)).params.some((parameter) => parameter.value === '2026-09')).toBe(true);
    expect(compilePlan(resolvePlan(year)).text).toContain("LEN(MRPDate) = 10");
    expect(() => semanticPlanSchema.parse({ mode: 'LIVE_QUERY', entity: 'material_requirement', select: ['material_code'], filters: [{ field: 'mrp_created_date', operator: 'year_month_equals', value: '2026-13' }] })).toThrow();
  });
  it('compiles grouped aggregates with aliases and bounded pagination', () => {
    const plan = semanticPlanSchema.parse({ mode: 'LIVE_QUERY', entity: 'purchase_request', select: ['material_description'], groupBy: ['material_description'], aggregates: [{ function: 'sum', field: 'quantity', as: 'total_quantity' }], filters: [], sort: [{ field: 'total_quantity', direction: 'desc' }], limit: 20, offset: 20 });
    const query = compilePlan(resolvePlan(plan));
    expect(query.text).toContain('SUM(Qty) AS total_quantity');
    expect(query.text).toContain('GROUP BY MaterialName');
    expect(query.text).toContain('ORDER BY total_quantity DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY');
    expect(query.params.map((parameter) => parameter.name)).toEqual(expect.arrayContaining(['limit', 'offset']));
  });
  it('rejects unknown entities and fields', () => {
    expect(() => resolvePlan({ mode: 'LIVE_QUERY', entity: 'unknown', select: ['x'], metrics: [], aggregates: [], groupBy: [], filters: [], sort: [], limit: 100, offset: 0 })).toThrow();
    expect(() => resolvePlan({ mode: 'LIVE_QUERY', entity: 'sales_order', select: ['not_mapped'], metrics: [], aggregates: [], groupBy: [], filters: [], sort: [], limit: 100, offset: 0 })).toThrow();
  });
  it('rejects low-confidence and restricted fields', () => {
    expect(() => resolvePlan({ mode: 'LIVE_QUERY', entity: 'inventory', select: ['quantity'], metrics: [], aggregates: [], groupBy: [], filters: [], sort: [], limit: 100, offset: 0 })).toThrow(/confidence|policy/i);
  });
  it('rejects raw SQL-shaped plan fields before compilation', () => {
    expect(() => semanticPlanSchema.parse({ mode: 'LIVE_QUERY', entity: 'sales_order', select: ['order_number; DROP TABLE users'], filters: [], limit: 100 })).toThrow();
  });
  it('compiles a detail-only PR path without a header join', () => {
    const detailField = (column: string) => ({ physicalObject: 'dbo.PRDetail', physicalColumn: column, datatype: 'nvarchar', aliases: [], confidence: 'CONFIRMED_BY_HUMAN' as const, classification: 'INTERNAL' as const, queryable: true });
    const plan = semanticPlanSchema.parse({ mode: 'LIVE_QUERY', entity: 'purchase_request', select: ['pr_number', 'material_description', 'quantity'], filters: [{ field: 'material_description', operator: 'contains', value: 'laptop ASUS' }, { field: 'quantity', operator: 'eq', value: 5 }], limit: 100 });
    const query = compilePlan({ plan, entity: { entity: 'purchase_request', aliases: [], domain: 'purchasing', confidence: 'CONFIRMED_BY_HUMAN', queryable: true, baseObject: 'dbo.PRDetail', fields: { pr_number: detailField('PRNo'), material_description: detailField('Material Description'), quantity: detailField('PRQty') } }, fields: new Map([['pr_number', detailField('PRNo')], ['material_description', detailField('Material Description')], ['quantity', { ...detailField('PRQty'), datatype: 'numeric' }]]) });
    expect(query.text).toContain('FROM dbo.PRDetail');
    expect(query.text).not.toMatch(/JOIN\s+dbo\.PR\b/i);
    expect(query.text).toContain('[Material Description]');
    expect(query.text).not.toContain('laptop ASUS');
  });
  it('blocks a header-dependent path when the relationship is not confirmed', () => {
    const field = (object: string, column: string) => ({ physicalObject: object, physicalColumn: column, datatype: 'nvarchar', aliases: [], confidence: 'CONFIRMED_BY_HUMAN' as const, classification: 'INTERNAL' as const, queryable: true });
    const plan = semanticPlanSchema.parse({ mode: 'LIVE_QUERY', entity: 'purchase_request', select: ['pr_number', 'request_date', 'quantity'], filters: [], limit: 100 });
    expect(() => compilePlan({ plan, entity: { entity: 'purchase_request', aliases: [], domain: 'purchasing', confidence: 'CONFIRMED_BY_HUMAN', queryable: true, baseObject: 'dbo.PR', fields: { pr_number: field('dbo.PR', 'PRNo'), request_date: field('dbo.PR', 'PRDate'), quantity: field('dbo.PRDetail', 'PRQty') } }, fields: new Map([['pr_number', field('dbo.PR', 'PRNo')], ['request_date', field('dbo.PR', 'PRDate')], ['quantity', field('dbo.PRDetail', 'PRQty')]]) })).toThrow('JOIN_PATH_NOT_CONFIRMED');
  });
  it.each([
    [0, 0, 'BELUM_DIBUAT_PR'],
    [1, 0, 'BELUM_DIBUAT_PR'],
    [2, 1, 'SEBAGIAN_DIBUAT_PR'],
    [2, 2, 'SUDAH_DIBUAT_PR'],
    [1, 2, 'DATA_MAPPING_EXCEPTION']
  ])('classifies released=%i final=%i as %s', (released, final, expected) => {
    expect(classifyPrCreationStatus(released, final)).toBe(expected);
  });
});
