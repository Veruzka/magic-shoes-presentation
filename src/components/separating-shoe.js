// A whole shoe drawing that comes apart in layers as you scroll, like lifting
// pieces out of a puzzle — bottom layer first.
//
// When the page loads, the drawing is split (in the browser), one layer at a
// time from the bottom up. Each layer is cut from whatever is left after the
// layer below it:
//   • the layer piece — its pixels, plus its top surface (which the drawing
//     never shows), painted to match
//   • what's left — with a clean gap and a soft sketch outline along the new edge
//
// Then setProgress(0…1) poses every layer for how far the visitor has scrolled.
// Each layer has its own stage (when it moves) and travel (how far, as a share
// of the chosen path in sole-moves.js).
//
// The layers, bottom to top:  src/shoes/sketch-sole.js     (gray rubber sole)
//                             src/shoes/sketch-midsole.js  (white foam midsole)
// The paths they travel:      src/shoes/sole-moves.js
import './separating-shoe.css';
import { drawSensor, SENSOR_WIDTH_PER_SIZE } from './sensor-drawing.js';

// The shoe's width on a desktop screen; sole-moves.js distances are measured on this.
const DESKTOP_SHOE_WIDTH = 414;

// ---------- small math helpers ----------
const clamp01 = (n) => Math.min(Math.max(n, 0), 1);
const between = (value, start, end) => clamp01((value - start) / (end - start));
const easeInOut = (t) => (1 - Math.cos(Math.PI * t)) / 2; // soft start and stop

export function separatingShoe({ image, alt, layers }, move) {
  const element = document.createElement('div');
  element.className = 'separating-shoe';
  element.setAttribute('role', 'img');
  element.setAttribute('aria-label', alt);

  // Until the split is ready, show the plain drawing so nothing flickers.
  const original = document.createElement('img');
  original.className = 'separating-shoe__original';
  original.src = image;
  original.alt = '';

  // One canvas per layer (bottom layer drawn first, so it sits behind), then the body.
  const layerCanvases = layers.map((layer) => {
    const canvas = document.createElement('canvas');
    canvas.className = `separating-shoe__layer separating-shoe__layer--${layer.name}`;
    return canvas;
  });
  const bodyCanvas = document.createElement('canvas');
  bodyCanvas.className = 'separating-shoe__body';

  element.append(original, ...layerCanvases, bodyCanvas);

  let currentMove = move;
  let currentProgress = 0;

  original.decode().then(() => {
    splitDrawing(original, layers, bodyCanvas, layerCanvases);
    element.classList.add('is-split');
    setProgress(currentProgress);
  });

  // Poses every layer for a scroll amount between 0 and 1.
  function setProgress(progress) {
    currentProgress = progress;
    const scale = element.clientWidth / DESKTOP_SHOE_WIDTH;
    layers.forEach((layer, i) => {
      const amount = easeInOut(between(progress, layer.stage.start, layer.stage.end)) * layer.travel;
      const x = currentMove.x * amount * scale;
      const y = currentMove.y * amount * scale;
      const turn = currentMove.turn * amount;
      layerCanvases[i].style.transform = `translate(${x}px, ${y}px) rotate(${turn}deg)`;
    });
  }

  // Switch between the travel paths in sole-moves.js (all layers follow it).
  function setMove(newMove) {
    currentMove = newMove;
    setProgress(currentProgress);
  }

  return { element, setProgress, setMove };
}

// ---------- splitting the drawing into layers ----------

function splitDrawing(img, layers, bodyCanvas, layerCanvases) {
  const width = img.naturalWidth;
  const height = img.naturalHeight;
  for (const canvas of [bodyCanvas, ...layerCanvases]) {
    canvas.width = width;
    canvas.height = height;
  }

  // Start with every pixel of the drawing; each cut takes its layer away.
  const source = makeCanvas(width, height);
  source.ctx.drawImage(img, 0, 0);
  let remaining = source.ctx.getImageData(0, 0, width, height);

  layers.forEach((layer, i) => {
    const { piece, rest, edge } = cutLayer(remaining, layer, width, height);

    // What's left gets a soft sketch outline along its new bottom edge.
    const restCanvas = makeCanvas(width, height);
    restCanvas.ctx.putImageData(rest, 0, 0);
    drawCutOutline(restCanvas.ctx, smooth(edge, 5), layer.outline);
    remaining = restCanvas.ctx.getImageData(0, 0, width, height);

    // The layer piece: its top surface first (behind), then its own pixels on top.
    // The top surface starts at the piece's real top pixels (not the cut line),
    // so it never sticks out past the piece as a thin string.
    const ctx = layerCanvases[i].getContext('2d');
    const topEdge = smooth(highestSolid(piece), 5);
    if (layer.topFace.style === 'tread') drawTreadFace(ctx, piece, layer, topEdge);
    else drawTrayFace(ctx, layer, topEdge);
    const sidePixels = makeCanvas(width, height);
    sidePixels.ctx.putImageData(piece, 0, 0);
    ctx.drawImage(sidePixels.canvas, 0, 0);
  });

  bodyCanvas.getContext('2d').putImageData(remaining, 0, 0);
}

