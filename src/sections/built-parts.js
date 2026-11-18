// "What we've built", part 2: picks up after the shoe comes apart (hero.js).
// Four pinned scenes, one after the other, all driven by scrolling:
//
//   parts       the sketch shoe, with its six parts labeled one at a time
//   mvp         the MVP: the move table, then the data flow lighting up step by step
//   mvp-media   photos of the MVP build, plus a slot for the demo video
//   next-build  what we're building next, and our takeaways
//
//   page.append(builtParts());
//
// Everything moves only with the scroll (no timers, no loops). Visitors who
// prefer reduced motion get plain fades with no movement.
import '../styles/built-parts.css';
import { scene, calmMotion, slice, ease } from '../core/scene.js';
import { shoeParts } from '../data/shoe-parts.js';
import { todoTag } from '../components/todo-tag.js';
import shoeUrl from '../assets/shoe-sketch.png';
import breadboard1Url from '../assets/mvp/breadboard-1.jpg';
import breadboard2Url from '../assets/mvp/breadboard-2.jpg';
import samplerUrl from '../assets/mvp/sampler-app.png';
import tinkercadUrl from '../assets/mvp/tinkercad-circuit.png';

const SVG = 'http://www.w3.org/2000/svg';

export function builtParts() {
  const wrapper = document.createElement('div');
  wrapper.className = 'tt-built';
  wrapper.append(partsScene(), mvpScene(), mediaScene(), nextBuildScene());
  return wrapper;
}

// Fades an element in (t: 0 → 1) and lifts it up into place from `rise` px below.
// With reduced motion it only fades.
function reveal(el, t, rise = 24) {
  const shown = ease(t);
  el.style.opacity = shown;
  el.style.transform = calmMotion() ? 'none' : `translateY(${(1 - shown) * rise}px)`;
}

// The small header used by every scene: eyebrow, headline, optional line.
function header({ eyebrow, headline, line }) {
  const el = document.createElement('header');
  el.className = 'tt-built__header';
  el.innerHTML = `
    <p class="tt-eyebrow">${eyebrow}</p>
    <h2 class="tt-headline tt-built__headline">${headline}</h2>
    ${line ? `<p class="tt-line">${line}</p>` : ''}
  `;
  return el;
}

