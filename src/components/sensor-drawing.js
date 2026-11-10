// Draws the small wireless-charging sensor that lies on the white midsole's tray:
// a black disc with a copper coil, two copper wires, and a little green circuit
// board — in the sketch style (soft ink outlines, a faint shadow underneath).
//
// Settings (size, position, colours): src/shoes/sketch-sensor.js

// How wide the whole sensor (coil + wires + board) is, for a coil `size` wide.
export const SENSOR_WIDTH_PER_SIZE = 1.06 + 0.32 + 0.78;

// The space the sensor takes on the floor, including its pocket and rim
// (before foreshortening), for a coil `size` wide.
export function sensorFootprint(size, sensor) {
  const extra = sensor.pocket ? 2 * size * (sensor.pocket.padding + sensor.pocket.rim) : 0;
  return { width: size * SENSOR_WIDTH_PER_SIZE + extra, height: size * 1.06 + extra };
}

// centre   where the middle of the sensor goes, and the shoe's direction ({ x, y, axis })
// sensor   the settings from sketch-sensor.js (size already fitted to the floor)
// outline  the soft sketch outline style ({ colour, width })
export function drawSensor(ctx, centre, sensor, outline) {
  const { flatten, coilRings, colours, size } = sensor;

  const R = size / 2; // coil radius
  const boardW = size * 0.78;
  const boardH = size * 0.72;
  const gap = size * 0.32; // space for the wires between coil and board
  const totalW = size * SENSOR_WIDTH_PER_SIZE;

  // Lay everything out flat (as if seen from straight above), then put it on the
  // floor: its long side runs along the shoe's toe-to-heel direction, and its
  // width is foreshortened straight up the screen — the same ground the shoe stands on.
  ctx.save();
  ctx.translate(centre.x, centre.y);
  ctx.transform(Math.cos(centre.axis), Math.sin(centre.axis), 0, flatten, 0, 0);
  ctx.translate(-totalW / 2 + R * 1.06, 0);
  ctx.lineJoin = 'round';
  const ink = (width = outline.width) => {
    ctx.strokeStyle = outline.colour;
    ctx.lineWidth = width / Math.sqrt(flatten); // roughly the same thickness after foreshortening
    ctx.stroke();
  };
  const circle = (r, dx = 0) => {
    ctx.beginPath();
    ctx.arc(dx, 0, r, 0, Math.PI * 2);
  };

  // The pressed-in pocket the sensor sits in (drawn first, underneath).
  if (sensor.pocket) {
    const pad = size * sensor.pocket.padding;
    const half = R * 1.06; // the disc is the tallest part
    drawPocket(ctx, { x: -half - pad, y: -half - pad, w: totalW + 2 * pad, h: 2 * half + 2 * pad }, size, sensor.pocket, ink);
  }

  // Faint shadow on the foam underneath everything.
  ctx.save();
  ctx.filter = `blur(${size * (sensor.pocket ? 0.025 : 0.05)}px)`;
  ctx.fillStyle = `rgb(110 92 70 / ${sensor.pocket ? 0.35 : 0.28})`;
  ctx.beginPath();
  ctx.ellipse(totalW / 2 - R * 1.06 + size * 0.04, size * 0.1, totalW / 2, R * 1.1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // ---------- the coil ----------
  // Black disc, with a little thickness showing along its front edge.
  ctx.fillStyle = '#0f0e0d';
  circle(R * 1.06);
  ctx.translate(0, size * 0.06);
  ctx.fill();
  ctx.translate(0, -size * 0.06);
  ctx.fillStyle = colours.disc;
  circle(R * 1.06);
  ctx.fill();
  ink();

  // Copper rings, from the outside in: dark gap, copper wire, a thin shine.
  const outer = R * 0.95;
  const inner = R * 0.42;
  const step = (outer - inner) / coilRings;
  for (let k = 0; k < coilRings; k++) {
    const r = outer - k * step - step / 2;
    circle(r);
    ctx.strokeStyle = colours.copperDark;
    ctx.lineWidth = step;
    ctx.stroke();
    circle(r);
    ctx.strokeStyle = colours.copper;
    ctx.lineWidth = step * 0.7;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, r, Math.PI * 1.05, Math.PI * 1.55); // shine on the upper-left of each ring
    ctx.strokeStyle = colours.copperLight;
    ctx.lineWidth = step * 0.25;
    ctx.stroke();
  }

  // Hub: a black ring with a small light hole.
  ctx.fillStyle = colours.disc;
  circle(inner);
  ctx.fill();
  ctx.fillStyle = colours.hub;
  circle(inner * 0.4);
  ctx.fill();
  ink(outline.width * 0.8);

  // Small dark tab where the wires leave the coil.
  const tabX = R * 0.55;
  ctx.fillStyle = '#2b2622';
  ctx.fillRect(tabX, -step * 1.4, R * 0.42, step * 2.8);

  // ---------- the wires ----------
  const boardX = R * 1.06 + gap; // left edge of the board
  for (const offset of [-step * 0.7, step * 0.7]) {
    ctx.beginPath();
    ctx.moveTo(tabX + R * 0.4, offset);
    ctx.bezierCurveTo(boardX - gap * 0.4, offset, boardX - gap * 0.6, offset * 1.6, boardX + size * 0.06, offset * 1.6);
    ctx.strokeStyle = colours.copperDark;
    ctx.lineWidth = step * 0.55;
    ctx.stroke();
    ctx.strokeStyle = colours.copper;
    ctx.lineWidth = step * 0.3;
    ctx.stroke();
  }

  // ---------- the circuit board ----------
  const boardTop = -boardH / 2;
  const rounded = (x, y, w, h, r) => {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  };
  // Thickness along its front edge, then the board itself.
  ctx.fillStyle = '#1f3226';
  rounded(boardX, boardTop + size * 0.05, boardW, boardH, size * 0.12);
  ctx.fill();
  ctx.fillStyle = colours.board;
  rounded(boardX, boardTop, boardW, boardH, size * 0.12);
  ctx.fill();
  ink();
  // Lighter top edge.
  ctx.strokeStyle = colours.boardEdge;
  ctx.lineWidth = size * 0.025;
  ctx.beginPath();
  ctx.moveTo(boardX + size * 0.1, boardTop + size * 0.03);
  ctx.lineTo(boardX + boardW - size * 0.1, boardTop + size * 0.03);
  ctx.stroke();

  // Parts on the board: wire pads, a silver chip, two small black parts, a copper connector.
  ctx.fillStyle = colours.copper;
  for (const offset of [-step * 0.7, step * 0.7]) {
    circle(step * 0.6, boardX + size * 0.08);
    ctx.translate(0, offset * 1.6);
    ctx.beginPath();
    ctx.arc(boardX + size * 0.08, 0, step * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.translate(0, -offset * 1.6);
  }
  ctx.fillStyle = colours.chip;
  rounded(boardX + boardW * 0.32, -boardH * 0.18, boardW * 0.26, boardH * 0.3, size * 0.02);
  ctx.fill();
  ink(outline.width * 0.8);
  ctx.fillStyle = colours.part;
  ctx.fillRect(boardX + boardW * 0.2, boardH * 0.18, boardW * 0.1, boardH * 0.1);
  ctx.fillRect(boardX + boardW * 0.66, -boardH * 0.32, boardW * 0.08, boardH * 0.08);
  ctx.fillStyle = colours.copper;
  ctx.fillRect(boardX + boardW * 0.82, -boardH * 0.06, boardW * 0.12, boardH * 0.16);
  ctx.fillStyle = colours.part;
  ctx.fillRect(boardX + boardW * 0.64, boardH * 0.2, boardW * 0.12, boardH * 0.12);

  ctx.restore();
}

// A shallow pocket pressed into the foam, shaped around the sensor:
// a small raised rim all round, a slightly darker recessed floor with a soft
// shadow along its far wall, and a faint wavy molded texture — like the inset
// panel on a shoe sole. Drawn in the sensor's flat layout (before foreshortening).
function drawPocket(ctx, box, size, pocket, ink) {
  const radius = Math.min(box.h / 2, size * pocket.roundness);
  const rimW = size * pocket.rim;
  const shape = (grow) => {
    ctx.beginPath();
    ctx.roundRect(box.x - grow, box.y - grow, box.w + 2 * grow, box.h + 2 * grow, radius + grow);
  };

  // Raised rim: a light band around the pocket, a touch brighter on the near side.
  ctx.save();
  shape(rimW);
  const rimLight = ctx.createLinearGradient(0, box.y - rimW, 0, box.y + box.h + rimW);
  rimLight.addColorStop(0, pocket.rimColour);
  rimLight.addColorStop(1, '#ffffff');
  ctx.fillStyle = rimLight;
  ctx.fill();
  ink();
  ctx.restore();

  // Recessed floor.
  ctx.save();
  shape(0);
  ctx.fillStyle = pocket.floorColour;
  ctx.fill();
  ctx.clip();

  // Faint wavy molded texture on the floor (light and dark pairs).
  if (pocket.texture > 0) {
    const step = size * 0.09;
    for (let y = box.y; y < box.y + box.h + step; y += step) {
      ctx.beginPath();
      for (let x = box.x; x <= box.x + box.w; x += size * 0.03) {
        const wave = Math.sin((x / size) * Math.PI * 6) * step * 0.3;
        if (x === box.x) ctx.moveTo(x, y + wave);
        else ctx.lineTo(x, y + wave);
      }
      ctx.strokeStyle = `rgb(120 104 82 / ${pocket.texture})`;
      ctx.lineWidth = step * 0.22;
      ctx.stroke();
      ctx.translate(0, step * 0.18);
      ctx.strokeStyle = `rgb(255 255 255 / ${pocket.texture * 1.4})`;
      ctx.stroke();
      ctx.translate(0, -step * 0.18);
    }
  }

  // Soft shadow along the far wall, where the floor dips below the rim.
  ctx.filter = `blur(${size * 0.04}px)`;
  shape(size * 0.06);
  ctx.translate(0, size * 0.07);
  ctx.strokeStyle = `rgb(110 92 70 / ${pocket.wallShade})`;
  ctx.lineWidth = size * 0.14;
  ctx.stroke();
  ctx.restore();

  // The inner edge of the rim.
  shape(0);
  ink();
}