// Cuts one layer out of an image along a smooth seam (like a puzzle cut):
// everything below the seam leaves with the layer, everything above stays.
function cutLayer(pixels, layer, width, height) {
  const { seam, bottoms } = findSeam(pixels, layer.seam);
  const outlinedColumns = layer.alsoLayer
    ? raiseSeamToCover(seam, layer.alsoLayer, width, height)
    : new Set();

  // Columns where the "layer" is thinner than `minThickness` aren't really this
  // layer (e.g. just an outline line along another part's edge): leave them alone,
  // so no thin strings come along with the piece.
  for (let x = 0; x < width; x++) {
    if (seam[x] !== null && !outlinedColumns.has(x) && bottoms[x] - seam[x] < layer.seam.minThickness) {
      seam[x] = null;
    }
  }

  // Split along the seam. Right on the line the two share pixels smoothly,
  // so neither edge is jagged.
  const rest = new ImageData(new Uint8ClampedArray(pixels.data), width, height);
  const piece = new ImageData(new Uint8ClampedArray(pixels.data), width, height);
  const blend = layer.seam.edgeBlend;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const i = (y * width + x) * 4;
      const below = seam[x] === null ? 0 : clamp01((y - seam[x] + blend / 2) / blend);
      piece.data[i + 3] = pixels.data[i + 3] * below;
      rest.data[i + 3] = pixels.data[i + 3] * (1 - below);
    }
  }

  // Clean-up: just above the cut there can be leftover bits of the layer (its ink
  // line, shine, foam). In each column, find the highest leftover pixel in a thin
  // strip and move everything from there down to the layer, so what's left ends
  // cleanly. `edge` = where what's left now ends.
  const { band, darkerThan, maxColour } = layer.cleanup;
  const isLeftover = (i) => {
    const r = pixels.data[i], g = pixels.data[i + 1], b = pixels.data[i + 2];
    const brightness = (r + g + b) / 3;
    const colour = Math.max(r, g, b) - Math.min(r, g, b);
    return (
      pixels.data[i + 3] > 0 &&
      (darkerThan === undefined || brightness < darkerThan) &&
      (maxColour === undefined || colour <= maxColour)
    );
  };
  const edge = seam.slice();
  for (let x = 0; x < width; x++) {
    // Skip where the cut follows a traced outline: it's already exact there,
    // and the line just above it belongs to what's left (e.g. the cream toe's outline).
    if (seam[x] === null || outlinedColumns.has(x)) continue;
    const bottom = Math.ceil(seam[x]);
    const top = Math.max(0, Math.floor(seam[x] - band));
    let highest = null;
    for (let y = bottom; y >= top; y--) {
      // The drawing's own outline next to the outside (e.g. back of the heel) isn't a leftover.
      if (isOuterOutline(pixels, seam, x, y, layer.outline.keepWithin)) continue;
      if (isLeftover((y * width + x) * 4)) highest = y;
    }
    if (highest === null) continue;
    for (let y = bottom; y >= highest; y--) {
      const i = (y * width + x) * 4;
      if (isOuterOutline(pixels, seam, x, y, layer.outline.keepWithin)) continue;
      piece.data[i + 3] = pixels.data[i + 3];
      rest.data[i + 3] = 0;
    }
    edge[x] = highest;
  }

  return { piece, rest, edge };
}

