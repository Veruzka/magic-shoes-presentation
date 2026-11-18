// Twinkle Toes hero: the first screen of the story. A huge name and one line
// at the top; the 3D shoe (src/three/shoe-stage.js) does one full spin in the
// space below as you start to scroll (see `hero` in src/data/shoe-path.js).
//
// Everything moves from the scroll position only (no timers).
// The earlier four-color fan is in git history (commit "Twinkle Toes hero").
import '../styles/tt-hero.css';
import { scene, calmMotion, slice, ease, lerp } from '../core/scene.js';
import { todoTag } from '../components/todo-tag.js';

export function ttHero() {
  const { section, stage, onProgress } = scene({ name: 'hero', length: 1.4, stops: 2, className: 'tt-hero' });

  stage.innerHTML = `
    <div class="tt-hero__layout">
      <div class="tt-hero__text">
        <h1 class="tt-headline tt-hero__name">Twinkle Toes</h1>
        <div class="tt-hero__todo"></div>
        <p class="tt-line tt-hero__line">Shoes that turn your movement into sound.</p>
      </div>
    </div>
  `;

  // TODO: confirm the project name: "Twinkle Toes" or "Music Sampling Shoes".
  stage.querySelector('.tt-hero__todo').append(todoTag('confirm name vs. Music Sampling Shoes'));

  if (calmMotion()) return section; // reduced motion: the text stays put

  // The text drifts up a little as the shoe spins.
  const text = stage.querySelector('.tt-hero__text');
  onProgress((p) => {
    text.style.transform = `translateY(${lerp(0, -28, ease(slice(p, 0, 0.7)))}px)`;
  });
  return section;
}
