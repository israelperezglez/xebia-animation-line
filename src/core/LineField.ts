import type { LineFieldOptions } from './types';
import { VARIANTS } from '../variants';
import { resolveBackground } from './background';
import { prefersReducedMotion } from './reducedMotion';
import { Renderer } from './Renderer';
import { ScrollProgress } from './scroll';

interface Internals {
  renderer?: Pick<Renderer, 'setPalette' | 'setBackground' | 'resize' | 'size' | 'draw' | 'destroy'>;
  autoStart?: boolean;
  reducedMotion?: boolean;
}

export class LineField {
  private renderer: Internals['renderer'];
  private raf = 0;
  private running = false;
  private reduced: boolean;
  private scroll?: ScrollProgress;
  private scrollT = 0;

  constructor(private el: HTMLElement, private opts: LineFieldOptions, internals: Internals = {}) {
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%'; canvas.style.height = '100%'; canvas.style.display = 'block';
    el.appendChild(canvas);
    this.renderer = internals.renderer ?? new Renderer(canvas);
    this.reduced = internals.reducedMotion ?? prefersReducedMotion();
    this.applyOptions();
    if (internals.autoStart ?? true) this.start();
  }

  private applyOptions(): void {
    this.renderer!.setPalette(this.opts.palette);
    this.renderer!.setBackground(resolveBackground(this.opts.background));
    this.renderer!.resize();
  }

  setOptions(partial: Partial<LineFieldOptions>): void {
    this.opts = { ...this.opts, ...partial };
    this.applyOptions();
  }

  /** Render one frame at time t (ms). */
  tick(t: number): void {
    const variant = VARIANTS[this.opts.variant];
    const { W, H } = this.renderer!.size;
    const time = this.opts.mode === 'scroll' ? this.scrollT * 10000 : t * (this.opts.speed ?? 0.6); // 0.6 = modo suave por defecto
    this.renderer!.draw(variant.generate({ t: time, W, H, lineCount: this.opts.lineCount }));
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    if (this.reduced) { this.tick(0); this.running = false; return; }
    if (this.opts.mode === 'scroll') {
      this.scroll = new ScrollProgress(this.el, (t) => { this.scrollT = t; this.tick(0); });
      this.scroll.start();
      return;
    }
    const loop = (t: number) => { if (!this.running) return; this.tick(t); this.raf = requestAnimationFrame(loop); };
    this.raf = requestAnimationFrame(loop);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.scroll?.stop();
  }

  destroy(): void {
    this.stop();
    this.renderer!.destroy();
  }
}
