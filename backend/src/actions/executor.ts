import { customerService } from '../services/customer.service.js';
import { deliveryService } from '../services/delivery.service.js';
import { inventoryService } from '../services/inventory.service.js';
import { salesService } from '../services/sales.service.js';
import { resolveDateRange } from '../utils/date-range.js';
import type { Intent } from '../ai/intents/schema.js';

export type ActionResult = { status: 'SUCCESS' | 'NOT_FOUND' | 'AMBIGUOUS' | 'BLOCKED'; data: unknown; customerCandidates?: Array<{ code: string; name: string; alias: string | null }>; };
function range(intent: Intent) { if (intent.parameters.dateFrom && intent.parameters.dateTo) return { dateFrom: intent.parameters.dateFrom, dateTo: intent.parameters.dateTo }; if (intent.parameters.period === 'ALL') return {}; return resolveDateRange(intent.parameters.period === 'PREVIOUS_MONTH' ? 'bulan lalu' : intent.parameters.period === 'THIS_YEAR' ? 'tahun ini' : intent.parameters.period === 'TODAY' ? 'hari ini' : 'bulan ini'); }

export async function executeAction(intent: Intent, selectedCustomerCode?: string): Promise<ActionResult> {
  const p = intent.parameters;
  if (intent.intent === 'SEARCH_CUSTOMER') { const data = await customerService.search(p.customerQuery ?? ''); return { status: data.length ? 'SUCCESS' : 'NOT_FOUND', data }; }
  if (intent.intent === 'SEARCH_ORDER' || intent.intent === 'GET_ORDER_DETAILS') { const data = intent.intent === 'SEARCH_ORDER' ? await salesService.search(p.orderNumber ?? '') : await salesService.details(p.orderNumber ?? ''); return { status: data.length ? 'SUCCESS' : 'NOT_FOUND', data }; }
  if (intent.intent === 'GET_STOCK_STATUS') { const data = await inventoryService.stockStatus(p.materialQuery ?? ''); return { status: data.length ? 'SUCCESS' : 'NOT_FOUND', data }; }
  if (intent.intent === 'GET_DELIVERY_LOOKUP') { if (!selectedCustomerCode) { const candidates = await customerService.search(p.customerQuery ?? ''); return candidates.length === 1 ? executeAction({ ...intent, parameters: { ...p, customerCode: candidates[0].code } }, candidates[0].code) : { status: candidates.length ? 'AMBIGUOUS' : 'NOT_FOUND', data: candidates, customerCandidates: candidates }; } const dates = range(intent); const data = await deliveryService.byCustomer(selectedCustomerCode, dates.dateFrom, dates.dateTo); return { status: data.length ? 'SUCCESS' : 'NOT_FOUND', data }; }
  if (intent.intent === 'GET_CUSTOMER_ORDERS' || intent.intent === 'GET_LATEST_CUSTOMER_ORDERS') { if (!selectedCustomerCode) { const candidates = await customerService.search(p.customerQuery ?? ''); return candidates.length === 1 ? executeAction({ ...intent, parameters: { ...p, customerCode: candidates[0].code } }, candidates[0].code) : { status: candidates.length ? 'AMBIGUOUS' : 'NOT_FOUND', data: candidates, customerCandidates: candidates }; } const data = intent.intent === 'GET_LATEST_CUSTOMER_ORDERS' ? await salesService.latestCustomerOrders(selectedCustomerCode) : await salesService.customerOrders(selectedCustomerCode, range(intent).dateFrom, range(intent).dateTo); return { status: data.length ? 'SUCCESS' : 'NOT_FOUND', data }; }
  return { status: 'BLOCKED', data: null };
}
