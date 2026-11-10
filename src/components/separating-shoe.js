// A whole shoe drawing whose gray bottom sole detaches as you scroll,
// like lifting one piece out of a puzzle.
//
// When the page loads, the drawing is split (in the browser) into two pictures:
//   1. the shoe body — the drawing with the gray sole cut out (leaves a clean gap)
//   2. the sole piece — the gray sole, plus its top surface (which the drawing
//      never shows), filled with the same gray texture as its visible side
//
// Then setProgress(0…1) poses the sole for how far the visitor has scrolled:
//   0.00 – 0.30  the sole slides from its place to its separated spot
//   after 0.30   nothing more happens (room for the next parts, later)
//
// Where the sole is in the drawing: src/shoes/sketch-sole.js
// Where it travels to:              src/shoes/sole-moves.js
import './separating-shoe.css';

// When the sole moves, as fractions of the scroll.
const SOLE_STAGE = { start: 0, end: 0.3 };

// The shoe's width on a desktop screen; sole-moves.js distances are measured on this.
const DESKTOP_SHOE_WIDTH = 414;

// ---------- small math helpers ----------
const clamp01 = (n) => Math.min(Math.max(n, 0), 1);
const between = (value, start, end) => clamp01((value - start) / (end - start));
const easeInOut = (t) => (1 - Math.cos(Math.PI * t)) / 2; // soft start and stop

export function separatingShoe({ image, alt, sole }, move) {
  const element = document.createElement('div');
  element.className = 'separating-shoe';
  element.setAttribute('role', 'img');
  element.setAttribute('aria-label', alt);

  // Until the split is ready, show the plain drawing so nothing flickers.
  const original = document.createElement('img');
  original.className = 'separating-shoe__original';
  original.src = image;
  original.alt = '';

  const bodyCanvas = document.createElement('canvas');
  bodyCanvas.className = 'separating-shoe__body';
  const soleCanvas = document.createElement('canvas');
  soleCanvas.className = 'separating-shoe__sole';

  element.append(original, soleCanvas, bodyCanvas);

  let currentMove = move;
  let currentProgress = 0;

  original.decode().then(() => {
    splitDrawing(original, sole, bodyCanvas, soleCanvas);
    element.classList.add('is-split');
    setProgress(currentProgress);
  });

  // Poses the sole for a scroll amount between 0 and 1.
  function setProgress(progress) {
    currentProgress = progress;
    const amount = easeInOut(between(progress, SOLE_STAGE.start, SOLE_STAGE.end));
    const scale = element.clientWidth / DESKTOP_SHOE_WIDTH;
    const x = currentMove.x * amount * scale;
    const y = currentMove.y * amount * scale;
    const turn = currentMove.turn * amount;
    soleCanvas.style.transform = `translate(${x}px, ${y}px) rotate(${turn}deg)`;
  }

  // Switch between the travel options in sole-moves.js.
  function setMove(newMove) {
    currentMove = newMove;
    setProgress(currentProgress);
  }

  return { element, setProgress, setMove };
}

// ---------- splitting the drawing into body + sole ----------

