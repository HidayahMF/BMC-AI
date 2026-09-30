import { customerService } from '../../services/customer.service.js';
import { salesService } from '../../services/sales.service.js';
import { deliveryService } from '../../services/delivery.service.js';
import { inventoryService } from '../../services/inventory.service.js';
import { getCustomerOrdersSchema, getDeliverySummarySchema, getLatestCustomerOrdersSchema, getOrderDetailsSchema, getStockStatusSchema, searchCustomerSchema, searchOrderSchema } from '../schemas/tools.js';
export const toolRegistry = {
  search_customer: { input: searchCustomerSchema, execute: ({ query }: { query: string }) => customerService.search(query) },
  get_customer_orders: { input: getCustomerOrdersSchema, execute: ({ customerCode, dateFrom, dateTo }: { customerCode: string; dateFrom?: string; dateTo?: string }) => salesService.customerOrders(customerCode, dateFrom, dateTo) },
  search_order: { input: searchOrderSchema, execute: ({ query }: { query: string }) => salesService.search(query) },
  get_order_details: { input: getOrderDetailsSchema, execute: ({ orderNo }: { orderNo: string }) => salesService.details(orderNo) },
  get_latest_customer_orders: { input: getLatestCustomerOrdersSchema, execute: ({ customerCode, limit }: { customerCode: string; limit?: number }) => salesService.latestCustomerOrders(customerCode, limit) },
  get_delivery_summary: { input: getDeliverySummarySchema, execute: ({ customerCode, dateFrom, dateTo }: { customerCode: string; dateFrom?: string; dateTo?: string }) => deliveryService.byCustomer(customerCode, dateFrom, dateTo) },
  get_stock_status: { input: getStockStatusSchema, execute: ({ materialQuery }: { materialQuery: string }) => inventoryService.stockStatus(materialQuery) }
} as const;

export type ToolName = keyof typeof toolRegistry;
export const toolDefinitions = [
  { name: 'search_customer', description: 'Search customers by name.', parameters: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] } },
  { name: 'get_customer_orders', description: 'Get Sales Orders for a confirmed customer and optional date range.', parameters: { type: 'object', properties: { customerCode: { type: 'string' }, dateFrom: { type: 'string' }, dateTo: { type: 'string' } }, required: ['customerCode'] } },
  { name: 'search_order', description: 'Search Sales Orders by order number, PO, or identifier.', parameters: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] } },
  { name: 'get_order_details', description: 'Get details for one Sales Order.', parameters: { type: 'object', properties: { orderNo: { type: 'string' } }, required: ['orderNo'] } },
  { name: 'get_latest_customer_orders', description: 'Get latest Sales Orders for a confirmed customer.', parameters: { type: 'object', properties: { customerCode: { type: 'string' }, limit: { type: 'integer' } }, required: ['customerCode'] } },
  { name: 'get_delivery_summary', description: 'Read delivery rows for a customer and optional date range. Does not calculate remaining quantity.', parameters: { type: 'object', properties: { customerCode: { type: 'string' }, dateFrom: { type: 'string' }, dateTo: { type: 'string' } }, required: ['customerCode'] } },
  { name: 'get_stock_status', description: 'Read ending stock/saldo stok for a material query.', parameters: { type: 'object', properties: { materialQuery: { type: 'string' } }, required: ['materialQuery'] } }
] as const;
