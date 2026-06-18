/** Map an element's vertical position over a full viewport pass to t∈[0,1]. */
export function progressFromRect(rect: { top: number; height: number }, viewportH: number): number {
  const total = viewportH + rect.height;
  const travelled = viewportH - rect.top;
  return Math.max(0, Math.min(1, travelled / total));
}

export class ScrollProgress {
  private raf = 0;
  private running = false;
  constructor(private el: HTMLElement, private onChange: (t: number) => void) {}

  start(): void {
    if (this.running) return;
    this.running = true;
    const tick = () => {
      if (!this.running) return;
      const rect = this.el.getBoundingClientRect();
      this.onChange(progressFromRect({ top: rect.top, height: rect.height }, window.innerHeight));
      this.raf = requestAnimationFrame(tick);
    };
    tick();
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }
}
