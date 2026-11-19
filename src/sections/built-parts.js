// "What we've built", part 2: picks up after the shoe comes apart (hero.js).
// Four pinned scenes, one after the other, all driven by scrolling:
//
//   parts       the 3D shoe breaks apart, its six parts labeled one at a time
//   mvp         the MVP: the move table, then the data flow lighting up step by step
//   mvp-media   photos of the MVP build, plus a slot for the demo video
//   next-build  what we're building next, and our takeaways
//
//   page.append(builtShoeParts());  // the parts scene
//   page.append(builtParts());      // the MVP, photos, next build
//
// Everything moves only with the scroll (no timers, no loops). Visitors who
// prefer reduced motion get plain fades with no movement.
import '../styles/built-parts.css';
import { scene, calmMotion, slice, ease } from '../core/scene.js';
import { todoTag } from '../components/todo-tag.js';
import breadboard1Url from '../assets/mvp/breadboard-1.jpg';
import breadboard2Url from '../assets/mvp/breadboard-2.jpg';
import samplerUrl from '../assets/mvp/sampler-app.png';
import tinkercadUrl from '../assets/mvp/tinkercad-circuit.png';

// The shoe breaking apart comes first, then Veruzka's sketch breakdown
// (hero.js), then the rest, so they're two separate pieces of the page.
export function builtShoeParts() {
  const wrapper = document.createElement('div');
  wrapper.className = 'tt-built';
  wrapper.append(partsScene());
  return wrapper;
}

export function builtParts() {
  const wrapper = document.createElement('div');
  wrapper.className = 'tt-built';
  wrapper.append(mvpScene(), mediaScene(), nextBuildScene());
  return wrapper;
}

// Fades an element in (t: 0 → 1) and lifts it up into place from `rise` px below.
// With reduced motion it only fades.
function reveal(el, t, rise = 24) {
  const shown = ease(t);
  el.style.opacity = shown;
  el.style.transform = calmMotion() ? 'none' : `translateY(${(1 - shown) * rise}px)`;
}

// The small header used by every scene: a headline and at most one line.
// (`eyebrow` is optional and unused for now: one headline per scene.)
function header({ eyebrow, headline, line }) {
  const el = document.createElement('header');
  el.className = 'tt-built__header';
  el.innerHTML = `
    ${eyebrow ? `<p class="tt-eyebrow">${eyebrow}</p>` : ''}
    <h2 class="tt-headline tt-built__headline">${headline}</h2>
    ${line ? `<p class="tt-line">${line}</p>` : ''}
  `;
  return el;
}

// ---------------------------------------------------------------------------
// 1. Inside each shoe: the 3D shoe breaks apart and each part gets a label.
//    The shoe and labels are drawn by src/three/shoe-stage.js (see `parts` in
//    src/data/shoe-path.js); this scene holds the headline and leaves room.
// ---------------------------------------------------------------------------
function partsScene() {
  const { section, stage, onProgress } = scene({ name: 'parts', length: 2, stops: 3 });
  stage.innerHTML = `
    <div class="tt-built__frame tt-built__parts"></div>
  `;
  const frame = stage.querySelector('.tt-built__parts');
  const head = header({ headline: 'Inside each shoe' });
  frame.prepend(head);

  function update(p) {
    reveal(head, slice(p, 0, 0.1));
  }
  update(0);
  onProgress(update);
  return section;
}

// ---------------------------------------------------------------------------
// 2. The MVP: the move table, then the data flow.
// ---------------------------------------------------------------------------
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
  // Arrow-key stops: once the headline is in (not the very start, which is
  // blank), then with the whole data flow lit.
  section.dataset.stopAt = '0.12,1';
  stage.innerHTML = `
    <div class="tt-built__frame tt-built__mvp">
      <div class="tt-built__mvp-top">
        <div class="tt-built__mvp-intro"></div>
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
    headline: 'Music Sampling Shoes',
    line: 'Two players remix one song with their feet. It worked.',
  });
  intro.prepend(head);
  const steps = [...stage.querySelectorAll('.tt-built__flow-step')];
  const arrows = [...stage.querySelectorAll('.tt-built__flow-arrow')];

  // Scroll timeline (p: 0 → 1):
  //   0.00 to 0.10  header
  //   0.20 to 0.90  the data flow lights up step by step, left to right
  function update(p) {
    reveal(head, slice(p, 0, 0.1));
    const stepEach = 0.7 / steps.length;
    steps.forEach((step, i) => {
      const t = slice(p, 0.2 + i * stepEach, 0.2 + (i + 1) * stepEach);
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
  // Arrow-key stop at the end, with every tile shown. At the start nothing has
  // faded in yet, so the slide was blank and the tiles flashed past on the next press.
  section.dataset.stopAt = '1';
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
  const head = header({ headline: 'How it came together' });
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
  // Arrow-key stop at the end, with the takeaways shown (same reason as mvp-media).
  section.dataset.stopAt = '1';
  stage.innerHTML = `
    <div class="tt-built__frame tt-built__next">
      <div class="tt-built__takeaways">
        <h3 class="tt-built__takeaways-title">Takeaways</h3>
        <ol class="tt-built__takeaway-list"></ol>
      </div>
    </div>
  `;
  const head = header({
    headline: 'Four shoes, sound effects',
    line: 'Each player wears a full pair.',
  });
  stage.querySelector('.tt-built__next').prepend(head);

  const title = stage.querySelector('.tt-built__takeaways-title');
  const list = stage.querySelector('.tt-built__takeaway-list');
  // The team's three takeaways: a short title, then its points.
  const TAKEAWAYS = [
    { title: 'Sound effects vs. music', points: ['Curiosity and imagination', 'Music empowered improv'] },
    { title: 'Scenarios and imagination built off friends', points: ['Building scenarios, sounds, and play'] },
    { title: 'A more open approach', points: ['Explore instead of define'] },
  ];
  const lines = TAKEAWAYS.map(({ title: text, points }, i) => {
    const li = document.createElement('li');
    li.className = 'tt-built__takeaway';
    li.innerHTML = `
      <span class="tt-built__takeaway-num">0${i + 1}</span>
      <span class="tt-built__takeaway-text">${text}</span>
      <ul class="tt-built__takeaway-points">${points.map((point) => `<li>${point}</li>`).join('')}</ul>`;
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
