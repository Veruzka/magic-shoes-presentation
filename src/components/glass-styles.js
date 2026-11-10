// Glass looks for the Style lab card — switch between them with its "Glass" row.
//
//   frosted  smooth frosted glass: blur, fine grain, light-catching rim
//   dimpled  hammered "lens" glass: a grid of tiny round bumps. Every browser
//            shows the bumps' highlights; Chrome-based browsers (Chrome, Edge,
//            Arc) also bend the background through each bump like a real lens.
//
// The look itself lives in option-switcher.css (.switcher-panel--dimpled) and
// the bump size / strength in src/styles/base.css (--dimple-*).

export const glassStyles = [
  { id: 'dimpled', label: 'Dimpled' },
  { id: 'frosted', label: 'Frosted' },
];

// Lens strength: how far each bump bends what's behind it (in pixels).
const LENS_STRENGTH = 24;

// Gives the card a glass look.
export function setGlassStyle(card, style) {
  card.classList.toggle('switcher-panel--dimpled', style.id === 'dimpled');
  if (style.id === 'dimpled' && bendsBackground()) {
    addLensFilter();
    card.classList.add('can-bend');
  }
}

// Only Chromium-based browsers can bend the background through an SVG filter.
function bendsBackground() {
  return Boolean(navigator.userAgentData?.brands?.some((b) => b.brand === 'Chromium'));
}

// The lens filter: a tile with one round lens, repeated across the card. Inside
// each lens, red runs left→right and green top→bottom, which tells the browser
// to shift what's behind it — that shift is what makes each bump magnify.
function addLensFilter() {
  if (document.getElementById('dimpled-glass')) return;
  const size = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--dimple-size')) || 10;
  const tile = `
    <svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>
      <linearGradient id='h'><stop offset='0' stop-color='rgb(0,128,0)'/><stop offset='1' stop-color='rgb(255,128,0)'/></linearGradient>
      <linearGradient id='v' x2='0' y2='1'><stop offset='0' stop-color='rgb(0,0,0)'/><stop offset='1' stop-color='rgb(0,255,0)'/></linearGradient>
      <rect width='100%' height='100%' fill='rgb(128,128,0)'/>
      <circle cx='50%' cy='50%' r='48%' fill='url(#h)'/>
      <circle cx='50%' cy='50%' r='48%' fill='url(#v)' style='mix-blend-mode:screen'/>
    </svg>`;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:absolute;width:0;height:0';
  svg.innerHTML = `
    <filter id="dimpled-glass" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feImage href="data:image/svg+xml,${encodeURIComponent(tile)}" width="${size}" height="${size}" result="lens"/>
      <feTile in="lens" result="lenses"/>
      <feDisplacementMap in="SourceGraphic" in2="lenses" scale="${LENS_STRENGTH}"
        xChannelSelector="R" yChannelSelector="G"/>
    </filter>`;
  document.body.append(svg);
}
