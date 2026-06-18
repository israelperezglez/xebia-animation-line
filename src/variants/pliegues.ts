import type { Variant, Polyline, VariantEnv } from '../core/types';
import { project3d } from '../core/geom';

export const pliegues: Variant = {
  name: 'pliegues',
  generate({ t, W, H }: VariantEnv): Polyline[] {
    const rotY = -0.5 + 0.15 * Math.sin(t * 0.0003), rotX = 0.55;
    const S = Math.min(W, H) * 0.34, phase = t * 0.0006, folds = 3;
    const tent = (a: number) => { const x = a - Math.floor(a); return 1 - Math.abs(x * 2 - 1); };
    const P = (u: number, v: number) => {
      const x = -1 + 2 * u, z = -1 + 2 * v, y = (tent(u * folds + phase) - 0.5) * 1.2;
      return project3d(x, y, z, rotX, rotY, S, W, H);
    };
    const rows = 30, cols = 30;
    const out: Polyline[] = [];
    for (let c = 0; c < cols; c++) {
      const u = c / (cols - 1); const pts: number[] = [];
      for (let r = 0; r < rows; r++) { const p = P(u, r / (rows - 1)); pts.push(p.X, p.Y); }
      out.push({ pts, s: c / (cols - 1) });
    }
    for (let r = 0; r < rows; r++) {
      const v = r / (rows - 1); const pts: number[] = [];
      for (let c = 0; c < cols; c++) { const p = P(c / (cols - 1), v); pts.push(p.X, p.Y); }
      out.push({ pts, s: r / (rows - 1) });
    }
    return out;
  },
};
