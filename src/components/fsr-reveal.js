// Chapter 3 of the hero, on the big FSR left by chapter 2:
//   1. it turns like a door around its upright centre line (real 3D), showing
//      the pad's thickness as a dark edge;
//   2. a line sweeps in from the right; behind it the FSR becomes a technical
//      sketch (src/components/fsr-sketch.js) on cream paper;
//   3. camera-style callouts fade in one by one (src/components/callouts.js).
// Driven by a progress number 0 → 1. Settings: src/shoes/fsr-reveal.js
import { fsrSketch } from './fsr-sketch.js';
import { callouts } from './callouts.js';

const clamp01 = (n) => Math.min(Math.max(n, 0), 1);
const between = (value, { start, end }) => clamp01((value - start) / (end - start));
const ease = (t) => (1 - Math.cos(Math.PI * t)) / 2;
const mix = (a, b, t) => a + (b - a) * t;

// parts     the flying FSR's pieces: { element, doors, front, renderLayers, depthHolder, sketchHolder }
// sensor    src/shoes/sketch-sensor.js (front.shape = the measured parts)
// settings  src/shoes/fsr-reveal.js
// geometry  () → { box, frontToScreen(fx, fy) } where the big FSR is, before the door turn
export function fsrReveal(parts, sensor, settings, geometry) {
  const { element, doors, front, sketchHolder, depthHolder } = parts;
  const renderLayers = [front];

  // The cream paper behind the line (grain baked into a picture, so it costs nothing to move).
  const paper = document.createElement('div');
  paper.className = 'fsr-paper';
  paper.style.backgroundColor = settings.paper.colour;
  paper.style.backgroundImage = `url("${grainPicture(settings.paper.grain)}")`;
  element.prepend(paper);

  // The sketch, drawn once the straight-on render's size is known.
  let sketch = null;
  // The pad's thickness: darkened copies of the render, stacked behind it.
  const depthCopies = [];
  front.decode?.().then(() => {
    sketch = fsrSketch(sensor.front.shape, settings.ink, front.naturalWidth, front.naturalHeight);
    sketchHolder.append(sketch);
    const shade = shadedPicture(front, settings.depth.shade);
    for (let i = settings.depth.layers; i >= 1; i--) {
      const copy = document.createElement('img');
      copy.className = 'fsr-flight__image fsr-flight__depth';
      copy.alt = '';
      copy.src = shade;
      copy.style.transform = `translateZ(${(-settings.depth.thickness * i) / settings.depth.layers}px)`;
      depthHolder.append(copy);
      depthCopies.push(copy);
      renderLayers.push(copy);
    }
  }).catch(() => {});

  const labels = callouts(settings.callouts.items.map((item) => item.text));
  element.append(labels.element);

  function setProgress(r) {
    const turn = ease(between(r, settings.turn));
    const sweep = ease(between(r, settings.sweep));
    const active = r > 0;
    element.classList.toggle('fsr-flight--reveal', active);

    // 1. The door turn, around the screen's centre (where the FSR's centre line is).
    const angle = (settings.turn.angle * turn * Math.PI) / 180;
    const P = settings.turn.perspective;
    for (const door of doors) door.style.transform = active ? `perspective(${P}px) rotateY(${angle}rad)` : '';
    for (const copy of depthCopies) copy.style.opacity = turn > 0 ? 1 : 0;

    const { box, frontToScreen } = geometry();
    const cx = box.width / 2;
    const cy = box.height / 2;
    // Where a point lands after the turn (rotateY + perspective, as the browser does it).
    const project = (p) => {
      const d = p.x - cx;
      const k = P / (P + d * Math.sin(angle));
      return { x: cx + d * Math.cos(angle) * k, y: cy + (p.y - cy) * k };
    };
    const padY = sensor.front.padCentre[1];
    const left = frontToScreen(0, padY).x;
    const right = frontToScreen(1, padY).x;

    // 2. The sweep: the line travels from the screen's right edge to the FSR's middle.
    // First it crosses the empty screen (speeding up), then the FSR itself (slowing to a stop),
    // so the interesting part, the FSR turning into a sketch, gets half the scroll.
    const stopX = project(frontToScreen(settings.sweep.stopAt, padY)).x;
    const edgeX = project(frontToScreen(1, padY)).x + 8;
    const s = between(r, settings.sweep);
    const lineX = s < 0.5
      ? mix(box.width, edgeX, (s / 0.5) ** 2)
      : mix(edgeX, stopX, 1 - (1 - (s - 0.5) / 0.5) ** 2);
    // Which share of the FSR's width is left of the line (undo the turn to find out).
    const dx = lineX - cx;
    const flatX = cx + (dx * P) / (P * Math.cos(angle) - dx * Math.sin(angle));
    const split = sweep > 0 ? clamp01((flatX - left) / (right - left)) : 1;
    for (const layer of renderLayers) layer.style.clipPath = split < 1 ? `inset(0 ${(1 - split) * 100}% 0 0)` : '';
    sketchHolder.style.clipPath = `inset(0 0 0 ${split * 100}%)`;
    sketchHolder.style.visibility = split < 1 ? 'visible' : 'hidden';
    paper.style.clipPath = `inset(0 0 0 ${lineX}px)`;
    paper.hidden = sweep <= 0;

    // 3. The callouts, one by one, in a column to the right of the FSR.
    const { start, each, fade, gap, items } = settings.callouts;
    const column = project(frontToScreen(1, padY)).x + gap;
    const width = front.naturalWidth || 1;
    const height = front.naturalHeight || 1;
    labels.place(items.map((item) => {
      const point = project(frontToScreen(item.point[0] / width, item.point[1] / height));
      return { point, label: { x: column, y: point.y + (item.rise || 0) } };
    }));
    labels.show(items.map((_, i) => clamp01((r - (start + i * each)) / fade)));
  }

  return { setProgress };
}

// A darker copy of the render (same shape), for the pad's thickness edge.
function shadedPicture(img, shade) {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.filter = `brightness(${shade})`;
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL('image/png');
}

// A tile of fine paper grain (an SVG noise picture, drawn once by the browser).
function grainPicture(strength) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.35 0 0 0 0 0.29 0 0 0 0 0.2 0 0 0 ${strength} 0'/></filter><rect width='100%' height='100%' filter='url(%23g)'/></svg>`;
  return `data:image/svg+xml;utf8,${svg.replace(/"/g, "'").replace(/</g, '%3C').replace(/>/g, '%3E')}`;
}
