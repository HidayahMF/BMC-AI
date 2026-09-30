import { customerService } from '../services/customer.service.js'
import { inventoryService } from '../services/inventory.service.js'
import { salesService } from '../services/sales.service.js'
import { resolveDateRange } from '../utils/date-range.js'
import { salesDataSource, salesSourceStatus } from '../config/sales-source.js'

export type AskResult = { answer: string; data: unknown; sources: string[]; toolsUsed: string[] }

const customerSources = [`SQLSERVER.${salesDataSource.customer}`]
const salesSources = [`SQLSERVER.${salesDataSource.orderHeader}`, `SQLSERVER.${salesDataSource.orderDetail}`, `SQLSERVER.${salesDataSource.product}`]

export const askAgent = async (message: string, selectedCustomer?: { code: string; name: string; alias: string | null }): Promise<AskResult> => {
  const normalized = message.trim()
  if (!normalized) return { answer: 'Silakan masukkan pertanyaan.', data: null, sources: [], toolsUsed: [] }

  if (/produksi|production|hasil produksi|output produksi/i.test(normalized)) return { answer: 'Data actual produksi belum dapat dihitung karena sumber hasil produksi belum tervalidasi.', data: { capability: 'productionOutput', available: false, reason: 'Sumber actual production belum tervalidasi.' }, sources: [], toolsUsed: [] }

  if (/stok|stock|saldo\s+stok|persediaan|material/i.test(normalized)) {
    const materialQuery = normalized.replace(/cek|cari|lihat|tampilkan|saldo|stok|stock|persediaan|material/gi, ' ').replace(/\s+/g, ' ').trim()
    const stock = await inventoryService.stockStatus(materialQuery)
    return {
      answer: stock.length ? `Saldo stok ditemukan untuk ${stock.length} material${materialQuery ? ` dengan kata kunci "${materialQuery}"` : ''}.` : `Saldo stok${materialQuery ? ` untuk "${materialQuery}"` : ''} tidak ditemukan dari data yang tersedia.`,
      data: { stock, query: materialQuery || null },
      sources: ['SQLSERVER.approved-tool:get_stock_status'],
      toolsUsed: ['get_stock_status']
    }
  }

  const asksOrders = /order|sales order|so\b|\bpo\b|\bbid\b/i.test(normalized)
  if (asksOrders) {
    const explicitOrderLookup = /sales order|\bso\b|\b(?:po|bid)\b\s*[/\w.-]*\d/i.test(normalized)
    const latest = /terbaru|terakhir|paling baru|latest/i.test(normalized)
    const customerHint = normalized.replace(/sales order|order|\bso\b|\bpo\b|\bbid\b|bulan ini|bulan lalu|hari ini|terbaru|terakhir|paling baru|latest|apa saja|apa aja|yang ada|isinya|cari/gi, ' ').replace(/[^\p{L}\p{N}\s.-]/gu, ' ').replace(/\s+/g, ' ').trim()
    const orderNumber = normalized.match(/\b(?:BID|PO|SO)\/[A-Z0-9-]+(?:\/[A-Z0-9-]+)*/i)?.[0]
    if (selectedCustomer) {
      const range = resolveDateRange(normalized)
      const orders = latest ? await salesService.latestCustomerOrders(selectedCustomer.code) : await salesService.customerOrders(selectedCustomer.code, range.dateFrom, range.dateTo)
      return { answer: orders.length ? `Saya menemukan ${latest ? 'PO/order terbaru' : 'Sales Order'} untuk ${selectedCustomer.name}: ${orders[0].customerPoNumber || orders[0].orderNumber || 'nomor tidak tersedia'}.` : `Tidak ada Sales Order yang ditemukan pada source Sales aktif untuk ${selectedCustomer.name} pada rentang tanggal tersebut.`, data: { customer: selectedCustomer, orders, salesSourceStatus, confidence: { customer: 'CONFIRMED_BY_DATA', orderRelationship: 'CONFIRMED_BY_DATA', quantitySemantics: 'PROBABLE', deliveryRelationship: 'PROBABLE' } }, sources: [...customerSources, ...salesSources], toolsUsed: [latest ? 'get_latest_customer_orders' : 'get_customer_orders'] }
    }
    if (customerHint && !explicitOrderLookup && !/\d/.test(customerHint)) {
      const customers = await customerService.search(customerHint)
      if (!customers.length) return { answer: `Customer dengan kata kunci "${customerHint}" tidak ditemukan dari data yang tersedia.`, data: { query: customerHint, matches: [], ambiguous: false, customers: [] }, sources: customerSources, toolsUsed: ['search_customer'] }
      if (customers.length > 1) return { answer: 'Saya menemukan beberapa customer yang cocok. Mohon pilih customer yang dimaksud.', data: { query: customerHint, matches: customers, ambiguous: true, customers }, sources: customerSources, toolsUsed: ['search_customer'] }
      const range = resolveDateRange(normalized)
      const orders = latest ? await salesService.latestCustomerOrders(customers[0].code) : await salesService.customerOrders(customers[0].code, range.dateFrom, range.dateTo)
      return { answer: orders.length ? `Saya menemukan ${latest ? 'PO/order terbaru' : 'Sales Order'} untuk ${customers[0].name}: ${orders[0].customerPoNumber || orders[0].orderNumber || 'nomor tidak tersedia'}.` : `Tidak ada Sales Order yang ditemukan pada source Sales aktif untuk ${customers[0].name} pada rentang tanggal tersebut.`, data: { customer: customers[0], orders, salesSourceStatus, confidence: { customer: 'CONFIRMED_BY_DATA', orderRelationship: 'CONFIRMED_BY_DATA', quantitySemantics: 'PROBABLE', deliveryRelationship: 'PROBABLE' } }, sources: [...customerSources, ...salesSources], toolsUsed: ['search_customer', latest ? 'get_latest_customer_orders' : 'get_customer_orders'] }
    }
    const orders = await salesService.search(orderNumber ?? (customerHint || normalized))
    return { answer: orders.length ? `Saya menemukan ${orders.length} Sales Order yang cocok.` : 'Sales Order tidak ditemukan dari data yang tersedia.', data: { orders }, sources: salesSources, toolsUsed: ['search_order'] }
  }

  if (/cari customer|search customer|customer/i.test(normalized)) {
    const query = normalized.replace(/cari customer|search customer|customer/gi, '').trim()
    const items = await customerService.search(query || normalized)
    return { answer: items.length ? `Saya menemukan ${items.length} customer yang cocok.` : 'Customer tidak ditemukan dari data yang tersedia.', data: { query: query || normalized, matches: items, ambiguous: items.length > 1, items }, sources: customerSources, toolsUsed: ['search_customer'] }
  }

  return { answer: 'Untuk saat ini saya hanya dapat melakukan pencarian customer yang sudah dipetakan. Pertanyaan order, delivery, stock, dan produksi masih menunggu validasi relationship serta query sumber.', data: null, sources: [], toolsUsed: [] }
}
