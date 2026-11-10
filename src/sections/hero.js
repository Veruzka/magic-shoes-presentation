// Hero section: the first screen. A swappable background (src/backgrounds/)
// with a swappable shoe (src/shoes/) floating in the middle.
//
// For shoes that come apart as you scroll, the hero becomes taller than the
// screen and its contents stay pinned in place while you scroll — that
// scrolling is what moves the shoe's parts (see setShoeOpening below).
import '../styles/hero.css';
import { backgrounds } from '../backgrounds/index.js';
import { shoes } from '../shoes/index.js';
import { soleMoves } from '../shoes/sole-moves.js';
import { loadChoice } from '../core/remember-choice.js';
import { explodingShoe } from '../components/exploding-shoe.js';
import { separatingShoe } from '../components/separating-shoe.js';
import { heroTitle } from '../components/hero-title.js';

// For each hero: the shoe's controls (setProgress, setMove), if it comes apart.
const shoeControls = new WeakMap();

export function hero() {
  const section = document.createElement('section');
  section.className = 'hero';
  section.innerHTML = `
    <div class="hero__stage">
      <div class="hero__background" aria-hidden="true"></div>
      <div class="hero__title-slot"></div>

      <div class="hero__clear-zone">
        <div class="hero__shoe-area">
          <div class="hero__floater"></div>
        </div>
      </div>
    </div>
  `;
  // The big title behind the shoe.
  section.querySelector('.hero__title-slot').replaceWith(heroTitle('Magic Shoes'));
  showBackground(section, loadChoice('background', backgrounds));
  showShoe(section, loadChoice('shoe', shoes));
  return section;
}

// Puts a background into the hero, replacing whatever was there,
// and switches the text/outline colors to ones that read well on it.
export function showBackground(section, background) {
  section.querySelector('.hero__background').replaceChildren(background.build());
  section.style.setProperty('--ink-text', background.inkColors.text);
  section.style.setProperty('--ink-line', background.inkColors.line);
  section.style.setProperty('--ink-title', background.inkColors.title);
}

// Swaps which shoe floats in the middle.
export function showShoe(section, shoe) {
  const floater = section.querySelector('.hero__floater');
  let controls = null;

  if (shoe.layers) {
    // Comes apart layer by layer, like puzzle pieces.
    controls = separatingShoe(shoe, loadChoice('sole-move', soleMoves));
  } else if (shoe.parts) {
    // The earlier 5-part exploded view (set aside for now, kept working).
    controls = explodingShoe(shoe);
  }

  if (controls) {
    floater.replaceChildren(controls.element);
    shoeControls.set(section, controls);
  } else {
    const img = document.createElement('img');
    img.className = 'hero__shoe';
    img.src = shoe.image;
    img.alt = shoe.alt;
    floater.replaceChildren(img);
    shoeControls.delete(section);
  }

  // Only shoes that come apart need the extra scrolling room.
  section.classList.toggle('hero--pinned', Boolean(controls));
}

// How far the shoe has come apart: 0 = whole, 1 = fully separated.
export function setShoeOpening(section, progress) {
  shoeControls.get(section)?.setProgress(progress);
}

// Which path the detaching sole takes (see src/shoes/sole-moves.js).
export function setSoleMove(section, move) {
  shoeControls.get(section)?.setMove?.(move);
}
