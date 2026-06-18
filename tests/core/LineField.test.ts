import { describe, it, expect, vi } from 'vitest';
import { LineField } from '../../src/core/LineField';

function fakeRenderer() {
  return {
    setPalette: vi.fn(), setBackground: vi.fn(), setZoom: vi.fn(), setPan: vi.fn(), setThickness: vi.fn(), resize: vi.fn(),
    size: { W: 800, H: 600 }, draw: vi.fn(), destroy: vi.fn(),
  };
}

describe('LineField', () => {
  it('draws the selected variant on tick and stops on destroy', () => {
    const el = document.createElement('div');
    const r = fakeRenderer();
    const lf = new LineField(el, {
      variant: 'oscilacion', palette: ['#000', '#fff'],
      background: { type: 'solid', color: '#000' },
    }, { renderer: r as any, autoStart: false });

    lf.tick(1000);
    expect(r.draw).toHaveBeenCalledTimes(1);
    const polylines = r.draw.mock.calls[0][0];
    expect(polylines.length).toBe(150); // oscilacion default N

    lf.destroy();
    expect(r.destroy).toHaveBeenCalled();
  });

  it('renders a single static frame under reduced motion', () => {
    const el = document.createElement('div');
    const r = fakeRenderer();
    const lf = new LineField(el, {
      variant: 'onda', palette: ['#000', '#fff'],
      background: { type: 'solid', color: '#000' },
    }, { renderer: r as any, autoStart: false, reducedMotion: true });

    lf.start();
    expect(r.draw).toHaveBeenCalledTimes(1); // one frame, no loop
  });
});
