import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

describe('semantic enrichment artifacts', () => {
  it('preserves validated seed entities and keeps PR conservative', async () => {
    const catalog = JSON.parse(await readFile(join(process.cwd(), '..', 'semantic', 'catalog', 'semantic.json'), 'utf8')) as { entities: Array<{ entity: string; queryable?: boolean }> };
    expect(catalog.entities.map((entity) => entity.entity)).toEqual(expect.arrayContaining(['customer', 'sales_order', 'inventory', 'purchase_request']));
    expect(catalog.entities.find((entity) => entity.entity === 'purchase_request')?.queryable).toBe(true);
  });
  it('reports the discovered physical coverage without claiming full semantic coverage', async () => {
    const coverage = JSON.parse(await readFile(join(process.cwd(), '..', 'semantic', 'catalog', 'coverage.json'), 'utf8')) as { discovered: { objects: number }; classified: { unknown: number }; mapped: { queryable: number } };
    expect(coverage.discovered.objects).toBe(882);
    expect(coverage.classified.unknown).toBeGreaterThan(0);
    expect(coverage.mapped.queryable).toBeGreaterThan(0);
  });
  it('ingests four human-approved PR fields without approving the skipped relationship', async () => {
    const catalog = JSON.parse(await readFile(join(process.cwd(), '..', 'semantic', 'catalog', 'semantic.json'), 'utf8')) as { entities: Array<{ entity: string; queryable?: boolean; fields?: Record<string, { confidence: string; queryable?: boolean; sourceStatus?: string }> }> };
    const pr = catalog.entities.find((entity) => entity.entity === 'purchase_request');
    expect(pr?.fields).toEqual(expect.objectContaining({
      pr_number: expect.objectContaining({ physicalObject: 'dbo.PURC_PURCHREQUEST_TEMP', physicalColumn: 'PRNo', confidence: 'CONFIRMED_BY_DATA', queryable: true }),
      material_description: expect.objectContaining({ physicalObject: 'dbo.PURC_PURCHREQUEST_TEMP', physicalColumn: 'MaterialName', confidence: 'CONFIRMED_BY_DATA', queryable: true }),
      quantity: expect.objectContaining({ physicalObject: 'dbo.PURC_PURCHREQUEST_TEMP', physicalColumn: 'Qty', confidence: 'CONFIRMED_BY_DATA', queryable: true }),
      material_code: expect.objectContaining({ physicalObject: 'dbo.PURC_PURCHREQUEST_TEMP', physicalColumn: 'MaterialId', confidence: 'CONFIRMED_BY_DATA', queryable: true })
    }));
    expect(pr?.queryable).toBe(true);
    const pending = JSON.parse(await readFile(join(process.cwd(), '..', 'semantic', 'review', 'pending.json'), 'utf8')) as { candidates: Array<{ reviewId: string; physicalSource: string }> };
    expect(pending.candidates).toEqual(expect.arrayContaining([expect.objectContaining({ reviewId: 'pr-header-detail-v1' })]));
    expect(pending.candidates.map((candidate) => candidate.reviewId)).not.toEqual(expect.arrayContaining(['pr-temp-number-v1', 'pr-temp-description-v1', 'pr-temp-quantity-v1', 'pr-temp-material-code-v1']));
  });
});
