// Drive the page like slides: arrow keys, space and Page Up/Down jump to the
// next or previous "stop". Every element with data-scene is a scene; a scene
// with data-stops="3" has three stops spread evenly through its scrolling.
// Home and End jump to the very start and end.
const NEXT = new Set(['ArrowDown', 'ArrowRight', 'PageDown', ' ']);
const PREV = new Set(['ArrowUp', 'ArrowLeft', 'PageUp']);

function allStops() {
  const stops = [];
  document.querySelectorAll('[data-scene]').forEach((el) => {
    const top = el.getBoundingClientRect().top + window.scrollY;
    const distance = Math.max(el.offsetHeight - window.innerHeight, 0);
    const count = Math.max(Number(el.dataset.stops) || 1, 1);
    for (let k = 0; k < count; k += 1) {
      stops.push(Math.round(top + (count === 1 ? 0 : (distance * k) / (count - 1))));
    }
  });
  return stops.sort((a, b) => a - b);
}

export function startKeyboardNav() {
  window.addEventListener('keydown', (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const tag = event.target.tagName;
    if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(tag)) return;
    const back = PREV.has(event.key) || (event.key === ' ' && event.shiftKey);
    const forward = !back && NEXT.has(event.key);
    if (!back && !forward && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();

    const stops = allStops();
    const here = window.scrollY;
    let target;
    if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = document.documentElement.scrollHeight;
    else if (forward) target = stops.find((s) => s > here + 4) ?? document.documentElement.scrollHeight;
    else target = [...stops].reverse().find((s) => s < here - 4) ?? 0;

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: target, behavior: calm ? 'auto' : 'smooth' });
  });
}
