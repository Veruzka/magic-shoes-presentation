// "What's next": just the headline, with the whole 3D shoe floating under it
// (see `forward` in src/data/shoe-path.js). Until 2026-11-19 it listed two next
// steps (below, set aside) with the shoe's pieces drifting in; Veruzka asked
// for the floating shoe only.
//
//   page.append(forward());
import '../styles/forward.css';
import { scene } from '../core/scene.js';

// Set aside: the two next steps that used to come in one per arrow-key stop.
// To show them again, see this file's git history (commit before 2026-11-19's
// "What's next: floating shoe only").
export const nextSteps = [
  { title: 'Shoe development', sub: 'A full pair for each player, one FSR and one gyro per shoe.' },
  { title: 'Sound development', sub: 'Our own sound-effect library for each move.' },
];

export function forward() {
  const { section, stage } = scene({ name: 'forward', length: 1, stops: 1 });
  stage.classList.add('tt-forward__stage');
  stage.innerHTML = `
    <div class="tt-forward__inner tt-forward__inner--shoe">
      <h2 class="tt-headline tt-forward__headline">What's next</h2>
    </div>
  `;
  return section;
}
