import { z } from 'zod';

const temporalFilterSchema = z.object({ field: z.string().regex(/^[a-z][a-z0-9_]*$/).max(80), operator: z.enum(['year_equals', 'year_month_equals']), value: z.string() }).superRefine((filter, context) => { if (filter.operator === 'year_equals' && !/^\d{4}$/.test(filter.value)) context.addIssue({ code: z.ZodIssueCode.custom, message: 'year_equals requires YYYY' }); if (filter.operator === 'year_month_equals' && !/^\d{4}-(0[1-9]|1[0-2])$/.test(filter.value)) context.addIssue({ code: z.ZodIssueCode.custom, message: 'year_month_equals requires YYYY-MM' }); });
const regularFilterSchema = z.object({ field: z.string().regex(/^[a-z][a-z0-9_]*$/).max(80), operator: z.enum(['eq', 'neq', 'contains', 'contains_all', 'starts_with', 'gt', 'gte', 'lt', 'lte', 'between', 'in', 'is_null']), value: z.union([z.string(), z.number(), z.boolean(), z.array(z.union([z.string(), z.number()]))]).optional() }).strict();
export const semanticPlanSchema = z.object({
  mode: z.literal('LIVE_QUERY'),
  entity: z.string().regex(/^[a-z][a-z0-9_]*$/).max(80),
  select: z.array(z.string().regex(/^[a-z][a-z0-9_]*$/).max(80)).min(1).max(30),
  metrics: z.array(z.object({ function: z.enum(['count', 'sum', 'avg', 'min', 'max']), field: z.string().regex(/^[a-z][a-z0-9_]*$/).max(80) }).strict()).max(10).default([]),
  aggregates: z.array(z.object({ function: z.enum(['count', 'sum', 'avg', 'min', 'max']), field: z.string().regex(/^[a-z][a-z0-9_]*$/).max(80), as: z.string().regex(/^[a-z][a-z0-9_]*$/).max(80) }).strict()).max(10).default([]),
  groupBy: z.array(z.string().regex(/^[a-z][a-z0-9_]*$/).max(80)).max(10).default([]),
  filters: z.array(z.union([regularFilterSchema, temporalFilterSchema])).max(30).default([]),
  sort: z.array(z.object({ field: z.string().regex(/^[a-z][a-z0-9_]*$/).max(80), direction: z.enum(['asc', 'desc']) }).strict()).max(10).default([]),
  limit: z.number().int().min(1).max(500).default(100),
  offset: z.number().int().min(0).max(100000).default(0)
}).strict();
export type SemanticPlan = z.infer<typeof semanticPlanSchema>;
