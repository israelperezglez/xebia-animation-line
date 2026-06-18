import { describe, it, expect } from 'vitest';
import { quilla } from '../../src/variants/quilla';
import { allFinite } from './helpers';

describe('quilla', () => {
  it('produces 2 ruling families (72 lines), finite & deterministic', () => {
    const a = quilla.generate({ t: 500, W: 800, H: 600 });
    expect(a.length).toBe(72);
    expect(a[0].pts.length).toBe(4);
    expect(allFinite(a)).toBe(true);
    expect(a).toEqual(quilla.generate({ t: 500, W: 800, H: 600 }));
  });
});
