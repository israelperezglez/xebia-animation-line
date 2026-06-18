import { describe, it, expect } from 'vitest';
import { polylinesToSegments } from '../../src/core/lineGeometry';

describe('polylinesToSegments', () => {
  it('expands an N-point polyline into thick-line triangles', () => {
    // 3 puntos → 2 segmentos × 2 triángulos × 3 vértices = 12 vértices
    const r = polylinesToSegments([{ pts: [0, 0, 400, 300, 800, 600], s: 0.5 }], 800, 600, { thickness: 2 });
    expect(r.position.length).toBe(12 * 2);
    expect(r.s.length).toBe(12);
    expect([...r.position].every(Number.isFinite)).toBe(true);
    expect([...r.s].every((v) => v === 0.5)).toBe(true);
  });

  it('centra los vértices cerca del punto en clip space (grosor pequeño)', () => {
    const r = polylinesToSegments([{ pts: [0, 0, 800, 600], s: 1 }], 800, 600, { thickness: 0 });
    // primer vértice (esquina del punto (0,0)) ≈ clip (-1, 1)
    expect(r.position[0]).toBeCloseTo(-1);
    expect(r.position[1]).toBeCloseTo(1);
  });

  it('skips degenerate single-point polylines', () => {
    const r = polylinesToSegments([{ pts: [10, 10], s: 0 }], 800, 600);
    expect(r.position.length).toBe(0);
  });
});
