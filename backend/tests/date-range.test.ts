import { describe, expect, it } from 'vitest';
import { currentMonthJakarta, previousMonthJakarta, resolveDateRange } from '../src/utils/date-range.js';

describe('Jakarta sales date ranges', () => {
  it('uses Asia/Jakarta for the current month', () => {
    expect(currentMonthJakarta(new Date('2026-01-31T17:30:00.000Z'))).toEqual({ dateFrom: '2026-02-01', dateTo: '2026-02-28' });
  });
  it('resolves historical month and year requests', () => {
    expect(resolveDateRange('Order Januari 2026')).toEqual({ dateFrom: '2026-01-01', dateTo: '2026-01-31' });
    expect(resolveDateRange('Order tahun 2025')).toEqual({ dateFrom: '2025-01-01', dateTo: '2025-12-31' });
  });
  it('resolves last month in Jakarta', () => {
    expect(previousMonthJakarta(new Date('2026-03-01T00:30:00.000Z'))).toEqual({ dateFrom: '2026-02-01', dateTo: '2026-02-28' });
  });
});
