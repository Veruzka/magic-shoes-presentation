// Reusable parallax engine.
//
// Any element with a data-speed attribute moves while its section scrolls:
//   data-speed="0"    stays with the page (no parallax)
//   data-speed="0.3"  drifts slowly (feels far away)
//   data-speed="-0.2" moves the opposite way (feels close)
//
// Movement is measured from the centre of the viewport, so layers sit in
// their designed position when their section is centred on screen.

export function createParallax({ selector = '[data-speed]' } = {}) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let layers = [];
  let ticking = false;

  function collect() {
    layers = [...document.querySelectorAll(selector)].map((el) => ({
      el,
      speed: parseFloat(el.dataset.speed) || 0,
      // Measure against the parent so the layer's own transform doesn't skew it.
      anchor: el.parentElement,
    }));
  }

  function update() {
    ticking = false;
    const viewportCentre = window.innerHeight / 2;

    for (const { el, speed, anchor } of layers) {
      if (reduceMotion.matches || speed === 0) {
        el.style.transform = '';
        continue;
      }
      const rect = anchor.getBoundingClientRect();
      // Skip layers whose section is far off screen.
      if (rect.bottom < -window.innerHeight || rect.top > window.innerHeight * 2) continue;

      const offset = (rect.top + rect.height / 2 - viewportCentre) * speed;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    }
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  collect();
  update();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  reduceMotion.addEventListener('change', requestUpdate);

  // Call refresh() after adding sections dynamically.
  return {
    refresh() {
      collect();
      update();
    },
    destroy() {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      reduceMotion.removeEventListener('change', requestUpdate);
      layers.forEach(({ el }) => (el.style.transform = ''));
    },
  };
}
