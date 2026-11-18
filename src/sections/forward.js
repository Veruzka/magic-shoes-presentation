// "What's next": the two concrete next steps, in one short pinned scene.
// The headline is there from the start; the two steps come in one per arrow
// key stop (p = 0.5 for the first, p = 1 for the second).
//
//   page.append(forward());
//
// Visitors who prefer reduced motion get fades only.
import '../styles/forward.css';
import { scene, calmMotion, slice, ease, lerp } from '../core/scene.js';
import { todoTag } from '../components/todo-tag.js';

const nextSteps = [
  { title: 'Shoe development', sub: 'A full pair for each player, one FSR and one gyro per shoe.' },
  { title: 'Sound development', sub: 'Our own sound-effect library for each move.' },
];

export function forward() {
  const { section, stage, onProgress } = scene({ name: 'forward', length: 1, stops: 3 });
  stage.classList.add('tt-forward__stage');

  stage.innerHTML = `
    <div class="tt-forward__inner">
      <header class="tt-forward__head">
        <h2 class="tt-headline tt-forward__headline">What's next</h2>
        <p class="tt-line tt-forward__line">Two concrete steps.</p>
      </header>
      <ol class="tt-forward__points">
        ${nextSteps
          .map(
            (s) => `
        <li class="tt-forward__point">
          <h3 class="tt-forward__title">${s.title}</h3>
          <p class="tt-forward__sub">${s.sub}</p>
        </li>`,
          )
          .join('')}
      </ol>
      <p class="tt-forward__todo"></p>
    </div>
  `;

  // TODO: add a timeline and who owns each step.
  const todo = stage.querySelector('.tt-forward__todo');
  todo.append(todoTag('timeline and owners'));

  const points = [...stage.querySelectorAll('.tt-forward__point')];
  const calm = calmMotion();

  onProgress((p) => {
    // Step 1 comes in on the way to the middle stop (0.1 → 0.45),
    // step 2 on the way to the last stop (0.6 → 0.95).
    points.forEach((point, i) => {
      const t = ease(slice(p, 0.1 + i * 0.5, 0.45 + i * 0.5));
      point.style.opacity = String(t);
      point.style.transform = calm ? 'none' : `translateY(${lerp(28, 0, t)}px)`;
    });
    // The TODO sticker shows up with the second step.
    todo.style.opacity = String(ease(slice(p, 0.75, 0.95)));
  });

  return section;
}
