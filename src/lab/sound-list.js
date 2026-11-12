// The sounds parts list in the right column, under the movements. Click a row to
// pick the sound; the ▶ at the row's right edge plays it once (at its `preview`
// values). Only active sounds get a ▶. Illustrator review: an outlined ink
// triangle that fills while the sound rings, with a hairline running under the row.
import { sounds } from './data/sounds.js';
import { labState } from './lab-state.js';
import { play, warmUp } from './lab-sound.js';

export function soundList() {
  const element = document.createElement('section');
  element.className = 'lab-list lab-list--sounds';
  element.innerHTML = '<h2 class="lab-list__title">Sounds</h2>';
  const list = document.createElement('ol');
  list.className = 'lab-list__items';

  const rows = sounds.map((sound, i) => {
    const item = document.createElement('li');
    item.className = 'lab-sound';
    const pick = document.createElement('button');
    pick.type = 'button';
    pick.className = 'lab-list__item';
    pick.innerHTML = `
      <span class="lab-list__number">${String(i + 1).padStart(2, '0')}</span>
      <span class="lab-list__name">${sound.name}</span>
      <span class="lab-list__meta">${sound.type === 'held' ? 'Held' : 'Hit'} · ${sound.source === 'synth' ? 'Made in code' : 'Recorded'}</span>
      ${sound.status === 'soon' ? '<span class="lab-list__soon">Soon</span>' : ''}`;
    item.append(pick);
    if (sound.status === 'soon') {
      pick.disabled = true;
    } else {
      pick.addEventListener('click', () => labState.pickSound(sound.id));
      const playButton = document.createElement('button');
      playButton.type = 'button';
      playButton.className = 'lab-sound__play';
      playButton.setAttribute('aria-label', `Play ${sound.name}`);
      playButton.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5 L13 8 L4 13.5 Z" /></svg>';
      playButton.addEventListener('pointerenter', warmUp);
      playButton.addEventListener('focus', warmUp);
      playButton.addEventListener('click', () => {
        play(sound.id);
        // Restart the "playing" look even if it's still showing from the last click.
        item.classList.remove('is-playing');
        void item.offsetWidth;
        item.style.setProperty('--ring', `${sound.seconds ?? 1.5}s`);
        item.classList.add('is-playing');
      });
      item.addEventListener('animationend', (event) => {
        if (event.animationName === 'lab-ring') item.classList.remove('is-playing');
      });
      item.append(playButton);
    }
    list.append(item);
    return { sound, pick };
  });
  element.append(list);

  // Load Tone.js quietly once the page has settled, so the first ▶ is quick.
  (window.requestIdleCallback ?? ((fn) => setTimeout(fn, 2000)))(() => warmUp());

  function draw() {
    for (const { sound, pick } of rows) {
      if (sound.status !== 'soon') pick.setAttribute('aria-pressed', String(labState.sound() === sound.id));
    }
  }
  labState.onChange(draw);
  draw();
  return element;
}
