// Section 1 of the Twinkle Toes story, "The concept", on Veruzka's warm dark:
//
//   concept  "Stories! Movement!" in gradient type, and one line.
//   moves    one pinned scene. Two players (pictogram figures, src/components/
//            sprite-rig.js), each in a pair of shoes, do a movement together:
//            player 1 (cyan) leads, player 2 (sand) copies a beat late and falls
//            into sync, and as they sync the sound rings grow ("copy and
//            heighten"). Above them: the movement and a random "Yes, and…" offer.
//            Behind them: that offer's story, drawn in the same flat style
//            (src/components/story-props.js): the thin ice cracks, the giant
//            chases. Players piece these together into a world they make up.
//
// Scrolling (or the arrow keys) picks the movement. Once you stop, the players
// keep looping it in real time, so it never freezes while someone is talking.
// It only runs while the scene is on screen. Every joint follows its target
// with a small spring, so arms trail, knees soften and switches ease.
// The 3D shoe starts big, then hands over to a shoe on each of the four feet
// (see `moves` in src/data/shoe-path.js). Silent: sound shows as rings.
import '../styles/concept-movements.css';
import { scene, calmMotion, slice, ease, lerp, clamp01 } from '../core/scene.js';
import { storyMovements } from '../data/story-movements.js';
import { todoTag } from '../components/todo-tag.js';
import { STAND, MOVES, movementPose, blendPose, switchPose, lying, figurePaths, feetOf, spinScale, strikesAt, GROUND } from '../components/sprite-rig.js';
import { STORY_PROPS, PROP_FOR_OFFER } from '../components/story-props.js';

// The scene's timeline (share of the scene's scrolling, 0 → 1):
const MOVES_START = 0.16; // before this: the big shoe hands over to the feet
const MOVES_END = 0.9; // after this: the shoes lift off for "Inside each shoe"

// Where the players stand in the scene's drawing (viewBox -480 -270 960 540).
const GROUND_Y = 150;
const PLAYER_X = 120; // player 1 at -120 facing right, player 2 at +120 facing left
const FIGURE_SCALE = 1.15;

// How player 2 falls into step: it starts this far behind (in loops of the
// movement) and catches up over this many seconds.
const COPY_DELAY = 0.3;
const SYNC_SECONDS = 3.5;
const SWITCH_SECONDS = 0.5; // how long a change of movement blends
// Getting up from lying on the floor (feet to the sky), or lying down, goes
// through a tucked sit (switchPose in sprite-rig.js), and takes a little longer.
const SWITCH_SECONDS_FLOOR = 1;
// How stiff each joint's spring is (higher = follows faster). Stiff enough that
// the joints keep the real motion (lag of a few degrees), arms a little looser
// so they trail softly. The spring is solved exactly, so a slow frame (a busy
// laptop, the big TV) can't make it fling the limbs around.
const SPRING = { lean: 40, y: 50, x: 50, hA: 55, hB: 55, kA: 50, kB: 50, aA: 45, aB: 45, sA: 32, sB: 32, eA: 28, eB: 28 };
// The moment of each loop that shows the movement best (reduced motion).
const KEY_PHASE = { step: 0.25, run: 0.25, spin: 0.12, pose: 0.5, kick: 0.5, sky: 0.4, heelclick: 0.53 };

export function conceptMovements() {
  const wrapper = document.createElement('div');
  wrapper.className = 'tt-moves';
  // The "Stories! Movement!" intro (conceptIntro below) is set aside
  // (2026-11-18): the players follow straight after the hero. To bring it
  // back: wrapper.append(conceptIntro(), spriteScene());
  wrapper.append(spriteScene());
  return wrapper;
}

// The intro screen: the promise in two words, in gradient type, and one line.
// Set aside: not on the page (see conceptMovements above).
function conceptIntro() {
  const { section, stage, onProgress } = scene({ name: 'concept', length: 0.6, stops: 1, className: 'tt-moves__intro' });
  stage.innerHTML = `
    <div class="tt-moves__intro-text">
      <h2 class="tt-headline tt-moves__title tt-gradient">
        <span>Stories!</span>
        <span>Movement!</span>
      </h2>
      <p class="tt-line">You make a move. The sound says yes, and. Your partner takes it from there.</p>
    </div>
  `;
  // TODO: more basic movements after the Kimney meeting (add them to src/data/story-movements.js).
  stage.querySelector('.tt-moves__intro-text').append(todoTag('more basic movements after the Kimney meeting'));

  if (calmMotion()) return section;
  const block = stage.querySelector('.tt-moves__intro-text');
  onProgress((p) => {
    block.style.transform = `translateY(${lerp(0, -6, ease(p))}vh)`;
    block.style.opacity = String(1 - 0.7 * ease(slice(p, 0.7, 1)));
  });
  return section;
}

