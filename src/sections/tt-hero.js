// Twinkle Toes hero: the first screen of the story. A huge title and one line
// at the top; the 3D shoe (src/three/shoe-stage.js) floats in the space below,
// bobbing and rocking on its own (see `hero` in src/data/shoe-path.js).
//
// Two arrow-key stops:
//   1. "Once upon a step" on the cream page.
//   2. A paper-cut forest has risen behind it, like a pop-up book: the back
//      wall first and slowest, then the middle trees, then the leafy front
//      frame. The last word swaps: "step" slides up and away, "forest" rises
//      into its place, and the text turns light to read on the teal.
// The forest layers are made by tools/forest-layers.py (src/assets/forest/).
//
// The text and forest move from the scroll position only (no timers).
// Reduced motion: nothing slides; the forest and the new word fade in.
// The earlier four-color fan is in git history (commit "Twinkle Toes hero").
import '../styles/tt-hero.css';
import { scene, calmMotion, slice, ease, lerp } from '../core/scene.js';
import forestBack from '../assets/forest/forest-back.webp';
import forestMiddle from '../assets/forest/forest-middle.webp';
import forestFront from '../assets/forest/forest-front.webp';

// When each forest layer rises, as a slice of the scene's scrolling (0 → 1).
// Later and shorter = rises faster. All are in place before the second stop.
const RISE = {
  back: [0.05, 0.65],
  middle: [0.18, 0.75],
  front: [0.3, 0.85],
};
const SWAP = [0.45, 0.72]; // "step" → "forest"
const LIGHTEN = [0.35, 0.6]; // dark text → light text

export function ttHero() {
  const { section, stage, onProgress } = scene({ name: 'hero', length: 1.4, stops: 2, className: 'tt-hero' });

  stage.innerHTML = `
    <div class="tt-hero__forest" aria-hidden="true">
      <img class="tt-hero__layer" data-layer="back" src="${forestBack}" alt="" decoding="async" />
      <img class="tt-hero__layer" data-layer="middle" src="${forestMiddle}" alt="" decoding="async" />
      <img class="tt-hero__layer" data-layer="front" src="${forestFront}" alt="" decoding="async" />
    </div>
    <div class="tt-hero__layout">
      <div class="tt-hero__text">
        <h1 class="tt-headline tt-hero__name">Once upon a <span class="tt-hero__swap"><span class="tt-hero__word" data-word="step">step</span><span class="tt-hero__word" data-word="forest" aria-hidden="true">forest</span></span></h1>
        <p class="tt-line tt-hero__line">Improv for your feet: sound that turns any space into a stage for play.</p>
      </div>
    </div>
  `;

  const calm = calmMotion();
  const text = stage.querySelector('.tt-hero__text');
  const layers = [...stage.querySelectorAll('.tt-hero__layer')];
  // Unpack the big pictures now, while they're still out of sight, so the
  // first scroll doesn't stutter while the browser decodes them.
  layers.forEach((layer) => layer.decode?.().catch(() => {}));
  const swap = stage.querySelector('.tt-hero__swap');
  const step = swap.querySelector('[data-word="step"]');
  const forest = swap.querySelector('[data-word="forest"]');

  // The swap box grows from the width of "step" to the width of "forest", so
  // the centered title never has a gap after it.
  let widths = null;
  let swapAmount = 0;
  const setSwapWidth = () => {
    swap.style.width = `${lerp(widths.step, widths.forest, swapAmount)}px`;
  };
  const measure = () => {
    widths = { step: step.offsetWidth, forest: forest.offsetWidth };
    setSwapWidth();
  };
  document.fonts?.ready.then(measure);
  window.addEventListener('resize', measure);

  onProgress((p) => {
    // The forest.
    layers.forEach((layer) => {
      const [start, end] = RISE[layer.dataset.layer];
      const t = ease(slice(p, start, end));
      if (calm) layer.style.opacity = String(t);
      else layer.style.transform = `translate3d(0, ${lerp(100, 0, t)}%, 0)`;
    });

    // The text: drifts up a little, then turns light over the forest.
    if (!calm) text.style.transform = `translateY(${lerp(0, -28, ease(slice(p, 0, 0.7)))}px)`;
    stage.style.setProperty('--forest', ease(slice(p, LIGHTEN[0], LIGHTEN[1])).toFixed(3));

    // The word swap.
    const w = ease(slice(p, SWAP[0], SWAP[1]));
    swapAmount = w;
    if (widths) setSwapWidth();
    else measure();
    if (calm) {
      step.style.opacity = String(1 - w);
      forest.style.opacity = String(w);
    } else {
      step.style.transform = `translateY(${lerp(0, -110, w)}%)`;
      forest.style.transform = `translateY(${lerp(110, 0, w)}%)`;
    }
    const swapped = w > 0.5;
    step.toggleAttribute('aria-hidden', swapped);
    forest.toggleAttribute('aria-hidden', !swapped);
  });
  return section;
}
