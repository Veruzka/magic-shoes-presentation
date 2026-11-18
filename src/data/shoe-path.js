// The 3D shoe's path through the story: what it does in each scene.
// Each entry is keyed by a scene's name (its data-scene) and turns that scene's
// progress p (0 → 1) into a pose. Movement scenes (move-walk, move-run…) all
// use `movement` below, which reads the motion from src/core/motions.js.
//
// A pose (every field optional; missing ones come from REST):
//   anchor   a CSS selector inside the scene; the shoe centres on that box
//   ax, ay   or: where to centre, as a share of the screen (-1 left/bottom → 1 right/top)
//   x, y     a nudge from there, as a share of the shoe's length
//   size     the shoe's length, as a share of the screen's height
//   yaw      which way it faces, in turns (0 = the drawing's side view, 0.5 = turned around)
//   turn     extra spin, in turns (1 = one full turn)
//   tilt     toe up (+) or down (-), in degrees
//   pitch    how much we look down on it, in degrees
//   opacity  0 = hidden
//   explode  0 = whole, 1 = broken apart into its parts
//   labels   0 → 1: the part labels appear one after another
//
// Between two scenes, the shoe glides from the end of one pose to the start of
// the next, so the hand-offs are continuous.
import { slice, ease } from '../core/scene.js';
import { motionFor } from '../core/motions.js';

export const REST = {
  anchor: null,
  ax: 0,
  ay: 0,
  x: 0,
  y: 0,
  size: 0.55,
  yaw: -0.08,
  turn: 0,
  tilt: 0,
  pitch: 12,
  opacity: 1,
  explode: 0,
  labels: 0,
};

// Off stage: hidden, still in pieces (so it can come back together at the end).
const away = () => ({ opacity: 0, explode: 1, size: 0.5 });

// A movement scene: the shoe faces right (away from the text) and does the move.
export function movement(motionName) {
  const motion = motionFor(motionName);
  return (p) => {
    const m = motion.pose(p);
    return { anchor: '.tt-move__visual', size: 0.5, yaw: 0.5 + 0.08, x: m.x, y: m.y, tilt: m.rot, turn: m.turn };
  };
}

export const shoePath = {
  // Hero: one full 3D spin under the title.
  hero: (p) => ({ ay: -0.32, size: 0.6, turn: ease(slice(p, 0.05, 0.95)) }),

  // "Stories! Movement!": resting low and small under the headline.
  concept: (p) => ({ ay: -0.6, size: 0.34, y: 0.04 * Math.sin(p * Math.PI) }),

  // What we've built: it breaks apart, then each part gets its label.
  parts: (p) => ({
    ax: 0.12,
    ay: -0.05,
    size: 0.62,
    turn: 0.06 * ease(p),
    explode: ease(slice(p, 0.06, 0.5)),
    labels: slice(p, 0.2, 0.95),
  }),

  // Veruzka's sketch breakdown (the FSR close-up) plays here: the 3D shoe steps aside.
  'built-inside': away,
  mvp: away,
  'mvp-media': away,
  'next-build': away,
  process: away,
  tracked: away,
  critique: away,
  grid: away,

  // What's next: the pieces drift back in at the end…
  forward: (p) => ({ ay: 0.42, size: 0.42, explode: 1, opacity: ease(slice(p, 0.7, 1)) }),
  // …and land whole for the close.
  close: () => ({ ay: 0.42, size: 0.42 }),
};
