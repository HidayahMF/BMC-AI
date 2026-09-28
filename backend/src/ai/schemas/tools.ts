import { z } from 'zod';
export const searchCustomerSchema = z.object({ query: z.string().trim().min(1).max(100) });
export const getCustomerOrdersSchema = z.object({ customerCode: z.string().trim().min(1).max(50), dateFrom: z.string().date().optional(), dateTo: z.string().date().optional() });
export const searchOrderSchema = z.object({ query: z.string().trim().min(1).max(100) });
export const getOrderDetailsSchema = z.object({ orderNo: z.string().trim().min(1).max(100) });
export const getLatestCustomerOrdersSchema = z.object({ customerCode: z.string().trim().min(1).max(50), limit: z.number().int().min(1).max(50).default(10) });
export const getDeliverySummarySchema = z.object({ customerCode: z.string().trim().min(1).max(50), dateFrom: z.string().date().optional(), dateTo: z.string().date().optional() });
export const getStockStatusSchema = z.object({ materialQuery: z.string().trim().min(1).max(100) });
