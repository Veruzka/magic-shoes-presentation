// One movement from the concept section, as its own pinned scene. On the left:
// the name, a randomly picked "Yes, and…" offer, and the sound that makes it
// real. On the right: sound ripples that pulse when the movement "makes" its sound. The shoe itself is the 3D shoe
// (src/three/shoe-stage.js), which does the movement in the right half while
// this scene is on screen (see src/data/shoe-path.js).
//
//   const move = movementScene(storyMovements[0]);
//   page.append(move.section);
//
// Everything is driven by scrolling (the scene's progress p, 0 → 1), never by a
// timer. The movement math lives in src/core/motions.js.
import './movement-scene.css';
import { scene, calmMotion, clamp01, slice, ease } from '../core/scene.js';
import { motionFor, MOTIONS } from '../core/motions.js';
import { soundRipples } from './sound-ripples.js';

// How fast the rings travel outward as you scroll (higher = more rings go by).
const RING_SPEED = 5;

export function movementScene(movement) {
  const motion = motionFor(movement.motion);
  const { section, stage, onProgress } = scene({
    name: `move-${movement.id}`,
    length: 1.2,
    stops: 2,
    className: 'tt-move',
  });
  // The 3D shoe reads this to know which movement to do.
  section.dataset.motion = MOTIONS[movement.motion] ? movement.motion : 'step';

  stage.innerHTML = `
    <div class="tt-move__layout">
      <div class="tt-move__text">
        <h2 class="tt-headline"></h2>
        <p class="tt-line tt-move__offer">Yes, and… <span class="tt-move__roll"></span></p>
        <p class="tt-move__sound">Sound: <span></span></p>
      </div>
      <div class="tt-move__visual" aria-hidden="true">
        <div class="tt-move__ripples"></div>
      </div>
    </div>
  `;
  // Text goes in with textContent, so names like "Dancer's pose" stay safe.
  stage.querySelector('.tt-headline').textContent = movement.name;

  // The randomizer: one offer per visit. As the scene arrives, the line rolls
  // through the offers like a slot machine and lands on the picked one; then
  // the sound that makes it real appears underneath.
  const offers = movement.offers ?? [];
  const pick = Math.floor(Math.random() * offers.length);
  const roll = stage.querySelector('.tt-move__roll');
  const soundLine = stage.querySelector('.tt-move__sound');
  soundLine.querySelector('span').textContent = offers[pick]?.sound ?? '';
  const SPINS = offers.length * 3; // how many offers flick past before it lands
  let shownIndex = -1;
  function showOffer(index) {
    if (index === shownIndex || !offers.length) return;
    shownIndex = index;
    roll.textContent = offers[index].offer;
  }

  const ripples = soundRipples();
  stage.querySelector('.tt-move__ripples').append(ripples.element);

  if (calmMotion()) {
    showOffer(pick); // reduced motion: no roll, just the picked offer
    ripples.set(0.45, 0.15); // and one still ripple
    return { section, stage, onProgress };
  }

  onProgress((p) => {
    // 0 to 0.2 of the scene: the roll slows down and lands.
    const t = ease(slice(p, 0, 0.2));
    const ticks = (1 - t) * SPINS; // offers still to go
    showOffer((pick + Math.ceil(ticks)) % offers.length);
    const f = ticks % 1; // how far between two offers
    roll.style.transform = `translateY(${-f * 0.5}em)`;
    roll.style.opacity = String(t >= 1 ? 1 : 0.35 + 0.65 * (1 - f));
    soundLine.style.opacity = String(ease(slice(p, 0.2, 0.3)));
    ripples.set(clamp01(motion.impact(p)), p * RING_SPEED);
  });
  return { section, stage, onProgress };
}
