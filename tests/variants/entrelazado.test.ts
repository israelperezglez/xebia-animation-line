import { describe, it, expect } from 'vitest';
import { entrelazado } from '../../src/variants/entrelazado';
import { allFinite } from './helpers';

describe('entrelazado', () => {
  it('produces 44 strands, finite & deterministic', () => {
    const a = entrelazado.generate({ t: 800, W: 800, H: 600 });
    expect(a.length).toBe(44);
    expect(a[0].pts.length).toBe(121 * 2);
    expect(allFinite(a)).toBe(true);
    expect(a).toEqual(entrelazado.generate({ t: 800, W: 800, H: 600 }));
  });
});
