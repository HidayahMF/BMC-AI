import { intentSchema, type Intent } from './schema.js';

function fallback(message: string): Intent {
  const value = message.trim();
  const orderNumber = value.match(/\b(?:BID|PO|SO|SLS)[\w./-]*\d[\w./-]*/i)?.[0];
  if (/produksi|production|eta|remaining|progress|sisa/i.test(value)) return { intent: 'UNSUPPORTED', parameters: {}, reason: 'Capability is blocked.' };
  if (/stok|stock|saldo\s+stok|persediaan|material/i.test(value)) return { intent: 'GET_STOCK_STATUS', parameters: { materialQuery: value.replace(/cek|cari|lihat|tampilkan|saldo|stok|stock|persediaan|material/gi, ' ').replace(/\s+/g, ' ').trim() } };
  if (/delivery|pengiriman/i.test(value)) return { intent: 'GET_DELIVERY_LOOKUP', parameters: { customerQuery: value.replace(/delivery|pengiriman|terbaru|hari ini/gi, ' ').replace(/\s+/g, ' ').trim() } };
  if (/\b(pr|mrp|purchase request|permintaan pembelian|material requirement|kebutuhan material|qty|quantity|berapa|jumlah|laptop|asus|monitor|bearing|bolt)\b/i.test(value)) return { intent: 'SEMANTIC_QUERY', parameters: {} };
  if (orderNumber) return { intent: 'GET_ORDER_DETAILS', parameters: { orderNumber } };
  if (/order|sales order|\bso\b|\bpo\b/i.test(value)) return { intent: /terbaru|terakhir/i.test(value) ? 'GET_LATEST_CUSTOMER_ORDERS' : 'GET_CUSTOMER_ORDERS', parameters: { customerQuery: value.replace(/order|sales order|\bso\b|\bpo\b|bulan ini|bulan lalu|terbaru|terakhir|apa saja|apa aja/gi, ' ').trim(), period: /bulan lalu/i.test(value) ? 'PREVIOUS_MONTH' : /tahun/i.test(value) ? 'THIS_YEAR' : 'THIS_MONTH' } };
  if (/customer|pelanggan/i.test(value)) return { intent: 'SEARCH_CUSTOMER', parameters: { customerQuery: value.replace(/cari|search|customer|pelanggan/gi, ' ').trim() } };
  if (/table|tabel|relasi|relationship|kenapa|mengapa|docs?|dokumentasi|capabilit|sumber|source|blocked|aktif/i.test(value)) return { intent: 'KNOWLEDGE_QUERY', parameters: {} };
  return { intent: 'UNSUPPORTED', parameters: {}, reason: 'Intent is not supported.' };
}

export function parseIntent(value: unknown, message: string): Intent {
  const parsed = intentSchema.safeParse(value);
  return parsed.success ? parsed.data : fallback(message);
}
