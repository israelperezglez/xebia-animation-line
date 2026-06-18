import { describe, it, expect } from 'vitest';
import { interferencia } from '../../src/variants/interferencia';
import { allFinite } from './helpers';

describe('interferencia', () => {
  it('produces 64 multi-point polylines, finite & deterministic', () => {
    const a = interferencia.generate({ t: 800, W: 800, H: 600 });
    expect(a.length).toBe(64);
    expect(a[0].pts.length).toBe(141 * 2);
    expect(allFinite(a)).toBe(true);
    expect(a).toEqual(interferencia.generate({ t: 800, W: 800, H: 600 }));
  });
});
