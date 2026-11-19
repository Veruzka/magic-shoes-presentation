// How the shoe moves for each movement in the concept section, as plain math.
// The 3D shoe (src/three/) uses `pose`, and the sound ripples use `impact`.
//
// Each motion has:
//   pose(p)    where the shoe is at this point of the scene (p: 0 → 1):
//                x, y   a share of the shoe's own length/height (0.3 = 30%)
//                       y up is positive
//                rot    tilt in degrees; positive = the toe goes up
//                turn   extra spin around the vertical axis, in turns (1 = 360°)
//                lift   how far off the ground, 0 → 1 (for a shadow)
//   impact(p)  how loud the sound is right now, 0 → 1 (drives the ripples)
//
// To add a motion: add an entry here and use its name as `motion` in
// src/data/story-movements.js. An unknown name falls back to 'step'.
import { slice, ease, lerp } from './scene.js';

// The movement plays between these two points of the scene, so the shoe rests
// for a moment when it arrives and before it leaves.
export const START = 0.08;
export const END = 0.9;

// A short burst that starts at `at` and fades out over `width` (both in p).
function burst(p, at, width) {
  const d = p - at;
  return d < 0 || d > width ? 0 : (1 - d / width) ** 2;
}

// Walking and running share one footstep: the heel lifts, the foot swings up
// and forward, the heel lands (toe tipped up a little), then the foot rolls flat.
const LANDING = 0.8; // where in each footstep the heel touches down

function stride(p, { steps, travel, lift, heel, lean = 0 }) {
  const t = slice(p, START, END) * steps;
  const i = Math.min(Math.floor(t), steps - 1);
  const f = t - i;
  const heelUp = ease(slice(f, 0, 0.3)) * (1 - ease(slice(f, 0.5, 0.75)));
  const toeUp = ease(slice(f, 0.55, 0.75)) * (1 - ease(slice(f, 0.8, 0.98)));
  const air = Math.sin(Math.PI * slice(f, 0.2, LANDING));
  const forward = ease(slice(f, 0.2, LANDING));
  return {
    x: lerp(-travel / 2, travel / 2, (i + forward) / steps),
    y: lift * air,
    rot: -(lean + heel * heelUp) + heel * 0.45 * toeUp, // heel up = toe down
    turn: 0,
    lift: air,
  };
}

// Loudness of the footfalls: a burst each time a heel lands.
function footfalls(p, steps, width = 0.35) {
  const t = ((p - START) / (END - START)) * steps;
  if (t < LANDING) return 0;
  const lastLanding = Math.min(Math.floor(t - LANDING) + LANDING, steps - 1 + LANDING);
  const d = t - lastLanding;
  return d > width ? 0 : (1 - d / width) ** 2;
}

const still = { x: 0, y: 0, rot: 0, turn: 0, lift: 0 };

export const MOTIONS = {
  // A few calm walking steps.
  step: {
    pose: (p) => stride(p, { steps: 3, travel: 0.3, lift: 0.14, heel: 14 }),
    impact: (p) => footfalls(p, 3),
  },

  // Faster, bigger and bouncier.
  run: {
    pose: (p) => stride(p, { steps: 6, travel: 0.44, lift: 0.26, heel: 22, lean: 4 }),
    impact: (p) => footfalls(p, 6, 0.5),
  },

  // Two full turns on the spot, lifting a little in the middle.
  spin: {
    pose: (p) => {
      const t = ease(slice(p, START, END));
      const up = Math.sin(Math.PI * t);
      return { ...still, y: 0.1 * up, turn: 2 * t, lift: up * 0.6 };
    },
    impact: (p) => slice(p, START + 0.05, 0.75) ** 1.5 * (1 - slice(p, 0.75, END)),
  },

  // Rises onto a pointed toe, then holds perfectly still.
  pose: {
    pose: (p) => {
      const up = ease(slice(p, START, 0.32)) * (1 - ease(slice(p, END, 1)));
      return { ...still, y: 0.22 * up, rot: -22 * up, lift: up };
    },
    impact: (p) => {
      const shimmer = 0.35 + 0.65 * Math.abs(Math.sin(p * 60));
      return shimmer * ease(slice(p, 0.18, 0.32)) * (1 - ease(slice(p, 0.36, 0.62)));
    },
  },

  // Winds up, then kicks fast forward and up, holds, returns.
  kick: {
    pose: (p) => {
      const windUp = ease(slice(p, START, 0.38));
      const kick = ease(slice(p, 0.4, 0.48));
      const back = ease(slice(p, 0.68, END));
      const x = lerp(lerp(0, -0.14, windUp), 0.28, kick);
      const y = lerp(lerp(0, 0.06, windUp), 0.24, kick);
      const rot = lerp(lerp(0, -16, windUp), 38, kick);
      return { x: lerp(x, 0, back), y: lerp(y, 0, back), rot: lerp(rot, 0, back), turn: 0, lift: Math.max(windUp * 0.3, kick) * (1 - back) };
    },
    impact: (p) => burst(p, 0.46, 0.3),
  },

  // Points the sole at the sky (toe up), takes the picture, twinkles.
  sky: {
    pose: (p) => {
      const up = ease(slice(p, START, 0.45)) * (1 - ease(slice(p, END, 1)));
      return { ...still, y: 0.12 * up, rot: 80 * up, lift: up };
    },
    impact: (p) => {
      const shutter = burst(p, 0.5, 0.06);
      const twinkle = 0.5 * Math.abs(Math.sin(p * 70)) * ease(slice(p, 0.52, 0.58)) * (1 - ease(slice(p, 0.7, 0.88)));
      return Math.max(shutter, twinkle);
    },
  },

  // Jumps, clicks the heels together at the top (a quick wiggle), lands.
  heelclick: {
    pose: (p) => {
      const t = slice(p, START, END);
      const air = Math.sin(Math.PI * slice(t, 0.15, 0.75));
      const click = burst(t, 0.42, 0.12);
      return { ...still, y: 0.4 * air, rot: 10 * click, turn: 0.04 * Math.sin(click * Math.PI * 4), lift: air };
    },
    // One bright click at the top of the jump, a softer thud on landing.
    impact: (p) => Math.max(burst(p, START + 0.43 * (END - START), 0.12), 0.5 * burst(p, START + 0.75 * (END - START), 0.2)),
  },
};

export function motionFor(name) {
  return MOTIONS[name] ?? MOTIONS.step;
}
