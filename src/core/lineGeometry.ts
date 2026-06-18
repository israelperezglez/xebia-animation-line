import type { Polyline } from './types';

export interface SegmentOpts {
  zoom?: number;
  pan?: { x: number; y: number };
  thickness?: number; // grosor de línea en px
}

/**
 * Expande polilíneas (en px) a triángulos en clip space, con grosor real.
 * zoom/pan se aplican aquí (CPU) para que el grosor sea constante en px.
 * Cada segmento → quad (2 triángulos, 6 vértices).
 */
export function polylinesToSegments(
  polylines: Polyline[], W: number, H: number, opts: SegmentOpts = {},
): { position: Float32Array; s: Float32Array } {
  const zoom = opts.zoom ?? 1;
  const panX = opts.pan?.x ?? 0;
  const panY = opts.pan?.y ?? 0;
  const T = opts.thickness ?? 1.5;
  const hx = T / W; // media-anchura en clip (x)
  const hy = T / H; // media-anchura en clip (y)
  const toClip = (px: number, py: number): [number, number] => [
    ((px / W) * 2 - 1) * zoom + panX,
    (1 - (py / H) * 2) * zoom + panY,
  ];
  const pos: number[] = [];
  const ss: number[] = [];
  for (const pl of polylines) {
    const n = pl.pts.length / 2;
    for (let i = 0; i < n - 1; i++) {
      const ax = pl.pts[i * 2], ay = pl.pts[i * 2 + 1];
      const bx = pl.pts[(i + 1) * 2], by = pl.pts[(i + 1) * 2 + 1];
      let dx = bx - ax, dy = by - ay;
      const len = Math.hypot(dx, dy) || 1;
      dx /= len; dy /= len;
      const ox = -dy * hx;          // perpendicular en clip (x)
      const oy = -dx * hy;          // perpendicular en clip (y) (signo por flip de Y)
      const A = toClip(ax, ay), B = toClip(bx, by);
      const a1x = A[0] + ox, a1y = A[1] + oy, a2x = A[0] - ox, a2y = A[1] - oy;
      const b1x = B[0] + ox, b1y = B[1] + oy, b2x = B[0] - ox, b2y = B[1] - oy;
      pos.push(a1x, a1y, a2x, a2y, b1x, b1y, a2x, a2y, b2x, b2y, b1x, b1y);
      for (let k = 0; k < 6; k++) ss.push(pl.s);
    }
  }
  return { position: new Float32Array(pos), s: new Float32Array(ss) };
}
