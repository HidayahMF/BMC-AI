export type Source = { database: 'SQLSERVER' | 'MYSQL'; table: string };
export type Customer = { code: string; name: string; alias: string | null };
export type SalesOrderItem = { productId: number | null; productCode: string | null; productDescription: string | null; quantity: number | null; unit: string | null };
export type SalesOrder = { id: number; orderNumber: string | null; customerPoNumber: string | null; orderDate: string | null; customer: Customer; status: number | null; deliveryFrom: string | null; deliveryTo: string | null; totalLines: number; items: SalesOrderItem[] };
export type Order = SalesOrder;
export type ToolResult<T> = { data: T; sources: Source[]; toolsUsed: string[] };
export type DataConfidence = { customer: 'CONFIRMED_BY_DATA' | 'PROBABLE' | 'UNKNOWN'; orderRelationship: 'CONFIRMED_BY_DATA' | 'PROBABLE' | 'UNKNOWN'; quantitySemantics: 'CONFIRMED_BY_DATA' | 'PROBABLE' | 'UNKNOWN'; deliveryRelationship?: 'CONFIRMED_BY_DATA' | 'PROBABLE' | 'UNKNOWN' };
