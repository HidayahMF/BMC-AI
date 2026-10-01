import { describe, expect, it } from 'vitest';
import { profilePlan } from '../src/semantic/profile.js';

describe('type-aware semantic profiler', () => {
  it('profiles int as numeric without datetime conversion', () => {
    const plan = profilePlan('int', 'dbo.Example', 'Qty');
    expect(plan.group).toBe('NUMERIC');
    expect(plan.text).toContain('MIN([Qty])');
    expect(plan.text).not.toContain('datetime');
  });
  it('profiles datetime2 as native date range', () => {
    const plan = profilePlan('datetime2', 'dbo.Example', 'CreatedDate');
    expect(plan.group).toBe('DATE_TIME');
    expect(plan.text).toContain('MIN([CreatedDate])');
    expect(plan.text).not.toContain('TRY_CONVERT');
  });
  it('profiles varchar as string lengths', () => {
    const plan = profilePlan('varchar', 'dbo.Example', 'NoPR');
    expect(plan.group).toBe('STRING');
    expect(plan.text).toContain('LEN([NoPR])');
    expect(plan.text).not.toContain('datetime');
  });
  it('profiles bit as boolean and skips xml', () => {
    const bit = profilePlan('bit', 'dbo.Example', 'Enabled');
    const xml = profilePlan('xml', 'dbo.Example', 'DocumentXml');
    expect(bit.group).toBe('BOOLEAN');
    expect(bit.text).toContain('CONVERT(int,[Enabled])');
    expect(xml.status).toBe('SKIPPED_UNSUPPORTED_TYPE');
    expect(xml.text).toBeUndefined();
  });
  it('quotes discovered identifiers without accepting SQL fragments', () => {
    expect(profilePlan('int', 'dbo.Bad Table', 'Qty').text).toContain('[Bad Table]');
    expect(profilePlan('int', 'dbo.Example', 'Qty]x').text).toContain('[Qty]]x]');
    expect(() => profilePlan('int', 'dbo.Example', 'Qty\u0000x')).toThrow();
  });
});
