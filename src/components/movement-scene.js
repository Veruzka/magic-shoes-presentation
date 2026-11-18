// One movement from the concept section, as its own pinned scene: the name and
// one line on the left, the shoe doing the movement on the right, and sound
// ripples that pulse at the moment the movement "makes" its sound.
//
//   const move = movementScene(storyMovements[0]);
//   page.append(move.section);
//
// Everything is driven by scrolling (the scene's progress p, 0 → 1), never by a
// timer, so the shoe only moves when you scroll and runs backwards when you
// scroll back up.
//
// To add a movement: add an entry to src/data/story-movements.js. If it needs a
// new kind of motion, add one to MOTIONS below (a `move` and an `impact`).
// An unknown motion name falls back to 'step'.
import './movement-scene.css';
import shoeUrl from '../assets/shoe-sketch.png';
import { scene, calmMotion, slice, ease, lerp, clamp01 } from '../core/scene.js';
import { movementGroups } from '../data/story-movements.js';
import { soundRipples } from './sound-ripples.js';

// The movement plays between these two points of the scene, so the shoe rests
// for a moment when it arrives and before it leaves.
const START = 0.08;
const END = 0.9;

// How fast the rings travel outward as you scroll (higher = more rings go by).
const RING_SPEED = 5;

// Moves and turns the shoe. x and y are a share of the shoe's own size (in %),
// rot is in degrees (positive = clockwise, so the heel goes up), sx squashes it
// sideways (used to fake the shoe turning around in 3D).
function place(shoeEl, { x = 0, y = 0, rot = 0, sx = 1, origin = '50% 80%' }) {
  shoeEl.style.transformOrigin = origin;
  shoeEl.style.transform = `translate(${x}%, ${y}%) rotate(${rot}deg) scale(${sx}, 1)`;
}

// A short burst that starts at `at` and fades out over `width` (both in p).
// Before `at` it is silent.
function burst(p, at, width) {
  const d = p - at;
  return d < 0 || d > width ? 0 : (1 - d / width) ** 2;
}

// Walking and running share one footstep: the heel lifts, the foot swings up
// and forward, the heel lands (toe tipped up a little), then the foot rolls flat.
//   steps   how many footsteps in the scene
//   travel  how far the shoe moves left to right in all, in % of its width
//   lift    how high the foot swings, in % of its height
//   heel    how far the heel tips up, in degrees
//   lean    a constant forward lean (negative = toe up), in degrees
const LANDING = 0.8; // where in each footstep the heel touches down

function stride(shoeEl, p, { steps, travel, lift, heel, lean = 0 }) {
  const t = slice(p, START, END) * steps;
  const i = Math.min(Math.floor(t), steps - 1);
  const f = t - i; // how far through this footstep, 0 → 1
  const heelUp = ease(slice(f, 0, 0.3)) * (1 - ease(slice(f, 0.5, 0.75)));
  const toeUp = ease(slice(f, 0.55, 0.75)) * (1 - ease(slice(f, 0.8, 0.98)));
  const air = Math.sin(Math.PI * slice(f, 0.2, LANDING));
  const forward = ease(slice(f, 0.2, LANDING));
  place(shoeEl, {
    x: lerp(-travel / 2, travel / 2, (i + forward) / steps),
    y: -lift * air,
    rot: lean + heel * heelUp - heel * 0.45 * toeUp,
    origin: '75% 90%', // pivot near the toe, so the heel is what lifts
  });
  return air; // how far off the ground, for the shadow
}

// Loudness of the footfalls: a burst each time a heel lands.
function footfalls(p, steps, width = 0.35) {
  const t = ((p - START) / (END - START)) * steps; // not clamped, so the last one fades out
  if (t < LANDING) return 0;
  const lastLanding = Math.min(Math.floor(t - LANDING) + LANDING, steps - 1 + LANDING);
  const d = t - lastLanding;
  return d > width ? 0 : (1 - d / width) ** 2;
}

