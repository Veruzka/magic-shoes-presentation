// Moves the 3D shoe along its path (src/data/shoe-path.js) as you scroll.
//
// Every scene on the page has data-scene="name". While a scene is pinned, the
// shoe takes that scene's pose for its progress (0 → 1). While one scene scrolls
// away and the next one arrives, the shoe blends from the end of the first pose
// to the start of the next, so each section hands the shoe to the next.
//
// Like the scroll progress elsewhere, it glides toward the scroll position
// instead of jumping (no jolts from mouse-wheel notches), and stops redrawing
// once it has arrived. The one exception is the hero, where the shoe floats on
// its own over time (FLOAT below), so it keeps redrawing while the hero shows.
// Reduced motion: no gliding, no movement, no float; the shoe keeps each
// scene's resting pose and only fades, comes apart and shows its labels.
import { REST, shoePath } from '../data/shoe-path.js';
import { clamp01, ease } from '../core/scene.js';

const SETTLE = 0.1; // seconds; how quickly it catches up with the scroll
const ANGLES = new Set(['yaw', 'turn']); // in turns: blend the short way round

// The hero's float: slow, out-of-step waves so it never looks mechanical.
// Nothing faster than about 4 seconds a cycle.
const FLOAT = {
  bob: 0.02, // up and down, as a share of the shoe's length
  bobPeriod: 4.6, // seconds
  rock: 2.5, // toe up and down, in degrees
  rockPeriod: 6.7, // seconds
};

// Adds the float on top of a pose, by the pose's float amount (0 → 1). It uses
// the page's clock (performance.now), so anything else that sways, like the
// hero's field, can share the same time and stay in step.
function withFloat(pose, now) {
  const t = now / 1000;
  const wave = (period) => Math.sin((t / period) * Math.PI * 2);
  return {
    ...pose,
    y: pose.y + FLOAT.bob * wave(FLOAT.bobPeriod) * pose.float,
    tilt: pose.tilt + FLOAT.rock * wave(FLOAT.rockPeriod) * pose.float,
  };
}

function progressOf(el) {
  const rect = el.getBoundingClientRect();
  const distance = rect.height - window.innerHeight;
  return distance > 0 ? clamp01(-rect.top / distance) : 0;
}

function pathFor(el) {
  const name = el.dataset.scene;
  if (shoePath[name]) return shoePath[name];
  return () => ({ opacity: 0, explode: 1 }); // unknown scenes: shoe off stage
}

// A scene's pose at p, with the anchor turned into a screen position.
function poseAt(el, p, calm) {
  const path = pathFor(el);
  let pose = { ...REST, ...path(p, el) };
  if (calm) {
    const rest = { ...REST, ...path(0, el) };
    pose = { ...rest, opacity: pose.opacity, explode: pose.explode, labels: pose.labels, pair: pose.pair };
  }
  if (pose.anchor) {
    const box = el.querySelector(pose.anchor)?.getBoundingClientRect();
    if (box && box.width) {
      pose.ax = ((box.left + box.width / 2) / window.innerWidth) * 2 - 1;
      pose.ay = 1 - ((box.top + box.height / 2) / window.innerHeight) * 2;
    }
  }
  return pose;
}

function blend(a, b, t) {
  const out = { ...a };
  for (const key of Object.keys(REST)) {
    if (typeof a[key] !== 'number') continue;
    let diff = b[key] - a[key];
    if (ANGLES.has(key)) diff -= Math.round(diff);
    out[key] = a[key] + diff * t;
  }
  return out;
}

export function startShoeDirector(stage) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let target = null;
  let current = null;
  let frame = null;
  let lastTime = null;

  function measure() {
    const calm = reduceMotion.matches;
    const scenes = [...document.querySelectorAll('[data-scene]')];
    if (!scenes.length) return { ...REST, opacity: 0 };
    // The scene we're in: the last one whose top has reached the top of the screen.
    let i = scenes.findLastIndex((el) => el.getBoundingClientRect().top <= 1);
    if (i < 0) return poseAt(scenes[0], 0, calm);
    const here = scenes[i];
    const p = progressOf(here);
    const next = scenes[i + 1];
    if (p < 1 || !next) return poseAt(here, p, calm);
    // Between scenes: blend as the next one rises into view.
    const t = clamp01(1 - next.getBoundingClientRect().top / window.innerHeight);
    return blend(poseAt(here, 1, calm), poseAt(next, 0, calm), ease(t));
  }

  function step(time) {
    frame = null;
    const seconds = lastTime === null ? 1 / 60 : Math.min((time - lastTime) / 1000, 0.25);
    lastTime = time;
    // Keyboard jumps already scroll smoothly: follow exactly (see keyboard-nav.js).
    const exact = reduceMotion.matches || document.documentElement.dataset.keyScrolling;
    const k = exact ? 1 : 1 - Math.exp(-seconds / SETTLE);
    let moving = false;
    const next = { ...target };
    for (const key of Object.keys(REST)) {
      if (typeof target[key] !== 'number') continue;
      let diff = target[key] - current[key];
      if (Math.abs(diff) < 0.0005) {
        next[key] = target[key];
      } else {
        next[key] = current[key] + diff * k;
        moving = true;
      }
    }
    current = next;
    // The float goes on after the glide, so the shoe still settles on the
    // scroll position. Reduced motion: no float.
    const floating = !reduceMotion.matches && current.float > 0.001;
    stage.render(floating ? withFloat(current, time) : current);
    // Keep drawing while it glides or floats; otherwise stop until the next scroll.
    if (moving || floating) frame = requestAnimationFrame(step);
    else lastTime = null;
  }

  function update() {
    target = measure();
    if (!current) current = target;
    if (frame === null) frame = requestAnimationFrame(step);
  }

  // The concept's sprite moves its feet every frame: redraw so the shoes stay on them.
  window.addEventListener('shoe-refresh', () => {
    if (current && frame === null) stage.render(current);
  });
  // Coming back to the tab: pick the float up again.
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && current && frame === null) frame = requestAnimationFrame(step);
  });
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  // Start once the sections are laid out.
  requestAnimationFrame(update);
  window.addEventListener('load', update, { once: true });
  return { update };
}
