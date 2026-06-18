import { describe, it, expect } from 'vitest';
import { helice } from '../../src/variants/helice';
import { allFinite } from './helpers';

describe('helice', () => {
  it('produces 24 symmetric rings, finite & deterministic', () => {
    const a = helice.generate({ t: 500, W: 800, H: 600 });
    expect(a.length).toBe(24);
    expect(a[0].pts.length).toBe(49 * 2);
    expect(allFinite(a)).toBe(true);
    expect(a).toEqual(helice.generate({ t: 500, W: 800, H: 600 }));
  });
});
