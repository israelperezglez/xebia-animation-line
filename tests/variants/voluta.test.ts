import { describe, it, expect } from 'vitest';
import { voluta } from '../../src/variants/voluta';
import { allFinite } from './helpers';

describe('voluta', () => {
  it('produces 50 lines, finite & deterministic', () => {
    const a = voluta.generate({ t: 500, W: 800, H: 600 });
    expect(a.length).toBe(50);
    expect(a[0].pts.length).toBe(31 * 2);
    expect(allFinite(a)).toBe(true);
    expect(a).toEqual(voluta.generate({ t: 500, W: 800, H: 600 }));
  });
});
