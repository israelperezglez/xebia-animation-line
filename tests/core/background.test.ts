import { describe, it, expect } from 'vitest';
import { resolveBackground } from '../../src/core/background';

describe('resolveBackground', () => {
  it('solid dark → opaque, normal blend (no acumulación), drawn', () => {
    const r = resolveBackground({ type: 'solid', color: '#0a1b2b' });
    expect(r.draw).toBe(true);
    expect(r.clearAlpha).toBe(1);
    expect(r.blend).toBe('normal');
    expect(r.from).toEqual(r.to);
  });

  it('transparent → not drawn, alpha 0', () => {
    const r = resolveBackground({ type: 'transparent' });
    expect(r.draw).toBe(false);
    expect(r.clearAlpha).toBe(0);
  });

  it('gradient keeps from/to and converts angle to radians', () => {
    const r = resolveBackground({ type: 'gradient', from: '#000000', to: '#ffffff', angle: 90 });
    expect(r.from).toEqual([0, 0, 0]);
    expect(r.to).toEqual([1, 1, 1]);
    expect(r.angle).toBeCloseTo(Math.PI / 2);
  });

  it('light solid → multiply blend', () => {
    expect(resolveBackground({ type: 'solid', color: '#eef2f7' }).blend).toBe('multiply');
  });

  it('light gradient → multiply blend', () => {
    expect(resolveBackground({ type: 'gradient', from: '#f3eef6', to: '#e7ecff' }).blend).toBe('multiply');
  });
});
