import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export type ReviewKind = 'FIELD' | 'RELATIONSHIP' | 'SOURCE_ROLE';
export type ReviewCandidate = {
  reviewId: string;
  entity: string;
  semanticField: string;
  physicalSource: string;
  suggestedMeaning: string;
  currentConfidence: 'PROBABLE';
  evidence: string[];
  kind?: ReviewKind;
  dataIntegrity?: number;
  suggestedSourceRole?: 'AUTHORITATIVE_FINAL' | 'AUTHORITATIVE_WORKFLOW';
};
export type ApprovedReview = ReviewCandidate & {
  approvedMeaning: string;
  confidence: 'CONFIRMED_BY_HUMAN';
  approvedAt: string;
  approvalReason: string;
  approverRole?: string;
};
export type RejectedReview = ReviewCandidate & { rejectedAt: string; rejectionReason: string };

export const reviewCandidates: ReviewCandidate[] = [
  { reviewId: 'pr-number-v1', entity: 'purchase_request', semanticField: 'pr_number', physicalSource: 'dbo.PR.PRNo', suggestedMeaning: 'purchase request business number', currentConfidence: 'PROBABLE', evidence: ['PR header context', 'PR.PRNo -> PRDetail.PRNo normalized match rate 98.58%'] },
  { reviewId: 'pr-date-v1', entity: 'purchase_request', semanticField: 'request_date', physicalSource: 'dbo.PR.PRDate', suggestedMeaning: 'purchase request/document date', currentConfidence: 'PROBABLE', evidence: ['PR header date context', 'date profile available'] },
  { reviewId: 'pr-quantity-v1', entity: 'purchase_request', semanticField: 'quantity', physicalSource: 'dbo.PRDetail.PRQty', suggestedMeaning: 'requested_quantity', currentConfidence: 'PROBABLE', evidence: ['PR detail context', 'numeric field', 'candidate name PRQty'] },
  { reviewId: 'pr-description-v1', entity: 'purchase_request', semanticField: 'material_description', physicalSource: 'dbo.PRDetail.[Material Description]', suggestedMeaning: 'material/item display description', currentConfidence: 'PROBABLE', evidence: ['PR detail context', 'direct material description field'] },
  { reviewId: 'pr-detail-number-v1', entity: 'purchase_request', semanticField: 'pr_number', physicalSource: 'dbo.PRDetail.PRNo', suggestedMeaning: 'Purchase Request business number stored on PR detail', currentConfidence: 'PROBABLE', evidence: ['PR detail context', '98.58% normalized match with PR.PRNo', 'repeated detail rows per PR number'] },
  { reviewId: 'pr-header-detail-v1', entity: 'purchase_request', semanticField: 'header_detail_relationship', physicalSource: 'dbo.PR.PRNo -> dbo.PRDetail.PRNo', suggestedMeaning: 'PR header to detail relationship', currentConfidence: 'PROBABLE', evidence: ['bounded normalized match rate 98.58%', 'PR header/detail dependency'], kind: 'RELATIONSHIP', dataIntegrity: 0.9858056777 }
  ,{ reviewId: 'pr-source-final-v1', entity: 'purchase_request', semanticField: 'source_role', physicalSource: 'dbo.PURC_PURCHASE_REQUEST', suggestedMeaning: 'Authoritative/final Purchase Request line-item source', currentConfidence: 'PROBABLE', evidence: ['PRNo and PRItemNo line identity', 'MaterialId and Qty line fields', 'inp_date and upd_date lifecycle fields'], kind: 'SOURCE_ROLE', suggestedSourceRole: 'AUTHORITATIVE_FINAL' }
  ,{ reviewId: 'pr-source-workflow-v1', entity: 'purchase_request', semanticField: 'source_role', physicalSource: 'dbo.PURC_PURCHREQUEST_TEMP', suggestedMeaning: 'Purchase Request workflow/request/approval source', currentConfidence: 'PROBABLE', evidence: ['Requestor and Dept fields', 'Approval workflow fields', 'AppDate and CDate workflow dates'], kind: 'SOURCE_ROLE', suggestedSourceRole: 'AUTHORITATIVE_WORKFLOW' }
  ,{ reviewId: 'pr-final-number-v1', entity: 'purchase_request', semanticField: 'pr_number', physicalSource: 'dbo.PURC_PURCHASE_REQUEST.PRNo', suggestedMeaning: 'Purchase Request business number on final line source', currentConfidence: 'PROBABLE', evidence: ['final line-item context', 'PRItemNo companion field', 'not inferred from name alone'] }
  ,{ reviewId: 'pr-final-quantity-v1', entity: 'purchase_request', semanticField: 'quantity', physicalSource: 'dbo.PURC_PURCHASE_REQUEST.Qty', suggestedMeaning: 'requested quantity on final line source', currentConfidence: 'PROBABLE', evidence: ['final line-item context', 'numeric Qty datatype', 'PRItemNo companion field'] }
  ,{ reviewId: 'pr-final-specification-v1', entity: 'purchase_request', semanticField: 'specification', physicalSource: 'dbo.PURC_PURCHASE_REQUEST.Specification', suggestedMeaning: 'Purchase Request item specification', currentConfidence: 'PROBABLE', evidence: ['final line item context', 'item description candidate requires explicit approval'] }
  ,{ reviewId: 'pr-final-brand-v1', entity: 'purchase_request', semanticField: 'brand', physicalSource: 'dbo.PURC_PURCHASE_REQUEST.Brand', suggestedMeaning: 'Purchase Request item brand', currentConfidence: 'PROBABLE', evidence: ['final line item context', 'brand field candidate requires explicit approval'] }
  ,{ reviewId: 'pr-final-material-code-v1', entity: 'purchase_request', semanticField: 'material_code', physicalSource: 'dbo.PURC_PURCHASE_REQUEST.MaterialId', suggestedMeaning: 'Purchase Request material code', currentConfidence: 'PROBABLE', evidence: ['final line item context', 'material domain target validation required'] }
  ,{ reviewId: 'pr-temp-number-v1', entity: 'purchase_request', semanticField: 'pr_number', physicalSource: 'dbo.PURC_PURCHREQUEST_TEMP.PRNo', suggestedMeaning: 'Purchase Request business number on active workflow source', currentConfidence: 'PROBABLE', evidence: ['direct database inspection identified active workflow rows', 'PRNo is present with MaterialName and Qty', 'source role approval required'] }
  ,{ reviewId: 'pr-temp-description-v1', entity: 'purchase_request', semanticField: 'material_description', physicalSource: 'dbo.PURC_PURCHREQUEST_TEMP.MaterialName', suggestedMeaning: 'human-readable Purchase Request item/material description', currentConfidence: 'PROBABLE', evidence: ['direct database inspection found searchable item descriptions', 'MaterialName is present with PRNo and Qty', 'source role approval required'] }
  ,{ reviewId: 'pr-temp-quantity-v1', entity: 'purchase_request', semanticField: 'quantity', physicalSource: 'dbo.PURC_PURCHREQUEST_TEMP.Qty', suggestedMeaning: 'requested quantity on active workflow source', currentConfidence: 'PROBABLE', evidence: ['direct database inspection found Qty on workflow rows', 'numeric quantity candidate', 'source role approval required'] }
  ,{ reviewId: 'pr-temp-material-code-v1', entity: 'purchase_request', semanticField: 'material_code', physicalSource: 'dbo.PURC_PURCHREQUEST_TEMP.MaterialId', suggestedMeaning: 'Purchase Request material code on active workflow source', currentConfidence: 'PROBABLE', evidence: ['direct database inspection found MaterialId', 'material code candidate', 'source role approval required'] }
];

