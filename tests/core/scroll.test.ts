import { describe, it, expect } from 'vitest';
import { progressFromRect } from '../../src/core/scroll';

describe('progressFromRect', () => {
  const vh = 1000;
  it('is 0 when element top is at the bottom of viewport', () => {
    expect(progressFromRect({ top: 1000, height: 400 }, vh)).toBeCloseTo(0);
  });
  it('is 1 when element bottom is at the top of viewport', () => {
    expect(progressFromRect({ top: -400, height: 400 }, vh)).toBeCloseTo(1);
  });
  it('is 0.5 mid-pass and clamps outside', () => {
    expect(progressFromRect({ top: 300, height: 400 }, vh)).toBeCloseTo(0.5);
    expect(progressFromRect({ top: 5000, height: 400 }, vh)).toBe(0);
    expect(progressFromRect({ top: -5000, height: 400 }, vh)).toBe(1);
  });
});
