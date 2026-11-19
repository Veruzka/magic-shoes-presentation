// Hero section: the first screen. A swappable background (src/backgrounds/)
// with a swappable shoe (src/shoes/) floating in the middle.
//
// For shoes that come apart as you scroll, the hero becomes taller than the
// screen and its contents stay pinned in place while you scroll — that
// scrolling is what moves the shoe's parts (see setShoeOpening below).
import '../styles/hero.css';
import { backgrounds } from '../backgrounds/index.js';
import { shoes, startShoe } from '../shoes/index.js';
import { soleMoves } from '../shoes/sole-moves.js';
import { loadChoice } from '../core/remember-choice.js';
import { explodingShoe } from '../components/exploding-shoe.js';
import { separatingShoe } from '../components/separating-shoe.js';
import { heroTitle } from '../components/hero-title.js';
import { flyingFsr } from '../components/fsr-transition.js';
import { pinLength } from './hero-timeline.js';

// For each hero: the shoe's controls (setProgress, setMove…), if it comes apart,
// and the flying FSR + its settings, if the shoe has a chapter-2 transition.
const shoeControls = new WeakMap();
const transitions = new WeakMap();

export function hero() {
  const section = document.createElement('section');
  section.className = 'hero';
  section.innerHTML = `
    <div class="hero__stage">
      <!-- The shoe scene: slides up and away during chapter 2. -->
      <div class="hero__scene">
        <div class="hero__background" aria-hidden="true"></div>
        <div class="hero__title-slot"></div>

        <div class="hero__clear-zone">
          <div class="hero__shoe-area">
            <div class="hero__floater"></div>
          </div>
        </div>
      </div>

      <!-- The next section's background: rises in behind the scene in chapter 2. -->
      <div class="hero__next" aria-hidden="true"></div>
    </div>
  `;
  // The big title behind the shoe.
  section.querySelector('.hero__title-slot').replaceWith(heroTitle('Magic Shoes'));
  showBackground(section, loadChoice('background', backgrounds));
  showShoe(section, loadChoice('shoe', shoes, startShoe));
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

  // Shoes with a chapter-2 transition get the flying FSR.
  section.querySelector('.fsr-flight')?.remove();
  section.querySelector('.fsr-explainer')?.remove();
  transitions.delete(section);
  if (controls && shoe.transition) {
    const sensor = shoe.layers?.find((layer) => layer.topFace?.sensor)?.topFace.sensor;
    const flight = flyingFsr(section.querySelector('.hero__stage'), controls, shoe.transition, sensor);
    section.querySelector('.hero__stage').append(flight.element);
    if (flight.text) section.querySelector('.hero__stage').append(flight.text); // chapter 4's texts
    section.querySelector('.hero__next').style.background = shoe.transition.nextBackground;
    transitions.set(section, { flight, settings: shoe.transition });
  }

  // Only shoes that come apart need the extra scrolling room (more with a chapter 2).
  section.classList.toggle('hero--pinned', Boolean(controls));
  section.style.setProperty('--pin-length', pinLength(Boolean(controls && shoe.transition)));
}

// Whether the current shoe has a chapter 2 (the FSR transition).
export function hasExitChapter(section) {
  return transitions.has(section);
}

// Chapter 2: 0 = the shoe scene as it is, 1 = the FSR big in the centre of the next section.
export function setTransition(section, progress) {
  const transition = transitions.get(section);
  if (!transition) return;
  const { start, end } = transition.settings.sceneAway;
  const t = Math.min(Math.max((progress - start) / (end - start), 0), 1);
  const away = (1 - Math.cos(Math.PI * t)) / 2; // soft start and stop
  // The scene scrolls up and out; the next background follows right behind it.
  section.querySelector('.hero__scene').style.translate = `0 ${-away * 100}%`;
  section.querySelector('.hero__next').style.translate = `0 ${(1 - away) * 100}%`;
  transition.flight.setProgress(progress);
}

// Chapter 3: 0 = the big FSR facing you, 1 = turned, half sketch, labelled.
export function setReveal(section, progress) {
  transitions.get(section)?.flight.setReveal(progress);
}

// Chapter 4: 0 = as chapter 3 left it, 1 = fully drawn, flat, on the right, texts on the left.
export function setSettle(section, progress) {
  transitions.get(section)?.flight.setSettle(progress);
}

// How far the shoe has come apart: 0 = whole, 1 = fully separated.
export function setShoeOpening(section, progress) {
  shoeControls.get(section)?.setProgress(progress);
}

// Which path the detaching sole takes (see src/shoes/sole-moves.js).
export function setSoleMove(section, move) {
  shoeControls.get(section)?.setMove?.(move);
}
