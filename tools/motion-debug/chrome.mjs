// Shared helper for the motion-debugging scripts: starts a fresh Chrome (nothing
// remembered), connects to it, and gives simple commands to drive the page.
//
//   visible: false → hidden Chrome (fast; good for checking the page's logic)
//   visible: true  → a real Chrome window using the graphics card (needed to see
//                    real frame rates; it pops up on screen while the test runs)
import { spawn } from 'node:child_process';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function openChrome({ visible = false, width = 1440, height = 900 } = {}) {
  const port = 9300 + Math.floor(Math.random() * 600);
  const args = [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${process.env.TMPDIR || '/tmp'}/motion-debug-${port}`, // fresh profile every time
    '--no-first-run',
    '--no-default-browser-check',
    `--window-size=${width},${height + 60}`,
    'about:blank',
  ];
  if (!visible) args.unshift('--headless=new', '--hide-scrollbars');
  const chrome = spawn(CHROME, args, { stdio: 'ignore' });

  let target;
  for (let i = 0; i < 60 && !target; i++) {
    await wait(250);
    try {
      const pages = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      target = pages.find((page) => page.type === 'page');
    } catch {
      // Chrome isn't ready yet.
    }
  }
  if (!target) throw new Error('Could not start Chrome.');

  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve) => (socket.onopen = resolve));
  let id = 0;
  const pending = {};
  socket.onmessage = (message) => {
    const data = JSON.parse(message.data);
    pending[data.id]?.(data.result);
  };
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      pending[++id] = resolve;
      socket.send(JSON.stringify({ id, method, params }));
    });

  if (!visible) {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
  }

  return {
    wait,
    // Go to a page and give it a moment to settle.
    async open(url) {
      await send('Page.navigate', { url });
      await wait(3000);
    },
    // Run some JavaScript in the page and get the result back.
    async run(code) {
      const result = await send('Runtime.evaluate', { expression: code, awaitPromise: true, returnByValue: true });
      return result?.result?.value;
    },
    // One real mouse-wheel "notch" (positive = down, negative = up).
    async wheel(deltaY) {
      await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: width / 2, y: height / 2, deltaX: 0, deltaY });
    },
    close() {
      socket.close();
      chrome.kill();
    },
  };
}

// Clicks a Style lab option by its label (e.g. 'Sketch'), if it's there.
export const pick = (label) =>
  `[...document.querySelectorAll('.option-switcher__option')].find((b) => b.textContent === ${JSON.stringify(label)})?.click()`;