// ---------------------------------------------------------------------------
// 1. Inside each shoe: the six parts, labeled one at a time.
// ---------------------------------------------------------------------------
function partsScene() {
  const { section, stage, onProgress } = scene({ name: 'parts', length: 2, stops: 3 });
  stage.innerHTML = `
    <div class="tt-built__frame tt-built__parts">
      <div class="tt-built__parts-row">
        <div class="tt-built__shoe-box">
          <img class="tt-built__shoe" src="${shoeUrl}" alt="Sketch of the Twinkle Toes shoe" width="1356" height="846">
        </div>
        <ul class="tt-built__labels"></ul>
        <svg class="tt-built__leaders" aria-hidden="true"></svg>
      </div>
    </div>
  `;
  const frame = stage.querySelector('.tt-built__parts');
  const head = header({ eyebrow: "What we've built", headline: 'Inside each shoe' });
  frame.prepend(head);

  const row = stage.querySelector('.tt-built__parts-row');
  const shoe = stage.querySelector('.tt-built__shoe');
  const list = stage.querySelector('.tt-built__labels');
  const svg = stage.querySelector('.tt-built__leaders');

  // The labels sit in the column from top to bottom in the order of their
  // point's height on the shoe, so the leader lines don't cross much.
  // They still appear in the data's order (the FSR first).
  const columnOrder = [...shoeParts].sort((a, b) => a.point.y - b.point.y);
  const items = shoeParts.map((part) => {
    const label = document.createElement('li');
    label.className = 'tt-built__label';
    label.innerHTML = `
      <span class="tt-built__label-name">${part.name}</span>
      <span class="tt-built__label-note">${part.note}</span>
    `;
    // A part that isn't final yet gets a TODO sticker next to its name.
    if (part.todo) label.querySelector('.tt-built__label-name').append(' ', todoTag(part.todo));

    const path = document.createElementNS(SVG, 'path');
    path.setAttribute('pathLength', '1'); // so "how much is drawn" is simply 0 → 1
    const dot = document.createElementNS(SVG, 'circle');
    dot.setAttribute('r', '3.5');
    svg.append(path, dot);
    return { part, label, path, dot };
  });
  columnOrder.forEach((part) => list.append(items.find((item) => item.part === part).label));

  // TODO: confirm the per-shoe parts with engineering once the final hardware is decided.
  const note = document.createElement('li');
  note.className = 'tt-built__labels-todo';
  note.append(todoTag('confirm per-shoe parts with engineering'));
  list.append(note);

  // Draws every leader line from its part's point on the shoe to its label.
  // Measured from the shoe image's real box each time, so it stays right on resize.
  function placeLines() {
    const rowBox = row.getBoundingClientRect();
    const shoeBox = shoe.getBoundingClientRect();
    if (!shoeBox.width) return; // not on the page yet
    const shoeRight = shoeBox.right - rowBox.left;
    items.forEach(({ part, label, path, dot }) => {
      const point = {
        x: shoeBox.left - rowBox.left + part.point.x * shoeBox.width,
        y: shoeBox.top - rowBox.top + part.point.y * shoeBox.height,
      };
      // offsetLeft/Top ignore the label's little slide-in, so the line end stays put.
      const name = label.querySelector('.tt-built__label-name');
      const end = {
        x: list.offsetLeft + label.offsetLeft - 14,
        y: list.offsetTop + label.offsetTop + name.offsetHeight / 2,
      };
      // A slant from the point to just past the shoe, then straight across to the label.
      const knee = { x: Math.max(shoeRight + 12, point.x + 20), y: end.y };
      path.setAttribute('d', `M${point.x},${point.y} L${knee.x},${knee.y} L${end.x},${end.y}`);
      dot.setAttribute('cx', point.x);
      dot.setAttribute('cy', point.y);
    });
  }

  // Scroll timeline (p: 0 → 1):
  //   0.00 to 0.12  header and shoe fade in
  //   0.14 to 0.92  the six parts, one after the other (line draws, then the label)
  const first = 0.14;
  const each = (0.92 - first) / items.length;
  let lastP = 0;
  function update(p) {
    lastP = p;
    reveal(head, slice(p, 0, 0.1));
    reveal(shoe, slice(p, 0.02, 0.12), 16);
    note.style.opacity = slice(p, 0.05, 0.12);
    placeLines();

    const calm = calmMotion();
    items.forEach(({ label, path, dot }, i) => {
      const start = first + i * each;
      const t = slice(p, start, start + each * 0.8);
      const drawn = calm ? (t > 0 ? 1 : 0) : slice(t, 0, 0.6); // the line draws first…
      const text = slice(t, 0.45, 1); // …and the label fades in as it lands
      // Once the next part starts, earlier ones step back a little.
      const current = p < first + (i + 1) * each || i === items.length - 1;
      const dim = current ? 1 : 0.55;
      path.style.strokeDashoffset = 1 - drawn;
      path.style.opacity = (calm ? text : drawn > 0 ? 1 : 0) * dim;
      dot.style.opacity = (calm ? text : slice(t, 0, 0.15)) * dim;
      label.style.opacity = ease(text) * dim;
      label.style.transform = calm ? 'none' : `translateX(${(1 - ease(text)) * 12}px)`;
    });
  }

  update(0);
  onProgress(update);
  // Not a loop: only re-measure when the window size changes or the image arrives.
  window.addEventListener('resize', () => update(lastP));
  shoe.addEventListener('load', () => update(lastP));
  return section;
}

// ---------------------------------------------------------------------------
// 2. The MVP: the move table, then the data flow.
// ---------------------------------------------------------------------------
const moves = [
  { move: 'Stand on your shoe', left: 'Drums in', right: 'Vocals in' },
  { move: 'Lift your foot', both: 'Part drops out' },
  { move: 'Tip toes', left: 'Bass in', right: 'Melody in' },
  { move: 'Shake', both: 'Echo' },
  { move: 'Both stomp within 0.25 s', both: 'Swap parts' },
];

