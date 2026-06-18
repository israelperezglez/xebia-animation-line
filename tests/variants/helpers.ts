import type { Polyline } from '../../src/core/types';
export function allFinite(pls: Polyline[]): boolean {
  return pls.every((p) => p.pts.every(Number.isFinite) && Number.isFinite(p.s));
}
