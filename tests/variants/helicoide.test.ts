import { describe, it, expect } from 'vitest';
import { helicoide } from '../../src/variants/helicoide';
import { allFinite } from './helpers';

describe('helicoide', () => {
  it('produces 80 chords, finite & deterministic', () => {
    const a = helicoide.generate({ t: 500, W: 800, H: 600 });
    expect(a.length).toBe(80);
    expect(a[0].pts.length).toBe(4);
    expect(allFinite(a)).toBe(true);
    expect(a).toEqual(helicoide.generate({ t: 500, W: 800, H: 600 }));
  });
});
