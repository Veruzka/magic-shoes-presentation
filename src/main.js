// Entry point: assembles the page from section modules, then starts the effects.
import './styles/base.css';

import { createParallax } from './core/parallax.js';
import { loadChoice, saveChoice } from './core/remember-choice.js';
import { watchScrollProgress } from './core/scroll-progress.js';
import { hero, showBackground, showShoe, setShoeOpening, setSoleMove, setTransition, setReveal, setSettle, hasExitChapter } from './sections/hero.js';
import { chapterProgress } from './sections/hero-timeline.js';
import { backgrounds } from './backgrounds/index.js';
import { shoes, startShoe } from './shoes/index.js';
import { soleMoves } from './shoes/sole-moves.js';
import { optionSwitcher, switcherPanel } from './components/option-switcher.js';
import { infoButton } from './components/info-panel.js';
import { pageSwitch } from './components/page-switch.js';
import { startKeyboardNav } from './core/keyboard-nav.js';
import { shoeStage } from './three/shoe-stage.js';
import { startShoeDirector } from './three/shoe-director.js';
import { startPresenterNotes } from './components/presenter-notes.js';
import { ttHero } from './sections/tt-hero.js';
import { conceptMovements } from './sections/concept-movements.js';
import { mvpDoes } from './sections/mvp-does.js';
import { builtShoeParts, builtParts } from './sections/built-parts.js';
import { process as processSection } from './sections/process.js';
import { forward } from './sections/forward.js';
import { close } from './sections/close.js';

// Add new sections here, in page order. Each one returns a DOM element.
// The Twinkle Toes story: concept first, then what we've built, then the process.
const sections = [
  ttHero, // "Once upon a step", the floating 3D shoe, and the paper forest rising behind them
  conceptMovements, // the two players, one arrow stop per movement ("Stories! Movement!" intro set aside)
  mvpDoes, // what the MVP does: walk and run, spin, whimsy moves (one arrow stop each)
  builtShoeParts, // "What we've built": the 3D shoe breaks apart, each part labeled
  // hero: Veruzka's "Magic Shoes" story and FSR breakdown, set aside 2026-11-19
  // (see heroSection below): "Music Sampling Shoes" follows "Inside each shoe".
  builtParts, // the MVP, photos, what's next, takeaways
  processSection, // the timeline and the bodystorm grid
  forward,
  close,
];

const app = document.querySelector('#app');
sections.forEach((section) => app.append(section()));

const parallax = createParallax();

// Scrolling through the hero: chapter 1 fans the shoe open (for shoes that have
// parts), chapter 2 flies the FSR to the centre as the scene scrolls away,
// chapter 3 turns it and half of it becomes a labelled sketch, chapter 4 slides it
// into the paper, fully drawn and flat, with texts on the left.
// Veruzka's "Magic Shoes" story (big title on its background, then the FSR
// breakdown: "What's an FSR", "What does it do in the shoe") is set aside: built
// but not put on the page, so the Style lab's switches still have something to
// drive and nothing breaks. To bring it back, add `hero` to `sections` after
// `builtShoeParts` and change this line back to `app.querySelector('.hero')`.
const heroSection = hero();
// The keyboard navigation treats the hero as one scene with a stop per chapter.
heroSection.dataset.scene = 'built-inside';
heroSection.dataset.stops = '5';
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
    current: loadChoice('shoe', shoes, startShoe), // the Sketch (see src/shoes/index.js)
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

// Arrow keys, space and Page Up/Down jump scene to scene, like slides.
startKeyboardNav();

// The one 3D shoe that travels through the story (path: src/data/shoe-path.js).
const shoe = shoeStage();
document.body.append(shoe.element);
startShoeDirector(shoe);

// Presenter mode: press P for who speaks and the talking points.
startPresenterNotes();

// The "i" button (bottom-right): shows how the app is built, read from docs/.
document.body.append(infoButton());

// The floating pill (bottom-right, left of "i"): jump to the prototyping lab.
document.body.append(pageSwitch({ label: 'Start prototyping →', href: `${import.meta.env.BASE_URL}lab/` }));
