import { describe, it, expect } from 'vitest';
import { cono } from '../../src/variants/cono';
import { allFinite } from './helpers';

describe('cono', () => {
  it('produces 48 lines, finite & deterministic', () => {
    const a = cono.generate({ t: 500, W: 800, H: 600 });
    expect(a.length).toBe(48);
    expect(a[0].pts.length).toBe(37 * 2);
    expect(allFinite(a)).toBe(true);
    expect(a).toEqual(cono.generate({ t: 500, W: 800, H: 600 }));
  });
});
