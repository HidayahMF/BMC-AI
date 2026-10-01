import { describe, expect, it } from 'vitest';
import { reviewCandidates } from '../src/semantic/review.js';
import { assertFieldAllowed } from '../src/semantic/policy.js';

describe('human approval contracts', () => {
  it('keeps the PR queue focused on five high-value candidates', () => {
    expect(reviewCandidates).toHaveLength(17);
    expect(reviewCandidates.map((candidate) => candidate.reviewId)).toEqual([
      'pr-number-v1', 'pr-date-v1', 'pr-quantity-v1', 'pr-description-v1', 'pr-detail-number-v1', 'pr-header-detail-v1', 'pr-source-final-v1', 'pr-source-workflow-v1', 'pr-final-number-v1', 'pr-final-quantity-v1', 'pr-final-specification-v1', 'pr-final-brand-v1', 'pr-final-material-code-v1', 'pr-temp-number-v1', 'pr-temp-description-v1', 'pr-temp-quantity-v1', 'pr-temp-material-code-v1'
    ]);
    expect(reviewCandidates.find((candidate) => candidate.kind === 'RELATIONSHIP')?.dataIntegrity).toBe(0.9858056777);
    expect(JSON.stringify(reviewCandidates)).not.toMatch(/511m19|ASUS|105\/HR/i);
  });

  it('treats human confidence as sufficient only after policy checks', () => {
    expect(() => assertFieldAllowed({ physicalObject: 'dbo.PRDetail', physicalColumn: 'PRQty', datatype: 'numeric', aliases: [], confidence: 'CONFIRMED_BY_HUMAN', classification: 'INTERNAL', queryable: true })).not.toThrow();
    expect(() => assertFieldAllowed({ physicalObject: 'dbo.HR', physicalColumn: 'Salary', datatype: 'money', aliases: [], confidence: 'CONFIRMED_BY_HUMAN', classification: 'SENSITIVE', queryable: true })).toThrow(/policy/i);
  });
});
