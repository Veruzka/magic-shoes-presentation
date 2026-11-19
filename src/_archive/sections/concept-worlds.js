// "The world changes": one pinned scene that walks through the four worlds
// made of sound (Sky, Lava, Forest, Water) and ends back home.
//
// While you're in a world, the pair of shoes taps along as you scroll and the
// world's three sound words and sound ripples show, all in that world's colors.
// Between worlds comes a "double stomp": both shoes lift, drop together and hit,
// a flash and a ring go off, and the background, shoe tint and ink change.
// The last change is a heel click instead, and the cream page color returns.
//
// The arrow keys stop at 0, 0.25, 0.5, 0.75 and 1 of the scroll (stops: 5),
// and each of those is a calm moment: Sky, Lava, Forest, Water, Home.
// Everything moves from the scroll position only (no timers).
// Visitors who prefer reduced motion get cross-fades only (no lifts or drops).
import '../styles/concept-worlds.css';
import { scene, calmMotion, slice, ease, lerp, clamp01 } from '../core/scene.js';
import { worlds } from '../data/worlds.js';
import { soundRipples } from '../components/sound-ripples.js';
import { todoTag } from '../components/todo-tag.js';
import shoeUrl from '../assets/shoe-sketch.png';

// Timing, as parts of the whole scroll (0 to 1).
const STOP = 0.25; // distance between two keyboard stops (one per world, then home)
const CHANGE_START = 0.08; // the change starts this far after a stop...
const CHANGE_LENGTH = 0.13; // ...and takes this long, so it is done before the next stop
const HIT = 0.6; // the moment the shoes hit, as part of one change (0 to 1)
const TAP_EVERY = 0.025; // one shoe tap per this much scrolling, while in a world

// The calm "back home" state at the end, after the four worlds.
const HOME = {
  id: 'home',
  name: 'Home',
  background: null, // filled in with the page's cream color (--color-bg)
  ink: '#3b3023',
  shoeFilter: 'none',
  sounds: [],
};

const WORLD_LINE = 'Same moves, new sounds.';
const HOME_LINE = 'Heel click: back home.';

