import { describe, it, expect } from 'vitest';
import { cinta } from '../../src/variants/cinta';
import { allFinite } from './helpers';

describe('cinta', () => {
  it('produces 81 cross-lines, finite & deterministic', () => {
    const a = cinta.generate({ t: 500, W: 800, H: 600 });
    expect(a.length).toBe(81);
    expect(a[0].pts.length).toBe(4);
    expect(allFinite(a)).toBe(true);
    expect(a).toEqual(cinta.generate({ t: 500, W: 800, H: 600 }));
  });
});
