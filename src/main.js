// Entry point: assembles the page from section modules, then starts the effects.
import './styles/base.css';

import { createParallax } from './core/parallax.js';
import { hero } from './sections/hero.js';

// Add new sections here, in page order. Each one returns a DOM element.
const sections = [hero];

const app = document.querySelector('#app');
sections.forEach((section) => app.append(section()));

createParallax();
