// A shoe that fans open into its parts. You give it a number from 0 to 1
// (how far the visitor has scrolled) and it poses every part to match:
//
//   0.00 – 0.10  the whole-shoe image fades into the stacked parts
//   0.10 – 0.90  the parts slide and turn from "closed" to "open" (the fan)
//   0.75 – 1.00  the labels fade in and their lines draw out
//
// The parts and labels are described in src/shoes/sketch-parts.js.
import './exploding-shoe.css';

const CANVAS = 1024; // size of the drawing the part positions are measured on

// When each stage happens, as fractions of the scroll (see the list above).
const STAGES = {
  fadeEnd: 0.1,
  fanStart: 0.1,
  fanEnd: 0.9,
  labelsStart: 0.75,
  labelsEnd: 1,
};

// How much later each lower part starts moving than the one above it.
const STAGGER = 0.08;

// ---------- small math helpers ----------
const clamp01 = (n) => Math.min(Math.max(n, 0), 1);
const between = (value, start, end) => clamp01((value - start) / (end - start));
const mix = (from, to, amount) => from + (to - from) * amount;
const easeOut = (t) => 1 - (1 - t) ** 3; // fast start, gentle stop
const asPercent = (units) => `${(units / CANVAS) * 100}%`;

export function explodingShoe({ image, alt, parts, labels = [] }) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const element = document.createElement('div');
  element.className = 'exploding-shoe';
  element.setAttribute('role', 'img');
  element.setAttribute('aria-label', alt);

  // The whole shoe, shown before the fan starts.
  const whole = document.createElement('img');
  whole.className = 'exploding-shoe__whole';
  whole.src = image;
  whole.alt = '';

  // Each part, placed where it sat in the original drawing.
  const partImages = parts.map((part) => {
    const img = document.createElement('img');
    img.className = 'exploding-shoe__part';
    img.src = part.image;
    img.alt = '';
    Object.assign(img.style, {
      left: asPercent(part.x),
      top: asPercent(part.y),
      width: asPercent(part.width),
      zIndex: part.layer,
    });
    return img;
  });

  // Labels: bold word + handwritten word, a short description, and a line.
  const labelElements = labels.map((label) => {
    const el = document.createElement('div');
    el.className = `part-label part-label--${label.side}`;
    el.style.top = asPercent(label.y);
    if (label.side === 'left') el.style.right = asPercent(CANVAS - label.x);
    else el.style.left = asPercent(label.x);
    el.innerHTML = `
      <span class="part-label__line"></span>
      <p class="part-label__title"><strong>${label.bold}</strong> <em>${label.script}</em></p>
      <p class="part-label__text">${label.text}</p>
    `;
    return el;
  });

  element.append(whole, ...partImages, ...labelElements);

  // Poses everything for a scroll amount between 0 and 1.
  function setProgress(progress) {
    const fade = between(progress, 0, STAGES.fadeEnd);
    const fan = between(progress, STAGES.fanStart, STAGES.fanEnd);
    const labelsShown = between(progress, STAGES.labelsStart, STAGES.labelsEnd);

    const unit = element.clientWidth / CANVAS; // canvas units → pixels
    const still = reduceMotion.matches;

    // Reduced motion: no sliding — the open view simply fades in as you scroll.
    whole.style.opacity = still ? 1 - progress : 1 - fade;

    partImages.forEach((img, i) => {
      const { closed, open } = parts[i];
      // Top part moves first; each lower part starts a little later.
      const amount = still ? 1 : easeOut(between(fan, i * STAGGER, 1));
      const x = mix(closed.x, open.x, amount) * unit;
      const y = mix(closed.y, open.y, amount) * unit;
      const turn = mix(closed.turn, open.turn, amount);
      img.style.opacity = still ? progress : fade;
      img.style.transform = `translate(${x}px, ${y}px) rotate(${turn}deg)`;
    });

    labelElements.forEach((el) => {
      el.style.opacity = labelsShown;
      el.style.setProperty('--line-drawn', labelsShown);
    });
  }

  setProgress(0);
  return { element, setProgress };
}