const flow = [
  { name: 'FSR + gyro' },
  { name: 'Minima', rate: '50x a second' },
  { name: 'XIAO' },
  { name: 'Bluetooth', rate: '40x a second' },
  { name: 'Chrome sampler app' },
  { name: 'Laptop speakers' },
];

function mvpScene() {
  const { section, stage, onProgress } = scene({ name: 'mvp', length: 1.5, stops: 2 });
  stage.innerHTML = `
    <div class="tt-built__frame tt-built__mvp">
      <div class="tt-built__mvp-top">
        <div class="tt-built__mvp-intro">
          <p class="tt-built__credit">Inspired by Kanye West's Stem Player.</p>
        </div>
        <div class="tt-built__moves" role="table" aria-label="What each move does">
          <div class="tt-built__move tt-built__move--head" role="row">
            <span role="columnheader">Move</span>
            <span role="columnheader">Left shoe</span>
            <span role="columnheader">Right shoe</span>
          </div>
          ${moves
            .map(
              (row) => `
            <div class="tt-built__move" role="row">
              <span role="cell" class="tt-built__move-name">${row.move}</span>
              ${
                row.both
                  ? `<span role="cell" class="tt-built__move-both">${row.both}</span>`
                  : `<span role="cell">${row.left}</span><span role="cell">${row.right}</span>`
              }
            </div>`,
            )
            .join('')}
        </div>
      </div>
      <ol class="tt-built__flow" aria-label="How the data travels">
        ${flow
          .map(
            (step, i) => `
          ${i ? '<li class="tt-built__flow-arrow" aria-hidden="true">→</li>' : ''}
          <li class="tt-built__flow-step">
            <span class="tt-built__flow-name">${step.name}</span>
            ${step.rate ? `<span class="tt-built__flow-rate">${step.rate}</span>` : ''}
            <span class="tt-built__flow-bar" aria-hidden="true"></span>
          </li>`,
          )
          .join('')}
      </ol>
    </div>
  `;
  const intro = stage.querySelector('.tt-built__mvp-intro');
  const head = header({
    eyebrow: 'The MVP',
    headline: 'Music Sampling Shoes',
    line: 'Two players, one shoe each, remixing one song split into four parts.',
  });
  intro.prepend(head);
  const credit = stage.querySelector('.tt-built__credit');
  const rows = [...stage.querySelectorAll('.tt-built__move')];
  const steps = [...stage.querySelectorAll('.tt-built__flow-step')];
  const arrows = [...stage.querySelectorAll('.tt-built__flow-arrow')];

  // Scroll timeline (p: 0 → 1):
  //   0.00 to 0.10  header
  //   0.08 to 0.42  table rows, one by one (heading row first), then the credit
  //   0.50 to 0.95  the data flow lights up step by step, left to right
  function update(p) {
    reveal(head, slice(p, 0, 0.1));
    const rowEach = 0.34 / rows.length;
    rows.forEach((row, i) => reveal(row, slice(p, 0.08 + i * rowEach, 0.08 + (i + 1) * rowEach), 14));
    reveal(credit, slice(p, 0.4, 0.46), 10);

    const stepEach = 0.45 / steps.length;
    steps.forEach((step, i) => {
      const t = slice(p, 0.5 + i * stepEach, 0.5 + (i + 1) * stepEach);
      // Unlit steps wait as faint outlines; lit ones go full ink with an underline.
      step.style.opacity = 0.25 + 0.75 * ease(t);
      step.querySelector('.tt-built__flow-bar').style.transform = `scaleX(${ease(t)})`;
      if (i) arrows[i - 1].style.opacity = 0.2 + 0.8 * ease(t);
    });
    // The whole chain stays hidden until the header has shown up.
    stage.querySelector('.tt-built__flow').style.opacity = slice(p, 0.02, 0.12);
  }

  update(0);
  onProgress(update);
  return section;
}

