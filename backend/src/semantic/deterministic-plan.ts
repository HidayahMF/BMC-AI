import { semanticPlanSchema, type SemanticPlan } from './schema.js';

const stopWords = new Set(['pr', 'mrp', 'no', 'material', 'apa', 'aja', 'cari', 'carikan', 'yang', 'tolong', 'dong', 'untuk', 'apa', 'saja', 'isi', 'ini', 'adalah', 'planning', 'qty', 'quantity', 'berapa', 'lebih', 'dari', 'antara', 'dan', 'approved', 'manager', 'sudah', 'baru', 'dibuat', 'belum', 'sebagian', 'semua', 'bulan', 'tahun', 'september', 'januari', 'februari', 'maret', 'april', 'mei', 'juni', 'juli', 'agustus', 'oktober', 'november', 'desember']);

export function extractPrNumber(message: string) {
  return message.match(/\b\d{3}\/[A-Za-z]{2,10}\/\d{2}\/\d{2}\b/)?.[0];
}

export function materialSearchTerms(message: string) {
  const prNumber = extractPrNumber(message);
  const quantity = message.match(/(?:qty|quantity|jumlah)\s+(\d+(?:[.,]\d+)?)/i)?.[1];
  const withoutQuantity = message.replace(/(?:qty|quantity|jumlah)\s+\d+(?:[.,]\d+)?/gi, ' ');
  return [...new Set((withoutQuantity.replace(prNumber ?? '', ' ').match(/[A-Za-z0-9][A-Za-z0-9/+.-]*/g) ?? []).filter((term) => !stopWords.has(term.toLowerCase())))]
    .filter((term) => term !== quantity);
}

export function deterministicSemanticPlan(message: string): SemanticPlan | undefined {
  const isPurchaseRequest = /\bpr\b|purchase request|permintaan pembelian/i.test(message);
  const isMrp = /\bmrp\b|material requirement|kebutuhan material|material planning/i.test(message);
  if (!isPurchaseRequest && !isMrp) return undefined;
  const isMrpLifecycle = /(?:belum|sebagian|sudah) (?:dibuat|sudah dibuat) PR/i.test(message);
  if (isMrp && (!isPurchaseRequest || isMrpLifecycle)) {
    const terms = materialSearchTerms(message);
    const planningQty = /planning\s+qty|planned purchase quantity|planning quantity/i.test(message);
    const lifecycleStatus = /sebagian dibuat PR|sebagian sudah dibuat PR/i.test(message) ? 'SEBAGIAN_DIBUAT_PR' : /sudah dibuat PR semua|sudah dibuat PR/i.test(message) ? 'SUDAH_DIBUAT_PR' : /belum dibuat PR|belum dibuat/i.test(message) ? 'BELUM_DIBUAT_PR' : undefined;
    const status = /approved manager|approved by manager|sudah di-approved oleh manager/i.test(message) ? 3 : /baru dibuat|new MRP/i.test(message) ? 0 : undefined;
    const month = message.match(/(?:bulan|month)\s+(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)\s+(20\d{2})|\b(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)\s+(20\d{2})/i);
    const monthNames = ['januari', 'februari', 'maret', 'april', 'mei', 'juni', 'juli', 'agustus', 'september', 'oktober', 'november', 'desember']; const monthName = (month?.[1] ?? month?.[3])?.toLowerCase(); const year = month?.[2] ?? month?.[4];
    const yearOnly = message.match(/\btahun\s+(20\d{2})\b/i)?.[1];
    const temporalTerms = new Set([monthName, year, yearOnly].filter(Boolean)); const materialTerms = terms.filter((term) => !temporalTerms.has(term.toLowerCase()));
    const filters = [...(materialTerms.length ? [{ field: 'material_description', operator: 'contains_all' as const, value: materialTerms }] : []), ...(status === undefined ? [] : [{ field: 'status', operator: 'eq' as const, value: status }]), ...(lifecycleStatus === undefined ? [] : [{ field: 'pr_creation_status', operator: 'eq' as const, value: lifecycleStatus }]), ...(monthName && year ? [{ field: 'mrp_created_date', operator: 'year_month_equals' as const, value: `${year}-${String(monthNames.indexOf(monthName) + 1).padStart(2, '0')}` }] : []), ...(yearOnly ? [{ field: 'mrp_created_date', operator: 'year_equals' as const, value: yearOnly }] : [])];
    return semanticPlanSchema.parse({ mode: 'LIVE_QUERY', entity: 'material_requirement', select: ['mrp_number', 'material_code', 'material_description', ...(planningQty ? ['planned_purchase_quantity'] : []), ...(lifecycleStatus ? ['pr_creation_status'] : []), ...(monthName || yearOnly ? ['mrp_created_date'] : [])], metrics: [], aggregates: [], groupBy: [], filters, sort: [], limit: 100, offset: 0 });
  }
  const terms = materialSearchTerms(message);
  const prNumber = extractPrNumber(message);
  const quantity = message.match(/(?:qty|quantity|jumlah)\s+(\d+(?:[.,]\d+)?)/i)?.[1];
  return semanticPlanSchema.parse({ mode: 'LIVE_QUERY', entity: 'purchase_request', select: ['pr_number', 'material_description', 'quantity'], metrics: [], filters: [...(prNumber ? [{ field: 'pr_number', operator: 'contains', value: prNumber }] : []), ...(terms.length ? [{ field: 'material_description', operator: 'contains_all', value: terms }] : []), ...(quantity ? [{ field: 'quantity', operator: 'eq', value: Number(quantity.replace(',', '.')) }] : [])], sort: [], limit: 100, offset: 0 });
}