export function reviewRoot() { return join(process.cwd(), '..', 'semantic', 'review'); }
async function readArray<T>(name: string): Promise<T[]> { try { return JSON.parse(await readFile(join(reviewRoot(), name), 'utf8')) as T[]; } catch { return []; } }
async function save(name: string, value: unknown) { await mkdir(reviewRoot(), { recursive: true }); await writeFile(join(reviewRoot(), name), `${JSON.stringify(value, null, 2)}\n`); }
export async function loadApproved() { return readArray<ApprovedReview>('approved.json'); }
export async function loadRejected() { return readArray<RejectedReview>('rejected.json'); }
export async function writeAudit(event: 'SEMANTIC_MAPPING_APPROVED' | 'SEMANTIC_MAPPING_REJECTED', item: { reviewId: string; entity: string; field: string; decision: 'APPROVED' | 'REJECTED'; timestamp: string }) {
  await mkdir(reviewRoot(), { recursive: true });
  await appendFile(join(reviewRoot(), 'audit.jsonl'), `${JSON.stringify({ event, ...item })}\n`);
}
export async function refreshPending() {
  const [approved, rejected] = await Promise.all([loadApproved(), loadRejected()]);
  const excluded = new Set([...approved, ...rejected].map((item) => item.reviewId));
  const dataConfirmed = new Set(['pr-temp-number-v1', 'pr-temp-description-v1', 'pr-temp-quantity-v1', 'pr-temp-material-code-v1']);
  const pending = reviewCandidates.filter((item) => !excluded.has(item.reviewId) && !dataConfirmed.has(item.reviewId));
  await save('pending.json', { generatedAt: new Date().toISOString(), candidates: pending });
  return { pending, approved, rejected };
}
