# Tools and setup

Every helper tool we use while building, what it's for, and the quirks of this Mac that make them work. All tools live in `tools/` and run from the `magic-shoes` folder. Most need the local preview running in another terminal (`npm run dev`).

## The tools at a glance
| Command | What it does | Read more |
|---|---|---|
| `npm run dev` | Starts the local preview at http://localhost:5173 | [README.md](README.md) |
| `npm run build` | Builds the site the way Vercel does; a quick "does it still work" check | |
| `npm run check:shot -- --at 1` | Screenshot at any point in the scroll, optionally zoomed in on one area | [visual-checks.md](visual-checks.md) |
| `npm run debug:walk` | Scrolls with real wheel notches and prints what the page is doing (logic check) | [debugging-motion.md](debugging-motion.md) |
| `npm run debug:stalls` | Measures slow frames in a visible Chrome (smoothness check); add `-- --suspects` to find the culprit | [debugging-motion.md](debugging-motion.md) |
| `npm run image:cutout -- in.png out.png` | Removes an image's background and crops to the object | below |
| `npm run image:outline -- image.png 10` | Lists where the object starts and ends on every 10th row (find centres and widths) | below |
| `npm run image:bands -- image.png row 264` | Lists the bright, dark and see-through bands across one row or column (find exact line positions) | below |
| `npm run sound:web` | Makes the small web copy (.m4a) of every new sound original, using the Mac's built-in `afconvert` | [sound-library.md](sound-library.md) |

## Making a new AI image (the image pipeline)
1. **Generate** it with Figma AI in the file **"Magic Shoes – assets"** (Graft team, https://www.figma.com/design/mnHnLX6S7rs63N8YTt9Igh). Use the prompt template in [electronics-style-guide.md](electronics-style-guide.md) for electronics. Each image is one frame on Page 1, left to right in the order made.
2. **Download the full-size original** into `design/originals/` and name it after the asset it becomes, plus `-original` (e.g. `fsr-render-front-original.png`). Originals are never edited, so any step can be redone.
3. **Cut it out:** `npm run image:cutout -- design/originals/x-original.png src/assets/x.png`
4. **Measure it** (for anything the code lines up with):
   - `npm run image:outline -- src/assets/x.png 4`: the widest rows give a round part's centre and width.
   - `npm run image:bands -- src/assets/x.png row 264`: exact positions of lines (S = silver/bright, K = black, . = see-through).
5. **Record it:**
   - the prompt in [changelog.md](changelog.md)
   - the image, its Figma frame and its cost in [architecture.md](architecture.md) and [design/originals/README.md](../design/originals/README.md)

**Credits:** at most 2–3 tries per image, then ask before spending more.

## Quirks of this Mac (and the fixes)
| Quirk | What you'd see | The fix (already built in) |
|---|---|---|
| The newest macOS toolkit (SDK 27.0) doesn't match the installed Swift | the image tools fail to build | `tools/images/run.sh` uses `MacOSX26.5.sdk`; override with `SWIFT_SDK=/path/to/sdk` |
| Node 20 has no built-in browser connection (WebSocket) | "WebSocket is not defined" | the npm scripts add `--experimental-websocket` |
| Git doesn't know who you are on this Mac | "Please tell me who you are" when committing | commits are made with your name and email passed in each time (not stored in settings) |
| The Playwright browser (used by Claude) can be locked by another Claude session | "browser is already in use" | our scripts start their own fresh Chrome (`tools/shared/chrome.mjs`) instead |
| Hidden (headless) Chrome draws without the graphics card | perfect frame rates that aren't real; jagged edges that aren't real | use `--real` / `debug:stalls`, which open a visible window |
| Google Chrome must be installed at `/Applications/Google Chrome.app` | "Could not start Chrome" | change the path at the top of `tools/shared/chrome.mjs` |

## Where things are
- `tools/shared/chrome.mjs`: starts and drives a fresh Chrome. All the browser tools use it.
- `tools/motion-debug/`: logic and smoothness checks.
- `tools/visual-check/`: screenshots and zoomed crops.
- `tools/images/`: cut-out and measuring tools (built automatically the first time; the builds sit in `tools/images/.build`, not saved in git).
- `tools/sounds/`: the sound converter.
- `design/originals/`: the untouched AI originals.
- `sounds/`: the untouched sound originals. Their web copies are in `public/sounds/`.
- `shots/`: screenshots from `check:shot` (not saved in git; delete any time).
