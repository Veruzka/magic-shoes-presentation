// The flying FSR for chapter 2 of the hero: a copy of the FSR that starts
// exactly where the real one lies in its pocket, lifts out, turns upright to face
// you and grows to the centre of the screen. Driven by a progress number 0 → 1.
//
// Timings and sizes: src/shoes/fsr-transition.js
import './fsr-transition.css';

const clamp01 = (n) => Math.min(Math.max(n, 0), 1);
const between = (value, { start, end }) => clamp01((value - start) / (end - start));
const ease = (t) => (1 - Math.cos(Math.PI * t)) / 2; // soft start and stop
const mix = (a, b, t) => a + (b - a) * t;

// stage     the pinned screen it flies across (positions are measured against it)
// shoe      the shoe's controls (fsrPose, setFsrHidden, setLabelsVisible)
// settings  src/shoes/fsr-transition.js
// image     the FSR render, loaded and decoded right away so chapter 2 never waits for it
export function flyingFsr(stage, shoe, settings, image) {
  const element = document.createElement('div');
  element.className = 'fsr-flight';
  element.setAttribute('aria-hidden', 'true');
  const inner = document.createElement('div');
  inner.className = 'fsr-flight__inner';
  const img = document.createElement('img');
  img.className = 'fsr-flight__image';
  img.alt = '';
  if (image) {
    img.src = image;
    img.decode().catch(() => {});
  }
  inner.append(img);
  element.append(inner);

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
    if (!img.src) img.src = layout.image;
    Object.assign(img.style, {
      left: `${-layout.width / 2 - layout.padX}px`,
      top: `${-layout.height / 2 - layout.padY}px`,
      width: `${layout.width}px`,
      height: `${layout.height}px`,
    });
    inner.style.transform = `rotate(${layout.level}rad)`;

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
    const middle = (-layout.size / 2 + (layout.width / 2 - layout.padX)) / 2;
    const start = {
      x: pose.origin.x - box.left + u.x * middle,
      y: pose.origin.y - box.top + u.y * middle,
    };
    const centre = { x: box.width / 2, y: box.height / 2 };
    const length = layout.width / 2 - layout.padX + layout.size / 2; // whole FSR, in flat units
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
    element.style.transform = `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`;
  }

  setProgress(0);
  return { element, setProgress };
}
