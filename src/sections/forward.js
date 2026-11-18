// "Moving forward": what the next build adds, in one short pinned scene.
// The headline is there from the start; the three points come in one after
// another as you scroll.
//
//   page.append(forward());
//
// Visitors who prefer reduced motion get fades only.
import '../styles/forward.css';
import { scene, calmMotion, slice, ease, lerp } from '../core/scene.js';
import { todoTag } from '../components/todo-tag.js';

export function forward() {
  const { section, stage, onProgress } = scene({ name: 'forward', length: 0.8, stops: 1 });
  stage.classList.add('tt-forward__stage');

  stage.innerHTML = `
    <div class="tt-forward__inner">
      <header class="tt-forward__head">
        <p class="tt-eyebrow">Moving forward</p>
        <h2 class="tt-headline tt-forward__headline">Two players, four shoes</h2>
      </header>
      <ol class="tt-forward__points">
        <li class="tt-forward__point">Each player wears a full pair: one FSR and one gyro per shoe.</li>
        <li class="tt-forward__point">Our own sound-effect library for every world.</li>
        <li class="tt-forward__point tt-forward__point--todo"></li>
      </ol>
    </div>
  `;

  // TODO: add the next build steps and timeline here.
  stage.querySelector('.tt-forward__point--todo').append(todoTag('next build steps and timeline'));

  const points = [...stage.querySelectorAll('.tt-forward__point')];
  const calm = calmMotion();

  onProgress((p) => {
    // Each point gets its own slice of the scroll: 0.05 → 0.3, 0.25 → 0.5, 0.45 → 0.7.
    points.forEach((point, i) => {
      const t = ease(slice(p, 0.05 + i * 0.2, 0.3 + i * 0.2));
      point.style.opacity = String(t);
      point.style.transform = calm ? 'none' : `translateY(${lerp(24, 0, t)}px)`;
    });
  });

  return section;
}
