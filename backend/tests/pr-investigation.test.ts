import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

describe('purchase request investigation artifact', () => {
  it('preserves conservative promotion when only business-number evidence is probable', async () => {
    const report = JSON.parse(await readFile(join(process.cwd(), '..', 'semantic', 'catalog', 'pr-investigation.json'), 'utf8')) as { outcome: { queryable: boolean; status: string }; checks: Array<{ from: string; confidence: string }> };
    expect(report.outcome.queryable).toBe(false);
    expect(report.outcome.status).toBe('MAPPING_REVIEW_REQUIRED');
    expect(report.checks.find((check) => check.from === 'dbo.PRDetail.PRNo')?.confidence).toBe('PROBABLE');
  });
  it('does not persist raw values in the investigation artifact', async () => {
    const text = await readFile(join(process.cwd(), '..', 'semantic', 'catalog', 'pr-investigation.json'), 'utf8');
    expect(text).not.toMatch(/511m19|105\/HR|ASUS/i);
    expect(text).toContain('rawValuesPersisted');
  });
});
