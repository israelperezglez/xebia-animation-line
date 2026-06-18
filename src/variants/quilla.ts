import type { Variant, Polyline, VariantEnv } from '../core/types';
import { project3d } from '../core/geom';

/** Quilla: las DOS familias de rulings de un paraboloide hiperbólico (z = x·y) que se
 *  retuerce; las rectas se cruzan y se funden formando una silla cambiante. */
export const quilla: Variant = {
  name: 'quilla',
  generate({ t, W, H, lineCount }: VariantEnv): Polyline[] {
    const cols = lineCount ?? 36;
    const S = Math.min(W, H) * 0.4;
    const rotY = t * 0.0003, rotX = 0.5 + 0.14 * Math.sin(t * 0.0004);
    const tw = 0.7 + 0.6 * Math.sin(t * 0.00045);
    const out: Polyline[] = [];
    for (let i = 0; i < cols; i++) {
      const u = i / (cols - 1), s = i / (cols - 1);
      const x = -1 + 2 * u;
      // familia 1: fija x, recorre y
      const A1 = project3d(x, -1, -x * tw, rotX, rotY, S, W, H);
      const B1 = project3d(x, 1, x * tw, rotX, rotY, S, W, H);
      out.push({ pts: [A1.X, A1.Y, B1.X, B1.Y], s });
      // familia 2: fija y, recorre x
      const y = -1 + 2 * u;
      const A2 = project3d(-1, y, -y * tw, rotX, rotY, S, W, H);
      const B2 = project3d(1, y, y * tw, rotX, rotY, S, W, H);
      out.push({ pts: [A2.X, A2.Y, B2.X, B2.Y], s: 1 - s });
    }
    return out;
  },
};
