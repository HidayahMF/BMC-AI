import { SalesRepository } from '../repositories/sales.repository.js';
const repository = new SalesRepository();
export const salesService = { search: (query: string) => repository.searchOrder(query), details: (orderNo: string) => repository.getOrderDetails(orderNo), customerOrders: (customerCode: string, dateFrom?: string, dateTo?: string) => repository.getCustomerOrders(customerCode, dateFrom, dateTo), latestCustomerOrders: (customerCode: string, limit?: number) => repository.getLatestCustomerOrders(customerCode, limit) };
