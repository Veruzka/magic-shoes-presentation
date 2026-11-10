// Background option: "Meadow" — blurry flowers framing an open middle.
// The flowers themselves are listed in src/data/flowers.js.
import './flower-meadow.css';
import { flowers } from '../data/flowers.js';

// How fast each depth layer moves when you scroll (see src/core/parallax.js).
// Positive = slower than the page (far away), negative = faster (close to you).
const LAYER_SPEEDS = {
  far: 0.35,
  mid: 0.2,
  near: -0.15,
};

// Turns one line from flowers.js into one flower element.
function flowerHTML({ kind, color, x, y, size, turn = 0 }) {
  return `<span class="flower flower--${kind} flower--${color}"
    style="--x: ${x}%; --y: ${y}%; --size: ${size}vmin; --turn: ${turn}deg"></span>`;
}

// One depth layer holding all the flowers that belong to it.
function layerHTML(layerName) {
  const layerFlowers = flowers.filter((f) => f.layer === layerName);
  return `
    <div class="meadow__layer meadow__layer--${layerName}" data-speed="${LAYER_SPEEDS[layerName]}">
      ${layerFlowers.map(flowerHTML).join('')}
    </div>`;
}

export const flowerMeadow = {
  id: 'flower-meadow',
  label: 'Meadow',

  // Colors for things drawn on top of this background (text, outlines).
  inkColors: {
    text: 'rgb(255 255 255 / 0.85)',
    line: 'rgb(255 255 255 / 0.6)',
    title: 'rgb(255 250 240 / 0.55)', // the big title: soft see-through cream over the flowers
  },

  build() {
    const el = document.createElement('div');
    el.className = 'meadow';
    el.innerHTML = `
      <div class="meadow__base"></div>
      <div class="meadow__flowers">
        ${layerHTML('far')}
        ${layerHTML('mid')}
        ${layerHTML('near')}
      </div>
      <div class="meadow__tint"></div>
    `;
    return el;
  },
};
