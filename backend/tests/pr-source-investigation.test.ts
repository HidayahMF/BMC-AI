import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

describe('purchase request source investigation', () => {
  it('does not promote either new table without lifecycle evidence', async () => {
    const report = JSON.parse(await readFile(join(process.cwd(), '..', 'semantic', 'catalog', 'pr-source-investigation.json'), 'utf8')) as { roleAssessment: { authoritative: { status: string; source: string | null } }; targetQuery: { queryable: boolean }; security: { rawRowsPersisted: boolean; databaseMutation: boolean } };
    expect(report.roleAssessment.authoritative.status).toBe('NOT_CONFIRMED');
    expect(report.roleAssessment.authoritative.source).toBeNull();
    expect(report.targetQuery.queryable).toBe(false);
    expect(report.security.rawRowsPersisted).toBe(false);
    expect(report.security.databaseMutation).toBe(false);
  });
  it('keeps data-confirmed TEMP fields queryable without promoting source authority', async () => {
    const catalog = JSON.parse(await readFile(join(process.cwd(), '..', 'semantic', 'catalog', 'semantic.json'), 'utf8')) as { entities: Array<{ entity: string; fields?: Record<string, { confidence: string; sourceStatus?: string; queryable?: boolean }> }> };
    const pr = catalog.entities.find((entity) => entity.entity === 'purchase_request');
    expect(pr?.fields?.pr_number).toEqual(expect.objectContaining({ physicalObject: 'dbo.PURC_PURCHREQUEST_TEMP', confidence: 'CONFIRMED_BY_DATA', queryable: true, sourceRole: 'AUTHORITATIVE_WORKFLOW', sourceConfidence: 'PROBABLE' }));
  });
  it('reports final and workflow source roles as human-review candidates', async () => {
    const report = JSON.parse(await readFile(join(process.cwd(), '..', 'semantic', 'catalog', 'pr-source-investigation.json'), 'utf8')) as { roleAssessment: { temp: { humanApprovalRequired: boolean }; final: { humanApprovalRequired: boolean } }; candidateSemanticFields: Record<string, Record<string, string[]>> };
    expect(report.roleAssessment.final.humanApprovalRequired).toBe(true);
    expect(report.roleAssessment.temp.humanApprovalRequired).toBe(true);
    expect(report.candidateSemanticFields.PURC_PURCHASE_REQUEST.pr_number).toContain('PRNo');
    expect(report.candidateSemanticFields.PURC_PURCHASE_REQUEST.quantity).toContain('Qty');
  });
});
