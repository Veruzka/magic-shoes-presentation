// Draws the paper-cut people's body parts (src/assets/paper-people/*.svg).
// The same code built the components in Figma ("Magic Shoes – assets", page
// "Paper people"), with the same seed, so the files match the Figma parts.
//
// Each part hangs straight down from its joint, and the joint is at (0,0) in
// the file (skeleton units, see LEN in src/components/sprite-rig.js). Hand-cut
// look: tapered limbs with an elbow or knee bump, slightly wobbly edges, a few
// faint paper fibres, and a lifted shadow under each piece.
//
// Run: node tools/paper-people.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const OUT = fileURLToPath(new URL('../src/assets/paper-people/', import.meta.url));
const S = 4; // the files' width/height in px per unit (the drawing itself is in units)

// Seeded random, so the "hand-cut" wobble is the same every time.
let seed = 7;
const rnd = () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};
const jit = (a) => (rnd() - 0.5) * 2 * a;
const f = (v) => Math.round(v * 100) / 100;
// A smooth closed path through points (Catmull-Rom to cubic Bezier).
function smooth(pts) {
  const n = pts.length;
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return d + 'Z';
}
// A tapered limb from (0,0) down to (0,len): width w0 at the top, w1 at the
// bottom, rounded ends, a bump at the bottom joint (+ = forward), hand-cut wobble.
function limb(len, w0, w1, bump = 0, wob = 0.35) {
  const left = [], right = [];
  const steps = 5;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, y = t * len, w = (w0 + (w1 - w0) * t) / 2;
    const b = t > 0.75 ? bump * (t - 0.75) * 4 : 0;
    right.push([w + Math.max(b, 0) + jit(wob), y]);
    left.push([-w + Math.min(b, 0) + jit(wob), y]);
  }
  const pts = [[0 + jit(wob), -w0 / 2 - 0.3], ...right, [bump * 0.6 + jit(wob), len + w1 / 2], ...left.reverse()];
  return { d: smooth(pts), widthAt: (y) => w0 + (w1 - w0) * Math.min(Math.max(y / len, 0), 1) };
}
const band = (y0, y1, wAt, color, cx = 0) => {
  const a = wAt(y0) / 2 + 0.2, b = wAt(y1) / 2 + 0.2;
  return `<path d="M${f(cx - a + jit(0.2))},${f(y0)} L${f(cx + a + jit(0.2))},${f(y0 + jit(0.3))} L${f(cx + b)},${f(y1)} L${f(cx - b)},${f(y1 + jit(0.3))} Z" fill="${color}"/>`;
};
// A few faint paper fibres inside a box.
const fibres = (x0, x1, y0, y1, n) => {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + rnd() * (x1 - x0), y = y0 + rnd() * (y1 - y0), l = 0.8 + rnd() * 1.6, a = rnd() * Math.PI;
    s += `<path d="M${f(x)},${f(y)}l${f(Math.cos(a) * l)},${f(Math.sin(a) * l)}" stroke="#ffffff" stroke-opacity="0.22" stroke-width="0.35" stroke-linecap="round"/>`;
  }
  return s;
};
// The lifted-paper shadow: the same shape, nudged down-right, soft and dark.
const shadow = (d) => `<path d="${d}" transform="translate(0.7,1.3)" fill="#1f3036" fill-opacity="0.2"/>`;
const C = {
  skinG: '#e8b48f', skinW: '#c98b62', hairG: '#5a3b2a',
  teal: '#2f6f7b', tealDark: '#245863', sage: '#9cc2b2', mustard: '#d9a441', mustardDark: '#bf8a2c',
  olive: '#8c8a4e', oliveDark: '#6f6d3c', coral: '#e07a68', coralDark: '#c4604f', cream: '#f3e7d3',
  hair: '#3a2a24', hairLight: '#4d382f', pantsW: '#5e8f86', pantsWDark: '#4a766e',
};
function torso(who) {
  const L = [[-8, 1], [-8.8, 9], [-9.2, 20], [-9.4, 32], [-9.8, 45], [-9.6, 58.5]];
  const R = [[9.2, 58.5], [9.6, 46], [10.6, 34], [11, 22], [10, 10], [7.5, 1.5]];
  const pts = [...L, ...R, [3.5, -1.6], [-3, -2]].map(([x, y]) => [x + jit(0.3), y + jit(0.2)]);
  const d = smooth(pts);
  const xAt = (side, y) => {
    const list = side < 0 ? L : [...R].reverse();
    for (let i = 1; i < list.length; i++) {
      if (y <= list[i][1]) {
        const [x0, y0] = list[i - 1], [x1, y1] = list[i];
        return x0 + ((x1 - x0) * (y - y0)) / (y1 - y0);
      }
    }
    return list[list.length - 1][0];
  };
  const strip = (y0, y1, color) => `<path d="M${f(xAt(-1, y0) + 0.2)},${f(y0 + jit(0.3))} L${f(xAt(1, y0) - 0.2)},${f(y0 + jit(0.3))} L${f(xAt(1, y1) - 0.2)},${f(y1)} L${f(xAt(-1, y1) + 0.2)},${f(y1)} Z" fill="${color}"/>`;
  const skin = who === 'guy' ? C.skinG : C.skinW;
  const neck = limb(18, 5.5, 6, 0, 0.15).d;
  let body = `<g transform="translate(0,-16)"><path d="${neck}" fill="${skin}"/></g>` + shadow(d) + `<path d="${d}" fill="${who === 'guy' ? C.teal : C.coral}"/>`;
  if (who === 'guy') body += [11, 21, 31, 41].map((y) => strip(y, y + 4.2, C.sage)).join('') + strip(52.5, 58.5, C.tealDark);
  else body += strip(52.5, 58.5, C.coralDark) + `<path d="M${f(-4)},-0.8 C-1,3.2 5,3.4 7.6,0.6 C5,1.8 -1,1.6 -4,-0.8Z" fill="${C.cream}"/>`;
  body += fibres(-8, 9, 4, 52, 14);
  return { vb: [-14, -18, 28, 80], body };
}
function upperArm(who) {
  const l = limb(31, 9.6, 8.2, -1.3);
  let body = shadow(l.d) + `<path d="${l.d}" fill="${who === 'guy' ? C.teal : C.coral}"/>`;
  if (who === 'guy') body += band(9, 12.8, l.widthAt, C.sage) + band(19, 22.8, l.widthAt, C.sage);
  return { vb: [-8, -6, 16, 44], body: body + fibres(-3, 3, 2, 28, 5) };
}
function forearm(who) {
  const sleeve = limb(19, 8.2, 7, 0);
  const cuffD = smooth([[-4.2, 17], [4.2, 16.8], [4.4, 21.4], [-4.3, 21.6]].map(([x, y]) => [x + jit(0.2), y]));
  // A mitten hand: palm plus a thumb toward the front.
  const hand = smooth([[-3, 21.5], [3.2, 21.5], [4.6, 25.5], [6.2, 26.5], [5.2, 28.6], [3.8, 28.4], [3.4, 32.5], [0.2, 34.2], [-3, 32.5], [-3.8, 27]]);
  const sleeveCol = who === 'guy' ? C.teal : C.coral, cuffCol = who === 'guy' ? C.tealDark : C.coralDark, skin = who === 'guy' ? C.skinG : C.skinW;
  let body = shadow(hand) + `<path d="${hand}" fill="${skin}"/>` + shadow(sleeve.d) + `<path d="${sleeve.d}" fill="${sleeveCol}"/>`;
  if (who === 'guy') body += band(5, 8.6, sleeve.widthAt, C.sage);
  body += `<path d="${cuffD}" fill="${cuffCol}"/>` + fibres(-2.5, 2.5, 1, 15, 4);
  return { vb: [-8, -5, 16, 42], body };
}
function thigh(who) {
  const l = limb(44, 15, 11.6, 1.6);
  return { vb: [-10, -9, 20, 62], body: shadow(l.d) + `<path d="${l.d}" fill="${who === 'guy' ? C.olive : C.pantsW}"/>` + fibres(-5, 5, 2, 40, 9) };
}
function shin(who) {
  const l = limb(39, 11.6, 9, 0.4);
  const main = who === 'guy' ? C.olive : C.pantsW, dark = who === 'guy' ? C.oliveDark : C.pantsWDark;
  return { vb: [-9, -7, 18, 54], body: shadow(l.d) + `<path d="${l.d}" fill="${main}"/>` + band(33.5, 38.5, (y) => l.widthAt(y) + 1, dark) + fibres(-4, 4, 2, 30, 7) };
}
function head(who) {
  const skin = who === 'guy' ? C.skinG : C.skinW;
  const face = smooth([[0, -10.6], [6.8, -8.2], [10, -3], [10.2, 2], [8, 7], [3.5, 9.8], [-2.5, 10.2], [-7.8, 7.2], [-10.4, 1.5], [-9.4, -5.4], [-5.6, -9.4]].map(([x, y]) => [x + jit(0.25), y + jit(0.25)]));
  const nose = smooth([[9, -0.6], [11.6, 1], [11.4, 3.2], [9.2, 3.6]]);
  let body = shadow(face) + `<path d="${face}" fill="${skin}"/><path d="${nose}" fill="${skin}"/>`;
  if (who === 'guy') {
    const tuft = smooth([[-10.6, -2], [-7, -1], [-7.4, 4.6], [-10.2, 4]]);
    const dome = smooth([[-11.2, -1.6], [-10, -8.6], [-4.6, -13.2], [2.6, -13.6], [8.6, -10], [11.2, -2.6]]);
    const cuff = smooth([[-12, -4.4], [11.8, -5.4], [12.2, -0.6], [-11.8, 0.4]]);
    body += `<path d="${tuft}" fill="${C.hairG}"/>` + shadow(dome) + `<path d="${dome}" fill="${C.mustard}"/>` + shadow(cuff) + `<path d="${cuff}" fill="${C.mustardDark}"/>`;
    body += [-7, -2, 3, 8].map((x) => `<path d="M${x},-4.6 L${x + 0.3},0" stroke="${C.mustard}" stroke-opacity="0.55" stroke-width="0.6" stroke-linecap="round"/>`).join('');
    body += shadow(smooth([[-3.6, -14], [-1, -17.4], [2, -14.6], [-0.6, -12.2]])) + `<circle cx="-0.6" cy="-14.6" r="3.2" fill="${C.mustard}"/>`;
  } else {
    const hairTop = smooth([[-11.6, 4.5], [-12.2, -4], [-8.8, -10.6], [-1.6, -13.4], [6, -11.6], [10.6, -6.4], [11.4, -2], [7.6, -6.4], [2.2, -7.8], [-1.4, -5], [-3.6, 1.4], [-7.4, 5.6]]);
    body += shadow(hairTop) + `<path d="${hairTop}" fill="${C.hair}"/><path d="M-6,-9 C-2,-11.4 3,-11 6.6,-8.6" stroke="${C.hairLight}" stroke-width="0.9" fill="none" stroke-linecap="round"/>`;
  }
  return { vb: [-16, -22, 32, 38], body: body + fibres(-7, 7, -6, 7, 5) };
}
function hairBack() {
  const back = smooth([[-11.4, -6], [-13.6, 6], [-14.4, 20], [-13.2, 34], [-11, 46], [-6.4, 50], [-1.6, 47.6], [-0.6, 40], [-3, 28], [-3.6, 14], [-1.2, -2], [-4, -9]]);
  const strand = smooth([[-11, 10], [-12, 24], [-10.6, 38], [-8.4, 46], [-8.8, 34], [-9.6, 22]]);
  return { vb: [-18, -14, 24, 70], body: shadow(back) + `<path d="${back}" fill="${C.hair}"/><path d="${strand}" fill="${C.hairLight}"/>` };
}

// Same order as the Figma build, so the seeded wobble comes out the same.
const P = {
  guy: { torso: torso('guy'), upperArm: upperArm('guy'), forearm: forearm('guy'), thigh: thigh('guy'), shin: shin('guy'), head: head('guy') },
  woman: { hairBack: hairBack(), torso: torso('woman'), upperArm: upperArm('woman'), forearm: forearm('woman'), thigh: thigh('woman'), shin: shin('woman'), head: head('woman') },
};
mkdirSync(OUT, { recursive: true });
for (const [who, parts] of Object.entries(P)) {
  for (const [name, part] of Object.entries(parts)) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${part.vb[2] * S}" height="${part.vb[3] * S}" viewBox="${part.vb.join(' ')}">${part.body}</svg>\n`;
    writeFileSync(`${OUT}${who}-${name}.svg`, svg);
  }
}
console.log('wrote', Object.values(P).reduce((n, p) => n + Object.keys(p).length, 0), 'parts');
