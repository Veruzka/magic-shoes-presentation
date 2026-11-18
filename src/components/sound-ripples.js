// Shows sound without playing it: rings spreading out from a point and a small
// waveform. Driven by scroll, not by a timer, so it only moves when you scroll.
//   const ripples = soundRipples();
//   ripples.set(level, phase);  // level 0..1 = how loud; phase 0..1 = moves the rings outward
// TODO: real audio, muted until the viewer clicks an unmute toggle.
import './sound-ripples.css';

const RINGS = 3;
const BARS = 15;

export function soundRipples() {
  const element = document.createElement('div');
  element.className = 'sound-ripples';
  element.setAttribute('aria-hidden', 'true');
  const rings = Array.from({ length: RINGS }, () => {
    const ring = document.createElement('span');
    ring.className = 'sound-ripples__ring';
    element.append(ring);
    return ring;
  });
  const wave = document.createElement('div');
  wave.className = 'sound-ripples__wave';
  const bars = Array.from({ length: BARS }, () => {
    const bar = document.createElement('span');
    wave.append(bar);
    return bar;
  });
  element.append(wave);

  function set(level, phase = 0) {
    rings.forEach((ring, i) => {
      const t = (phase * 2 + i / RINGS) % 1; // each ring a little further out
      ring.style.scale = String(0.3 + t * 1.2);
      ring.style.opacity = String(level * (1 - t));
    });
    bars.forEach((bar, i) => {
      const shape = Math.sin((i / (BARS - 1)) * Math.PI); // taller in the middle
      const wobble = 0.5 + 0.5 * Math.sin(i * 1.7 + phase * 18);
      bar.style.scale = `1 ${0.08 + level * shape * wobble}`;
    });
  }

  set(0);
  return { element, set };
}
