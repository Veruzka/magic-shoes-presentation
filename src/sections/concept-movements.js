// Section 1 of the Twinkle Toes story, "The concept", on Veruzka's warm dark:
//
//   concept  "Stories! Movement!" in gradient type, and one line.
//   moves    one pinned scene: a cyan pictogram figure (the sprite, from
//            src/components/sprite-rig.js) does every movement in place
//            (walk → run → spin → dancer's pose → side kick → feet to the sky
//            → heel click) while a wall of round badges behind it shows the same
//            movement at low opacity. The 3D shoe starts big, shrinks into a pair
//            on the sprite's feet, rides along, and lifts off at the end (see
//            `moves` in src/data/shoe-path.js). Under the sprite: the movement's
//            name and a random "Yes, and…" offer that rolls in.
//
// The movements and their offers come from src/data/story-movements.js.
// Everything follows the scroll (no timers). Silent: sound shows as rings at the feet.
import '../styles/concept-movements.css';
import { scene, calmMotion, slice, ease, lerp, clamp01 } from '../core/scene.js';
import { storyMovements } from '../data/story-movements.js';
import { todoTag } from '../components/todo-tag.js';
import { STAND, MOVES, movementPose, blendPose, figurePaths, figureSVG, feetOf, spinScale, strikesAt } from '../components/sprite-rig.js';

// The scene's timeline (share of the scene, 0 → 1):
const PULL_BACK = [0, 0.12]; // the wall pulls back from a few big badges
const MOVES_START = 0.16; // the sprite starts walking (the shoe has shrunk onto its feet)
const MOVES_END = 0.9; // the last movement ends; the shoes lift off after this
const BLEND = 0.18; // the first 18% of each movement blends in from the one before
const ROLL = [0.06, 0.22]; // when the "Yes, and…" offer rolls in, within each movement

// The moment in each loop that shows the movement best (for the wall's badges).
const KEY_PHASE = { step: 0.25, run: 0.25, spin: 0.12, pose: 0.25, kick: 0.5, sky: 0.25, heelclick: 0.5 };
// How many loops each movement plays while it's on screen.
const LOOPS = { pose: 1, sky: 1 };

export function conceptMovements() {
  const wrapper = document.createElement('div');
  wrapper.className = 'tt-moves';
  wrapper.append(conceptIntro(), spriteScene());
  return wrapper;
}

// The intro screen: the promise in two words, in gradient type, and one line.
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

