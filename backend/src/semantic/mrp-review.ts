import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export type MrpReviewDecision = 'APPROVED' | 'REJECTED' | 'UNKNOWN' | 'NEEDS_DOMAIN_REVIEW';
export type MrpReviewAnswer = { id: string; semanticField: string; physicalSource: string; decision: MrpReviewDecision; meaning?: string; reason?: string; enumMapping?: Record<string, { key: string; label: string }> };
export type MrpReviewImport = { domain: 'MRP'; approverRole: string; evidenceType: 'BUSINESS_OWNER_CONFIRMATION' | 'BUSINESS_UI_VERIFICATION'; answers: MrpReviewAnswer[] };
export function validateMrpReview(input: unknown): MrpReviewImport {
  const value = input as Partial<MrpReviewImport>;
  if (value.domain !== 'MRP' || !value.approverRole || !value.evidenceType || !Array.isArray(value.answers)) throw new Error('Invalid MRP review package.');
  if (!['BUSINESS_OWNER_CONFIRMATION', 'BUSINESS_UI_VERIFICATION'].includes(value.evidenceType)) throw new Error('Invalid MRP review evidence type.');
  for (const answer of value.answers) { if (!answer.id || !answer.semanticField || !answer.physicalSource || !['APPROVED', 'REJECTED', 'UNKNOWN', 'NEEDS_DOMAIN_REVIEW'].includes(answer.decision)) throw new Error('Invalid MRP review answer.'); }
  return value as MrpReviewImport;
}
export async function importMrpReview(input: unknown, root = join(process.cwd(), '..', 'semantic', 'review')) {
  const review = validateMrpReview(input); const timestamp = new Date().toISOString(); await mkdir(root, { recursive: true });
  const audit = review.answers.map((answer) => ({ event: 'MRP_BUSINESS_REVIEW_DECISION', id: answer.id, entity: 'material_requirement', semanticField: answer.semanticField, physicalSource: answer.physicalSource, decision: answer.decision, approverRole: review.approverRole, domain: review.domain, evidenceType: review.evidenceType, timestamp, reason: answer.reason ?? null }));
  await appendFile(join(root, 'audit.jsonl'), `${audit.map((entry) => JSON.stringify(entry)).join('\n')}\n`);
  const approvedPath = join(root, 'mrp-approved.json'); const existing = await readFile(approvedPath, 'utf8').then((text) => JSON.parse(text) as unknown[]).catch(() => []); const approved = review.answers.filter((answer) => answer.decision === 'APPROVED').map((answer) => ({ ...answer, confidence: 'CONFIRMED_BY_HUMAN', approverRole: review.approverRole, domain: review.domain, evidenceType: review.evidenceType, approvedAt: timestamp })); await writeFile(approvedPath, `${JSON.stringify([...existing, ...approved], null, 2)}\n`); return { imported: audit.length, approved: approved.length, timestamp };
}