// Each motion has:
//   move(shoeEl, p)  sets the shoe's transform for this point of the scene, and
//                    returns how far it is off the ground (0 → 1) for the shadow
//   impact(p)        how loud the sound is right now, 0 → 1 (drives the ripples)
// The shoe image is mirrored so the toe points right, away from the text.
export const MOTIONS = {
  // A few calm walking steps, travelling a little to the right.
  step: {
    move: (shoeEl, p) => stride(shoeEl, p, { steps: 3, travel: 30, lift: 14, heel: 14 }),
    impact: (p) => footfalls(p, 3),
  },

  // Faster, bigger and bouncier: more steps, higher, leaning forward.
  run: {
    move: (shoeEl, p) => stride(shoeEl, p, { steps: 6, travel: 44, lift: 26, heel: 22, lean: -4 }),
    impact: (p) => footfalls(p, 6, 0.5),
  },

  // Turns around twice on the spot. Squashing it sideways fakes the 3D turn;
  // a small lift and wobble make it feel like a spin, not a flip.
  spin: {
    move: (shoeEl, p) => {
      const t = ease(slice(p, START, END));
      const angle = t * Math.PI * 4; // two full turns
      const up = Math.sin(Math.PI * t);
      const sx = Math.cos(angle);
      place(shoeEl, {
        y: -10 * up,
        rot: Math.sin(angle) * 8 * up,
        sx: Math.sign(sx || 1) * Math.max(Math.abs(sx), 0.12), // never fully paper-thin
        origin: '50% 60%',
      });
      return up * 0.6;
    },
    // A rising whoosh: louder as the spin builds, cut off when it stops.
    impact: (p) => slice(p, START + 0.05, 0.75) ** 1.5 * (1 - slice(p, 0.75, END)),
  },

  // Rises onto a pointed toe, then holds perfectly still. The shimmer fades
  // to silence while the shoe stays frozen.
  pose: {
    move: (shoeEl, p) => {
      const rise = ease(slice(p, START, 0.32));
      const settle = ease(slice(p, END, 1));
      const up = rise * (1 - settle);
      place(shoeEl, { y: -22 * up, rot: 22 * up, origin: '75% 85%' });
      return up;
    },
    impact: (p) => {
      const shimmer = 0.35 + 0.65 * Math.abs(Math.sin(p * 60)); // a flicker, not a beat
      return shimmer * ease(slice(p, 0.18, 0.32)) * (1 - ease(slice(p, 0.36, 0.62)));
    },
  },

  // Winds up (pulls back, heel up), then kicks fast forward and up, holds, returns.
  kick: {
    move: (shoeEl, p) => {
      const windUp = ease(slice(p, START, 0.38));
      const kick = ease(slice(p, 0.4, 0.48));
      const back = ease(slice(p, 0.68, END));
      const x = lerp(lerp(0, -14, windUp), 28, kick);
      const y = lerp(lerp(0, -6, windUp), -24, kick);
      const rot = lerp(lerp(0, 16, windUp), -38, kick);
      place(shoeEl, {
        x: lerp(x, 0, back),
        y: lerp(y, 0, back),
        rot: lerp(rot, 0, back),
        origin: '30% 80%', // pivot near the heel, so the toe swings up
      });
      return Math.max(windUp * 0.3, kick) * (1 - back);
    },
    // One big burst right as the kick lands at full stretch.
    impact: (p) => burst(p, 0.46, 0.3),
  },

  // Points the sole at the sky (toe up), takes the picture, twinkles.
  sky: {
    move: (shoeEl, p) => {
      const up = ease(slice(p, START, 0.45)) * (1 - ease(slice(p, END, 1)));
      place(shoeEl, { y: -12 * up, rot: -80 * up, origin: '50% 55%' });
      return up;
    },
    // The shutter is one sharp click, then a softer twinkle that fades.
    impact: (p) => {
      const shutter = burst(p, 0.5, 0.06);
      const twinkle = 0.5 * Math.abs(Math.sin(p * 70)) * ease(slice(p, 0.52, 0.58)) * (1 - ease(slice(p, 0.7, 0.88)));
      return Math.max(shutter, twinkle);
    },
  },
};

export function movementScene(movement) {
  const motion = MOTIONS[movement.motion] ?? MOTIONS.step;
  const { section, stage, onProgress } = scene({
    name: `move-${movement.id}`,
    length: 1.2,
    stops: 2,
    className: 'tt-move',
  });
  section.dataset.motion = MOTIONS[movement.motion] ? movement.motion : 'step';

  stage.innerHTML = `
    <div class="tt-move__layout">
      <div class="tt-move__text">
        <p class="tt-eyebrow"></p>
        <h2 class="tt-headline"></h2>
        <p class="tt-line"></p>
        <p class="tt-move__makes">Makes: <span></span></p>
      </div>
      <div class="tt-move__visual">
        <div class="tt-move__ripples"></div>
        <div class="tt-move__shadow" aria-hidden="true"></div>
        <div class="tt-move__shoe">
          <img src="${shoeUrl}" alt="" width="1356" height="846" />
        </div>
      </div>
    </div>
  `;
  // Text goes in with textContent, so names like "Dancer's pose" stay safe.
  stage.querySelector('.tt-eyebrow').textContent = movementGroups[movement.group] ?? movement.group;
  stage.querySelector('.tt-headline').textContent = movement.name;
  stage.querySelector('.tt-line').textContent = movement.line;
  stage.querySelector('.tt-move__makes span').textContent = movement.sound;
  stage.querySelector('.tt-move__shoe img').alt = `The Twinkle Toes shoe doing a ${movement.name.toLowerCase()}`;

  const shoeEl = stage.querySelector('.tt-move__shoe');
  const shadowEl = stage.querySelector('.tt-move__shadow');
  const ripples = soundRipples();
  stage.querySelector('.tt-move__ripples').append(ripples.element);

  if (calmMotion()) {
    // Reduced motion: no movement, just fade the shoe in and show a still ripple.
    ripples.set(0.45, 0.15);
    onProgress((p) => {
      const shown = String(ease(slice(p, 0, 0.15)));
      shoeEl.style.opacity = shown;
      shadowEl.style.opacity = shown;
    });
    return { section, stage, onProgress };
  }

  onProgress((p) => {
    const lift = clamp01(motion.move(shoeEl, p) ?? 0);
    // The shadow shrinks and fades as the shoe leaves the ground.
    shadowEl.style.transform = `translateX(-50%) scale(${1 - lift * 0.35}, ${1 - lift * 0.2})`;
    shadowEl.style.opacity = String(1 - lift * 0.55);
    ripples.set(clamp01(motion.impact(p)), p * RING_SPEED);
  });

  return { section, stage, onProgress };
}
