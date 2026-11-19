// "What the MVP does": right after the concept, before "Inside each shoe".
// Three things the MVP can do, one per arrow-key stop. On the left, the list:
// the item for this stop is lit, the others wait faded. On the right, one
// pictogram figure (src/components/sprite-rig.js) does that item, looping in
// real time while the scene is on screen:
//   01 Walk and run    walks, then runs; a ring at each step
//   02 Spin            spins; the ring changes colour every turn (a new sound)
//   03 Whimsy moves    heel click, side kick, feet to the sky, one after another
import '../styles/mvp-does.css';
import { scene, calmMotion } from '../core/scene.js';
import { MOVES, movementPose, switchPose, lying, feetOf, spinScale, strikesAt, GROUND } from '../components/sprite-rig.js';
import { paperPerson } from '../components/paper-person.js';

const ITEMS = [
  {
    title: 'Walk and run',
    line: 'Every step makes a sound.',
    // [motion, seconds it plays]
    plan: [['step', 4.6], ['run', 4.2]],
  },
  {
    title: 'Spin',
    line: 'Spin around to change the sounds.',
    plan: [['spin', 1.6 * 3]],
  },
  {
    title: 'Whimsy moves',
    line: 'Unexpected and whimsical movements have their own sounds to be discovered.',
    plan: [['heelclick', 2.2], ['kick', 2.2], ['sky', 3.2]],
  },
];
const FIGURE = '#2f6f7b'; // the guy's teal sweater (the rings at his feet)
const SPIN_RINGS = ['#2fd3ff', '#d2b48c', '#f0846a', '#9b8cff']; // a new colour (a new sound) every turn
const SWITCH_SECONDS = 0.5;
const SWITCH_SECONDS_FLOOR = 1; // getting up from (or down to) the floor goes through a sit-up

const SVGNS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs = {}, parent) => {
  const node = document.createElementNS(SVGNS, tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  parent?.append(node);
  return node;
};

export function mvpDoes() {
  const { section, stage, onProgress } = scene({ name: 'mvp-does', length: 1.8, stops: 3, className: 'tt-does' });
  // One stop per item, each in the middle of its third of the scroll.
  section.dataset.stopAt = '0.1,0.5,0.9';

  stage.innerHTML = `
    <div class="tt-does__inner">
      <div class="tt-does__text">
        <h2 class="tt-headline tt-does__headline">What the MVP does</h2>
        <ol class="tt-does__list">
          ${ITEMS.map(
            (item, i) => `
            <li class="tt-does__item">
              <span class="tt-does__num">0${i + 1}</span>
              <h3 class="tt-does__title">${item.title}</h3>
              <p class="tt-does__line">${item.line}</p>
            </li>`,
          ).join('')}
        </ol>
      </div>
      <svg class="tt-does__figure" viewBox="-130 -125 260 240" aria-hidden="true"></svg>
    </div>
  `;
  const items = [...stage.querySelectorAll('.tt-does__item')];
  const svg = stage.querySelector('.tt-does__figure');
  el('line', { class: 'tt-does__ground', x1: -120, x2: 120, y1: GROUND + 6, y2: GROUND + 6 }, svg);
  const rings = [el('circle', { class: 'tt-does__ring', r: 8 }, svg), el('circle', { class: 'tt-does__ring', r: 8 }, svg)];
  const body = el('g', { class: 'tt-does__body' }, svg);
  // The guy in a beanie from the movement scene (src/components/paper-person.js),
  // with the Sketch shoe drawn flat on each foot. Until 2026-11-19 this was a
  // cyan stick figure (figurePaths in sprite-rig.js).
  const person = paperPerson(body, 'guy', { shoes: true });

  const calm = calmMotion();
  let p = 0;
  let active = -1; // the item on now
  let itemTime = 0; // seconds since it started
  let part = -1; // which motion of the item's plan
  let partTime = 0;
  let from = null; // the pose we're blending away from
  let switchSeconds = SWITCH_SECONDS;
  let pose = movementPose('step', 0);
  let turns = 0;
  let lastSpin = 0;

  const itemAt = (progress) => (progress < 0.3 ? 0 : progress < 0.7 ? 1 : 2);

  function startPart(motion) {
    from = { ...pose };
    partTime = 0;
    switchSeconds = lying(from) || lying(movementPose(motion, 0)) ? SWITCH_SECONDS_FLOOR : SWITCH_SECONDS;
  }

  function frame(dt) {
    const now = itemAt(p);
    if (now !== active) {
      active = now;
      itemTime = 0;
      part = -1;
      items.forEach((item, i) => item.classList.toggle('is-on', i === active));
    }
    itemTime += dt;
    partTime += dt;

    // Which motion of the item's plan, looping.
    const plan = ITEMS[active].plan;
    const total = plan.reduce((sum, [, s]) => sum + s, 0);
    let t = itemTime % total;
    let i = 0;
    while (t > plan[i][1]) {
      t -= plan[i][1];
      i += 1;
    }
    const motion = plan[i][0];
    if (i !== part) {
      part = i;
      startPart(motion);
    }
    const phase = calm ? 0.25 : t / (MOVES[motion].seconds ?? 1.5);
    let target = movementPose(motion, phase);
    const blend = calm ? 1 : Math.min(partTime / switchSeconds, 1);
    if (blend < 1) target = switchPose(from, target, blend);
    pose = target;

    person.update(pose);
    body.setAttribute('transform', `scale(${spinScale(pose).toFixed(3)},1)`);

    // The rings at the feet; in the spin they change colour every turn.
    if (motion === 'spin') {
      const f = ((phase % 1) + 1) % 1;
      if (f < lastSpin) turns += 1;
      lastSpin = f;
    }
    const ringColour = motion === 'spin' ? SPIN_RINGS[turns % SPIN_RINGS.length] : FIGURE;
    const level = calm ? { A: 0, B: 0 } : strikesAt(motion, phase, 0.35);
    const feet = feetOf(pose);
    [level.A, level.B].forEach((v, k) => {
      rings[k].setAttribute('cx', feet[k].x.toFixed(1));
      rings[k].setAttribute('cy', (feet[k].y + 4).toFixed(1));
      rings[k].setAttribute('r', (8 + 42 * (1 - v)).toFixed(1));
      rings[k].setAttribute('stroke', ringColour);
      rings[k].setAttribute('stroke-width', motion === 'spin' ? 5 : 3);
      rings[k].style.opacity = String(v);
    });
  }

  // Running only while on screen (like the movement scene).
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
    start(); // reduced motion: one still frame per scroll change
  });
  return section;
}