function splitDrawing(img, sole, bodyCanvas, soleCanvas) {
  const width = img.naturalWidth;
  const height = img.naturalHeight;
  for (const canvas of [bodyCanvas, soleCanvas]) {
    canvas.width = width;
    canvas.height = height;
  }

  // Read every pixel of the drawing.
  const source = makeCanvas(width, height);
  source.ctx.drawImage(img, 0, 0);
  const pixels = source.ctx.getImageData(0, 0, width, height);

  // Find the seam: one smooth line where the gray sole meets the white foam.
  const seam = findSeam(pixels, sole.seam);
  const outlinedColumns = sole.alsoSole ? raiseSeamToCover(seam, sole.alsoSole, width, height) : new Set();

  // Split along the seam, like a puzzle cut: everything below goes with the sole
  // (gray, highlights, ink, edge glow), everything above stays with the body.
  // Right on the line the two share pixels smoothly, so neither edge is jagged.
  const body = new ImageData(new Uint8ClampedArray(pixels.data), width, height);
  const solePixels = new ImageData(new Uint8ClampedArray(pixels.data), width, height);
  const blend = sole.seam.edgeBlend;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const i = (y * width + x) * 4;
      const below = seam[x] === null ? 0 : clamp01((y - seam[x] + blend / 2) / blend);
      solePixels.data[i + 3] = pixels.data[i + 3] * below;
      body.data[i + 3] = pixels.data[i + 3] * (1 - below);
    }
  }

  // Clean-up: just above the cut there can be the foam's dark bottom ink line and
  // bits of light rubber shine below it. In each column, find the highest dark
  // pixel in that thin strip and move everything from there down to the sole,
  // so the foam left behind ends cleanly. `edge` = where the shoe now ends.
  const { cleanupBand, cleanupDarkerThan } = sole.seam;
  const edge = seam.slice();
  for (let x = 0; x < width; x++) {
    // Skip where the cut follows an "always sole" outline: it's already exact there,
    // and the dark line just above it belongs to the shoe (e.g. the cream toe's outline).
    if (seam[x] === null || outlinedColumns.has(x)) continue;
    const bottom = Math.ceil(seam[x]);
    const top = Math.max(0, Math.floor(seam[x] - cleanupBand));
    let highestDark = null;
    for (let y = bottom; y >= top; y--) {
      const i = (y * width + x) * 4;
      const brightness = (pixels.data[i] + pixels.data[i + 1] + pixels.data[i + 2]) / 3;
      // The drawing's own outline next to the outside (e.g. back of the heel) isn't a leftover.
      if (isOuterOutline(pixels, seam, x, y, sole.outline.keepWithin)) continue;
      if (pixels.data[i + 3] > 0 && brightness < cleanupDarkerThan) highestDark = y;
    }
    if (highestDark === null) continue;
    for (let y = bottom; y >= highestDark; y--) {
      const i = (y * width + x) * 4;
      if (isOuterOutline(pixels, seam, x, y, sole.outline.keepWithin)) continue;
      solePixels.data[i + 3] = pixels.data[i + 3];
      body.data[i + 3] = 0;
    }
    edge[x] = highestDark;
  }

  // The top edge of the sole in each column = its highest solid pixel (smoothed).
  // Using the sole's real pixels (not the cut line) means the top surface never
  // sticks out past the rubber as a thin string — e.g. at the toe tip.
  const topEdge = smooth(highestSolid(solePixels), 5);

  bodyCanvas.getContext('2d').putImageData(body, 0, 0);

  // Give the shoe's new bottom edge the same thin ink outline as the rest of
  // the drawing, so it looks sketched that way rather than cut.
  drawCutOutline(bodyCanvas.getContext('2d'), smooth(edge, 5), sole.outline);

  // The sole piece: its top surface first (behind), then the visible gray side on top.
  const ctx = soleCanvas.getContext('2d');
  drawTopFace(ctx, solePixels, sole, topEdge);
  const sidePixels = makeCanvas(width, height);
  sidePixels.ctx.putImageData(solePixels, 0, 0);
  ctx.drawImage(sidePixels.canvas, 0, 0);
}

// Walks up each column from the shoe's bottom edge while the pixels still belong
// to the sole, and stops at the first solid run of white foam (or coloured upper).
// Returns one y per column (or null where there's no sole), smoothed into a clean curve.
function findSeam({ data, width, height }, settings) {
  const isFoamOrUpper = (i) => {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const brightness = (r + g + b) / 3;
    const colour = Math.max(r, g, b) - Math.min(r, g, b);
    const foam = brightness >= settings.foamBrightness && colour <= settings.foamMaxColour;
    const upper = colour >= settings.upperMinColour;
    return data[i + 3] > 200 && (foam || upper);
  };

  const raw = new Array(width).fill(null);
  for (let x = 0; x < width; x++) {
    let bottom = height - 1;
    while (bottom >= 0 && data[(bottom * width + x) * 4 + 3] === 0) bottom--;
    if (bottom < 0) continue; // empty column

    let run = 0;
    let y = bottom;
    let seenSolid = false;
    let leftShape = false;
    const limit = Math.max(0, bottom - settings.maxThickness);
    for (; y > limit; y--) {
      const i = (y * width + x) * 4;
      if (data[i + 3] > 200) seenSolid = true;
      // Walked out of the shoe's outline (empty space above a thin edge): stop here.
      if (seenSolid && data[i + 3] < 30) {
        leftShape = true;
        break;
      }
      run = isFoamOrUpper(i) ? run + 1 : 0;
      if (run >= settings.foamRunToStop) break;
    }
    // Where the sole ends: just below the foam run, or where the outline ended.
    raw[x] = leftShape ? y + 1 : y + run;
  }

  return smooth(raw, settings.smoothing);
}

