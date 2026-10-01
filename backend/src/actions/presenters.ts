import type { Intent } from '../ai/intents/schema.js';
export function presentLive(intent: Intent, result: { status: string; data: any }) {
  const data = result.data;
  if (result.status === 'BLOCKED') return { sourceMode: 'BLOCKED', answer: 'Capability ini masih diblokir karena sumber atau formula belum tervalidasi.', data: { capability: intent.intent, available: false }, visualization: null, sources: [] };
  if (intent.intent === 'SEARCH_CUSTOMER') return { sourceMode: 'LIVE_BACKEND', answer: data.length ? `Ditemukan ${data.length} customer.` : 'Customer tidak ditemukan dari data yang tersedia.', data: { matches: data }, visualization: 'customer-list', sources: ['SQLSERVER.dbo.MAS_CUSTOMER'] };
  if (intent.intent === 'GET_STOCK_STATUS') return { sourceMode: 'LIVE_BACKEND', answer: data.length ? `Saldo stok ditemukan untuk ${data.length} material.` : 'Saldo stok tidak ditemukan dari data yang tersedia.', data: { stock: data }, visualization: 'stock-list', sources: ['SQLSERVER.approved-tool:get_stock_status'] };
  if (intent.intent === 'GET_DELIVERY_LOOKUP') return { sourceMode: 'LIVE_BACKEND', answer: data.length ? `Ditemukan ${data.length} baris delivery.` : 'Delivery tidak ditemukan dari data yang tersedia.', data: { deliveries: data }, visualization: 'delivery-list', sources: ['SQLSERVER.dbo.SLS_DELIVERYORDER_HED_NEW', 'SQLSERVER.dbo.SLS_DELIVERYORDER_NEW'] };
  return { sourceMode: 'LIVE_BACKEND', answer: data.length ? `Ditemukan ${data.length} Sales Order.` : 'Sales Order tidak ditemukan dari data yang tersedia.', data: { orders: data }, visualization: 'sales-order-list', sources: ['SQLSERVER.dbo.SLS_SALESORDER_HED_NEW', 'SQLSERVER.dbo.SLS_SALESORDER_NEW'] };
}
