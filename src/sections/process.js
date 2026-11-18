// "The process": how we got to Twinkle Toes, in four pinned scenes.
//
//   process   five steps, one at a time. The current step is shown big in the
//             middle; a line with five dots underneath shows where you are.
//   tracked   how we turned the bodystorm into data: three moments, each one
//             built left to right as you scroll (video, then the pose-tracking
//             skeleton, then the pictogram we drew from it).
//   critique  what Kimiko pushed us on: three short quotes from her critique,
//             each followed by what we changed because of it.
//   grid      the bodystorm map: a 2x2 grid that builds as you scroll. First the
//             two axes draw in, then the four corner names fade in, then each
//             gesture drops onto its spot, one after another.
//
//   page.append(process());
//
// Everything moves only from the scroll number p (0 → 1). Visitors who prefer
// reduced motion get fades only (no sliding, growing or dropping).
import '../styles/process.css';
import { scene, calmMotion, slice, ease, lerp, clamp01 } from '../core/scene.js';
import { quadrants, gestures } from '../data/gestures.js';

// The bodystorm pictures (Vite turns these imports into real file paths).
import f20 from '../assets/bodystorm/P-20_frame.jpg';
import p20 from '../assets/bodystorm/P-20_pose.jpg';
import i20 from '../assets/bodystorm/P-20_picto.png';
import f09 from '../assets/bodystorm/P-09c_frame.jpg';
import p09 from '../assets/bodystorm/P-09c_pose.jpg';
import i09 from '../assets/bodystorm/P-09c_picto.png';
import f11 from '../assets/bodystorm/P-11_frame.jpg';
import p11 from '../assets/bodystorm/P-11_pose.jpg';
import i11 from '../assets/bodystorm/P-11_picto.png';

// The five steps: one short line each.
const steps = [
  'Movement and math',
  'Bring back whimsy',
  'What can feet do?',
  'Bodystorm: 28 gestures in 26 minutes',
  'Standard vs. whimsical',
];

// The three bodystorm moments in the "tracked" scene. Each has its video
// frame, the pose-tracking picture and the pictogram.
const moments = [
  { name: 'Heel-click jump', frame: f20, pose: p20, picto: i20 },
  { name: 'Side kick', frame: f09, pose: p09, picto: i09 },
  { name: 'Toe descent ring', frame: f11, pose: p11, picto: i11 },
];

// Kimiko's critique of our bodystorm (from our notes, 4 Nov), and what we did.
const critique = [
  { quote: 'Still feels individual.', answer: 'Two players, four shoes.' },
  { quote: 'Sound as the output.', answer: 'Sound only. No screens.' },
  {
    quote: 'Once we mimicked each other, we felt comfortable.',
    answer: 'Copying your partner makes the sound bigger.',
  },
];

export function process() {
  const wrapper = document.createElement('div');
  wrapper.className = 'tt-process';
  wrapper.append(timelineScene(), trackedScene(), critiqueScene(), gridScene());
  return wrapper;
}

// ---- Scene 1: the five steps ----------------------------------------------