// True if a pixel sits within `distance` pixels of the outside of the drawing
// ABOVE the cut — i.e. it's the shoe's own outer ink edge (like the back of the
// heel). Empty space below the cut (where the sole was) doesn't count.
function isOuterOutline({ data, width, height }, seam, x, y, distance) {
  for (let dy = -distance; dy <= distance; dy++) {
    for (let dx = -distance; dx <= distance; dx++) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const outside = data[(ny * width + nx) * 4 + 3] < 100;
      const aboveCut = seam[nx] === null || ny < seam[nx] - distance;
      if (outside && aboveCut) return true;
    }
  }
  return false;
}

// Draws a thin ink line along the cut. It's painted only on top of the shoe's
// own pixels ("source-atop"), so it hugs the inside of the new edge.
function drawCutOutline(ctx, seam, outline) {
  const path = new Path2D();
  let drawing = false;
  seam.forEach((y, x) => {
    if (y === null) {
      drawing = false;
      return;
    }
    const lineY = y - outline.width / 2; // just inside the shoe's edge
    if (drawing) path.lineTo(x, lineY);
    else path.moveTo(x, lineY);
    drawing = true;
  });
  ctx.save();
  ctx.globalCompositeOperation = 'source-atop';
  ctx.strokeStyle = outline.colour;
  ctx.lineWidth = outline.width;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.stroke(path);
  ctx.restore();
}

// Moves the seam up wherever an "always sole" outline reaches higher than it,
// so that whole area leaves with the sole (cut exactly along the outline's top).
// Returns the columns where that happened.
function raiseSeamToCover(seam, outline, width, height) {
  const shape = makeCanvas(width, height);
  shape.ctx.beginPath();
  outline.forEach(([x, y], i) => (i ? shape.ctx.lineTo(x, y) : shape.ctx.moveTo(x, y)));
  shape.ctx.closePath();
  shape.ctx.fill();
  const filled = shape.ctx.getImageData(0, 0, width, height).data;
  const columns = new Set();
  for (let x = 0; x < width; x++) {
    if (seam[x] === null) continue;
    for (let y = 0; y < height; y++) {
      if (filled[(y * width + x) * 4 + 3] > 127) {
        if (y < seam[x]) {
          seam[x] = y; // top of the outline in this column
          columns.add(x);
        }
        break;
      }
    }
  }
  return columns;
}

// Rolling median (removes spikes) then rolling average (removes jaggies).
function smooth(values, size) {
  const half = Math.floor(size / 2);
  const pick = (list, x, reduce) => {
    const window = [];
    for (let k = x - half; k <= x + half; k++) if (list[k] != null) window.push(list[k]);
    return window.length ? reduce(window) : null;
  };
  const median = (w) => w.sort((p, q) => p - q)[Math.floor(w.length / 2)];
  const mean = (w) => w.reduce((sum, v) => sum + v, 0) / w.length;
  const medianed = values.map((v, x) => (v == null ? null : pick(values, x, median)));
  return medianed.map((v, x) => (v == null ? null : pick(medianed, x, mean)));
}

