// The shoe in the middle of the lab.
//
// The picture is the story's coming-apart Sketch shoe (src/components/separating-shoe.js),
// with lab-only settings: the FSR lies in its pocket at the heel, not mid-foot, and
// the story's handwritten labels are left out. On top sit two drawn layers (SVG, in
// the drawing's own pixels, 1356 × 846):
//   • closed: one marker per placed sensor – dashed zone outline, red crosshair,
//     leader line and label (2a)
//   • open ("Show inside"): technical labels riding along with each layer, the FSR's
//     label, or an "empty" pocket outline when no FSR is placed (2b)
// Markers are code, not part of the picture, so they can move to a 3D shoe later.
import shoeUrl from '../assets/shoe-sketch.png';
import { separatingShoe } from '../components/separating-shoe.js';
import { sketchSole } from '../shoes/sketch-sole.js';
import { sketchMidsole } from '../shoes/sketch-midsole.js';
import { sketchSensor } from '../shoes/sketch-sensor.js';
import { sensors, sensorById } from './data/sensors.js';
import { zoneById } from './data/zones.js';
import { layers, pieceFor } from './data/layers.js';
import { labState } from './lab-state.js';

const SVG = 'http://www.w3.org/2000/svg';
const VIEW = 'sketch34';
const WIDTH = 1356;
const HEIGHT = 846;

// ---- Lab-only settings for the coming-apart shoe (the story's stay unchanged) ----
const FSR_ALONG = 0.78; // where the FSR lies from toe (0) to heel (1): the heel
const OPEN_MOVE = { x: 0, y: 150, turn: 0, lift: 50 }; // straight down, less far than the story
const OPEN_SECONDS = 0.8; // motion-director review: open 0.8s, close a bit faster
const CLOSE_SECONDS = 0.6;

const labMidsole = {
  ...sketchMidsole,
  topFace: { ...sketchMidsole.topFace, sensor: { ...sketchSensor, along: FSR_ALONG } },
};
const labLayers = [sketchSole, labMidsole];
// The moment all layers have finished moving (the story's labels come after it).
const OPEN_END = Math.max(...labLayers.map((layer) => layer.stage.end));

function svg(tag, attributes = {}) {
  const node = document.createElementNS(SVG, tag);
  for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
  return node;
}

// A leader line from a point, a short slant, then straight across, and its label.
// Labels to the left of the line end at it; labels to the right start at it.
function callout([x, y], bend, end, text, className) {
  const group = svg('g', { class: className });
  const towardRight = end[0] >= bend[0];
  const start = [x + (towardRight ? 22 : -22), y + (bend[1] > y ? 22 : -22)];
  group.append(
    svg('path', {
      class: 'lab-callout__leader',
      d: `M ${start[0]} ${start[1]} L ${bend[0]} ${bend[1]} L ${end[0]} ${end[1]}`,
      pathLength: 1,
    }),
  );
  const label = svg('text', {
    class: 'lab-callout__label',
    x: end[0] + (towardRight ? 12 : -12),
    y: end[1],
    'text-anchor': towardRight ? 'start' : 'end',
  });
  label.textContent = text;
  group.append(label);
  return group;
}

// The closed-shoe marker for one sensor (2a).
function marker(sensor, zone) {
  const view = zone.views[VIEW];
  const [x, y] = view.anchor;
  const group = svg('g', { class: 'lab-marker', 'data-sensor': sensor.id });
  group.append(
    svg('path', { class: 'lab-marker__zone-under', d: view.outline }),
    svg('path', { class: 'lab-marker__zone', d: view.outline }),
  );
  const cross = svg('g', { class: 'lab-marker__cross' });
  cross.append(
    svg('circle', { cx: x, cy: y, r: 18 }),
    svg('path', { d: `M ${x - 32} ${y} H ${x - 10} M ${x + 10} ${y} H ${x + 32} M ${x} ${y - 32} V ${y - 10} M ${x} ${y + 10} V ${y + 32}` }),
  );
  group.append(cross);
  const { bend, end, text } = view.label;
  const line = callout([x, y], bend, end, text, 'lab-marker__callout');
  group.append(...line.childNodes);
  return group;
}

