import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { assertFieldAllowed } from '../src/semantic/policy.js';

describe('human semantic review', () => {
  it('creates a focused pending queue without raw rows', async () => {
    const queue = JSON.parse(await readFile(join(process.cwd(), '..', 'semantic', 'review', 'pending.json'), 'utf8')) as { candidates: Array<{ reviewId: string; entity: string; semanticField: string; physicalSource: string }> };
    expect(queue.candidates.length).toBe(8);
    expect(queue.candidates.every((candidate) => candidate.entity === 'purchase_request')).toBe(true);
    expect(queue.candidates).toEqual(expect.arrayContaining([
      expect.objectContaining({ reviewId: 'pr-header-detail-v1' }),
      expect.objectContaining({ reviewId: 'pr-source-final-v1', kind: 'SOURCE_ROLE' }),
      expect.objectContaining({ reviewId: 'pr-source-workflow-v1', kind: 'SOURCE_ROLE' }),
      expect.objectContaining({ reviewId: 'pr-final-number-v1', physicalSource: 'dbo.PURC_PURCHASE_REQUEST.PRNo' }),
      expect.objectContaining({ reviewId: 'pr-final-quantity-v1', physicalSource: 'dbo.PURC_PURCHASE_REQUEST.Qty' }),
      expect.objectContaining({ reviewId: 'pr-final-specification-v1' }),
      expect.objectContaining({ reviewId: 'pr-final-brand-v1' }),
      expect.objectContaining({ reviewId: 'pr-final-material-code-v1' })
     ]));
    expect(queue.candidates.map((candidate) => candidate.reviewId)).not.toEqual(expect.arrayContaining(['pr-temp-number-v1', 'pr-temp-description-v1', 'pr-temp-quantity-v1', 'pr-temp-material-code-v1']));
    expect(JSON.stringify(queue)).not.toMatch(/511m19|ASUS|105\/HR/i);
  });
  it('allows human-confirmed fields only when policy permits them', () => {
    expect(() => assertFieldAllowed({ physicalObject: 'dbo.PRDetail', physicalColumn: 'PRQty', datatype: 'int', aliases: [], confidence: 'CONFIRMED_BY_HUMAN', classification: 'INTERNAL' })).not.toThrow();
    expect(() => assertFieldAllowed({ physicalObject: 'dbo.HR', physicalColumn: 'Salary', datatype: 'money', aliases: [], confidence: 'CONFIRMED_BY_HUMAN', classification: 'RESTRICTED' })).toThrow();
  });
});
