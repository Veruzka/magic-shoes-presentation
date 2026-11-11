// VISUAL CHECKS (docs/visual-checks.md): takes a screenshot of the page at any
// point in the scroll, optionally zoomed in on one area at 100%.
//
//   npm run check:shot -- --at 1 --out shots/end.png
//   npm run check:shot -- --at 0.85 --real --crop 1160,200,560,640 --out shots/pad.png
//
// Options:
//   --at 0–1         how far through the hero (0 = top, 1 = the end). Default 0.
//   --shoe Sketch    which Shoe option to pick first (Background/Sole: --background, --sole)
//   --real           use a VISIBLE Chrome with the graphics card (true sharpness, 2× on a Mac).
//                    Hidden Chrome can show jagged or blurry edges that real browsers don't.
//   --scale 2        hidden Chrome only: pixel density (default 2, like a Mac)
//   --width 1440 --height 900   window size (use 390 × 844 for a phone)
//   --css "…"        extra CSS to add first (e.g. to switch something off for a before/after)
//   --crop x,y,w,h   also save a zoomed crop, in screenshot pixels (2× = double the page's px)
//   --out file.png   where to save (default shots/shot.png; the shots/ folder isn't saved in git)
//
// Needs the local preview running (npm run dev).
import { openChrome, pick } from '../shared/chrome.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { execFileSync } from 'node:child_process';

const option = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
};
const flag = (name) => process.argv.includes(`--${name}`);

const at = Number(option('at', 0));
const out = option('out', 'shots/shot.png');
const real = flag('real');
const chrome = await openChrome({
  visible: real,
  width: Number(option('width', 1440)),
  height: Number(option('height', 900)),
  scale: Number(option('scale', 2)),
});
await chrome.open(option('url', 'http://localhost:5173'));
for (const name of ['background', 'shoe', 'sole']) {
  const choice = option(name, name === 'shoe' ? 'Sketch' : null);
  if (choice) await chrome.run(pick(choice));
}
await chrome.wait(2500); // the shoe takes a moment to prepare
const css = option('css', '');
if (css) await chrome.run(`(() => { const s = document.createElement('style'); s.textContent = ${JSON.stringify(css)}; document.head.append(s); })()`);
const progress = await chrome.run(`(async () => {
  const hero = document.querySelector('.hero');
  scrollTo(0, (hero.offsetTop + hero.offsetHeight - innerHeight) * ${at});
  await new Promise((r) => setTimeout(r, 1500)); // let the scroll smoothing settle
  return hero.dataset.progress;
})()`);
const shot = await chrome.send('Page.captureScreenshot', { format: 'png' });
chrome.close();

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, Buffer.from(shot.data, 'base64'));
console.log(`Saved ${out} (page showing progress ${progress})`);

const crop = option('crop', null);
if (crop) {
  const [x, y, w, h] = crop.split(',').map(Number);
  const cropOut = out.replace(/\.png$/, '-crop.png');
  execFileSync('sips', ['-c', String(h), String(w), '--cropOffset', String(y), String(x), out, '--out', cropOut], { stdio: 'ignore' });
  console.log(`Saved ${cropOut} (zoomed: ${w} × ${h} at ${x},${y})`);
}
