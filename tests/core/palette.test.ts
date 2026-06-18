import { describe, it, expect } from 'vitest';
import { colorAt, buildGradientPixels } from '../../src/core/palette';

describe('palette', () => {
  it('returns endpoints exactly', () => {
    expect(colorAt(['#000000', '#ffffff'], 0)).toEqual([0, 0, 0]);
    expect(colorAt(['#000000', '#ffffff'], 1)).toEqual([255, 255, 255]);
  });

  it('mixes the midpoint', () => {
    expect(colorAt(['#000000', '#ffffff'], 0.5)).toEqual([128, 128, 128]);
  });

  it('clamps out-of-range', () => {
    expect(colorAt(['#000000', '#ffffff'], -1)).toEqual([0, 0, 0]);
    expect(colorAt(['#000000', '#ffffff'], 2)).toEqual([255, 255, 255]);
  });

  it('builds a 256*4 RGBA gradient', () => {
    const px = buildGradientPixels(['#000000', '#ffffff']);
    expect(px.length).toBe(256 * 4);
    expect(px[3]).toBe(255);          // alpha set
    expect([px[0], px[1], px[2]]).toEqual([0, 0, 0]);
    expect([px[255 * 4], px[255 * 4 + 1], px[255 * 4 + 2]]).toEqual([255, 255, 255]);
  });
});
