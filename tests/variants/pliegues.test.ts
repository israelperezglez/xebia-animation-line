import { describe, it, expect } from 'vitest';
import { pliegues } from '../../src/variants/pliegues';
import { allFinite } from './helpers';

describe('pliegues', () => {
  it('produces 60 polylines (30 cols + 30 rows), finite & deterministic', () => {
    const a = pliegues.generate({ t: 400, W: 800, H: 600 });
    expect(a.length).toBe(60);
    expect(allFinite(a)).toBe(true);
    expect(a).toEqual(pliegues.generate({ t: 400, W: 800, H: 600 }));
  });
});
