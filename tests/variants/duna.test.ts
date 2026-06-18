import { describe, it, expect } from 'vitest';
import { duna } from '../../src/variants/duna';
import { allFinite } from './helpers';

describe('duna', () => {
  it('produces 40 draped lines, finite & deterministic', () => {
    const a = duna.generate({ t: 500, W: 800, H: 600 });
    expect(a.length).toBe(40);
    expect(a[0].pts.length).toBe(61 * 2);
    expect(allFinite(a)).toBe(true);
    expect(a).toEqual(duna.generate({ t: 500, W: 800, H: 600 }));
  });
});