// Walks up each column from the bottom edge while the pixels still belong to the
// layer, and stops at the first solid run of pixels that belong to the part above:
//   • white foam (if `foamBrightness` is set) — bright and un-coloured
//   • the coloured upper/cork (`upperMinColour`) — clearly coloured
// Returns one y per column (or null where there's nothing), smoothed into a clean curve.
function findSeam({ data, width, height }, settings) {
  const isFoamOrUpper = (i) => {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const brightness = (r + g + b) / 3;
    const colour = Math.max(r, g, b) - Math.min(r, g, b);
    const foam =
      settings.foamBrightness !== undefined &&
      brightness >= settings.foamBrightness &&
      colour <= settings.foamMaxColour;
    const upper = colour >= settings.upperMinColour;
    return data[i + 3] > 200 && (foam || upper);
  };

  const raw = new Array(width).fill(null);
  const bottoms = new Array(width).fill(null); // the bottom edge in each column
  const throughTop = new Set(); // columns where the layer runs right up out of the shape
  for (let x = 0; x < width; x++) {
    let bottom = height - 1;
    while (bottom >= 0 && data[(bottom * width + x) * 4 + 3] === 0) bottom--;
    if (bottom < 0) continue; // empty column
    bottoms[x] = bottom;

    // Some layers only exist where their material is really there: e.g. the white
    // midsole needs white foam near the bottom of the column (the toe cap is cream).
    if (settings.mustContain && !containsNearBottom(data, width, x, bottom, settings.mustContain)) {
      continue;
    }

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
    if (leftShape) {
      // Walked out of the top of the shape: keep going through the faint edge glow
      // too, so no ghost line is left hanging where the layer was.
      while (y > 0 && data[(y * width + x) * 4 + 3] > 0) y--;
      raw[x] = y + 1;
      throughTop.add(x);
    } else {
      raw[x] = y + run; // just below the run that belongs to the part above
    }
  }

  // Smooth the line, but keep the exact top where the layer runs out of the shape.
  const seam = smooth(raw, settings.smoothing);
  throughTop.forEach((x) => (seam[x] = raw[x]));
  return { seam, bottoms };
}

