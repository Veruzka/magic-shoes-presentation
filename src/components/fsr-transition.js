// The flying FSR for chapter 2 of the hero: a copy of the FSR that starts
// exactly where the real one lies in its pocket, lifts out, turns upright to face
// you and grows to the centre of the screen. Driven by a progress number 0 → 1.
//
// Chapter 3 (the door turn and the half-sketch) runs on the same pieces:
// src/components/fsr-reveal.js
//
// Timings and sizes: src/shoes/fsr-transition.js
import './fsr-transition.css';
import { fsrReveal } from './fsr-reveal.js';

const clamp01 = (n) => Math.min(Math.max(n, 0), 1);
const between = (value, { start, end }) => clamp01((value - start) / (end - start));
const ease = (t) => (1 - Math.cos(Math.PI * t)) / 2; // soft start and stop
const mix = (a, b, t) => a + (b - a) * t;

// stage     the pinned screen it flies across (positions are measured against it)
// shoe      the shoe's controls (fsrPose, setFsrHidden, setLabelsVisible)
// settings  src/shoes/fsr-transition.js
// sensor    the FSR's settings (src/shoes/sketch-sensor.js): its angled render, plus
//           the sharp straight-on render it switches to as it faces you
//
// Both images are loaded and decoded right away so chapter 2 never waits for them.
// Sharpness: the moving piece is NOT marked "will-change", so the browser redraws
// it crisply at every size instead of stretching a small snapshot. Its shadow is
// on the outer wrapper (which doesn't move), so the images themselves aren't filtered.
//
// Its pieces (two identical stacks, so only the render half gets a shadow):
//   .fsr-flight                       the whole screen, holds everything
//     .fsr-flight__photo  (shadow)    door → mover → angled render + straight-on render
//     .fsr-flight__drawing            door → mover → the sketch (chapter 3)
//   door  = the chapter-3 turn; mover = where the FSR is (one transform)
export function flyingFsr(stage, shoe, settings, sensor = {}) {
  const element = document.createElement('div');
  element.className = 'fsr-flight';
  element.setAttribute('aria-hidden', 'true');

  const photo = stack('fsr-flight__photo');
  const inner = document.createElement('div');
  inner.className = 'fsr-flight__inner';
  const img = picture(sensor.render?.image);
  inner.append(img);
  // The straight-on render, turned so its tail runs along the FSR's length (pad on the left).
  const front = picture(sensor.front?.image);
  const depthHolder = document.createElement('div'); // the pad's thickness (chapter 3)
  depthHolder.className = 'fsr-flight__depth-holder';
  photo.frontTurn.append(depthHolder, front);
  photo.mover.prepend(inner);

  const drawing = stack('fsr-flight__drawing');
  const sketchHolder = document.createElement('div');
  sketchHolder.className = 'fsr-flight__sketch';
  drawing.frontTurn.append(sketchHolder);
  element.append(photo.element, drawing.element);

  const movers = [photo.mover, drawing.mover];
  const frontBoxes = [depthHolder, front, sketchHolder];
  let placed = null; // where the straight-on render sits now (for chapter 3)

  function setProgress(t) {
    shoe.setLabelsVisible?.(1 - ease(between(t, settings.labelsOut)));

    const pose = t > 0 ? shoe.fsrPose?.() : null;
    if (!pose) {
      element.hidden = true;
      shoe.setFsrHidden?.(false);
      return;
    }
    element.hidden = false;
    shoe.setFsrHidden?.(true);

    // How the image sits around the pad, in flat units (same as in the pocket).
    const { layout } = pose;
    Object.assign(img.style, {
      left: `${-layout.width / 2 - layout.padX}px`,
      top: `${-layout.height / 2 - layout.padY}px`,
      width: `${layout.width}px`,
      height: `${layout.height}px`,
    });
    inner.style.transform = `rotate(${layout.level}rad)`;

    // The straight-on render, sized so its pad matches the angled one's pad exactly.
    // Its tail is a little shorter, so after the swap the centring and final size
    // follow its own length.
    const hasFront = Boolean(sensor.front && front.naturalWidth);
    const swap = hasFront ? ease(between(t, settings.swap)) : 0;
    let frontLength = 0;
    if (hasFront) {
      const width = layout.size / sensor.front.padWidth;
      const height = (width * front.naturalHeight) / front.naturalWidth;
      frontLength = layout.size / 2 + (1 - sensor.front.padCentre[1]) * height; // pad's edge → pins
      for (const layer of frontBoxes) {
        Object.assign(layer.style, {
          left: `${-sensor.front.padCentre[0] * width}px`,
          top: `${-sensor.front.padCentre[1] * height}px`,
          width: `${width}px`,
          height: `${height}px`,
        });
      }
      front.style.opacity = swap;
      img.style.opacity = 1 - swap;
      placed = { width, height };
    }

    // Where the FSR lies now: turn its on-screen axes into angle, size, tilt.
    const box = stage.getBoundingClientRect();
    const u = pose.xAxis;
    const v = pose.yAxis;
    const angle0 = Math.atan2(u.y, u.x);
    const size0 = Math.hypot(u.x, u.y);
    const cos = Math.cos(-angle0);
    const sin = Math.sin(-angle0);
    const skew0 = (v.x * cos - v.y * sin) / size0; // tilt of the "across" direction
    const squash0 = (v.x * sin + v.y * cos) / size0; // how foreshortened it is

    // The middle of the FSR (pad's left edge → tail end), relative to the pad, in flat units.
    const angledLength = layout.width / 2 - layout.padX + layout.size / 2; // whole FSR, in flat units
    const length = frontLength ? mix(angledLength, frontLength, swap) : angledLength;
    const middle = length / 2 - layout.size / 2;
    const start = {
      x: pose.origin.x - box.left + u.x * middle,
      y: pose.origin.y - box.top + u.y * middle,
    };
    const centre = { x: box.width / 2, y: box.height / 2 };
    const finalSize = (box.height * settings.grow.finalHeight) / length;

    // The three movements, each with a soft start and stop.
    const lift = ease(between(t, settings.lift));
    const turn = ease(between(t, settings.turn));
    const grow = ease(between(t, settings.grow));

    // Turn: from lying along the shoe to upright (pad on top, tail pointing down = 90°).
    const angle = mix(angle0, Math.PI / 2, turn);
    const skew = mix(skew0, 0, turn);
    const squash = mix(squash0, 1, turn);
    let size = size0 * mix(1, settings.lift.grow, lift);
    size = mix(size, finalSize, grow);
    // Position: rise out of the pocket, then glide to the centre.
    const x = mix(start.x, centre.x, turn);
    const y = mix(start.y - settings.lift.rise * lift, centre.y, turn);

    // One matrix: along-axis → (cos, sin)·size; across-axis → turned (skew, squash)·size.
    const a = Math.cos(angle) * size;
    const b = Math.sin(angle) * size;
    const c = (Math.cos(angle) * skew - Math.sin(angle) * squash) * size;
    const d = (Math.sin(angle) * skew + Math.cos(angle) * squash) * size;
    // Place it so the FSR's middle lands on (x, y).
    const e = x - a * middle;
    const f = y - b * middle;
    for (const mover of movers) mover.style.transform = `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`;
    if (placed) Object.assign(placed, { a, b, c, d, e, f, box });
  }

  // A point on the straight-on render (share of its width, height) → the screen
  // (before the chapter-3 turn). The render is turned −90°: (x, y) → (y, −x).
  function frontToScreen(fx, fy) {
    const { width, height, a, b, c, d, e, f } = placed;
    const x = (fx - sensor.front.padCentre[0]) * width;
    const y = (fy - sensor.front.padCentre[1]) * height;
    return { x: a * y + c * -x + e, y: b * y + d * -x + f };
  }

  const reveal = settings.reveal && sensor.front
    ? fsrReveal({ element, doors: [photo.door, drawing.door], front, depthHolder, sketchHolder }, sensor, settings.reveal, () => ({ box: placed.box, frontToScreen }))
    : null;

  // Chapter 3: 0 = the big FSR facing you, 1 = turned, half sketch, labelled.
  function setReveal(r) {
    if (reveal && placed?.box) reveal.setProgress(r);
  }

  setProgress(0);
  return { element, setProgress, setReveal };
}

// One stack: a still wrapper → the door (chapter-3 turn) → the mover → the
// straight-on image's holder (turned upright).
function stack(className) {
  const element = document.createElement('div');
  element.className = className;
  const door = document.createElement('div');
  door.className = 'fsr-flight__door';
  const mover = document.createElement('div');
  mover.className = 'fsr-flight__mover';
  const frontTurn = document.createElement('div');
  frontTurn.className = 'fsr-flight__front';
  mover.append(frontTurn);
  door.append(mover);
  element.append(door);
  return { element, door, mover, frontTurn };
}

function picture(src) {
  const img = document.createElement('img');
  img.className = 'fsr-flight__image';
  img.alt = '';
  if (src) {
    img.src = src;
    img.decode().catch(() => {});
  }
  return img;
}
