import { describe, it, expect } from 'vitest';
import { resolveBackground } from '../../src/core/background';

describe('resolveBackground', () => {
  it('solid → opaque clear colour, normal blend', () => {
    const r = resolveBackground({ type: 'solid', color: '#0a1b2b' });
    expect(r.clear).toEqual([10 / 255, 27 / 255, 43 / 255, 1]);
    expect(r.blend).toBe('add');
    expect(r.gradient).toBeUndefined();
  });

  it('transparent → alpha 0', () => {
    const r = resolveBackground({ type: 'transparent' });
    expect(r.clear[3]).toBe(0);
  });

  it('gradient → returns from/to and additive blend', () => {
    const r = resolveBackground({ type: 'gradient', from: '#000000', to: '#ffffff' });
    expect(r.gradient).toEqual({ from: '#000000', to: '#ffffff', angle: 45 });
    expect(r.blend).toBe('add');
  });

  it('light solid uses normal blend (no additive glow)', () => {
    const r = resolveBackground({ type: 'solid', color: '#eef2f7' });
    expect(r.blend).toBe('normal');
  });
});
