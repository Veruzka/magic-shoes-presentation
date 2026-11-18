// STEPS 3–4 of the motion-debugging playbook (docs/debugging-motion.md):
// "Is the browser keeping up?" and "What's slowing it down?"
//
// Opens a VISIBLE Chrome window (it uses the graphics card, like a real visitor),
// switches to the Sketch shoe, scrolls down notch by notch and reports every
// "stall": a gap between drawn frames longer than 50 ms. Smooth = ~16 ms.
//
// With `--suspects`, it repeats the run once per suspect, each time switching
// ONE visual off with a bit of CSS, so you can see which one causes the stalls.
//
// Run (with `npm run dev` going in another terminal; don't click the window):
//   npm run debug:stalls              → one run, everything on
//   npm run debug:stalls -- --suspects → one run per suspect
import { openChrome, pick, notchesToEnd } from '../shared/chrome.mjs';

const URL = 'http://localhost:5173';

// Each suspect = a name + CSS that switches that one thing off. Add new ones
// here when new visuals are added to the page.
const SUSPECTS = [
  ['everything on (baseline)', ''],
  ['no labels', '.part-note{display:none!important}'],
  ['no glass card', '.switcher-panel{display:none!important}'],
  ['no cloud pictures', '.clouds__layer{display:none!important}'],
  ['no shoe shadows', '.separating-shoe__picture,.separating-shoe__original{filter:none!important}'],
  ['no flying FSR', '.fsr-flight{display:none!important}'],
  ['no paper (chapter 3)', '.fsr-paper{display:none!important}'],
  ['no sketch (chapter 3)', '.fsr-flight__drawing{display:none!important}'],
  ['no callouts (chapter 3)', '.callouts{display:none!important}'],
  ['no 3D turn (chapter 3)', '.fsr-flight__door{transform:none!important}'],
  ['no 3D shoe (Twinkle Toes)', '.shoe-stage{display:none!important}'],
];

async function measure(name, css) {
  const chrome = await openChrome({ visible: true });
  await chrome.open(URL);
  await chrome.run(pick('Sketch'));
  await chrome.wait(2500);
  await chrome.run(`(() => { const s = document.createElement('style'); s.textContent = ${JSON.stringify(css)}; document.head.append(s); })()`);
  // Track the longest gap between frames since we last asked.
  await chrome.run(`(() => { window.__gap = 0; let last = performance.now();
    const loop = (t) => { window.__gap = Math.max(window.__gap, t - last); last = t; requestAnimationFrame(loop); };
    requestAnimationFrame(loop); })()`);
  await chrome.wait(800);
  await chrome.run('window.__gap = 0');

  const stalls = [];
  let worst = 0;
  const notches = await chrome.run(notchesToEnd(120)); // enough to reach the end, however long the page gets
  for (let i = 0; i < notches; i++) {
    await chrome.wheel(120);
    await chrome.wait(90);
    const [gap, progress] = await chrome.run(
      `(() => { const g = Math.round(window.__gap); window.__gap = 0; return [g, document.querySelector('.hero').dataset.progress]; })()`,
    );
    worst = Math.max(worst, gap);
    if (gap > 50) stalls.push(`${gap}ms at ${progress}`);
  }
  chrome.close();
  console.log(`${name}: longest frame ${worst}ms; stalls: ${stalls.join(', ') || 'none'}`);
}

const runs = process.argv.includes('--suspects') ? SUSPECTS : SUSPECTS.slice(0, 1);
for (const [name, css] of runs) await measure(name, css);
