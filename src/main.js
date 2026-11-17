// Entry point: assembles the page from section modules, then starts the effects.
import './styles/base.css';

import { createParallax } from './core/parallax.js';
import { loadChoice, saveChoice } from './core/remember-choice.js';
import { watchScrollProgress } from './core/scroll-progress.js';
import { hero, showBackground, showShoe, setShoeOpening, setSoleMove, setTransition, setReveal, setSettle, hasExitChapter } from './sections/hero.js';
import { chapterProgress } from './sections/hero-timeline.js';
import { backgrounds } from './backgrounds/index.js';
import { shoes } from './shoes/index.js';
import { soleMoves } from './shoes/sole-moves.js';
import { optionSwitcher, switcherPanel } from './components/option-switcher.js';
import { infoButton } from './components/info-panel.js';
import { pageSwitch } from './components/page-switch.js';

// Add new sections here, in page order. Each one returns a DOM element.
const sections = [hero];

const app = document.querySelector('#app');
sections.forEach((section) => app.append(section()));

const parallax = createParallax();

// Scrolling through the hero: chapter 1 fans the shoe open (for shoes that have
// parts), chapter 2 flies the FSR to the centre as the scene scrolls away,
// chapter 3 turns it and half of it becomes a labelled sketch, chapter 4 slides it
// into the paper, fully drawn and flat, with texts on the left.
const heroSection = app.querySelector('.hero');
const shoeOpening = watchScrollProgress(heroSection, (progress) => {
  heroSection.dataset.progress = progress.toFixed(3); // handy when debugging the motion
  const chapter = chapterProgress(progress, hasExitChapter(heroSection));
  setShoeOpening(heroSection, chapter.fan);
  setTransition(heroSection, chapter.exit);
  setReveal(heroSection, chapter.reveal);
  setSettle(heroSection, chapter.settle);
});
// When a shoe finishes preparing (it takes a moment), re-measure the scroll right away.
heroSection.addEventListener('shoe-ready', () => shoeOpening.refresh());

// Prototype tool: the "Style lab" glass card (top-right) to flip between options.
const styleLab = switcherPanel(
  'Style lab',
  optionSwitcher({
    title: 'Background',
    options: backgrounds,
    current: loadChoice('background', backgrounds),
    onPick(background) {
      showBackground(heroSection, background);
      saveChoice('background', background);
      parallax.refresh(); // pick up the new background's moving layers
    },
  }),
  optionSwitcher({
    title: 'Shoe',
    options: shoes,
    current: loadChoice('shoe', shoes),
    onPick(shoe) {
      showShoe(heroSection, shoe);
      saveChoice('shoe', shoe);
      parallax.refresh(); // the hero may have changed height
      shoeOpening.refresh(); // pose the new shoe for the current scroll position
    },
  }),
  optionSwitcher({
    title: 'Sole',
    options: soleMoves,
    current: loadChoice('sole-move', soleMoves),
    onPick(move) {
      setSoleMove(heroSection, move);
      saveChoice('sole-move', move);
    },
  }),
);
document.body.append(styleLab);

// The "i" button (bottom-right): shows how the app is built, read from docs/.
document.body.append(infoButton());

// The floating pill (bottom-right, left of "i"): jump to the prototyping lab.
document.body.append(pageSwitch({ label: 'Start prototyping →', href: `${import.meta.env.BASE_URL}lab/` }));
