// STEP 2 of the motion-debugging playbook (docs/debugging-motion.md):
// "Is the page's logic right?"
//
// Opens a fresh, hidden Chrome, switches to the Sketch shoe, then scrolls with
// real mouse-wheel notches — down, back up, and down again — and prints what
// the page is doing after every few notches. If the logic is right, both
// "down" passes print the same story, in order.
//
// Run (with `npm run dev` going in another terminal):
//   npm run debug:walk
import { openChrome, pick, notchesToEnd } from '../shared/chrome.mjs';

const URL = process.argv[2] || 'http://localhost:5173';
const NOTCH = 100; // pixels per notch

// What we read from the page after each notch.
const READ_STATE = `(() => {
  const hero = document.querySelector('.hero');
  const labels = [...document.querySelectorAll('.part-note')].map((n) => Math.round(parseFloat(n.style.opacity || 0) * 100));
  const flight = document.querySelector('.fsr-flight');
  return {
    scroll: Math.round(scrollY),
    progress: hero.dataset.progress,                 // what the page is currently showing (0–1)
    labels: labels.join('/'),                        // how visible each label is (%)
    fsr: flight ? (flight.hidden ? 'in pocket' : 'flying') : '-',
    scene: document.querySelector('.hero__scene')?.style.translate || '',
    sketch: document.querySelector('.fsr-flight__sketch')?.style.clipPath || '-',  // chapter 3: how much is sketch
  };
})()`;

const chrome = await openChrome({ visible: false });
await chrome.open(URL);
await chrome.run(pick('Sketch'));
await chrome.wait(2500);
const NOTCHES = await chrome.run(notchesToEnd(NOTCH)); // enough to reach the end, however long the page gets

for (const [name, direction] of [['DOWN (first pass)', 1], ['UP', -1], ['DOWN (second pass)', 1]]) {
  console.log(`\n--- ${name} ---`);
  for (let i = 0; i < NOTCHES; i++) {
    await chrome.wheel(NOTCH * direction);
    await chrome.wait(120);
    if (i % 3 === 2) console.log(JSON.stringify(await chrome.run(READ_STATE)));
  }
  await chrome.wait(1500);
}
chrome.close();
