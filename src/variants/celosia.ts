import type { Variant, Polyline, VariantEnv } from '../core/types';

/** Celosía: dos familias de rectas que cizallan y se cruzan (moiré), con espaciado fruncido. */
export const celosia: Variant = {
  name: 'celosia',
  generate({ t, W, H, lineCount }: VariantEnv): Polyline[] {
    const per = lineCount ?? 22;
    const cx = W / 2, cy = H / 2, D = Math.max(W, H);
    const angles = [0.3 + 0.25 * Math.sin(t * 0.0005), -0.3 - 0.25 * Math.sin(t * 0.0006 + 1)];
    const out: Polyline[] = [];
    angles.forEach((ang, fam) => {
      const dirx = Math.cos(ang), diry = Math.sin(ang);
      const nx = -diry, ny = dirx;
      for (let i = 0; i < per; i++) {
        const g = i / (per - 1) - 0.5;
        const off = (g + 0.12 * Math.sin(g * 6.283 * 2 + t * 0.0008)) * H * 1.1; // espaciado fruncido
        const ccx = cx + nx * off, ccy = cy + ny * off;
        out.push({
          pts: [ccx - dirx * D, ccy - diry * D, ccx + dirx * D, ccy + diry * D],
          s: fam === 0 ? i / (per - 1) : 1 - i / (per - 1),
        });
      }
    });
    return out;
  },
};
