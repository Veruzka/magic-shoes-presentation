// Tells you how far you've scrolled through an element, as a number:
//   0 = its top has just reached the top of the screen
//   1 = you've scrolled to its end (its bottom reaches the bottom of the screen)
// Scrolling back up runs the numbers backwards, so anything driven by it reverses.
//
// Smoothing: instead of jumping straight to the scroll position (which shows every
// mouse-wheel notch as a jolt), the number glides toward it over a few frames.
//   smoothing  how much of the remaining distance to cover each frame
//              (0.12 = soft and floaty, 1 = no smoothing). Visitors who prefer
//              reduced motion always get 1, so nothing lags behind their scroll.

export function watchScrollProgress(element, onProgress, { smoothing = 0.12 } = {}) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let target = 0; // where the scroll actually is
  let current = 0; // what we've shown so far
  let frame = null;

  function measure() {
    const rect = element.getBoundingClientRect();
    const distance = rect.height - window.innerHeight; // how far there is to scroll
    return distance > 0 ? Math.min(Math.max(-rect.top / distance, 0), 1) : 0;
  }

  // One animation frame: move part of the way toward the target, and keep
  // going until we've (almost) arrived.
  function step() {
    frame = null;
    const ease = reduceMotion.matches ? 1 : smoothing;
    current += (target - current) * ease;
    if (Math.abs(target - current) < 0.0005) current = target;
    onProgress(current);
    if (current !== target) frame = requestAnimationFrame(step);
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
