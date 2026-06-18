import type { Variant, Polyline, VariantEnv } from '../core/types';
import { lerp } from '../core/geom';

export const interferencia: Variant = {
  name: 'interferencia',
  generate({ t, W, H }: VariantEnv): Polyline[] {
    const lines = 64;
    const src = [
      { x: 0.24, y: 0.40, f: 0.030 },
      { x: 0.72, y: 0.62, f: 0.024 },
      { x: 0.52, y: 0.30, f: 0.038 },
    ];
    const out: Polyline[] = [];
    for (let l = 0; l < lines; l++) {
      const s = l / (lines - 1);
      const baseY = lerp(H * 0.10, H * 0.90, s);
      const pts: number[] = [];
      for (let i = 0; i <= 140; i++) {
        const u = i / 140;
        const x = lerp(W * 0.03, W * 0.97, u);
        let disp = 0;
        src.forEach((q, qi) => {
          const sx = q.x * W, sy = q.y * H, d = Math.hypot(x - sx, baseY - sy);
          disp += Math.sin(d * q.f - t * 0.0022 * (1 + qi * 0.3) + u * qi) * (32 / (1 + d * 0.004));
        });
        pts.push(x, baseY + disp);
      }
      out.push({ pts, s });
    }
    return out;
  },
};
