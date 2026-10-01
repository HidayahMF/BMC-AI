export const actionNames = ['SEARCH_CUSTOMER', 'GET_CUSTOMER_ORDERS', 'SEARCH_ORDER', 'GET_ORDER_DETAILS', 'GET_LATEST_CUSTOMER_ORDERS', 'GET_DELIVERY_LOOKUP', 'GET_STOCK_STATUS'] as const;
export type ActionName = typeof actionNames[number];
