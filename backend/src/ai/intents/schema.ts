import { z } from 'zod';

export const intentNames = ['SEARCH_CUSTOMER', 'GET_CUSTOMER_ORDERS', 'SEARCH_ORDER', 'GET_ORDER_DETAILS', 'GET_LATEST_CUSTOMER_ORDERS', 'GET_DELIVERY_LOOKUP', 'GET_STOCK_STATUS', 'SEMANTIC_QUERY', 'KNOWLEDGE_QUERY', 'UNSUPPORTED'] as const;
export const intentSchema = z.object({
  intent: z.enum(intentNames),
  parameters: z.object({
    customerQuery: z.string().trim().max(100).optional(),
    customerCode: z.string().trim().max(50).optional(),
    orderNumber: z.string().trim().max(100).optional(),
    materialQuery: z.string().trim().max(100).optional(),
    deliveryNumber: z.string().trim().max(100).optional(),
    period: z.enum(['THIS_MONTH', 'PREVIOUS_MONTH', 'TODAY', 'THIS_YEAR', 'ALL', 'EXPLICIT']).optional(),
    dateFrom: z.string().date().optional(),
    dateTo: z.string().date().optional()
  }).strict(),
  reason: z.string().trim().max(300).optional()
}).strict();
export type Intent = z.infer<typeof intentSchema>;