function spriteScene() {
  const moves = storyMovements;
  const n = moves.length;
  const each = (MOVES_END - MOVES_START) / n;
  // Arrow-key stops: the start, the pull-back, the middle of each movement, the end.
  const stops = [0, PULL_BACK[1] + 0.02, ...moves.map((_, i) => MOVES_START + (i + 0.55) * each), 1];
  const { section, stage, onProgress } = scene({ name: 'moves', length: 6, stops: stops.length, className: 'tt-sprite' });
  section.dataset.stopAt = stops.map((s) => s.toFixed(3)).join(',');

  stage.innerHTML = `
    <div class="tt-sprite__wall" aria-hidden="true"></div>
    <div class="tt-sprite__center">
      <svg class="tt-sprite__figure" viewBox="-120 -150 240 270" aria-hidden="true">
        <g class="tt-sprite__rings">
          <circle class="tt-sprite__ring" r="10"></circle>
          <circle class="tt-sprite__ring" r="10"></circle>
        </g>
        <g class="tt-sprite__body">
          <path class="tt-sprite__far"></path>
          <path class="tt-sprite__torso"></path>
          <path class="tt-sprite__near"></path>
          <circle class="tt-sprite__head" r="14"></circle>
        </g>
      </svg>
      <div class="tt-sprite__label">
        <h2 class="tt-sprite__name"></h2>
        <p class="tt-line tt-sprite__offer">Yes, and… <span class="tt-sprite__roll"></span></p>
      </div>
    </div>
  `;

  const svg = stage.querySelector('.tt-sprite__figure');
  const body = stage.querySelector('.tt-sprite__body');
  const [far, torso, near] = ['far', 'torso', 'near'].map((k) => stage.querySelector(`.tt-sprite__${k}`));
  const head = stage.querySelector('.tt-sprite__head');
  const rings = [...stage.querySelectorAll('.tt-sprite__ring')];
  const nameEl = stage.querySelector('.tt-sprite__name');
  const offerEl = stage.querySelector('.tt-sprite__offer');
  const roll = stage.querySelector('.tt-sprite__roll');
  const label = stage.querySelector('.tt-sprite__label');

  // One random "Yes, and…" offer per movement, per visit.
  const picks = moves.map((m) => Math.floor(Math.random() * (m.offers?.length || 1)));

  // ---------- The wall ----------
  const wall = stage.querySelector('.tt-sprite__wall');
  const COLS = 12;
  const ROWS = 8;
  const badgeMarkup = moves.map((m) => figureSVG(movementPose(MOVES[m.motion] ? m.motion : 'walk', KEY_PHASE[m.motion] ?? 0.25)));
  const badges = [];
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      const el = document.createElement('div');
      el.className = 'tt-sprite__badge';
      // Every other row is nudged half a badge, like a honeycomb.
      el.style.gridColumn = String(c + 1);
      el.style.gridRow = String(r + 1);
      if (r % 2) el.style.translate = '50% 0';
      wall.append(el);
      const dx = (c + (r % 2) * 0.5 - (COLS - 1) / 2) / (COLS / 2);
      const dy = (r - (ROWS - 1) / 2) / (ROWS / 2);
      badges.push({ el, dist: Math.min(Math.hypot(dx, dy) / 1.2, 1), shown: -1 });
    }
  }
  function showBadges(current, previous, s) {
    badges.forEach((b) => {
      // The change ripples out from the centre over the first quarter of a movement.
      const index = s >= b.dist * 0.25 ? current : previous;
      if (index === b.shown) return;
      b.shown = index;
      b.el.innerHTML = badgeMarkup[index];
    });
  }

  // ---------- Drawing ----------
  let feetNow = [];
  function draw(pose, motion, phase) {
    const p = figurePaths(pose);
    far.setAttribute('d', p.far);
    torso.setAttribute('d', p.torso);
    near.setAttribute('d', p.near);
    head.setAttribute('cx', p.head.x.toFixed(1));
    head.setAttribute('cy', p.head.y.toFixed(1));
    body.setAttribute('transform', `scale(${spinScale(pose).toFixed(3)},1)`);
    feetNow = feetOf(pose);
    // Sound as rings at the feet: each strike sends one ring outward.
    const level = motion ? strikesAt(motion, phase) : { A: 0, B: 0 };
    [level.A, level.B].forEach((v, i) => {
      const foot = feetNow[i];
      const t = 1 - v;
      rings[i].setAttribute('cx', foot.x.toFixed(1));
      rings[i].setAttribute('cy', (foot.y + 4).toFixed(1));
      rings[i].setAttribute('r', (8 + 34 * t).toFixed(1));
      rings[i].style.opacity = String(v * 0.9);
    });
  }

  // Where the feet are on screen, for the 3D shoes (see `moves` in shoe-path.js).
  section.__feet = () => {
    const m = svg.getScreenCTM();
    if (!m || !feetNow.length) return null;
    return feetNow.map((f) => ({
      x: m.a * f.x + m.c * f.y + m.e,
      y: m.b * f.x + m.d * f.y + m.f,
      length: f.length * m.a,
      angle: f.angle,
      flipped: f.flipped,
    }));
  };

  let shownMove = -1;
  let shownOffer = '';
  function setLabel(i) {
    if (i === shownMove) return;
    shownMove = i;
    nameEl.textContent = moves[i].name;
    section.dataset.sound = moves[i].offers?.[picks[i]]?.sound ?? ''; // shown in presenter mode
  }
  function setRoll(text) {
    if (text === shownOffer) return;
    shownOffer = text;
    roll.textContent = text;
  }

  const calm = calmMotion();
  function update(p) {
    // The wall: pulls back from close up, then drifts gently.
    const pull = calm ? 1 : ease(slice(p, PULL_BACK[0], PULL_BACK[1]));
    const drift = calm ? 0 : p;
    wall.style.transform = `translate(-50%, -50%) translate(${(-drift * 70).toFixed(1)}px, ${(-drift * 24).toFixed(1)}px) scale(${lerp(2.6, 1, pull).toFixed(3)})`;

    // Which movement, and how far through it.
    const t = (p - MOVES_START) / each;
    const i = Math.min(Math.max(Math.floor(t), 0), n - 1);
    const s = clamp01(t - i);
    const move = moves[i];
    const motion = MOVES[move.motion] ? move.motion : 'walk';
    const loops = LOOPS[motion] ?? 2;
    const phase = calm ? KEY_PHASE[motion] ?? 0.25 : s * loops;

    let pose;
    if (p < MOVES_START) {
      pose = STAND;
    } else {
      pose = movementPose(motion, phase);
      if (!calm && s < BLEND) {
        // Blend in from where the previous movement ended (its loop start), or from standing.
        const prev = i ? movementPose(MOVES[moves[i - 1].motion] ? moves[i - 1].motion : 'walk', 0) : STAND;
        pose = blendPose(prev, pose, ease(s / BLEND));
      }
      if (p > MOVES_END) pose = blendPose(pose, STAND, ease(slice(p, MOVES_END, MOVES_END + 0.05)));
    }
    draw(pose, p >= MOVES_START && p <= MOVES_END ? motion : null, phase);
    showBadges(p < MOVES_START ? 0 : i, Math.max(i - 1, 0), p < MOVES_START ? 1 : s);

    // The figure fades in as the wall pulls back.
    svg.style.opacity = String(ease(slice(p, 0.04, 0.14)));

    // The label: the name and its rolled offer, fading between movements.
    setLabel(i);
    const inMove = p >= MOVES_START && p <= MOVES_END + 0.02;
    const fadeOut = i === n - 1 ? ease(slice(p, MOVES_END, MOVES_END + 0.03)) : ease(slice(s, 0.94, 1));
    label.style.opacity = String(inMove ? ease(slice(s, 0, 0.08)) * (1 - fadeOut) : 0);
    const offers = move.offers ?? [];
    if (!offers.length) return;
    const r = calm ? 1 : ease(slice(s, ROLL[0], ROLL[1]));
    const ticks = (1 - r) * offers.length * 3;
    setRoll(offers[(picks[i] + Math.ceil(ticks)) % offers.length].offer);
    const f = ticks % 1;
    roll.style.transform = `translateY(${(-f * 0.5).toFixed(3)}em)`;
    offerEl.style.opacity = String(ease(slice(s, ROLL[0] - 0.04, ROLL[0])) * (r >= 1 ? 1 : 0.35 + 0.65 * (1 - f)));
  }

  update(0);
  onProgress((p) => {
    update(p);
    // The 3D shoes ride on the feet: ask them to redraw with the new foot positions.
    window.dispatchEvent(new Event('shoe-refresh'));
  });
  return section;
}
