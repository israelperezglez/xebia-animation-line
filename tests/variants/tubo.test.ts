import { describe, it, expect } from 'vitest';
import { tubo } from '../../src/variants/tubo';
import { allFinite } from './helpers';

describe('tubo', () => {
  it('produces 44 lines, finite & deterministic', () => {
    const a = tubo.generate({ t: 500, W: 800, H: 600 });
    expect(a.length).toBe(44);
    expect(a[0].pts.length).toBe(41 * 2);
    expect(allFinite(a)).toBe(true);
    expect(a).toEqual(tubo.generate({ t: 500, W: 800, H: 600 }));
  });
});
