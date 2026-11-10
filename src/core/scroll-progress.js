// Tells you how far you've scrolled through an element, as a number:
//   0 = its top has just reached the top of the screen
//   1 = you've scrolled to its end (its bottom reaches the bottom of the screen)
// Scrolling back up runs the numbers backwards, so anything driven by it reverses.
//
// Smoothing: instead of jumping straight to the scroll position (which shows every
// mouse-wheel notch as a jolt), the number glides toward it.
//   settle  how quickly it catches up, in seconds (about 3× this to arrive fully).
//           It's measured in time, not screen refreshes, so a slow moment (e.g. the
//           browser preparing something heavy the first time) can't make it fall
//           behind and then race ahead.
//   maxLag  it never trails the real scroll by more than this share of the scroll.
// Visitors who prefer reduced motion get no smoothing, so nothing lags their scroll.

export function watchScrollProgress(element, onProgress, { settle = 0.1, maxLag = 0.15 } = {}) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let target = 0; // where the scroll actually is
  let current = 0; // what we've shown so far
  let frame = null;
  let lastTime = null;

  function measure() {
    const rect = element.getBoundingClientRect();
    const distance = rect.height - window.innerHeight; // how far there is to scroll
    return distance > 0 ? Math.min(Math.max(-rect.top / distance, 0), 1) : 0;
  }

  // One animation frame: move toward the target by an amount based on how much
  // time has passed, and keep going until we've (almost) arrived.
  function step(time) {
    frame = null;
    const seconds = lastTime === null ? 1 / 60 : Math.min((time - lastTime) / 1000, 0.25);
    lastTime = time;
    if (reduceMotion.matches) current = target;
    else current += (target - current) * (1 - Math.exp(-seconds / settle));
    // Never trail too far behind.
    if (target - current > maxLag) current = target - maxLag;
    if (current - target > maxLag) current = target + maxLag;
    if (Math.abs(target - current) < 0.0005) current = target;
    onProgress(current);
    if (current !== target) frame = requestAnimationFrame(step);
    else lastTime = null;
  }

  function requestUpdate() {
    target = measure();
    if (frame === null) frame = requestAnimationFrame(step);
  }

  // Jump straight to the right place (no gliding), e.g. on load or after a shoe switch.
  function snap() {
    target = current = measure();
    onProgress(current);
  }

  snap();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);

  return {
    // Call after the element changes size (e.g. a different shoe was picked).
    refresh: snap,
    stop() {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    },
  };
}