// True if, within the first `within` solid pixels above the bottom of a column,
// there's a pixel of the given material (bright enough and un-coloured enough).
function containsNearBottom(data, width, x, bottom, { minBrightness, maxColour, within }) {
  let solid = 0;
  for (let y = bottom; y >= 0 && solid < within; y--) {
    const i = (y * width + x) * 4;
    if (data[i + 3] < 200) continue;
    solid++;
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const colour = Math.max(data[i], data[i + 1], data[i + 2]) - Math.min(data[i], data[i + 1], data[i + 2]);
    if (brightness >= minBrightness && colour <= maxColour) return true;
  }
  return false;
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

// The outline of a layer's top surface: its near edge (the layer's own top edge),
// then a far edge rising into a foot shape — deepest mid-foot, nothing at toe and heel.
function topFacePath(topEdge, depth) {
  const columns = topEdge.map((y, x) => (y === null ? null : [x, y])).filter(Boolean);
  if (columns.length < 2) return null;
  const firstX = columns[0][0];
  const lastX = columns[columns.length - 1][0];
  const path = new Path2D();
  columns.forEach(([x, y], i) => (i ? path.lineTo(x, y) : path.moveTo(x, y)));
  for (let i = columns.length - 1; i >= 0; i--) {
    const [x, y] = columns[i];
    const along = (x - firstX) / (lastX - firstX); // 0 at the toe, 1 at the heel
    path.lineTo(x, y - depth * Math.sin(Math.PI * along));
  }
  path.closePath();
  return { path, columns, firstX, lastX };
}

// The white midsole's top surface: a smooth matte tray — a slightly raised lip
// around the edge, a recessed floor inside with soft shading where they meet,
// and a faint grain. (Like the foam midsole in the reference photo.)
function drawTrayFace(ctx, layer, topEdge) {
  const { depth, floorLight, floorDark, lipWidth, lipLight, recessShade, grain } = layer.topFace;
  const face = topFacePath(topEdge, depth);
  if (!face) return;
  const { path, columns, firstX, lastX } = face;
  const top = Math.min(...columns.map(([, y]) => y)) - depth;
  const bottom = Math.max(...columns.map(([, y]) => y));

  ctx.save();
  ctx.clip(path);

  // Floor: light near you, a touch darker toward the far edge.
  const floor = ctx.createLinearGradient(0, top, 0, bottom);
  floor.addColorStop(0, floorDark);
  floor.addColorStop(1, floorLight);
  ctx.fillStyle = floor;
  ctx.fill(path);

  // Recess: a soft shadow just inside the lip, so the floor sits lower.
  ctx.filter = `blur(${lipWidth * 0.6}px)`;
  ctx.strokeStyle = `rgb(120 104 82 / ${recessShade})`;
  ctx.lineWidth = lipWidth * 3.2;
  ctx.stroke(path);

  // Lip: a bright raised rim along the edge.
  ctx.filter = 'blur(1.2px)';
  ctx.strokeStyle = `rgb(255 255 255 / ${lipLight})`;
  ctx.lineWidth = lipWidth * 2;
  ctx.stroke(path);
  ctx.filter = 'none';

  // Faint foam grain.
  const noise = makeCanvas(64, 64);
  const dots = noise.ctx.createImageData(64, 64);
  for (let i = 0; i < dots.data.length; i += 4) {
    const v = Math.random() * 255;
    dots.data.set([v, v, v, 255 * grain], i);
  }
  noise.ctx.putImageData(dots, 0, 0);
  ctx.globalCompositeOperation = 'soft-light';
  ctx.fillStyle = ctx.createPattern(noise.canvas, 'repeat');
  ctx.fill(path);
  ctx.restore();

  // A soft sketch outline around it.
  ctx.strokeStyle = layer.outline.colour;
  ctx.lineWidth = layer.outline.width;
  ctx.stroke(path);

  // Anything lying on the tray floor (e.g. the charging sensor).
  const { sensor } = layer.topFace;
  if (sensor) placeOnFloor(ctx, sensor, face, depth, lipWidth * 3, layer.outline);
}

// Places the sensor on the tray floor: it measures the floor along the sensor's
// whole width, tilts the sensor to follow the floor's slope, and shrinks it if
// any part of the floor is too narrow — so it always sits inside, clear of the lip.
function placeOnFloor(ctx, sensor, { columns, firstX, lastX }, depth, margin, outline) {
  const nearAt = new Map(columns);
  const length = lastX - firstX;
  // The floor at any x: its near edge, how deep it is, and the line `across` of the way in.
  const floorAt = (x) => {
    const near = nearAt.get(Math.round(x));
    if (near === undefined) return null;
    const height = depth * Math.sin(Math.PI * ((x - firstX) / length));
    return { line: near - height * sensor.across, room: height };
  };

  const centreX = firstX + sensor.along * length;
  let size = sensor.size;
  let fit = null;
  for (let attempt = 0; attempt < 6; attempt++) {
    const halfWidth = (size * SENSOR_WIDTH_PER_SIZE) / 2;
    const left = floorAt(centreX - halfWidth);
    const right = floorAt(centreX + halfWidth);
    const middle = floorAt(centreX);
    if (!left || !right || !middle) {
      size *= 0.8;
      continue;
    }
    // Narrowest floor under the sensor vs. how tall the sensor is on screen.
    const room = Math.min(left.room, right.room, middle.room) - 2 * margin;
    const tall = size * 1.1 * sensor.flatten;
    fit = { left, right, middle, halfWidth };
    if (tall <= room) break;
    size *= Math.max(0.6, room / tall);
  }
  if (!fit) return;

  const angle = Math.atan2(fit.right.line - fit.left.line, 2 * fit.halfWidth) * (sensor.tilt ?? 1);
  const centreY = (fit.left.line + fit.right.line + fit.middle.line) / 3;
  drawSensor(ctx, { x: centreX, y: centreY, angle }, { ...sensor, size }, outline);
}

// The gray sole's top surface: painted with the colours of the visible gray side,
// scattered evenly (same grain and colour, no repeating pattern), with molded tread.
function drawTreadFace(ctx, solePixels, sole, topEdge) {
  const { width, height } = ctx.canvas;
  const face = topFacePath(topEdge, sole.topFace.depth);
  if (!face) return;
  const { path, columns, firstX, lastX } = face;

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
  const painting = new ImageData(width, height);
  const tread = treadRelief(columns, firstX, lastX, sole.topFace);
  for (let i = 0; i < inFace.length; i += 4) {
    if (inFace[i + 3] === 0) continue;
    const x = (i / 4) % width;
    const y = Math.floor(i / 4 / width);
    const light = tread(x, y);
    const [r, g, b] = colours[Math.floor(Math.random() * colours.length)];
    painting.data.set([r * light, g * light, b * light, inFace[i + 3]], i);
  }
  const painted = makeCanvas(width, height);
  painted.ctx.putImageData(painting, 0, 0);
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
