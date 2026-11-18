// Section 1 of the Twinkle Toes story, "The concept": one intro screen that
// says what this is right away, then one scene per movement (walk, run, spin,
// and the whimsy ones). The movements come from src/data/story-movements.js,
// so adding one there adds a scene here with no other change.
//
//   page.append(conceptMovements());
//
// Returns one wrapper (<div class="tt-moves">) holding all the scenes.
import '../styles/concept-movements.css';
import { scene, calmMotion, slice, ease, lerp } from '../core/scene.js';
import { storyMovements } from '../data/story-movements.js';
import { movementScene } from '../components/movement-scene.js';
import { todoTag } from '../components/todo-tag.js';

export function conceptMovements() {
  const wrapper = document.createElement('div');
  wrapper.className = 'tt-moves';

  wrapper.append(conceptIntro());

  storyMovements.forEach((movement, i) => {
    const { section } = movementScene(movement);
    // After the last basic movement, flag that more basic ones are coming.
    const isLastBasic = movement.group === 'basic' && storyMovements[i + 1]?.group !== 'basic';
    if (isLastBasic) {
      // TODO: more basic movements after the Kimney meeting (add them to src/data/story-movements.js).
      section.querySelector('.tt-move__text').append(todoTag('more basic movements after the Kimney meeting'));
    }
    wrapper.append(section);
  });

  return wrapper;
}

// The intro screen: the big promise in two words, and one line under it.
// It drifts up a little and the line settles in as you scroll on.
function conceptIntro() {
  const { section, stage, onProgress } = scene({
    name: 'concept',
    length: 0.6,
    stops: 1,
    className: 'tt-moves__intro',
  });
  stage.innerHTML = `
    <div class="tt-moves__intro-text">
      <p class="tt-eyebrow">The concept</p>
      <h2 class="tt-headline tt-moves__title">
        <span>Stories!</span>
        <span>Movement!</span>
      </h2>
      <p class="tt-line">Every move you make becomes a sound. Two players, one story they make up together.</p>
    </div>
  `;

  if (calmMotion()) return section; // reduced motion: stays still

  const block = stage.querySelector('.tt-moves__intro-text');
  const [first, second] = stage.querySelectorAll('.tt-moves__title span');
  onProgress((p) => {
    // The whole block drifts up; the two words drift apart a touch, like a step.
    const t = ease(slice(p, 0, 1));
    block.style.transform = `translateY(${lerp(0, -6, t)}vh)`;
    first.style.transform = `translateX(${lerp(0, -1.5, t)}vw)`;
    second.style.transform = `translateX(${lerp(0, 1.5, t)}vw)`;
    block.style.opacity = String(1 - 0.6 * ease(slice(p, 0.75, 1)));
  });
  return section;
}
