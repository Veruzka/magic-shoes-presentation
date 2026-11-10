// Draws the small wireless-charging sensor that lies on the white midsole's tray:
// a black disc with a copper coil, two copper wires, and a little green circuit
// board — in the sketch style (soft ink outlines, a faint shadow underneath).
//
// Settings (size, position, colours): src/shoes/sketch-sensor.js

// How wide the whole sensor (coil + wires + board) is, for a coil `size` wide.
export const SENSOR_WIDTH_PER_SIZE = 1.06 + 0.32 + 0.78;

// centre   where the middle of the sensor goes, and its tilt ({ x, y, angle })
// sensor   the settings from sketch-sensor.js (size already fitted to the floor)
// outline  the soft sketch outline style ({ colour, width })
export function drawSensor(ctx, centre, sensor, outline) {
  const { flatten, coilRings, colours, size } = sensor;

  const R = size / 2; // coil radius
  const boardW = size * 0.78;
  const boardH = size * 0.72;
  const gap = size * 0.32; // space for the wires between coil and board
  const totalW = size * SENSOR_WIDTH_PER_SIZE;

  // Lay everything out flat (as if seen from straight above), centred on the spot
  // and tilted with the floor, then squash it vertically to match the viewing angle.
  ctx.save();
  ctx.translate(centre.x, centre.y);
  ctx.rotate(centre.angle);
  ctx.translate(-totalW / 2 + R * 1.06, 0);
  ctx.scale(1, flatten);
  ctx.lineJoin = 'round';
  const ink = (width = outline.width) => {
    ctx.strokeStyle = outline.colour;
    ctx.lineWidth = width / flatten; // keep outlines the same thickness after squashing
    ctx.stroke();
  };
  const circle = (r, dx = 0) => {
    ctx.beginPath();
    ctx.arc(dx, 0, r, 0, Math.PI * 2);
  };

  // Faint shadow on the foam underneath everything.
  ctx.save();
  ctx.filter = `blur(${size * 0.05}px)`;
  ctx.fillStyle = 'rgb(110 92 70 / 0.28)';
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
