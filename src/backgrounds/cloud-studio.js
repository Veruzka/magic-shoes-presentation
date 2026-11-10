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
const TEXTURE = { baseFrequency: 0.011, octaves: 5, seed: 7, scale: 110, blur: 3 };

// Each cloud layer is drawn ONCE into a picture (an SVG image with the texture
// filter baked in), then that picture just slides around for the parallax.
// Running the texture filter live made every frame re-calculate it across the
// whole screen (~250 ms a frame), which made scrolling stutter.
// The picture is taller than the screen, so nothing gets cut off as it drifts.
const EXTRA_ABOVE = 0.25; // share of the screen height added above…
const EXTRA_BELOW = 0.5; //  …and below

function layerPictureURL(layerName, width, height) {
  const scale = window.matchMedia('(max-width: 700px)').matches ? 2 : 1; // bigger clouds on phones
  const offsetY = height * EXTRA_ABOVE;
  const circles = clouds
    .filter((cloud) => cloud.layer === layerName)
    .flatMap(({ shape, x, y, size, flip = false }) => {
      const cloudW = (size / 100) * width * scale;
      const cloudH = cloudW / 2;
      const left = (x / 100) * width - cloudW / 2;
      const top = (y / 100) * height - cloudH / 2 + offsetY;
      return cloudShapes[shape].map(([px, py, r]) => {
        const along = flip ? 200 - px : px;
        const cx = left + (along / 200) * cloudW;
        const cy = top + (py / 100) * cloudH;
        const radius = ((r / 100) * cloudW * 1.7) / 2;
        return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${radius.toFixed(1)}" fill="url(#puff)"/>`;
      });
    })
    .join('');
  const fullH = height * (1 + EXTRA_ABOVE + EXTRA_BELOW);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${fullH}" viewBox="0 0 ${width} ${fullH}">
    <defs>
      <radialGradient id="puff" cx="0.5" cy="0.42" r="0.766">
        <stop offset="0" stop-color="#fff" stop-opacity="1"/>
        <stop offset="0.35" stop-color="#fff" stop-opacity="0.9"/>
        <stop offset="0.55" stop-color="rgb(252,248,242)" stop-opacity="0.5"/>
        <stop offset="0.7" stop-color="rgb(250,245,238)" stop-opacity="0"/>
      </radialGradient>
      <filter id="texture" filterUnits="userSpaceOnUse" x="${-width * 0.25}" y="${-fullH * 0.25}" width="${width * 1.5}" height="${fullH * 1.5}">
        <feTurbulence type="fractalNoise" baseFrequency="${TEXTURE.baseFrequency}" numOctaves="${TEXTURE.octaves}" seed="${TEXTURE.seed}" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="${TEXTURE.scale}" xChannelSelector="R" yChannelSelector="G" result="wispy"/>
        <feGaussianBlur in="wispy" stdDeviation="${TEXTURE.blur}"/>
      </filter>
    </defs>
    <g filter="url(#texture)">${circles}</g>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function layerHTML(layerName) {
  return `
    <div class="clouds__layer clouds__layer--${layerName}" data-speed="${LAYER_SPEEDS[layerName]}">
      <img class="clouds__picture" data-layer="${layerName}" alt="" />
    </div>`;
}

// Draws (or re-draws, after a resize) every cloud layer's picture.
function paintClouds(el) {
  const width = window.innerWidth;
  const height = Math.max(window.innerHeight, 560); // the stage is never shorter than 560px
  el.querySelectorAll('.clouds__picture').forEach((img) => {
    img.src = layerPictureURL(img.dataset.layer, width, height);
  });
}

export const cloudStudio = {
  id: 'cloud-studio',
  label: 'Clouds',

  // Colors for things drawn on top of this background (text, outlines).
  inkColors: {
    text: 'rgb(110 90 60 / 0.9)',
    line: 'rgb(110 90 60 / 0.45)',
    title: '#e6d6b9', // the big title: soft sand, just darker than the sky
  },

  build() {
    const el = document.createElement('div');
    el.className = 'clouds';
    el.innerHTML = `
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
    paintClouds(el);
    // Re-draw the cloud pictures when the window changes size (a moment after it settles).
    let timer = null;
    let lastWidth = window.innerWidth;
    window.addEventListener('resize', () => {
      if (Math.abs(window.innerWidth - lastWidth) < 40) return; // ignore tiny changes (phone toolbars)
      lastWidth = window.innerWidth;
      clearTimeout(timer);
      timer = setTimeout(() => el.isConnected && paintClouds(el), 250);
    });
    return el;
  },
};
