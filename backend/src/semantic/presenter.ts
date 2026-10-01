import type { SemanticPlan } from './schema.js';
import { getEntity } from './catalog.js';
import { applyDisplayTransform } from './display-transform.js';
const labels: Record<string, string> = { pr_number: 'No PR', mrp_number: 'No MRP', material_description: 'Material', quantity: 'Qty', planned_purchase_quantity: 'Planning Qty', material_code: 'Kode Material', status: 'Status', pr_creation_status: 'Status PR' };
export function presentSemantic(plan: SemanticPlan, result: { entity: string; rows: unknown[]; rowCount: number; columns: string[] }) {
  const columns = result.columns.map((key) => ({ key, label: labels[key] ?? key.replace(/_/g, ' ') }));
  const entity = getEntity(result.entity);
  const data = result.rows.map((row) => {
    const source = row as Record<string, unknown>;
    return Object.fromEntries(result.columns.map((key) => [key, entity?.fields[key]?.enumMapping?.[String(source[key])]?.label ?? applyDisplayTransform(source[key], entity?.fields[key]?.displayTransform)]));
  });
  const status = result.rowCount ? 'SUCCESS' : 'ZERO_RESULTS';
  const label = result.entity === 'material_requirement' ? 'MRP' : 'Purchase Request';
  return { sourceMode: 'LIVE_BACKEND', status, entity: result.entity, answer: result.rowCount ? `Ditemukan ${result.rowCount} ${label}.` : `Tidak ditemukan ${label} yang sesuai.`, data, visualization: { type: 'table', columns }, sources: ['SQLSERVER.semantic-backend'] };
}