function timelineScene() {
  const { section, stage, onProgress } = scene({ name: 'process', length: 2, stops: 5 });
  stage.classList.add('tt-process__stage');

  stage.innerHTML = `
    <div class="tt-process__inner">
      <header class="tt-process__head">
        <h2 class="tt-headline tt-process__headline">How we got here</h2>
      </header>
      <div class="tt-process__slot">
        ${steps
          .map(
            (text, i) => `
          <p class="tt-process__step" style="opacity:${i === 0 ? 1 : 0}">${text}</p>`,
          )
          .join('')}
      </div>
      <div class="tt-process__rail">
        <span class="tt-process__track" aria-hidden="true"><span class="tt-process__fill"></span></span>
        <ol class="tt-process__stops">
        ${steps
          .map(
            (_, i) => `
          <li class="tt-process__stop">
            <span class="tt-process__dot" aria-hidden="true"></span>
            <span class="tt-process__stop-label">0${i + 1}</span>
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

// ---- Scene 2: how we tracked movement -------------------------------------
// Three rows, one per bodystorm moment. Each row has three pictures in a line:
// video frame → pose tracking → pictogram. The arrow keys stop at
// p = 0 (just the headline), 1/3 (row 1 built), 2/3 (row 2), 1 (row 3).
// Inside its third of the scroll, a row builds left to right.

function trackedScene() {
  const { section, stage, onProgress } = scene({ name: 'tracked', length: 1.8, stops: 4 });
  stage.classList.add('tt-tracked__stage');

  const panel = (src, kind, name) => `
    <figure class="tt-tracked__panel tt-tracked__panel--${kind}">
      <img src="${src}" alt="${name}: ${kind}" loading="lazy" decoding="async" />
    </figure>`;
  const arrow = '<span class="tt-tracked__arrow" aria-hidden="true">→</span>';

  stage.innerHTML = `
    <div class="tt-tracked__inner">
      <header class="tt-tracked__head">
        <h2 class="tt-headline tt-tracked__headline">How we tracked movement</h2>
        <p class="tt-line tt-tracked__line">Video, then pose tracking, then a pictogram.</p>
      </header>
      <div class="tt-tracked__table">
        <div class="tt-tracked__row tt-tracked__row--heads" aria-hidden="true">
          <span></span>
          <span class="tt-tracked__colhead">Video</span><span></span>
          <span class="tt-tracked__colhead">Pose tracking</span><span></span>
          <span class="tt-tracked__colhead">Pictogram</span>
        </div>
        ${moments
          .map(
            (m) => `
        <div class="tt-tracked__row">
          <p class="tt-tracked__name">${m.name}</p>
          ${panel(m.frame, 'video', m.name)}${arrow}${panel(m.pose, 'pose', m.name)}${arrow}${panel(m.picto, 'pictogram', m.name)}
        </div>`,
          )
          .join('')}
      </div>
    </div>
  `;

  const rows = [...stage.querySelectorAll('.tt-tracked__row:not(.tt-tracked__row--heads)')].map((row) => ({
    name: row.querySelector('.tt-tracked__name'),
    imgs: [...row.querySelectorAll('.tt-tracked__panel img')],
    arrows: [...row.querySelectorAll('.tt-tracked__arrow')],
  }));
  const calm = calmMotion();

  onProgress((p) => {
    rows.forEach((row, r) => {
      // This row owns the scroll from r/3 to (r+1)/3, finishing just before its stop.
      const from = r / 3 + 0.02;
      const to = (r + 1) / 3 - 0.02;
      const at = (t) => lerp(from, to, t); // a point inside this row's slice

      const n = ease(slice(p, at(0), at(0.3)));
      row.name.style.opacity = String(n);

      // The three pictures come in one after another, left to right.
      row.imgs.forEach((img, i) => {
        const t = ease(slice(p, at(i * 0.33), at(i * 0.33 + 0.34)));
        img.style.opacity = String(t);
        img.style.transform = calm ? 'none' : `translateX(${lerp(-18, 0, t)}px) scale(${lerp(0.96, 1, t)})`;
      });
      // Each arrow shows up just before the picture it points to.
      row.arrows.forEach((a, i) => {
        a.style.opacity = String(ease(slice(p, at(0.2 + i * 0.33), at(0.36 + i * 0.33))));
      });
    });
  });

  return section;
}

// ---- Scene 3: what Kimiko pushed us on ------------------------------------
// Three cards, one per stop (1/3, 2/3, 1). In each card the quote comes in
// first; then it dims and our answer appears under it.

function critiqueScene() {
  const { section, stage, onProgress } = scene({ name: 'critique', length: 1.5, stops: 4 });
  stage.classList.add('tt-critique__stage');

  stage.innerHTML = `
    <div class="tt-critique__inner">
      <header class="tt-critique__head">
        <h2 class="tt-headline tt-critique__headline">What Kimiko pushed us on</h2>
        <p class="tt-line tt-critique__line">From her critique of our bodystorm, 4 Nov.</p>
      </header>
      <div class="tt-critique__cards">
        ${critique
          .map(
            (c) => `
        <article class="tt-critique__card">
          <blockquote class="tt-critique__quote">“${c.quote}”</blockquote>
          <p class="tt-critique__answer"><span class="tt-critique__arrow" aria-hidden="true">→</span> ${c.answer}</p>
        </article>`,
          )
          .join('')}
      </div>
    </div>
  `;

  const cards = [...stage.querySelectorAll('.tt-critique__card')].map((card) => ({
    card,
    quote: card.querySelector('.tt-critique__quote'),
    answer: card.querySelector('.tt-critique__answer'),
  }));
  const calm = calmMotion();

  onProgress((p) => {
    cards.forEach(({ card, quote, answer }, i) => {
      const from = i / 3 + 0.02;
      const to = (i + 1) / 3 - 0.01;
      const at = (t) => lerp(from, to, t);

      // 1. The card and its quote come in.
      const c = ease(slice(p, at(0), at(0.4)));
      card.style.opacity = String(c);
      card.style.transform = calm ? 'none' : `translateY(${lerp(24, 0, c)}px)`;

      // 2. The quote dims to "secondary" while our answer comes in under it.
      const a = ease(slice(p, at(0.55), at(1)));
      quote.style.opacity = String(lerp(1, 0.5, a));
      answer.style.opacity = String(a);
      answer.style.transform = calm ? 'none' : `translateY(${lerp(12, 0, a)}px)`;
    });
  });

  return section;
}

// ---- Scene 4: the bodystorm grid ------------------------------------------

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
