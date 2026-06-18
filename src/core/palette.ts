import { lerp } from './geom';

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function colorAt(palette: string[], t: number): [number, number, number] {
  const p = palette.length >= 2 ? palette : [palette[0] ?? '#000000', palette[0] ?? '#000000'];
  const c = Math.max(0, Math.min(1, t));
  const seg = c * (p.length - 1);
  const i = Math.min(Math.floor(seg), p.length - 2);
  const f = seg - i;
  const a = hexToRgb(p[i]);
  const b = hexToRgb(p[i + 1]);
  return [
    Math.round(lerp(a[0], b[0], f)),
    Math.round(lerp(a[1], b[1], f)),
    Math.round(lerp(a[2], b[2], f)),
  ];
}

export function buildGradientPixels(palette: string[]): Uint8Array {
  const px = new Uint8Array(256 * 4);
  for (let i = 0; i < 256; i++) {
    const [r, g, b] = colorAt(palette, i / 255);
    px[i * 4] = r; px[i * 4 + 1] = g; px[i * 4 + 2] = b; px[i * 4 + 3] = 255;
  }
  return px;
}
