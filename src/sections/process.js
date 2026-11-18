// "The process": how we got to Twinkle Toes, in two pinned scenes.
//
//   process  five steps, one at a time. The current step is shown big in the
//            middle; a line with five dots underneath shows where you are
//            (past dots dim, the current one grows).
//   grid     the bodystorm map: a 2x2 grid that builds as you scroll. First the
//            two axes draw in, then the four corner names fade in, then each
//            gesture drops onto its spot, one after another.
//
//   page.append(process());
//
// Everything moves only from the scroll number p (0 → 1). Visitors who prefer
// reduced motion get fades only (no sliding, growing or dropping).
import '../styles/process.css';
import { scene, calmMotion, slice, ease, lerp, clamp01 } from '../core/scene.js';
import { quadrants, gestures } from '../data/gestures.js';

// The five steps. `title` is the short name under its dot on the line;
// `text` is the big line; `facts` and `groups` are optional extras.
const steps = [
  { title: 'Movement and math', text: 'We started with movement and math.' },
  {
    title: 'Embodied whimsy',
    text: 'We were encouraged to explore embodied interaction and bring back whimsy: unexpected movements, improv and storytelling.',
  },
  { title: 'Back to basics', text: 'We landed on the basics: what can we do with our feet?' },
  {
    title: 'Bodystorm',
    text: 'Bodystorming session.',
    facts: ['29 Oct 2026', 'Outdoors on campus', 'Shoes on', 'About 26 minutes', '28 gestures'],
    takeaway: 'Takeaway: we want people to play with our tool the way we played.',
  },
  {
    title: 'Grouping',
    text: 'We wrote down the movements we liked and grouped them.',
    groups: [
      { name: 'Standard', items: 'walk, run, step' },
      { name: 'Whimsical', items: "kick, dancer's pose, feet to the sky" },
    ],
  },
];

export function process() {
  const wrapper = document.createElement('div');
  wrapper.className = 'tt-process';
  wrapper.append(timelineScene(), gridScene());
  return wrapper;
}

// ---- Scene 1: the five steps ----------------------------------------------

function timelineScene() {
  const { section, stage, onProgress } = scene({ name: 'process', length: 2, stops: 5 });
  stage.classList.add('tt-process__stage');

  stage.innerHTML = `
    <div class="tt-process__inner">
      <header class="tt-process__head">
        <p class="tt-eyebrow">The process</p>
        <h2 class="tt-headline tt-process__headline">How we got here</h2>
      </header>
      <div class="tt-process__slot">
        ${steps.map(stepCard).join('')}
      </div>
      <div class="tt-process__rail">
        <span class="tt-process__track" aria-hidden="true"><span class="tt-process__fill"></span></span>
        <ol class="tt-process__stops">
        ${steps
          .map(
            (step, i) => `
          <li class="tt-process__stop">
            <span class="tt-process__dot" aria-hidden="true"></span>
            <span class="tt-process__stop-label"><b>0${i + 1}</b> ${step.title}</span>
          </li>`,
          )
          .join('')}
        </ol>
      </div>
    </div>
  `;

  const cards = [...stage.querySelectorAll('.tt-process__step')];
  const dots = [...stage.querySelectorAll('.tt-process__dot')];
  const labels = [...stage.querySelectorAll('.tt-process__stop-label')];
  const fill = stage.querySelector('.tt-process__fill');
  const calm = calmMotion();
  const last = steps.length - 1;

  onProgress((p) => {
    // The arrow keys stop at p = 0, 0.25, 0.5, 0.75 and 1: one step per stop.
    // Between two stops, the old step leaves first, then the new one comes in
    // (they never overlap).
    cards.forEach((card, i) => {
      const at = i / last;
      const come = i === 0 ? 1 : ease(slice(p, at - 0.11, at - 0.03));
      const go = i === last ? 0 : ease(slice(p, at + 0.03, at + 0.11));
      card.style.opacity = String(come * (1 - go));
      card.style.transform = calm ? 'none' : `translateY(${lerp(28, 0, come) - go * 28}px)`;
      card.setAttribute('aria-hidden', come * (1 - go) > 0.5 ? 'false' : 'true');
    });

    // The line under the steps fills up as you go.
    fill.style.transform = calm ? 'none' : `scaleX(${clamp01(p)})`;
    if (calm) fill.style.opacity = String(0.25 + 0.75 * clamp01(p));

    // Dots: not reached yet = faint, current = big, past = dimmed.
    dots.forEach((dot, i) => {
      const at = i / last;
      const reached = i === 0 ? 1 : ease(slice(p, at - 0.11, at - 0.03));
      const current = 1 - clamp01(Math.abs(p - at) / 0.14);
      dot.style.opacity = String(lerp(0.25, lerp(0.5, 1, current), reached));
      dot.style.transform = calm ? 'none' : `scale(${lerp(1, 1.7, ease(current))})`;
      labels[i].style.opacity = String(lerp(0.3, lerp(0.55, 1, current), reached));
    });
  });

  return section;
}

