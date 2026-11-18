// The ending: one plain full screen with the name, the team, the course and
// the links. It has no scroll room of its own (it's the last screen), so it
// fades in by how much of it has come into view: a quarter showing = faint,
// all of it showing = fully there. Scrolling back up fades it out again.
//
// The text sits in the lower part of the screen on purpose: the top-centre
// (about 45% of the height) stays empty for the floating 3D shoe.
//
//   page.append(close());
import '../styles/close.css';
import { scene } from '../core/scene.js';

const team = ['Cassius Palacio', 'Elizabeth (Liz) Wang', 'Kimney Nguyen', 'Veruzka Oropeza', 'Vinay Thorat'];

const links = [
  { label: 'MVP code', href: 'https://github.com/cassiusp-beep/tui-music-sampling-shoes' },
  { label: 'This website', href: 'https://github.com/Veruzka/magic-shoes-presentation' },
  { label: "Liz's Medium post: Twinkle Toes", href: 'https://medium.com/@elizabeth_wang/twinkle-toes-f98c42327bf4' },
];

export function close() {
  const { section, stage } = scene({ name: 'close', length: 0, stops: 1 });
  stage.classList.add('tt-close__stage');

  stage.innerHTML = `
    <div class="tt-close__inner">
      <h2 class="tt-headline tt-close__headline">Once upon a step</h2>
      <ul class="tt-close__team">
        ${team.map((name) => `<li>${name}</li>`).join('')}
      </ul>
      <p class="tt-close__course">
        NWMEDIA C262 Theory and Practice of Tangible User Interfaces, UC Berkeley, Fall 2026.
        Prof. Kimiko Ryokai, TA Connie Gu.
      </p>
      <ul class="tt-close__links">
        ${links
          .map((l) => `<li><a href="${l.href}" target="_blank" rel="noopener">${l.label}</a></li>`)
          .join('')}
      </ul>
    </div>
  `;

  // Fade by how much of the screen has scrolled into view (no timers, no
  // animation loop: the browser tells us each time the amount changes).
  const inner = stage.querySelector('.tt-close__inner');
  const steps = Array.from({ length: 21 }, (_, i) => i / 20);
  const fadeIn = (ratio) => Math.min(Math.max((ratio - 0.25) / 0.65, 0), 1);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      ([entry]) => {
        inner.style.opacity = String(fadeIn(entry.intersectionRatio));
      },
      { threshold: steps },
    ).observe(section);
  } else {
    inner.style.opacity = '1';
  }

  return section;
}
