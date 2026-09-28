import { customerService } from '../services/customer.service.js'
import { salesService } from '../services/sales.service.js'
import { resolveDateRange } from '../utils/date-range.js'
import { salesDataSource, salesSourceStatus } from '../config/sales-source.js'

export type AskResult = { answer: string; data: unknown; sources: string[]; toolsUsed: string[] }

const customerSources = [`SQLSERVER.${salesDataSource.customer}`]
const salesSources = [`SQLSERVER.${salesDataSource.orderHeader}`, `SQLSERVER.${salesDataSource.orderDetail}`, `SQLSERVER.${salesDataSource.product}`]

export const askAgent = async (message: string, selectedCustomer?: { code: string; name: string; alias: string | null }): Promise<AskResult> => {
  const normalized = message.trim()
  if (!normalized) return { answer: 'Silakan masukkan pertanyaan.', data: null, sources: [], toolsUsed: [] }

  const asksOrders = /order|sales order|so\b/i.test(normalized)
  if (asksOrders) {
    const explicitOrderLookup = /sales order|\bso\b/i.test(normalized)
    const customerHint = normalized.replace(/sales order|order|so\b|bulan ini|bulan lalu|hari ini|apa saja|apa aja|yang ada|cari/gi, ' ').replace(/[^\p{L}\p{N}\s.-]/gu, ' ').replace(/\s+/g, ' ').trim()
    if (selectedCustomer) {
       const range = resolveDateRange(normalized)
      const orders = await salesService.customerOrders(selectedCustomer.code, range.dateFrom, range.dateTo)
        return { answer: orders.length ? `Saya menemukan ${orders.length} Sales Order untuk ${selectedCustomer.name}.` : `Tidak ada Sales Order yang ditemukan pada source Sales aktif untuk ${selectedCustomer.name} pada rentang tanggal tersebut.`, data: { customer: selectedCustomer, orders, salesSourceStatus, confidence: { customer: 'CONFIRMED_BY_DATA', orderRelationship: 'CONFIRMED_BY_DATA', quantitySemantics: 'PROBABLE', deliveryRelationship: 'PROBABLE' } }, sources: [...customerSources, ...salesSources], toolsUsed: ['get_customer_orders'] }
    }
    if (customerHint && !explicitOrderLookup && !/\d/.test(customerHint)) {
      const customers = await customerService.search(customerHint)
      if (!customers.length) return { answer: `Customer dengan kata kunci "${customerHint}" tidak ditemukan dari data yang tersedia.`, data: { query: customerHint, matches: [], ambiguous: false, customers: [] }, sources: customerSources, toolsUsed: ['search_customer'] }
      if (customers.length > 1) return { answer: 'Saya menemukan beberapa customer yang cocok. Mohon pilih customer yang dimaksud.', data: { query: customerHint, matches: customers, ambiguous: true, customers }, sources: customerSources, toolsUsed: ['search_customer'] }
       const range = resolveDateRange(normalized)
      const orders = await salesService.customerOrders(customers[0].code, range.dateFrom, range.dateTo)
       return { answer: orders.length ? `Saya menemukan ${orders.length} Sales Order untuk ${customers[0].name}.` : `Tidak ada Sales Order yang ditemukan pada source Sales aktif untuk ${customers[0].name} pada rentang tanggal tersebut.`, data: { customer: customers[0], orders, salesSourceStatus, confidence: { customer: 'CONFIRMED_BY_DATA', orderRelationship: 'CONFIRMED_BY_DATA', quantitySemantics: 'PROBABLE', deliveryRelationship: 'PROBABLE' } }, sources: [...customerSources, ...salesSources], toolsUsed: ['search_customer', 'get_customer_orders'] }
    }
    const orders = await salesService.search(customerHint || normalized)
    return { answer: orders.length ? `Saya menemukan ${orders.length} Sales Order yang cocok.` : 'Sales Order tidak ditemukan dari data yang tersedia.', data: { orders }, sources: salesSources, toolsUsed: ['search_order'] }
  }

  if (/cari customer|search customer|customer/i.test(normalized)) {
    const query = normalized.replace(/cari customer|search customer|customer/gi, '').trim()
    const items = await customerService.search(query || normalized)
    return { answer: items.length ? `Saya menemukan ${items.length} customer yang cocok.` : 'Customer tidak ditemukan dari data yang tersedia.', data: { query: query || normalized, matches: items, ambiguous: items.length > 1, items }, sources: customerSources, toolsUsed: ['search_customer'] }
  }

  return { answer: 'Untuk saat ini saya hanya dapat melakukan pencarian customer yang sudah dipetakan. Pertanyaan order, delivery, stock, dan produksi masih menunggu validasi relationship serta query sumber.', data: null, sources: [], toolsUsed: [] }
}
