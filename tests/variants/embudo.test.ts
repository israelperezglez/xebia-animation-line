import { describe, it, expect } from 'vitest';
import { embudo } from '../../src/variants/embudo';
import { allFinite } from './helpers';

describe('embudo', () => {
  it('produces 90 lines, finite & deterministic', () => {
    const a = embudo.generate({ t: 500, W: 800, H: 600 });
    expect(a.length).toBe(90);
    expect(a[0].pts.length).toBe(4);
    expect(allFinite(a)).toBe(true);
    expect(a).toEqual(embudo.generate({ t: 500, W: 800, H: 600 }));
  });
});
