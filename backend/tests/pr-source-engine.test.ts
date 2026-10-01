import { describe, expect, it } from 'vitest';
import { compilePlan } from '../src/semantic/compiler.js';
import { semanticPlanSchema } from '../src/semantic/schema.js';
import { assertFieldAllowed } from '../src/semantic/policy.js';
import type { SemanticField } from '../src/semantic/catalog.js';

const field = (object: string, column: string, datatype = 'varchar'): SemanticField => ({ physicalObject: object, physicalColumn: column, datatype, aliases: [], confidence: 'CONFIRMED_BY_HUMAN', classification: 'INTERNAL', queryable: true });
const plan = semanticPlanSchema.parse({ mode: 'LIVE_QUERY', entity: 'purchase_request', select: ['pr_number', 'material_description', 'quantity'], filters: [{ field: 'material_description', operator: 'contains', value: 'laptop' }, { field: 'material_description', operator: 'contains', value: 'ASUS' }, { field: 'quantity', operator: 'eq', value: 5 }], limit: 50 });

describe('Purchase Request source paths', () => {
  it('compiles the confirmed TEMP monitor quantity query without a join', () => {
    const workflow = (column: string, datatype = 'varchar'): SemanticField => ({ physicalObject: 'dbo.PURC_PURCHREQUEST_TEMP', physicalColumn: column, datatype, aliases: [], confidence: 'CONFIRMED_BY_DATA', classification: 'INTERNAL', queryable: true });
    const queryPlan = semanticPlanSchema.parse({ mode: 'LIVE_QUERY', entity: 'purchase_request', select: ['pr_number', 'material_description', 'quantity'], filters: [{ field: 'material_description', operator: 'contains', value: 'monitor' }, { field: 'quantity', operator: 'eq', value: 3 }], limit: 100 });
    const fields = new Map([['pr_number', workflow('PRNo')], ['material_description', workflow('MaterialName')], ['quantity', workflow('Qty', 'numeric')]]);
    const query = compilePlan({ plan: queryPlan, entity: { entity: 'purchase_request', aliases: [], domain: 'purchasing', confidence: 'CONFIRMED_BY_DATA', queryable: true, baseObject: 'dbo.PURC_PURCHREQUEST_TEMP', fields: Object.fromEntries(fields), joins: [] }, fields });
    expect(query.text).toContain('FROM dbo.PURC_PURCHREQUEST_TEMP');
    expect(query.text).not.toMatch(/JOIN/i);
    expect(query.params.map((parameter) => parameter.value)).toEqual(expect.arrayContaining(['%monitor%', 3]));
  });
  it('uses abstract TEMP fields for the target query plan', () => {
    expect(plan.select).toEqual(['pr_number', 'material_description', 'quantity']);
    expect(plan.filters.map((filter) => filter.field)).toEqual(['material_description', 'material_description', 'quantity']);
  });
  it('compiles final-table-only query without a join', () => {
    const finalPlan = semanticPlanSchema.parse({ mode: 'LIVE_QUERY', entity: 'purchase_request', select: ['pr_number', 'quantity'], filters: [{ field: 'quantity', operator: 'eq', value: 5 }], limit: 50 });
    const fields = new Map([['pr_number', field('dbo.PURC_PURCHASE_REQUEST', 'PRNo')], ['quantity', field('dbo.PURC_PURCHASE_REQUEST', 'Qty', 'numeric')]]);
    const query = compilePlan({ plan: finalPlan, entity: { entity: 'purchase_request', aliases: [], domain: 'purchasing', confidence: 'CONFIRMED_BY_HUMAN', queryable: true, baseObject: 'dbo.PURC_PURCHASE_REQUEST', fields: Object.fromEntries(fields), joins: [] }, fields });
    expect(query.text).toContain('FROM dbo.PURC_PURCHASE_REQUEST');
    expect(query.text).not.toMatch(/JOIN/i);
    expect(query.text).not.toMatch(/laptop|ASUS/i);
    expect(query.params.map((parameter) => parameter.value)).toEqual(expect.arrayContaining([5]));
  });
  it('compiles workflow-only fields without joining final source', () => {
    const workflow = field('dbo.PURC_PURCHREQUEST_TEMP', 'Dept');
    expect(workflow.sourceRole).toBeUndefined();
    expect(() => assertFieldAllowed(workflow)).not.toThrow();
  });
  it('rejects an unconfirmed TEMP to final join', () => {
    const fields = new Map([['pr_number', field('dbo.PURC_PURCHASE_REQUEST', 'PRNo')], ['department', field('dbo.PURC_PURCHREQUEST_TEMP', 'Dept')]]);
    const workflowPlan = semanticPlanSchema.parse({ mode: 'LIVE_QUERY', entity: 'purchase_request', select: ['pr_number', 'department'], filters: [], limit: 50 });
    expect(() => compilePlan({ plan: workflowPlan, entity: { entity: 'purchase_request', aliases: [], domain: 'purchasing', confidence: 'CONFIRMED_BY_HUMAN', queryable: true, baseObject: 'dbo.PURC_PURCHASE_REQUEST', fields: Object.fromEntries(fields), joins: [] }, fields })).toThrow('JOIN_PATH_NOT_CONFIRMED');
  });
});
