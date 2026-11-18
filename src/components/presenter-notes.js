// Presenter mode: press P to show a small card (bottom left) with the part of
// the talk you're in, who speaks, and the talking points. Press P again to hide
// it. Off by default, so the shared link stays clean. Content lives in
// src/data/presenter-notes.js.
import './presenter-notes.css';
import { presenterNotes } from '../data/presenter-notes.js';

export function startPresenterNotes() {
  const card = document.createElement('aside');
  card.className = 'presenter-notes';
  card.hidden = true;
  card.innerHTML = `
    <p class="presenter-notes__part"></p>
    <p class="presenter-notes__speaker"></p>
    <ul class="presenter-notes__points"></ul>
    <p class="presenter-notes__sound"></p>
    <p class="presenter-notes__hint">P to hide</p>
  `;
  document.body.append(card);
  let shown = null;

  function update() {
    if (card.hidden) return;
    const scenes = [...document.querySelectorAll('[data-scene]')];
    const here = scenes.findLast((el) => el.getBoundingClientRect().top <= window.innerHeight / 2) ?? scenes[0];
    const note = presenterNotes.find((n) => n.scenes.includes(here?.dataset.scene));
    // The movement scene says which sound goes with the current "Yes, and…" offer.
    const sound = card.querySelector('.presenter-notes__sound');
    sound.textContent = here?.dataset.sound ? `Sound: ${here.dataset.sound}` : '';
    if (!note || note === shown) return;
    shown = note;
    card.querySelector('.presenter-notes__part').textContent = note.part;
    card.querySelector('.presenter-notes__speaker').textContent = note.speaker;
    const list = card.querySelector('.presenter-notes__points');
    list.replaceChildren(
      ...note.points.map((point) => {
        const li = document.createElement('li');
        li.textContent = point;
        return li;
      }),
    );
  }

  window.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() !== 'p' || event.metaKey || event.ctrlKey || event.altKey) return;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;
    card.hidden = !card.hidden;
    shown = null;
    update();
  });
  window.addEventListener('scroll', update, { passive: true });
}
