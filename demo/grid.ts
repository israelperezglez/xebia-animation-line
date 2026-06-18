import { LineField, VARIANT_NAMES } from '../src/index';
import type { Background, LineFieldOptions } from '../src/index';

const PALETTES = [
  ['#3fd6a0', '#5ad1ff', '#9b8cff'],
  ['#ff9bc4', '#b18cff', '#5ad1ff'],
  ['#ffd27a', '#ff8f6b', '#c96bff'],
  ['#7be0c0', '#4aa3ff', '#0d2b4a'],
  ['#a0f0c8', '#ffe08a', '#ff8f6b'],
  ['#8be9ff', '#c9a0ff', '#ff9bd6'],
];

const BACKGROUNDS: { name: string; bg: Background; css: string }[] = [
  { name: 'Oscuro', bg: { type: 'gradient', from: '#06101a', to: '#0a1b2b' }, css: 'linear-gradient(135deg,#06101a,#0a1b2b)' },
  { name: 'Negro', bg: { type: 'solid', color: '#000000' }, css: '#000000' },
  { name: 'Marca', bg: { type: 'gradient', from: '#0b1f3a', to: '#3a1d5c' }, css: 'linear-gradient(135deg,#0b1f3a,#3a1d5c)' },
  { name: 'Claro', bg: { type: 'solid', color: '#f3ecf6' }, css: '#f3ecf6' },
  { name: 'Lavanda', bg: { type: 'gradient', from: '#eef0ff', to: '#dfeaff' }, css: 'linear-gradient(135deg,#eef0ff,#dfeaff)' },
];
const DEFAULT_BG = 2;

// ---- lazy-mount: solo anima lo visible (evita el límite de contextos WebGL) ----
interface Slot { el: HTMLElement; opts: LineFieldOptions; field: LineField | null; }
const slots: Slot[] = [];
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    const slot = slots.find((s) => s.el === e.target);
    if (!slot) continue;
    if (e.isIntersecting && !slot.field) {
      slot.field = new LineField(slot.el, slot.opts);
    } else if (!e.isIntersecting && slot.field) {
      slot.field.destroy();
      slot.field = null;
      slot.el.querySelectorAll('canvas').forEach((c) => c.remove());
    }
  }
}, { rootMargin: '300px' });

const grid = document.getElementById('grid')!;

VARIANT_NAMES.forEach((name, i) => {
  const card = document.createElement('div');
  card.className = 'card';
  const stage = document.createElement('div');
  stage.className = 'stage';
  const label = document.createElement('span');
  label.className = 'label';
  label.textContent = name;
  const swatches = document.createElement('div');
  swatches.className = 'swatches';
  card.append(stage, label, swatches);
  grid.appendChild(card);

  const startIdx = PALETTES.length - 1; // por defecto, la última paleta
  const slot: Slot = {
    el: stage,
    opts: { variant: name, palette: PALETTES[startIdx], background: BACKGROUNDS[DEFAULT_BG].bg },
    field: null,
  };
  slots.push(slot);
  io.observe(stage);

  PALETTES.forEach((p, idx) => {
    const dot = document.createElement('span');
    dot.className = 'dot' + (idx === startIdx ? ' active' : '');
    dot.style.background = `linear-gradient(135deg, ${p.join(', ')})`;
    dot.onclick = () => {
      slot.opts.palette = p;
      slot.field?.setOptions({ palette: p });
      [...swatches.children].forEach((c) => c.classList.remove('active'));
      dot.classList.add('active');
    };
    swatches.appendChild(dot);
  });
});

// Selector de fondo global.
const bgbar = document.getElementById('backgrounds')!;
const blabel = document.createElement('span');
blabel.className = 'blabel';
blabel.textContent = 'Fondo';
bgbar.appendChild(blabel);
BACKGROUNDS.forEach((b, idx) => {
  const dot = document.createElement('span');
  dot.className = 'bgdot' + (idx === DEFAULT_BG ? ' active' : '');
  dot.title = b.name;
  dot.style.background = b.css;
  dot.onclick = () => {
    slots.forEach((s) => { s.opts.background = b.bg; s.field?.setOptions({ background: b.bg }); });
    [...bgbar.querySelectorAll('.bgdot')].forEach((c) => c.classList.remove('active'));
    dot.classList.add('active');
  };
  bgbar.appendChild(dot);
});
