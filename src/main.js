// Entry point: assembles the page from section modules, then starts the effects.
import './styles/base.css';

import { createParallax } from './core/parallax.js';
import { loadChoice, saveChoice } from './core/remember-choice.js';
import { watchScrollProgress } from './core/scroll-progress.js';
import { hero, showBackground, showShoe, setShoeOpening, setSoleMove } from './sections/hero.js';
import { backgrounds } from './backgrounds/index.js';
import { shoes } from './shoes/index.js';
import { soleMoves } from './shoes/sole-moves.js';
import { optionSwitcher, switcherPanel } from './components/option-switcher.js';
import { infoButton } from './components/info-panel.js';
import { glassStyles, setGlassStyle } from './components/glass-styles.js';

// Add new sections here, in page order. Each one returns a DOM element.
const sections = [hero];

const app = document.querySelector('#app');
sections.forEach((section) => app.append(section()));

const parallax = createParallax();

// Scrolling through the hero fans the shoe open (for shoes that have parts).
const heroSection = app.querySelector('.hero');
const shoeOpening = watchScrollProgress(heroSection, (progress) =>
  setShoeOpening(heroSection, progress),
);

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
  optionSwitcher({
    title: 'Glass',
    options: glassStyles,
    current: loadChoice('glass', glassStyles),
    onPick(style) {
      setGlassStyle(styleLab, style);
      saveChoice('glass', style);
    },
  }),
);
setGlassStyle(styleLab, loadChoice('glass', glassStyles));
document.body.append(styleLab);

// The "i" button (bottom-right): shows how the app is built, read from docs/.
document.body.append(infoButton());
