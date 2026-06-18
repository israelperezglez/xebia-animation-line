import { describe, it, expect } from 'vitest';
import { celosia } from '../../src/variants/celosia';
import { allFinite } from './helpers';

describe('celosia', () => {
  it('produces 2 families of 22 lines, finite & deterministic', () => {
    const a = celosia.generate({ t: 500, W: 800, H: 600 });
    expect(a.length).toBe(44);
    expect(a[0].pts.length).toBe(4);
    expect(allFinite(a)).toBe(true);
    expect(a).toEqual(celosia.generate({ t: 500, W: 800, H: 600 }));
  });
});
