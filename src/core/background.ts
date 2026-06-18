import type { Background } from './types';

export interface ResolvedBackground {
  clear: [number, number, number, number];
  blend: 'add' | 'normal';
  gradient?: { from: string; to: string; angle: number };
}

function hexToUnit(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function luminance(hex: string): number {
  const [r, g, b] = hexToUnit(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function resolveBackground(bg: Background): ResolvedBackground {
  if (bg.type === 'transparent') {
    return { clear: [0, 0, 0, 0], blend: 'add' };
  }
  if (bg.type === 'gradient') {
    return {
      clear: [...hexToUnit(bg.from), 1] as [number, number, number, number],
      blend: 'add',
      gradient: { from: bg.from, to: bg.to, angle: bg.angle ?? 45 },
    };
  }
  // solid: light backgrounds can't show additive glow → use normal blend
  const blend = luminance(bg.color) > 0.6 ? 'normal' : 'add';
  return { clear: [...hexToUnit(bg.color), 1] as [number, number, number, number], blend };
}
