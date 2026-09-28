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
