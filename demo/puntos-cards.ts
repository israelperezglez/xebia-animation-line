import { POINTS, makeCol, PALETTES, BACKGROUNDS, paintBg } from './points';
import type { PBg, Col } from './points';

let PAL = PALETTES[1];
let BG: PBg = BACKGROUNDS[1];
let col: Col = makeCol(PAL);

interface Viz { cv: HTMLCanvasElement; ctx: CanvasRenderingContext2D; fn: (c: CanvasRenderingContext2D, W: number, H: number, t: number, col: Col) => void; w: number; h: number; vis: boolean; }
const vizzes: Viz[] = [];
const DPR = Math.min(devicePixelRatio || 1, 2);
function addViz(host: HTMLElement, key: string): void {
  const cv = document.createElement('canvas');
  host.appendChild(cv);
  vizzes.push({ cv, ctx: cv.getContext('2d')!, fn: POINTS[key], w: 1, h: 1, vis: true });
}

const cardsRoot = document.getElementById('cards')!;
function card(html: string, key: string): void {
  const wrap = document.createElement('div'); wrap.innerHTML = html;
  const el = wrap.firstElementChild as HTMLElement; cardsRoot.appendChild(el);
  addViz(el.querySelector<HTMLElement>('.viz')!, key);
}
card(`<article class="xcard cover"><div class="viz"></div><div class="overlay"><div class="top"><span class="kicker">Report</span></div><div class="foot"><h2>Live data, in motion</h2></div></div></article>`, 'datos');
card(`<article class="xcard cover"><div class="viz"></div><div class="overlay"><div class="top"><span class="kicker">AI</span></div><div class="foot"><h2>Neural networks at work</h2></div></div></article>`, 'neural');
card(`<article class="xcard split"><div class="text"><div class="top"><span class="kicker">Insight</span></div><h2>Particle fields of data</h2></div><div class="accent"></div><div class="viz"></div></article>`, 'pondas');
card(`<article class="xcard statscard"><div class="text"><span class="kicker">By the numbers</span><h2>Data &amp; AI</h2><p class="sub">Generative point systems</p></div><div class="viz statsviz"><div class="tiles"><div class="tile"><div class="n">2.4M</div><div class="l">Events / s</div></div><div class="tile"><div class="n">∞</div><div class="l">Datapoints</div></div><div class="tile"><div class="n">60</div><div class="l">FPS</div></div></div></div></article>`, 'datos');
card(`<article class="xcard cover minimal"><div class="viz"></div><div class="overlay"><div class="top"></div><div class="foot"><h2>Sphere</h2></div></div></article>`, 'esfera');
card(`<article class="xcard cover wide"><div class="viz"></div><div class="overlay"><div class="top"><span class="kicker">Showreel</span></div><div class="foot"><h2>A point system for data storytelling</h2></div></div></article>`, 'pondas');

const heroesRoot = document.getElementById('heroes')!;
function hero(label: string, html: string, vs: { sel: string; key: string }[]): void {
  const sec = document.createElement('div'); sec.innerHTML = `<div class="hlabel">${label}</div>${html}`;
  heroesRoot.appendChild(sec);
  vs.forEach((v) => addViz(sec.querySelector<HTMLElement>(v.sel)!, v.key));
}
hero('Hero · banner (red neuronal)', `<div class="h-banner"><div class="viz" data-h="1"></div><div class="overlay"><h2>Intelligence, visualized</h2><div class="sub">Neural activation across the network</div></div></div>`, [{ sel: '[data-h="1"]', key: 'neural' }]);
hero('Hero · split + stats (datos)', `<div class="h-split"><div class="viz" data-h="2"></div><div class="panel"><div class="block purple"><div class="stat">2.4M</div><div class="sub">events processed per second</div></div><div class="block light"><div class="stat">99.9%</div><div class="sub">uptime across regions</div></div></div></div>`, [{ sel: '[data-h="2"]', key: 'datos' }]);
hero('Hero · duo (fusión · montañas)', `<div class="h-duo"><div class="half"><div class="viz" data-h="3a"></div><div class="lab">Fusion</div></div><div class="half"><div class="viz" data-h="3b"></div><div class="lab">Terrain</div></div></div>`, [{ sel: '[data-h="3a"]', key: 'fusion' }, { sel: '[data-h="3b"]', key: 'montanas' }]);

function fit(): void { for (const v of vizzes) { const r = v.cv.getBoundingClientRect(); v.w = r.width; v.h = r.height; v.cv.width = r.width * DPR; v.cv.height = r.height * DPR; v.ctx.setTransform(DPR, 0, 0, DPR, 0, 0); } }
addEventListener('resize', fit);
const vio = new IntersectionObserver((es) => es.forEach((e) => { const v = vizzes.find((x) => x.cv === e.target); if (v) v.vis = e.isIntersecting; }), { rootMargin: '300px' });
vizzes.forEach((v) => vio.observe(v.cv));
function frame(t: number): void { const ts = t * 0.55; for (const v of vizzes) { if (!v.vis) continue; paintBg(v.ctx, v.w, v.h, BG); v.fn(v.ctx, v.w, v.h, ts, col); } requestAnimationFrame(frame); }

function applyLight(): void { document.body.classList.toggle('cards-light', !!BG.light); }
const palEl = document.getElementById('pal')!;
PALETTES.forEach((p, idx) => { const d = document.createElement('span'); d.className = 'swat' + (idx === 1 ? ' active' : ''); d.style.background = 'linear-gradient(135deg,' + p.join(',') + ')'; d.onclick = () => { PAL = p; col = makeCol(p); [...palEl.children].forEach((c) => c.classList.remove('active')); d.classList.add('active'); }; palEl.appendChild(d); });
const bgsEl = document.getElementById('bgs')!;
BACKGROUNDS.forEach((b, idx) => { const d = document.createElement('span'); d.className = 'swat sq' + (idx === 1 ? ' active' : ''); d.title = b.name; d.style.background = b.css; d.onclick = () => { BG = b; applyLight(); [...bgsEl.children].forEach((c) => c.classList.remove('active')); d.classList.add('active'); }; bgsEl.appendChild(d); });

fit(); applyLight(); requestAnimationFrame(frame);
