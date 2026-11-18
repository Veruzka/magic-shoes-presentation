// A reusable full-screen "scene" for the Twinkle Toes story: a section that is
// taller than the screen, with a stage that stays pinned while you scroll
// through it. Scrolling through it gives a number from 0 to 1 (via
// watchScrollProgress), and the scene uses that number to animate.
//
//   const { section, stage, onProgress } = scene({ name: 'hero', length: 1.5, stops: 3 });
//   stage.innerHTML = '…';
//   onProgress((p) => { … });   // p: 0 at the start of the scene, 1 at its end
//
//   name    used by the keyboard navigation and handy when debugging
//   length  how much scrolling the scene takes, in screen-heights (0 = one plain screen)
//   stops   how many places the arrow keys stop at inside the scene (spread evenly)
//
// Visitors who prefer reduced motion: use `calmMotion()` to swap big moves for fades.
import '../styles/scene.css';
import { watchScrollProgress } from './scroll-progress.js';

export function scene({ name, length = 1, stops = 1, className = '' }) {
  const section = document.createElement('section');
  section.className = `scene ${className}`.trim();
  section.dataset.scene = name;
  section.dataset.stops = String(stops);
  section.style.setProperty('--scene-length', `${length * 100}vh`);
  section.innerHTML = '<div class="scene__stage"></div>';
  const stage = section.querySelector('.scene__stage');

  function onProgress(callback) {
    section.dataset.progress = '0';
    // Start once the section is on the page, so its position can be measured.
    requestAnimationFrame(() => {
      const watcher = watchScrollProgress(section, (p) => {
        section.dataset.progress = p.toFixed(3);
        callback(p);
      });
      window.addEventListener('load', () => watcher.refresh(), { once: true });
    });
  }

  return { section, stage, onProgress };
}

// True when the visitor asked their computer for less motion.
export function calmMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Small helpers for scroll-driven motion.
export const clamp01 = (n) => Math.min(Math.max(n, 0), 1);
// How far through the slice [start, end] of the scene we are, as 0 → 1.
export const slice = (p, start, end) => clamp01((p - start) / (end - start));
// Soft start and stop.
export const ease = (t) => (1 - Math.cos(Math.PI * clamp01(t))) / 2;
export const lerp = (a, b, t) => a + (b - a) * t;
