import { describe, it, expect } from 'vitest';
import { oscilacion } from '../../src/variants/oscilacion';
import { allFinite } from './helpers';

describe('oscilacion', () => {
  it('produces N 2-point polylines, deterministic & finite', () => {
    const a = oscilacion.generate({ t: 1000, W: 800, H: 600 });
    const b = oscilacion.generate({ t: 1000, W: 800, H: 600 });
    expect(a.length).toBe(150);
    expect(a[0].pts.length).toBe(4);
    expect(allFinite(a)).toBe(true);
    expect(a).toEqual(b);
  });
});
