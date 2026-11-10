// Background option: "Clouds" — warm cream studio, soft misty clouds along the
// bottom, and a beige box the shoe floats above.
// Cloud shapes and positions are listed in src/data/clouds.js.
import './cloud-studio.css';
import { cloudShapes, clouds } from '../data/clouds.js';

// How fast each cloud layer moves when you scroll (see src/core/parallax.js).
const LAYER_SPEEDS = {
  back: 0.25,   // slower than the page (far)
  front: -0.15, // faster than the page (close)
};

// The "cloud texture" filter: it takes smooth white blobs and roughens their
// edges with random noise, so they look like real, wispy clouds.
//   baseFrequency = how big the wisps are (smaller number = bigger wisps)
//   scale         = how far the edges get pushed around (bigger = wispier)
function cloudTextureHTML() {
  return `
    <svg class="clouds__definitions" aria-hidden="true">
      <filter id="cloud-texture" x="-50%" y="-50%" width="200%" height="200%">
        <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="5" seed="7" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="110"
          xChannelSelector="R" yChannelSelector="G" result="wispy" />
        <feGaussianBlur in="wispy" stdDeviation="3" />
      </filter>
    </svg>`;
}

// One cloud on the screen, from one line of clouds.js.
// Each puff of the shape becomes a soft white glow; the glows melt together.
function cloudHTML({ shape, x, y, size, flip = false }) {
  const puffs = cloudShapes[shape]
    .map(([px, py, r]) => `<span class="cloud__puff"
      style="--px: ${px / 2}%; --py: ${py}%; --pr: ${r}%"></span>`)
    .join('');

  return `
    <div class="cloud${flip ? ' cloud--flipped' : ''}"
      style="--x: ${x}%; --y: ${y}%; --size: ${size}vw">${puffs}</div>`;
}

function layerHTML(layerName) {
  const layerClouds = clouds.filter((c) => c.layer === layerName);
  return `
    <div class="clouds__layer clouds__layer--${layerName}" data-speed="${LAYER_SPEEDS[layerName]}">
      ${layerClouds.map(cloudHTML).join('')}
    </div>`;
}

export const cloudStudio = {
  id: 'cloud-studio',
  label: 'Clouds',

  // Colors for things drawn on top of this background (text, outlines).
  inkColors: {
    text: 'rgb(110 90 60 / 0.9)',
    line: 'rgb(110 90 60 / 0.45)',
  },

  build() {
    const el = document.createElement('div');
    el.className = 'clouds';
    el.innerHTML = `
      ${cloudTextureHTML()}
      ${layerHTML('back')}

      <!-- The box the shoe floats above: three faces, plus the shoe's shadow. -->
      <div class="pedestal">
        <div class="pedestal__face pedestal__face--left"></div>
        <div class="pedestal__face pedestal__face--right"></div>
        <div class="pedestal__face pedestal__face--top"></div>
        <div class="pedestal__shadow"></div>
      </div>

      ${layerHTML('front')}

      <!-- Low white mist hugging the very bottom of the screen. -->
      <div class="clouds__mist"></div>
    `;
    return el;
  },
};
