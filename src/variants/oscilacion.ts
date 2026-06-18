import type { Variant, Polyline, VariantEnv } from '../core/types';
import { auto } from '../core/geom';

export const oscilacion: Variant = {
  name: 'oscilacion',
  generate({ t, W, H, lineCount }: VariantEnv): Polyline[] {
    const N = lineCount ?? 150;
    const { mx, my } = auto(t);
    const cx = W * 0.42, cy = H * 0.5;
    // foco abierto (círculo grande) → sin punto de luz por acumulación aditiva
    const r0 = Math.min(W, H) * (0.16 + 0.04 * Math.sin(t * 0.0006));
    const r1 = Math.min(W, H) * 0.46;
    const a = 2 + mx * 2;
    const phase = t * 0.00035;
    const twist = (my - 0.5) * 2.2;
    const out: Polyline[] = [];
    for (let i = 0; i < N; i++) {
      const s = i / (N - 1);
      const x0 = cx + r0 * Math.cos(a * s * 6.283 + phase + twist * s);
      const y0 = cy + r0 * Math.sin(a * s * 6.283 + phase + twist * s);
      const ang = s * 4.712 - 0.6 + phase * 0.4;
      const x1 = cx + r1 * Math.cos(ang);
      const y1 = cy + r1 * Math.sin(ang) + (s - 0.5) * H * 0.15;
      out.push({ pts: [x0, y0, x1, y1], s });
    }
    return out;
  },
};