function stepCard(step, i) {
  const facts = step.facts
    ? `<ul class="tt-process__facts">${step.facts.map((f) => `<li>${f}</li>`).join('')}</ul>`
    : '';
  const takeaway = step.takeaway ? `<p class="tt-process__takeaway">${step.takeaway}</p>` : '';
  const groups = step.groups
    ? `<dl class="tt-process__groups">${step.groups
        .map((g) => `<div><dt>${g.name}</dt><dd>${g.items}</dd></div>`)
        .join('')}</dl>`
    : '';
  return `
    <article class="tt-process__step" style="opacity:${i === 0 ? 1 : 0}">
      <p class="tt-process__number">Step 0${i + 1}</p>
      <p class="tt-process__text">${step.text}</p>
      ${facts}${takeaway}${groups}
    </article>`;
}

// ---- Scene 2: the bodystorm grid ------------------------------------------

// Labels sit to the right of their dot, except near the right edge (so they
// don't spill out of the grid) and where they'd bump into a neighbour.
const labelOnLeft = (g) => g.x > 0.72 || g.id === 'P-11';

function gridScene() {
  const { section, stage, onProgress } = scene({ name: 'grid', length: 1.6, stops: 3 });
  stage.classList.add('tt-grid__stage');

  // Where each corner name sits, outside the square.
  const corner = { street: 'top-left', play: 'top-right', pause: 'bottom-left', reverie: 'bottom-right' };

  stage.innerHTML = `
    <div class="tt-grid__inner">
      <div class="tt-grid__text">
        <p class="tt-eyebrow">The bodystorm map</p>
        <h2 class="tt-headline tt-grid__headline">Expected to whimsy</h2>
        <p class="tt-line tt-grid__caption">Copying each other was the strongest signal.</p>
      </div>
      <figure class="tt-grid__figure">
        <div class="tt-grid__square">
          <span class="tt-grid__axis tt-grid__axis--x" aria-hidden="true"></span>
          <span class="tt-grid__axis tt-grid__axis--y" aria-hidden="true"></span>
          <span class="tt-grid__end tt-grid__end--left">Expected</span>
          <span class="tt-grid__end tt-grid__end--right">Whimsy</span>
          <span class="tt-grid__end tt-grid__end--top">Active</span>
          <span class="tt-grid__end tt-grid__end--bottom">Ambient</span>
          ${quadrants
            .map((q) => `<span class="tt-grid__quadrant tt-grid__quadrant--${corner[q.id]}">${q.name}</span>`)
            .join('')}
          ${gestures
            .map(
              (g) => `
            <span class="tt-grid__gesture${labelOnLeft(g) ? ' tt-grid__gesture--left' : ''}"
                  style="left:${g.x * 100}%; top:${(1 - g.y) * 100}%">
              <span class="tt-grid__drop">
                <span class="tt-grid__dot" aria-hidden="true"></span>
                <span class="tt-grid__label">${g.name}</span>
              </span>
            </span>`,
            )
            .join('')}
        </div>
      </figure>
    </div>
  `;

  const axisX = stage.querySelector('.tt-grid__axis--x');
  const axisY = stage.querySelector('.tt-grid__axis--y');
  const ends = [...stage.querySelectorAll('.tt-grid__end')];
  const names = [...stage.querySelectorAll('.tt-grid__quadrant')];
  const drops = [...stage.querySelectorAll('.tt-grid__drop')];
  const caption = stage.querySelector('.tt-grid__caption');
  const calm = calmMotion();

  onProgress((p) => {
    // 1. The axes draw in from the middle (0 → 0.16), with their end words.
    const axes = ease(slice(p, 0, 0.16));
    if (calm) {
      axisX.style.opacity = axisY.style.opacity = String(axes);
    } else {
      axisX.style.transform = `scaleX(${axes})`;
      axisY.style.transform = `scaleY(${axes})`;
    }
    ends.forEach((end) => (end.style.opacity = String(ease(slice(p, 0.08, 0.2)))));

    // 2. The corner names fade in, one after another (0.18 → 0.4).
    names.forEach((name, i) => {
      name.style.opacity = String(ease(slice(p, 0.18 + i * 0.05, 0.28 + i * 0.05)));
    });

    // 3. The gestures drop onto their spots, one after another (0.4 → 0.92).
    const gap = 0.44 / drops.length;
    drops.forEach((drop, i) => {
      const t = ease(slice(p, 0.4 + i * gap, 0.4 + i * gap + 0.08));
      drop.style.opacity = String(t);
      drop.style.transform = calm ? 'none' : `translateY(${lerp(-36, 0, t)}px)`;
    });

    // 4. The one-line takeaway comes in last.
    const c = ease(slice(p, 0.86, 0.98));
    caption.style.opacity = String(c);
    caption.style.transform = calm ? 'none' : `translateY(${lerp(16, 0, c)}px)`;
  });

  return section;
}
