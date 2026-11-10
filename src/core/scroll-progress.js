// Tells you how far you've scrolled through an element, as a number:
//   0 = its top has just reached the top of the screen
//   1 = you've scrolled to its end (its bottom reaches the bottom of the screen)
// Scrolling back up runs the numbers backwards, so anything driven by it reverses.

export function watchScrollProgress(element, onProgress) {
  let ticking = false;

  function update() {
    ticking = false;
    const rect = element.getBoundingClientRect();
    const distance = rect.height - window.innerHeight; // how far there is to scroll
    const progress = distance > 0 ? Math.min(Math.max(-rect.top / distance, 0), 1) : 0;
    onProgress(progress);
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  update();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);

  return {
    // Call after the element changes size (e.g. a different shoe was picked).
    refresh: update,
    stop() {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    },
  };
}