export function conceptWorlds() {
  const { section, stage, onProgress } = scene({ name: 'worlds', length: 4, stops: 5, className: 'tt-worlds' });
  const states = [...worlds, HOME];

  stage.innerHTML = `
    <div class="tt-worlds__flash" aria-hidden="true"></div>
    <div class="tt-worlds__layout">
      <div class="tt-worlds__text">
        <p class="tt-eyebrow tt-worlds__eyebrow">The world changes</p>
        <h2 class="tt-headline tt-worlds__name"></h2>
        <p class="tt-line tt-worlds__line"></p>
      </div>

      <div class="tt-worlds__floor">
        <div class="tt-worlds__pair">
          <div class="tt-worlds__ring" aria-hidden="true"></div>
          <span class="tt-worlds__hit-word" aria-hidden="true"></span>
          <div class="tt-worlds__shoe tt-worlds__shoe--left"></div>
          <div class="tt-worlds__shoe tt-worlds__shoe--right"></div>
        </div>
      </div>

      <ul class="tt-worlds__sounds"></ul>

      <div class="tt-worlds__foot">
        <p class="tt-worlds__caption">Both players stomp together within a quarter second: they swap sounds and move to the next world.</p>
        <p class="tt-worlds__note">Play is open-ended. No winner, just play.</p>
        <div class="tt-worlds__todo"></div>
      </div>
    </div>
  `;

  // TODO: real sound files per world, muted until the viewer clicks an unmute toggle.
  stage.querySelector('.tt-worlds__todo').append(todoTag('real world sounds, muted until unmute'));

  const $ = (selector) => stage.querySelector(selector);
  const name = $('.tt-worlds__name');
  const line = $('.tt-worlds__line');
  const flash = $('.tt-worlds__flash');
  const ring = $('.tt-worlds__ring');
  const hitWord = $('.tt-worlds__hit-word');
  const caption = $('.tt-worlds__caption');
  const note = $('.tt-worlds__note');
  const soundList = $('.tt-worlds__sounds');
  const pair = $('.tt-worlds__pair');

  // Each shoe holds one tinted copy per state, stacked, so the tint can cross-fade.
  // The right shoe is mirrored (in the CSS), so the two heels face each other.
  const shoes = ['left', 'right'].map((side) => {
    const shoe = $(`.tt-worlds__shoe--${side}`);
    const layers = states.map((state) => {
      const img = document.createElement('img');
      img.className = 'tt-worlds__shoe-img';
      img.src = shoeUrl;
      img.alt = '';
      img.draggable = false;
      img.style.filter = state.shoeFilter;
      shoe.append(img);
      return img;
    });
    return { shoe, layers, side };
  });

  // Sound ripples between the heels, where the pressure sensor sits.
  const ripples = soundRipples();
  ripples.element.classList.add('tt-worlds__ripples');
  pair.prepend(ripples.element);

  // Three word slots, refilled when the world changes.
  const words = [0, 1, 2].map(() => {
    const li = document.createElement('li');
    li.className = 'tt-worlds__sound';
    soundList.append(li);
    return li;
  });

  const calm = calmMotion();
  let shown = -1; // which state's words are on screen right now

  // How far the heels slide toward each other for the final heel click.
  // Measured once, and again when the window changes size.
  let heelGap = 0;
  const measure = () => {
    const [left, right] = shoes.map((s) => s.shoe);
    heelGap = right.offsetLeft - (left.offsetLeft + left.offsetWidth) + left.offsetWidth * 0.08;
  };
  window.addEventListener('resize', measure);

  function showState(index) {
    if (index === shown) return;
    shown = index;
    const state = states[index];
    name.textContent = state.name;
    line.textContent = state.id === 'home' ? HOME_LINE : WORLD_LINE;
    words.forEach((li, i) => {
      li.textContent = state.sounds[i] ?? '';
    });
  }

  onProgress((p) => {
    if (HOME.background === null) {
      HOME.background = getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim() || '#fbfaf8';
      measure();
    }

    // Where are we? Either resting in one state (from === to), or in the
    // change from one state to the next, with t going 0 to 1.
    const k = Math.min(Math.floor(p / STOP), states.length - 1);
    const local = p - k * STOP;
    let from = k;
    let to = k;
    let t = 0;
    if (k < states.length - 1 && local >= CHANGE_START) {
      const done = (local - CHANGE_START) / CHANGE_LENGTH;
      if (done < 1) {
        to = k + 1;
        t = clamp01(done);
      } else {
        from = k + 1; // the change is over: resting in the next state
        to = k + 1;
      }
    }
    const changing = from !== to;
    const isHeelClick = changing && to === states.length - 1;

    // Colors: blend quickly just after the hit, hidden by the flash.
    const mix = changing ? ease(slice(t, HIT - 0.02, HIT + 0.2)) : 0;
    const a = states[from];
    const b = states[to];
    const ink = mixColor(a.ink, b.ink, mix);
    stage.style.background = mixColor(a.background ?? HOME.background, b.background ?? HOME.background, mix);
    stage.style.color = ink;
    ripples.element.style.setProperty('--ripple-color', ink);
    shoes.forEach(({ layers }) => {
      layers.forEach((img, j) => {
        let o = 0;
        if (j === from) o = 1 - mix;
        if (j === to) o = changing ? mix : 1;
        img.style.opacity = String(o);
      });
    });

    // Text: the old name fades out, swaps at the hit, the new one fades in.
    showState(changing && t >= HIT ? to : from);
    const textIn = !changing ? 1 : t < HIT ? 1 - ease(slice(t, 0.3, 0.55)) : ease(slice(t, 0.68, 0.95));
    name.style.opacity = String(textIn);
    line.style.opacity = String(textIn);
    words.forEach((li, i) => {
      const o = !changing ? 1 : t < HIT ? 1 - slice(t, 0, 0.3) : slice(t, 0.7 + i * 0.08, 0.82 + i * 0.08);
      li.style.opacity = String(o);
    });

    // The stomp caption shows through the worlds; the home note takes over at the end.
    const homeIn = to === states.length - 1 ? (changing ? slice(t, 0.7, 1) : 1) : 0;
    caption.style.opacity = String(1 - (isHeelClick ? slice(t, 0.2, 0.5) : homeIn));
    note.style.opacity = String(homeIn);

    // Taps while resting in a world: left and right shoe take turns.
    // They calm down at the start of a change and come back at the end.
    const atHome = to === states.length - 1;
    let tapsOn = atHome ? 0 : 1;
    if (changing) tapsOn = Math.max(1 - slice(t, 0, 0.12), atHome ? 0 : slice(t, 0.88, 1));
    const wave = Math.sin((p / TAP_EVERY) * Math.PI * 2);
    const tapLeft = Math.max(wave, 0) * tapsOn;
    const tapRight = Math.max(-wave, 0) * tapsOn;

    // The stomp: lift (toes up a little), then drop fast and hit at HIT.
    const height = stage.clientHeight || window.innerHeight;
    const liftMax = height * (isHeelClick ? 0.05 : 0.1);
    let lift = 0;
    if (changing) {
      lift = t < 0.45 ? ease(slice(t, 0.1, 0.45)) : 1 - slice(t, 0.45, HIT) ** 2;
    }
    const squash = changing ? Math.sin(Math.PI * slice(t, HIT, HIT + 0.12)) : 0;
    const inward = isHeelClick ? ease(slice(t, 0.2, HIT)) : 0;

    shoes.forEach(({ shoe, side }) => {
      if (calm) {
        shoe.style.transform = 'none';
        return;
      }
      const dir = side === 'left' ? 1 : -1; // the right shoe mirrors every move
      const tap = side === 'left' ? tapLeft : tapRight;
      const y = -lift * liftMax - tap * 12;
      const x = inward * (heelGap / 2) * dir;
      const tilt = (lift * 6 + tap * 4) * dir; // toe up, heel down
      shoe.style.transform = `translate(${x}px, ${y}px) rotate(${tilt}deg) scale(${1 + squash * 0.04}, ${1 - squash * 0.06})`;
    });

    // The hit: a white flash over everything, a ring from the heels, a word.
    const hitOn = changing && t >= HIT - 0.03;
    flash.style.opacity = String(hitOn ? (isHeelClick ? 0.35 : 0.6) * (1 - slice(t, HIT, HIT + 0.2)) : 0);
    const ringT = slice(t, HIT, HIT + 0.25);
    ring.style.opacity = String(hitOn && t >= HIT ? 1 - ringT : 0);
    ring.style.transform = calm ? 'translate(-50%, -50%) scale(1.2)' : `translate(-50%, -50%) scale(${lerp(0.3, isHeelClick ? 1.4 : 2.6, ease(ringT))})`;
    const hitText = isHeelClick ? 'Heel click' : 'Double stomp';
    if (hitWord.textContent !== hitText) hitWord.textContent = hitText;
    hitWord.style.opacity = String(changing ? slice(t, HIT - 0.04, HIT) * (1 - slice(t, HIT + 0.15, HIT + 0.3)) : 0);

    // Sound ripples: follow the taps while resting, burst at the hit.
    const burst = changing && t >= HIT ? 1 - slice(t, HIT, HIT + 0.3) : 0;
    const level = Math.max((0.3 + 0.7 * Math.max(tapLeft, tapRight)) * tapsOn, burst);
    ripples.set(level, (p * 10) % 1);
  });

  return section;
}

// Blends two "#rrggbb" colors; t = 0 gives the first, 1 the second.
function mixColor(a, b, t) {
  const ca = toRgb(a);
  const cb = toRgb(b);
  const c = ca.map((v, i) => Math.round(lerp(v, cb[i], t)));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

function toRgb(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((x) => x + x).join('') : h;
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return [251, 250, 248]; // cream, if the color can't be read
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
