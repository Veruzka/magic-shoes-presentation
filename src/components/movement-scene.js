// One movement from the concept section, as its own pinned scene: the name and
// one line on the left, and sound ripples on the right that pulse at the moment
// the movement "makes" its sound. The shoe itself is the 3D shoe
// (src/three/shoe-stage.js), which does the movement in the right half while
// this scene is on screen (see src/data/shoe-path.js).
//
//   const move = movementScene(storyMovements[0]);
//   page.append(move.section);
//
// Everything is driven by scrolling (the scene's progress p, 0 → 1), never by a
// timer. The movement math lives in src/core/motions.js.
import './movement-scene.css';
import { scene, calmMotion, clamp01 } from '../core/scene.js';
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
        <p class="tt-line"></p>
      </div>
      <div class="tt-move__visual" aria-hidden="true">
        <div class="tt-move__ripples"></div>
      </div>
    </div>
  `;
  // Text goes in with textContent, so names like "Dancer's pose" stay safe.
  stage.querySelector('.tt-headline').textContent = movement.name;
  stage.querySelector('.tt-line').textContent = movement.line;

  const ripples = soundRipples();
  stage.querySelector('.tt-move__ripples').append(ripples.element);

  if (calmMotion()) {
    ripples.set(0.45, 0.15); // reduced motion: one still ripple
    return { section, stage, onProgress };
  }

  onProgress((p) => ripples.set(clamp01(motion.impact(p)), p * RING_SPEED));
  return { section, stage, onProgress };
}