// The sole's top surface: from the sole's own top edge, rising into a foot shape.
// It's painted with the colours of the visible gray side, scattered evenly, so it
// has the same grain and colour without any repeating pattern.
function drawTopFace(ctx, solePixels, sole, topEdge) {
  const { width, height } = ctx.canvas;
  const columns = topEdge.map((y, x) => (y === null ? null : [x, y])).filter(Boolean);
  if (columns.length < 2) return;
  const firstX = columns[0][0];
  const lastX = columns[columns.length - 1][0];

  // Near edge (the sole's top edge), then the far edge back the other way.
  const path = new Path2D();
  columns.forEach(([x, y], i) => (i ? path.lineTo(x, y) : path.moveTo(x, y)));
  for (let i = columns.length - 1; i >= 0; i--) {
    const [x, y] = columns[i];
    const along = (x - firstX) / (lastX - firstX); // 0 at the toe, 1 at the heel
    path.lineTo(x, y - sole.topFace.depth * Math.sin(Math.PI * along));
  }
  path.closePath();

  // Collect the gray side's colours (skipping its dark ink outline).
  const colours = [];
  const side = solePixels.data;
  for (let i = 0; i < side.length; i += 4) {
    if (side[i + 3] > 200 && (side[i] + side[i + 1] + side[i + 2]) / 3 > sole.topFace.skipDarkerThan) {
      colours.push([side[i], side[i + 1], side[i + 2]]);
    }
  }
  if (!colours.length) return;

  // Paint every pixel of the face: a randomly picked side colour (the rubber's
  // grain), lit and grooved by the molded tread pattern (see treadRelief below).
  const shape = makeCanvas(width, height);
  shape.ctx.fill(path);
  const inFace = shape.ctx.getImageData(0, 0, width, height).data;
  const face = new ImageData(width, height);
  const tread = treadRelief(columns, firstX, lastX, sole.topFace);
  for (let i = 0; i < inFace.length; i += 4) {
    if (inFace[i + 3] === 0) continue;
    const x = (i / 4) % width;
    const y = Math.floor(i / 4 / width);
    const light = tread(x, y);
    const [r, g, b] = colours[Math.floor(Math.random() * colours.length)];
    face.data.set([r * light, g * light, b * light, inFace[i + 3]], i);
  }
  const painted = makeCanvas(width, height);
  painted.ctx.putImageData(face, 0, 0);
  ctx.filter = `blur(${sole.topFace.grainSoftness}px)`; // soften the grain a touch
  ctx.save();
  ctx.clip(path);
  ctx.drawImage(painted.canvas, 0, 0);
  ctx.restore();
  ctx.filter = 'none';

  // Light shading: a little darker toward the far edge, so it reads as a surface.
  const top = Math.min(...columns.map(([, y]) => y)) - sole.topFace.depth;
  const bottom = Math.max(...columns.map(([, y]) => y));
  const shade = ctx.createLinearGradient(0, top, 0, bottom);
  shade.addColorStop(0, `rgb(40 36 32 / ${sole.topFace.farEdgeShade})`);
  shade.addColorStop(1, 'rgb(40 36 32 / 0)');
  ctx.fillStyle = shade;
  ctx.fill(path);

  // A thin ink line around it, to match the sketch style.
  ctx.strokeStyle = 'rgb(70 64 58 / 0.7)';
  ctx.lineWidth = 2.5;
  ctx.stroke(path);
}

// The molded tread on the sole's top surface: flowing ridges like topographic
// lines — curved swirls at the toe and heel, longer waves through the middle,
// blending into each other. Returns a brightness multiplier for any pixel
// (1 = unchanged, above 1 = a lit ridge, below 1 = a groove).
function treadRelief(columns, firstX, lastX, settings) {
  const { spacing, ridgeLight, grooveDark, waviness } = settings.tread;
  const length = lastX - firstX;
  const nearY = new Map(columns);
  const middleY = (x) => {
    const along = (x - firstX) / length;
    const near = nearY.get(Math.round(x)) ?? columns[0][1];
    return near - (settings.depth * Math.sin(Math.PI * along)) / 2;
  };
  const toe = { x: firstX + length * 0.18 };
  const heel = { x: firstX + length * 0.84 };
  toe.y = middleY(toe.x);
  heel.y = middleY(heel.x);
  const smoothstep = (a, b, v) => {
    const t = Math.min(Math.max((v - a) / (b - a), 0), 1);
    return t * t * (3 - 2 * t);
  };

  return (x, y) => {
    const along = (x - firstX) / length;
    // Seen from slightly above, so circles look squashed: stretch distances vertically.
    const toeRings = Math.hypot(x - toe.x, (y - toe.y) * 2.2);
    const heelRings = Math.hypot(x - heel.x, (y - heel.y) * 2.2);
    const middleWaves = x * 0.35 + y * 1.6 + waviness * Math.sin(x / 55);
    const toeWeight = 1 - smoothstep(0.25, 0.45, along);
    const heelWeight = smoothstep(0.6, 0.78, along);
    const middleWeight = 1 - toeWeight - heelWeight;
    const wobble = waviness * 0.45 * Math.sin(x / 37 + y / 23); // keeps rings organic, not target-like
    const flow = toeWeight * toeRings + middleWeight * middleWaves + heelWeight * heelRings + wobble;

    const phase = (2 * Math.PI * flow) / spacing;
    const lit = Math.sin(phase); // one side of each ridge catches the light
    const groove = Math.max(0, -Math.cos(phase)) ** 6; // thin dark line between ridges
    return 1 + ridgeLight * lit - grooveDark * groove;
  };
}

// The highest solid pixel in each column of an image (null where there's none).
function highestSolid({ data, width, height }) {
  const tops = new Array(width).fill(null);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (data[(y * width + x) * 4 + 3] > 160) {
        tops[x] = y;
        break;
      }
    }
  }
  return tops;
}

function makeCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return { canvas, ctx: canvas.getContext('2d', { willReadFrequently: true }) };
}
