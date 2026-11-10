// The FSR as a technical line drawing (like an exploded-view illustration):
// fine warm-ink outlines, double lines for thickness, light hatching for shade,
// and one part in red. Drawn as crisp vector lines on top of the straight-on
// render, in the render's own pixels, so the two halves line up exactly.
//
// shape   the parts' measurements (src/shoes/sketch-sensor.js → front.shape)
// ink     line colours and weights (src/shoes/fsr-reveal.js → ink)
// width, height   the render image's size in pixels
const SVG = 'http://www.w3.org/2000/svg';

export function fsrSketch(shape, ink, width, height) {
  const svg = make('svg', { viewBox: `0 0 ${width} ${height}`, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
  svg.classList.add('fsr-sketch');
  const line = (d, weight = ink.line, colour = ink.colour) => svg.append(make('path', { d, stroke: colour, 'stroke-width': weight }));
  const { pad, ring, reach, tail, collar, block } = shape;
  const red = (part) => (ink.accentPart === part ? ink.accent : ink.colour);

  // --- The pad: outer edge, a bevel just inside it, shade on its lower right.
  line(ellipse(pad.cx, pad.cy, pad.rx, pad.ry));
  line(ellipse(pad.cx, pad.cy, pad.rx - 11, pad.ry - 11), ink.fine);
  const rimBand = `${ellipse(pad.cx, pad.cy, pad.rx - 11, pad.ry - 11)} ${ellipse(ring.cx, ring.cy, ring.r + ring.width, ring.r + ring.width)}`;
  hatch(svg, ink, rimBand, pad.cx + 40, pad.cy + 20, pad.cx + pad.rx, pad.cy + pad.ry);

  // The ring around the lines: a double line (the red accent, by default).
  line(ellipse(ring.cx, ring.cy, ring.r + ring.width / 2, ring.r + ring.width / 2), ink.line, red('ring'));
  line(ellipse(ring.cx, ring.cy, ring.r - ring.width / 2, ring.r - ring.width / 2), ink.fine, red('ring'));

  // The electrode lines: slender loops, each running as far as the oval allows.
  const halfReach = (x) => reach.b * Math.sqrt(Math.max(0, 1 - ((x - pad.cx) / reach.a) ** 2));
  for (const [x1, x2] of shape.loops) {
    const h = halfReach((x1 + x2) / 2);
    const r = (x2 - x1) / 2;
    line(`M${x1},${reach.cy - h + r} V${reach.cy + h - r} A${r},${r} 0 0 0 ${x2},${reach.cy + h - r} V${reach.cy - h + r} A${r},${r} 0 0 0 ${x1},${reach.cy - h + r} Z`, ink.fine * 1.15);
  }
  for (const x of shape.singles) {
    const h = halfReach(x);
    line(`M${x},${reach.cy - h} V${reach.cy + h}`, ink.fine * 1.15);
  }

  // --- The tail: clear film with thick glass edges, curving out of the pad.
  const neckX = (side) => pad.cx + side * pad.rx * Math.sqrt(Math.max(0, 1 - ((tail.neck - pad.cy) / pad.ry) ** 2));
  line(`M${tail.left},${collar.top} V${tail.neck + 30} Q${tail.left},${tail.neck + 4} ${neckX(-1)},${tail.neck}`);
  line(`M${tail.right},${collar.top} V${tail.neck + 30} Q${tail.right},${tail.neck + 4} ${neckX(1)},${tail.neck}`);
  line(`M${tail.left + tail.glass},${collar.top} V${tail.neck + 34}`, ink.fine);
  line(`M${tail.right - tail.glass},${collar.top} V${tail.neck + 34}`, ink.fine);
  // Glass shade: short strokes along the right edge.
  for (let y = tail.neck + 40; y < collar.top - 6; y += ink.hatchGap * 1.6) {
    line(`M${tail.right - tail.glass + 1.5},${y + 6} L${tail.right - 1.5},${y}`, ink.hatch);
  }

  // The two silver traces: from the ring down to the tab.
  const traceTop = ring.cy + ring.r - 2;
  for (const [x1, x2] of shape.traces) {
    line(`M${x1},${traceTop} V${collar.top}`, ink.fine, red('traces'));
    line(`M${x2},${traceTop} V${collar.top}`, ink.fine, red('traces'));
  }

  // --- The connector: a collar, a block, two crimp windows and two pins.
  line(roundedRect(collar.left, collar.top, collar.right - collar.left, collar.bottom - collar.top, 5));
  line(`M${collar.left + 6},${collar.top + 8} H${collar.right - 6}`, ink.fine);
  line(roundedRect(block.left, block.top, block.right - block.left, block.bottom - block.top, 3));
  hatch(svg, ink, roundedRect(block.left, block.top, block.right - block.left, block.bottom - block.top, 3), block.right - 34, block.top, block.right, block.bottom);
  for (const [x1, x2] of shape.pins) {
    const w = x2 - x1;
    line(roundedRect(x1 + 1, collar.top + 18, w - 2, 24, 2), ink.fine);
    line(`M${x1},${block.bottom} V${shape.pinEnd - w / 2} A${w / 2},${w / 2} 0 0 0 ${x2},${shape.pinEnd - w / 2} V${block.bottom}`);
    line(`M${x1 + w * 0.3},${block.bottom + 8} V${shape.pinEnd - w}`, ink.fine); // highlight
  }
  return svg;
}

// Diagonal shading strokes inside `area` (a path), only within the box x1,y1 → x2,y2.
function hatch(svg, ink, area, x1, y1, x2, y2) {
  const id = `hatch-${Math.random().toString(36).slice(2, 8)}`;
  const clip = make('clipPath', { id });
  clip.append(make('path', { d: area, 'clip-rule': 'evenodd' }));
  const group = make('g', { 'clip-path': `url(#${id})` });
  let d = '';
  for (let x = x1 - (y2 - y1); x < x2; x += ink.hatchGap) d += `M${x},${y2} L${x + (y2 - y1)},${y1} `;
  group.append(make('path', { d, stroke: ink.colour, 'stroke-width': ink.hatch, opacity: 0.75 }));
  svg.append(clip, group);
}

const ellipse = (cx, cy, rx, ry) => `M${cx - rx},${cy} A${rx},${ry} 0 1 0 ${cx + rx},${cy} A${rx},${ry} 0 1 0 ${cx - rx},${cy} Z`;

function roundedRect(x, y, w, h, r) {
  return `M${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} H${x + r} Q${x},${y + h} ${x},${y + h - r} V${y + r} Q${x},${y} ${x + r},${y} Z`;
}

function make(tag, attributes = {}) {
  const node = document.createElementNS(SVG, tag);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
  return node;
}
