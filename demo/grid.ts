import { LineField, VARIANT_NAMES } from '../src/index';
import type { Background } from '../src/index';

// Paletas seleccionables por card.
const PALETTES = [
  ['#3fd6a0', '#5ad1ff', '#9b8cff'], // teal → azul → violeta
  ['#ff9bc4', '#b18cff', '#5ad1ff'], // rosa → violeta → azul
  ['#ffd27a', '#ff8f6b', '#c96bff'], // cálido
  ['#7be0c0', '#4aa3ff', '#0d2b4a'], // verde agua → azul profundo
  ['#a0f0c8', '#ffe08a', '#ff8f6b'], // verde → ámbar
  ['#8be9ff', '#c9a0ff', '#ff9bd6'], // pastel frío
];
const BACKGROUND: Background = { type: 'gradient', from: '#06101a', to: '#0a1b2b' };

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

  // Cada card arranca con un color distinto → grid colorido.
  const startIdx = i % PALETTES.length;
  const field = new LineField(stage, {
    variant: name,
    palette: PALETTES[startIdx],
    background: BACKGROUND,
  });

  // Swatches por card para cambiarle el color en el propio listado.
  PALETTES.forEach((p, idx) => {
    const dot = document.createElement('span');
    dot.className = 'dot' + (idx === startIdx ? ' active' : '');
    dot.style.background = `linear-gradient(135deg, ${p.join(', ')})`;
    dot.onclick = () => {
      field.setOptions({ palette: p });
      [...swatches.children].forEach((c) => c.classList.remove('active'));
      dot.classList.add('active');
    };
    swatches.appendChild(dot);
  });
});