export function labShoe() {
  const figure = document.createElement('figure');
  figure.className = 'lab-shoe';

  const shoe = separatingShoe(
    {
      image: shoeUrl,
      alt: 'The shoe, drawn from the outer side at an angle',
      layers: labLayers,
      labels: [], // the story's handwritten labels stay in the story
    },
    OPEN_MOVE,
  );
  const stage = document.createElement('div');
  stage.className = 'lab-shoe__stage';
  stage.append(shoe.element);

  // ---- closed view: sensor markers (2a) ----
  const closedLayer = svg('svg', { class: 'lab-shoe__layer', viewBox: `0 0 ${WIDTH} ${HEIGHT}`, 'aria-hidden': 'true' });
  const markers = sensors
    .filter((sensor) => sensor.status === 'active' && zoneById(sensor.zone)?.views[VIEW])
    .map((sensor) => {
      const group = marker(sensor, zoneById(sensor.zone));
      closedLayer.append(group);
      return { sensor, group };
    });
  stage.append(closedLayer);

  // ---- open view: technical labels, one drawn layer inside each moving piece (2b) ----
  const pieceLayers = new Map(); // piece name → its SVG, which rides along with the piece
  let partLabels = [];
  let fsrInside = null; // the FSR's label + the empty-pocket outline, made once the shoe is split
  shoe.element.addEventListener('shoe-ready', () => {
    for (const layer of layers) {
      const view = layer.views[VIEW];
      if (!view?.piece || !view.label) continue;
      const piece = shoe.element.querySelector(`.separating-shoe__layer--${view.piece}`);
      if (!piece) continue;
      const drawn = svg('svg', { class: 'lab-shoe__layer lab-shoe__inside', viewBox: `0 0 ${WIDTH} ${HEIGHT}`, 'aria-hidden': 'true' });
      piece.append(drawn);
      pieceLayers.set(view.piece, drawn);
      const { anchor, bend, end, text } = view.label;
      const label = callout(anchor, bend, end, text, 'lab-callout lab-callout--part');
      drawn.append(label);
      partLabels.push(label);
    }
    // Stagger the labels one after another (like chapter 3's callouts).
    partLabels.forEach((label, i) => label.style.setProperty('--order', i));
    draw();
  });

  // Where the FSR's pocket is, in the drawing's pixels of its piece. The coming-apart
  // shoe only reports it on screen, so convert (the piece only slides, never turns).
  function pocketSpot(piece) {
    const pose = shoe.fsrPose();
    if (!pose) return null;
    const box = piece.getBoundingClientRect();
    return [((pose.origin.x - box.left) / box.width) * WIDTH, ((pose.origin.y - box.top) / box.height) * HEIGHT];
  }

  function makeFsrInside() {
    const fsr = sensorById('fsr');
    const pieceName = pieceFor(zoneById(fsr.zone).layer, VIEW); // insole → rests on the midsole
    const drawn = pieceLayers.get(pieceName);
    const piece = drawn?.parentElement;
    const spot = piece && pocketSpot(piece);
    if (!spot) return null;
    const [x, y] = spot;
    const group = svg('g', { class: 'lab-fsr-inside' });
    const text = zoneById(fsr.zone).views[VIEW].label.text; // same words as the closed marker
    const placedLabel = callout([x, y], [x + 70, y - 70], [WIDTH + 40, y - 70], text, 'lab-callout lab-callout--fsr');
    placedLabel.style.setProperty('--order', partLabels.length);
    const empty = svg('g', { class: 'lab-empty-pocket' });
    empty.append(svg('ellipse', { cx: x, cy: y, rx: 95, ry: 38 }));
    const emptyLabel = callout([x, y], [x + 70, y - 70], [WIDTH + 40, y - 70], 'Empty · Place a sensor', 'lab-callout lab-callout--empty');
    emptyLabel.style.setProperty('--order', partLabels.length);
    empty.append(emptyLabel);
    group.append(placedLabel, empty);
    drawn.append(group);
    return group;
  }

  // ---- "Show inside": play the opening from wherever it is (clicks never wait) ----
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let progress = 0; // 0 = closed … OPEN_END = fully open
  let frame = 0;
  let last = 0;

  function step(now) {
    const target = labState.isOpen() ? OPEN_END : 0;
    const seconds = labState.isOpen() ? OPEN_SECONDS : CLOSE_SECONDS;
    const elapsed = last ? (now - last) / 1000 : 0;
    last = now;
    const change = (OPEN_END / seconds) * elapsed; // steady speed: the layers ease themselves
    progress = target > progress ? Math.min(target, progress + change) : Math.max(target, progress - change);
    shoe.setProgress(progress);
    if (progress === target) {
      frame = 0;
      last = 0;
      settle();
    } else {
      frame = requestAnimationFrame(step);
    }
  }

  function animate() {
    if (reduceMotion.matches) {
      progress = labState.isOpen() ? OPEN_END : 0;
      shoe.setProgress(progress);
      settle();
      return;
    }
    if (!frame) frame = requestAnimationFrame(step);
  }

  // Once fully open: show the labels. Once fully closed: bring the markers back.
  function settle() {
    const fullyOpen = labState.isOpen() && progress === OPEN_END;
    if (fullyOpen && !fsrInside) fsrInside = makeFsrInside();
    figure.classList.toggle('show-parts', fullyOpen);
    if (!labState.isOpen() && progress === 0) figure.classList.remove('is-inside');
  }

  let wasOpen = false;
  function draw() {
    for (const { sensor, group } of markers) group.classList.toggle('is-placed', labState.isPlaced(sensor.id));
    figure.classList.toggle('has-fsr', labState.isPlaced('fsr'));
    const open = labState.isOpen();
    if (open !== wasOpen) {
      wasOpen = open;
      if (open) figure.classList.add('is-inside'); // markers fade out as the opening starts
      else figure.classList.remove('show-parts'); // labels go as soon as closing starts
      animate();
    }
  }

  figure.append(stage);
  labState.onChange(draw);
  draw();
  return figure;
}