// ---------------------------------------------------------------------------
// 3. MVP photos and the demo video slot.
// ---------------------------------------------------------------------------
const photos = [
  { url: breadboard1Url, caption: 'The breadboard: sensors wired to both boards', className: 'tt-built__media--b1' },
  { url: breadboard2Url, caption: 'Up close, the gyro and the XIAO', className: 'tt-built__media--b2' },
  { url: samplerUrl, caption: 'The sampler app in Chrome, one panel per player', className: 'tt-built__media--app' },
  { url: tinkercadUrl, caption: 'The circuit, planned in Tinkercad', className: 'tt-built__media--circuit' },
];

function mediaScene() {
  const { section, stage, onProgress } = scene({ name: 'mvp-media', length: 0.8, stops: 1 });
  stage.innerHTML = `
    <div class="tt-built__frame tt-built__media-frame">
      <div class="tt-built__media-grid">
        <figure class="tt-built__media tt-built__media--video">
          <div class="tt-built__video-slot">
            <span class="tt-built__video-label">MVP demo video</span>
          </div>
          <figcaption>The MVP in action</figcaption>
        </figure>
        ${photos
          .map(
            (photo) => `
          <figure class="tt-built__media ${photo.className}">
            <img src="${photo.url}" alt="${photo.caption}" loading="lazy">
            <figcaption>${photo.caption}</figcaption>
          </figure>`,
          )
          .join('')}
      </div>
    </div>
  `;
  const head = header({ eyebrow: 'The MVP', headline: 'How it came together' });
  stage.querySelector('.tt-built__media-frame').prepend(head);
  // TODO: add the MVP demo video here (replace the placeholder box).
  stage.querySelector('.tt-built__video-slot').append(todoTag('add demo video'));

  const tiles = [...stage.querySelectorAll('.tt-built__media')];

  // Scroll timeline (p: 0 → 1): header, then each tile rises in, one after another.
  function update(p) {
    reveal(head, slice(p, 0, 0.15));
    tiles.forEach((tile, i) => reveal(tile, slice(p, 0.1 + i * 0.1, 0.3 + i * 0.1), 32));
  }

  update(0);
  onProgress(update);
  return section;
}

// ---------------------------------------------------------------------------
// 4. Building on that: the next build, and our takeaways.
// ---------------------------------------------------------------------------
function nextBuildScene() {
  const { section, stage, onProgress } = scene({ name: 'next-build', length: 0.8, stops: 1 });
  stage.innerHTML = `
    <div class="tt-built__frame tt-built__next">
      <div class="tt-built__takeaways">
        <h3 class="tt-built__takeaways-title">Takeaways</h3>
        <ol class="tt-built__takeaway-list"></ol>
      </div>
    </div>
  `;
  const head = header({
    eyebrow: 'Building on that',
    headline: 'Four shoes, sound effects',
    line: 'Each player wears a full pair, and the song parts become sound effects for each world.',
  });
  stage.querySelector('.tt-built__next').prepend(head);

  const title = stage.querySelector('.tt-built__takeaways-title');
  const list = stage.querySelector('.tt-built__takeaway-list');
  // TODO: team to write takeaway 1.
  // TODO: team to write takeaway 2.
  // TODO: team to write takeaway 3.
  const lines = [1, 2, 3].map((n) => {
    const li = document.createElement('li');
    li.className = 'tt-built__takeaway';
    li.innerHTML = `<span class="tt-built__takeaway-text">Takeaway ${n} goes here.</span>`;
    li.append(todoTag('team to write takeaway'));
    list.append(li);
    return li;
  });

  // Scroll timeline (p: 0 → 1): header, then "Takeaways", then each line.
  function update(p) {
    reveal(head, slice(p, 0, 0.25));
    reveal(title, slice(p, 0.3, 0.42), 16);
    lines.forEach((line, i) => reveal(line, slice(p, 0.4 + i * 0.12, 0.55 + i * 0.12), 16));
  }

  update(0);
  onProgress(update);
  return section;
}