const SVGNS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs = {}, parent) => {
  const node = document.createElementNS(SVGNS, tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  parent?.append(node);
  return node;
};
const motionOf = (move) => (MOVES[move.motion] ? move.motion : 'step');

// One player: its drawing, its springy joints and its rings.
function makePlayer(svg, { side, className }) {
  const facing = side < 0 ? 1 : -1; // player 1 (left) faces right, player 2 (right) faces left
  const group = el('g', { class: `tt-sprite__player ${className}` }, svg);
  const top = GROUND_Y - GROUND * FIGURE_SCALE;
  group.setAttribute('transform', `translate(${side * PLAYER_X},${top}) scale(${facing * FIGURE_SCALE},${FIGURE_SCALE})`);
  const rings = [el('circle', { class: 'tt-sprite__ring', r: 10 }, group), el('circle', { class: 'tt-sprite__ring', r: 10 }, group)];
  const body = el('g', { class: 'tt-sprite__body' }, group);
  const far = el('path', { class: 'tt-sprite__far' }, body);
  const torso = el('path', { class: 'tt-sprite__torso' }, body);
  const near = el('path', { class: 'tt-sprite__near' }, body);
  const head = el('circle', { class: 'tt-sprite__head', r: 14 }, body);

  let pose = { ...STAND };
  const vel = {};
  Object.keys(SPRING).forEach((k) => (vel[k] = 0));

  return {
    facing,
    get pose() {
      return pose;
    },
    // Moves each joint toward the target with a critically damped spring.
    follow(target, dt, snap) {
      const next = { ...target };
      Object.keys(SPRING).forEach((k) => {
        if (snap) {
          next[k] = target[k];
          vel[k] = 0;
          return;
        }
        // Critically damped spring, solved exactly for this frame's time step
        // (stable for any frame rate, never overshoots).
        const w = SPRING[k];
        const d = pose[k] - target[k];
        const c = vel[k] + w * d;
        const e = Math.exp(-w * dt);
        next[k] = target[k] + (d + c * dt) * e;
        vel[k] = (vel[k] - w * c * dt) * e;
      });
      next.spin = target.spin; // spinning isn't sprung (it wraps around)
      pose = next;
    },
    draw(level, heighten) {
      const p = figurePaths(pose);
      far.setAttribute('d', p.far);
      torso.setAttribute('d', p.torso);
      near.setAttribute('d', p.near);
      head.setAttribute('cx', p.head.x.toFixed(1));
      head.setAttribute('cy', p.head.y.toFixed(1));
      body.setAttribute('transform', `scale(${spinScale(pose).toFixed(3)},1)`);
      const feet = feetOf(pose);
      [level.A, level.B].forEach((v, i) => {
        const t = 1 - v;
        rings[i].setAttribute('cx', feet[i].x.toFixed(1));
        rings[i].setAttribute('cy', (feet[i].y + 4).toFixed(1));
        rings[i].setAttribute('r', ((8 + 34 * t) * (0.7 + 0.9 * heighten)).toFixed(1));
        rings[i].setAttribute('stroke-width', (2 + 3 * heighten).toFixed(2));
        rings[i].style.opacity = String(v * (0.5 + 0.5 * heighten));
      });
      return feet;
    },
  };
}

function spriteScene() {
  const moves = storyMovements;
  const n = moves.length;
  const each = (MOVES_END - MOVES_START) / n;
  // Arrow-key stops: the start, the handover, the middle of each movement, the end.
  const stops = [0, MOVES_START - 0.02, ...moves.map((_, i) => MOVES_START + (i + 0.55) * each), 1];
  const { section, stage, onProgress } = scene({ name: 'moves', length: 6, stops: stops.length, className: 'tt-sprite' });
  section.dataset.stopAt = stops.map((s) => s.toFixed(3)).join(',');

  stage.innerHTML = `
    <div class="tt-sprite__label">
      <h2 class="tt-sprite__name"></h2>
      <p class="tt-line tt-sprite__offer">Yes, and… <span class="tt-sprite__roll"></span></p>
    </div>
  `;
  const svg = el('svg', { class: 'tt-sprite__svg', viewBox: '-480 -270 960 540', preserveAspectRatio: 'xMidYMid meet', 'aria-hidden': 'true' });
  stage.prepend(svg);
  const storyLayer = el('g', { class: 'tt-sprite__story' }, svg);
  el('line', { class: 'tt-sprite__ground', x1: -440, x2: 440, y1: GROUND_Y + 2, y2: GROUND_Y + 2 }, svg);
  const players = [makePlayer(svg, { side: -1, className: 'tt-sprite__player--one' }), makePlayer(svg, { side: 1, className: 'tt-sprite__player--two' })];

  const label = stage.querySelector('.tt-sprite__label');
  const nameEl = stage.querySelector('.tt-sprite__name');
  const offerEl = stage.querySelector('.tt-sprite__offer');
  const roll = stage.querySelector('.tt-sprite__roll');

  // One random "Yes, and…" offer per movement, per visit.
  const picks = moves.map((m) => m.pick ?? Math.floor(Math.random() * (m.offers?.length || 1))); // one offer per move (`pick`), random if unset

  // ---------- State ----------
  const calm = calmMotion();
  let p = 0; // scroll progress through the scene
  let index = -1; // the movement on now
  let moveTime = 0; // seconds since this movement started
  let phase = 0; // where player 1 is in the movement's loop
  let fromTargets = null; // the poses we're blending away from after a switch
  let story = null; // { layer, prop, born }
  const leaving = []; // story layers fading out
  let feetNow = [];
  let front = 0; // 0 → 1: how far the 3D shoes have turned from the side view to the front view
  let switchSeconds = SWITCH_SECONDS; // how long the current change of movement blends

  function startMovement(i) {
    if (i === index) return;
    fromTargets = players.map((pl) => ({ ...pl.pose }));
    index = i;
    moveTime = 0;
    phase = 0;
    const move = moves[i];
    const toFloor = lying(movementPose(motionOf(move), 0));
    switchSeconds = toFloor || fromTargets.some(lying) ? SWITCH_SECONDS_FLOOR : SWITCH_SECONDS;
    nameEl.textContent = move.name;
    section.dataset.sound = move.offers?.[picks[i]]?.sound ?? ''; // shown in presenter mode
    // The offer's story: fade the old one out, build the new one.
    if (story) leaving.push({ ...story, out: 0 });
    const propId = PROP_FOR_OFFER[move.id]?.[picks[i]];
    const make = STORY_PROPS[propId];
    if (make) {
      const layer = el('g', { class: 'tt-sprite__prop', 'data-prop': propId }, storyLayer);
      story = { layer, prop: make(layer), born: 0 };
    } else {
      story = null;
    }
  }

  // Which movement the scroll is on.
  function movementAt(progress) {
    const t = (progress - MOVES_START) / each;
    return Math.min(Math.max(Math.floor(t), 0), n - 1);
  }

  // Where each foot is on screen, for the 3D shoes (see `moves` in shoe-path.js).
  // Order: player 1 far, player 1 near, player 2 far, player 2 near.
  section.__feet = () => {
    const m = svg.getScreenCTM();
    if (!m || feetNow.length < 4) return null;
    const view = MOVES[motionOf(moves[Math.max(index, 0)])]?.view ?? 'side';
    return feetNow.map((f) => {
      // From the figure's drawing to the scene's drawing (its spot, its facing).
      const sx = f.facing * FIGURE_SCALE;
      const gx = f.side * PLAYER_X + f.x * sx;
      const gy = GROUND_Y - GROUND * FIGURE_SCALE + f.y * FIGURE_SCALE;
      return {
        x: m.a * gx + m.c * gy + m.e,
        y: m.b * gx + m.d * gy + m.f,
        length: f.length * FIGURE_SCALE * m.a,
        angle: f.angle, // the foot's angle in the figure's own drawing (toe forward = 0)
        facing: f.facing, // which way the player faces on screen
        spin: f.spin * f.facing, // how far round the spin is (0 → 1), mirrored for player 2
        view,
        front: ease(front), // the shoes turn between the side and front views instead of snapping
      };
    });
  };

  // ---------- One frame ----------
  let wasBefore = true;
  function frame(dt) {
    const before = p < MOVES_START;
    startMovement(movementAt(p));
    if (wasBefore && !before) {
      moveTime = 0; // the movements just began: start the roll and the sync fresh
      phase = 0;
    }
    wasBefore = before;
    const move = moves[index];
    const motion = motionOf(move);
    const spec = MOVES[motion];
    moveTime += dt;
    phase += dt / (spec.seconds ?? 1.5);
    // The 3D shoes' view (side or front) turns over the same time the figures blend.
    const wantFront = spec.view === 'front' && !before ? 1 : 0;
    const turnStep = dt / SWITCH_SECONDS;
    front = calm ? wantFront : front + Math.min(Math.max(wantFront - front, -turnStep), turnStep);

    // Player 2 copies player 1 a beat late, then falls into sync.
    const sync = calm ? 1 : ease(clamp01(moveTime / SYNC_SECONDS));
    const delay = COPY_DELAY * (1 - sync);
    const phases = calm ? [KEY_PHASE[motion] ?? 0.25, KEY_PHASE[motion] ?? 0.25] : [phase, phase - delay];

    // Before the movements (and after them): standing, breathing a little.
    const idle = { ...STAND, lean: 1.5 * Math.sin(moveTime * 1.6), y: Math.sin(moveTime * 3.2) * 1 };
    const after = p > MOVES_END ? ease(slice(p, MOVES_END, MOVES_END + 0.05)) : 0;
    const blendIn = clamp01(moveTime / switchSeconds);

    feetNow = [];
    players.forEach((pl, k) => {
      let target = before ? idle : movementPose(motion, phases[k]);
      if (!before && fromTargets && blendIn < 1) target = switchPose(fromTargets[k], target, blendIn);
      if (after) target = blendPose(target, idle, after);
      pl.follow(target, dt, calm);
      const level = before || after ? { A: 0, B: 0 } : strikesAt(motion, phases[k]);
      const feet = pl.draw(level, sync);
      feet.forEach((f) => feetNow.push({ ...f, facing: pl.facing, side: k ? 1 : -1 }));
    });

    // The story behind them.
    if (story) {
      story.born += dt;
      const ctx = {
        time: story.born,
        dt,
        appear: before ? 0 : ease(clamp01(story.born / 0.7)) * (1 - after),
        phase: ((phase % 1) + 1) % 1,
        sync,
        calm,
        players: players.map((pl, k) => ({
          x: (k ? 1 : -1) * PLAYER_X,
          facing: pl.facing,
          feet: feetNow.slice(k * 2, k * 2 + 2).map((f) => ({
            x: f.side * PLAYER_X + f.x * f.facing * FIGURE_SCALE,
            y: GROUND_Y - GROUND * FIGURE_SCALE + f.y * FIGURE_SCALE,
          })),
          strike: before ? [0, 0] : [strikesAt(motion, phases[k]).A, strikesAt(motion, phases[k]).B],
        })),
      };
      story.layer.style.opacity = String(ctx.appear);
      story.prop.update(ctx);
    }
    for (let i = leaving.length - 1; i >= 0; i -= 1) {
      const old = leaving[i];
      old.out += dt;
      old.layer.style.opacity = String(1 - clamp01(old.out / 0.4));
      if (old.out >= 0.4) {
        old.layer.remove();
        leaving.splice(i, 1);
      }
    }

    // The label: the name and its offer, rolling in when a movement starts.
    const inMove = !before && !after;
    label.style.opacity = String(inMove ? ease(clamp01(moveTime / 0.35)) : 0);
    const offers = move.offers ?? [];
    if (offers.length) {
      const r = calm ? 1 : ease(clamp01((moveTime - 0.15) / 0.9));
      const ticks = (1 - r) * offers.length * 3;
      const text = offers[(picks[index] + Math.ceil(ticks)) % offers.length].offer;
      if (roll.textContent !== text) roll.textContent = text;
      const f = ticks % 1;
      roll.style.transform = `translateY(${(-f * 0.5).toFixed(3)}em)`;
      offerEl.style.opacity = String(r >= 1 ? 1 : 0.35 + 0.65 * (1 - f));
    }

    // The figures fade in at the start of the scene.
    svg.style.opacity = String(ease(slice(p, 0.03, 0.12)));
    // The 3D shoes ride on the feet: ask them to redraw.
    window.dispatchEvent(new Event('shoe-refresh'));
  }

  // ---------- Running only while on screen ----------
  let raf = null;
  let last = null;
  let onScreen = false;
  function tick(time) {
    raf = null;
    const dt = last === null ? 1 / 60 : Math.min((time - last) / 1000, 1 / 20);
    last = time;
    frame(dt);
    if (onScreen && !calm) raf = requestAnimationFrame(tick);
  }
  function start() {
    if (raf === null) {
      last = null;
      raf = requestAnimationFrame(tick);
    }
  }
  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    if (onScreen) start();
  }).observe(section);

  onProgress((progress) => {
    p = progress;
    start(); // reduced motion: draws one still frame per scroll change
  });
  return section;
}
