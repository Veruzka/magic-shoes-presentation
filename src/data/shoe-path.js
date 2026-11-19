// The 3D shoe's path through the story: what it does in each scene.
// Each entry is keyed by a scene's name (its data-scene) and turns that scene's
// progress p (0 → 1) into a pose. In the concept's movement scene (`moves`)
// the shoes ride on the sprite's feet.
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
//   pair     0 → 1: the shoe becomes a pair on the sprite's feet (concept scene)
//   feet     a function giving the sprite's feet on screen (set by the moves scene)
//   float    0 → 1: the shoe bobs and rocks gently on its own, over time, even
//            when nobody scrolls (see FLOAT in src/three/shoe-director.js)
//
// A path function gets (p, sceneElement).
//
// Between two scenes, the shoe glides from the end of one pose to the start of
// the next, so the hand-offs are continuous.
import { slice, ease } from '../core/scene.js';

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
  pair: 0,
  feet: null,
  float: 0,
};

// Off stage: hidden, still in pieces (so it can come back together at the end).
const away = () => ({ opacity: 0, explode: 1, size: 0.5 });

export const shoePath = {
  // Hero: floats under the title, bobbing and rocking on its own (no spin; the
  // earlier one-full-turn spin is in git history). The float fades out as the
  // shoe glides into the next scene.
  hero: () => ({ ay: -0.32, size: 0.6, float: 1 }),

  // "Stories! Movement!": resting low and small under the headline.
  concept: (p) => ({ ay: -0.6, size: 0.34, y: 0.04 * Math.sin(p * Math.PI) }),

  // The movements: big in the middle, then it hands over to a shoe on each of
  // the two players' four feet and rides along with every move. The shoes stay
  // on their feet to the end and fade out with the players as "What the MVP
  // does" scrolls in (until 2026-11-19 they lifted off and flew on as one big shoe).
  moves: (p, el) => ({
    ay: 0.05,
    size: 0.62,
    turn: 0.12 * ease(slice(p, 0, 0.1)),
    pair: ease(slice(p, 0.03, 0.15)),
    feet: el?.__feet ?? null,
  }),

  // What the MVP does: the figure has the stage; the shoe waits off screen,
  // whole, where "Inside each shoe" picks it up. `pair: 1` keeps the players'
  // shoes on their feet while they scroll away (the big shoe doesn't come back).
  'mvp-does': () => ({ ax: 0.12, ay: -0.05, size: 0.62, opacity: 0, pair: 1 }),

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

  // What's next: the whole shoe, fully opaque, floating under the headline
  // (2026-11-19; it used to drift in as pieces at the end)…
  forward: () => ({ ay: -0.12, size: 0.5, float: 1 }),
  // …and land whole for the close.
  close: () => ({ ay: 0.42, size: 0.42 }),
};
