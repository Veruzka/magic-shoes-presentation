// Twinkle Toes hero: the first screen of the story. A huge name, one line,
// and four copies of the shoe, one per world, tinted in that world's color.
// The shoes start stacked like a deck of cards and fan out as you scroll,
// turning around a shared point near the heel (inspired by the way
// apple.com fans out phone colors, but with our own shoe).
//
// Everything moves from the scroll position only (no timers).
// Visitors who prefer reduced motion see the fan already open, and the
// shoes and world names simply fade in.
import '../styles/tt-hero.css';
import { scene, calmMotion, slice, ease, lerp } from '../core/scene.js';
import { worlds } from '../data/worlds.js';
import { todoTag } from '../components/todo-tag.js';
import shoeUrl from '../assets/shoe-sketch.png';

// Where each shoe ends up when the fan is fully open (one per world, in order).
//   angle  how far it turns around the heel, in degrees (positive = toe goes up)
//   x, y   a small nudge in pixels so the cards don't sit exactly on top of each other
const FAN = [
  { angle: 16, x: -26, y: -10 },
  { angle: 5.5, x: -9, y: -3 },
  { angle: -5.5, x: 9, y: 3 },
  { angle: -16, x: 26, y: 10 },
];

// How the stack looks before you scroll: almost on top of each other.
const STACK = [
  { angle: 2.4, x: -6, y: -6 },
  { angle: 0.8, x: -2, y: -2 },
  { angle: -0.8, x: 2, y: 2 },
  { angle: -2.4, x: 6, y: 6 },
];

export function ttHero() {
  const { section, stage, onProgress } = scene({ name: 'hero', length: 1.4, stops: 2, className: 'tt-hero' });

  stage.innerHTML = `
    <div class="tt-hero__layout">
      <div class="tt-hero__text">
        <h1 class="tt-headline tt-hero__name">Twinkle Toes</h1>
        <div class="tt-hero__todo"></div>
        <p class="tt-line tt-hero__line">Shoes that turn your movement into sound.</p>
      </div>
      <div class="tt-hero__fan" aria-hidden="true"></div>
    </div>
  `;

  // TODO: confirm the project name: "Twinkle Toes" or "Music Sampling Shoes".
  stage.querySelector('.tt-hero__todo').append(todoTag('confirm name vs. Music Sampling Shoes'));

  // One card per world: a tinted shoe plus the world's name next to its toe.
  const fan = stage.querySelector('.tt-hero__fan');
  const cards = worlds.map((world) => {
    const card = document.createElement('div');
    card.className = 'tt-hero__card';
    card.innerHTML = `
      <img class="tt-hero__shoe" src="${shoeUrl}" alt="" draggable="false" />
      <span class="tt-hero__label">${world.name}</span>
    `;
    card.querySelector('.tt-hero__shoe').style.filter = world.shoeFilter;
    card.style.setProperty('--tt-hero-ink', world.ink);
    fan.append(card);
    return { card, label: card.querySelector('.tt-hero__label') };
  });

  const text = stage.querySelector('.tt-hero__text');
  const calm = calmMotion();

  onProgress((p) => {
    // 0 to 0.7 of the scroll: the fan opens. 0.45 to 0.85: the world names appear.
    const open = calm ? 1 : ease(slice(p, 0, 0.7));
    const names = ease(slice(p, 0.45, 0.85));

    cards.forEach(({ card, label }, i) => {
      const angle = lerp(STACK[i].angle, FAN[i].angle, open);
      const x = lerp(STACK[i].x, FAN[i].x, open);
      const y = lerp(STACK[i].y, FAN[i].y, open);
      card.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
      // Calm mode: the shoes fade in one after another instead of moving.
      card.style.opacity = calm ? String(0.35 + 0.65 * slice(p, i * 0.15, i * 0.15 + 0.3)) : '1';
      // Turn the name back the other way so it always reads level.
      label.style.transform = `translateY(-50%) rotate(${-angle}deg)`;
      label.style.opacity = String(names);
    });

    // The text drifts up a little as the fan opens (calm mode: it stays put).
    text.style.transform = calm ? 'none' : `translateY(${lerp(0, -28, open)}px)`;
  });

  return section;
}
