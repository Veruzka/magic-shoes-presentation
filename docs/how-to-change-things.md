# How to change things

Each section below covers one part of the app: what it does, where it lives, and what's safe to change. "Safe" means you can change the value and the worst case is it looks different. Nothing breaks.

**Tip:** with `npm run dev` running, save the file and the browser updates by itself.

---

## Shared look (colors, fonts, sizes, shadows, motion)
**What:** the values every part of the app shares.
**File:** `src/styles/base.css`, at the top, inside `:root`.
**Safe to change:** every value there.
- `--color-text`: the main brown text color.
- `--font-body`: the main font.
- `--radius-pill` and `--radius-panel`: how round the corners are.
- `--shadow-ui` and `--shadow-shoe`: the shadows.
- `--duration-float`: how long one float of the shoe takes.

> **Example:** to make the shoe float more slowly, change `--duration-float: 4s;` to `--duration-float: 6s;`.

See [design-spec.md](design-spec.md) for the full list.

---

## Clouds background (the main look)
**What:** cream sky, soft misty clouds along the bottom, and a beige box under the shoe.
**Files:**
- `src/backgrounds/cloud-studio.css`: colors, how misty the clouds are, the box.
- `src/backgrounds/cloud-studio.js`: the "wispy edge" texture and how fast the cloud layers move.
- `src/data/clouds.js`: the shape of each cloud and where it sits.

**Safe to change:**
- **Colors** at the top of `cloud-studio.css`: `--cream-top`, `--cream-middle`, `--cream-bottom` (the sky) and `--box-top`, `--box-left`, `--box-right` (the box).
- **Wispiness**, in `cloud-studio.js`, inside the `cloud-texture` filter:
  - `baseFrequency`: a smaller number makes bigger, lazier wisps.
  - `scale`: a bigger number makes raggeder edges.
- **Cloud positions:** each line in `clouds.js` has `x`, `y` (percent of the screen), `size` (percent of the screen width), `layer` (`'back'` or `'front'`) and `flip`.
- **Scroll speeds:** `LAYER_SPEEDS` in `cloud-studio.js`. Positive means slower than the page (feels far); negative means faster (feels close).

> **Example:** to make the sky warmer and darker at the bottom, change `--cream-bottom: #e4d3b8;` to `--cream-bottom: #d9c29f;` in `cloud-studio.css`.

---

## Meadow background
**What:** blurry flowers framing the middle, with a dark tint.
**Files:** `src/backgrounds/flower-meadow.css` (colors, blur, tint), `src/backgrounds/flower-meadow.js` (layer speeds), `src/data/flowers.js` (each flower).
**Safe to change:**
- **Flower colors and the base color** at the top of the CSS: `--flower-pink`, `--meadow-base` and others.
- **Blur per depth:** `.meadow__layer--far`, `--mid` and `--near` set `blur(…)`.
- **Darkness:** `--tint` and `--tint-soft`.
- **Each flower:** a line in `flowers.js`, with `layer`, `kind` (`bloom`, `daisy`, `leaf` or `glow`), `color`, `x`, `y`, `size` and `turn`.

> **Example:** to make the meadow background darker, change `--tint: rgb(14 16 10 / 0.6);` to `/ 0.75` in `flower-meadow.css`.

Flowers near the middle fade out on their own, so the shoe always keeps its clear space.

---

## Shoe area and float
**What:** how big the shoe is, the empty space around it, and the gentle up-and-down float.
**File:** `src/styles/hero.css`
**Safe to change:**
- `--shoe-width`: the shoe area size. It's `min(70vw, 460px)`: 70% of the screen width, never more than 460px.
- `--shoe-clear-space`: the empty space around the shoe. It's 32px, as you asked.
- `--fan-scroll-length`: how much scrolling the coming-apart animation takes.
- The `shoe-float` steps: how high the shoe rises and how much it tilts.

> **Example:** to make the shoe bigger on desktop, change `460px` to `540px` in `--shoe-width`.

---

## Shoe styles
**What:** the list of shoes you can switch between.
**File:** `src/shoes/index.js`
**Safe to change:** the `label` (the switcher text) and the `alt` (a description for screen readers). To add a shoe, put a cut-out image in `src/assets/` and add one entry.

---

## Detaching gray sole (Sketch shoe)
**What:** as you scroll, the Sketch shoe's gray bottom sole slides away, leaving a clean gap. The sole's hidden top surface is painted gray.
**Files:**
- `src/shoes/sole-moves.js`: where the sole travels to.
- `src/shoes/sketch-sole.js`: where the gray sole is in the drawing and how its top surface looks.
- `src/components/separating-shoe.js`: the motion (careful).

**Safe to change:**
- **Travel:** in `sole-moves.js`, `x` and `y` (pixels on a desktop-size shoe) and `turn` (degrees) for each option.
- **Tread texture** on the sole's top surface: flowing molded ridges, with swirls at the toe and heel and long waves through the middle. The settings are `topFace.tread` in `sketch-sole.js`:
  - `spacing`: distance between ridges (bigger means fewer, wider ridges).
  - `ridgeLight`: how bright the lit side of each ridge is.
  - `grooveDark`: how dark the grooves are.
  - `waviness`: how much the waves meander (0 gives straight lines).
- **Top surface:** `topFace` in `sketch-sole.js`:
  - `depth`: how deep it looks.
  - `grainSoftness`: how blurry the grain is.
  - `farEdgeShade`: how much darker the far edge is.
- **Timing:** `SOLE_STAGE` at the top of `separating-shoe.js`. `end: 0.3` means "finished after 30% of the scroll".

**How the cut works:** the sole is cut along one smooth line, the **seam**, where the gray rubber meets the white foam. Everything below the seam leaves with the sole (gray, shine, ink, edge glow) and everything above stays on the shoe, like a puzzle cut. The seam settings are in `seam` in `sketch-sole.js`:
- `smoothing`: how smooth the cut line is (bigger is smoother).
- `edgeBlend`: how soft the cut edge is, in pixels.
- `foamBrightness`, `foamMaxColour`, `upperMinColour`, `foamRunToStop`: how the seam is found (careful).
- `cleanupBand` and `cleanupDarkerThan`: a thin clean-up strip just above the cut. Dark ink or gray bits inside it also leave with the sole, so the foam left behind is pure white. Make `cleanupBand` bigger if a dark line is ever left on the foam.
- `outline`: the thin ink line drawn along the shoe's new bottom edge, so it matches the drawing's own outline (as on the back of the heel). It has a `colour` and a `width`, and `keepWithin` stops the clean-up from erasing the drawing's real outline.
- `alsoSole`: an outline of extra areas that always leave with the sole. Right now that's the rubber toe bumper, whose light-gray shine would otherwise be mistaken for foam. If a bit of gray is ever left behind, add its area here.

> **Example:** to make the sole drop further, change `y: 100` to `y: 150` in `sole-moves.js`. To make the tread ridges bolder, change `spacing: 26` to `spacing: 34` in `sketch-sole.js`.

---

## Switcher pills (prototype tool)
**What:** the frosted pills in the top-right corner for comparing options.
**Files:** `src/components/option-switcher.js` and `.css`. They're added in `src/main.js`.
**Safe to change:** the `title` text in `main.js`, and the look in the CSS.

---

## Info button and panel
**What:** the "i" in the bottom-right corner. It opens a panel that shows [architecture.md](architecture.md) and [design-improvements.md](design-improvements.md).
**Files:** `src/components/info-panel.js` and `.css`.
**Safe to change:** the panel's width and look in the CSS. To change what the panel *says*, edit the docs, not the code.

---

## Set aside: the 5-part exploded view
**Files:** `src/components/exploding-shoe.js`, `src/shoes/sketch-parts.js`, `src/assets/sketch-parts/`. It isn't shown right now. Leave it alone unless we bring it back.

---

## Main functions
"In" is what you give the function; "out" is what it gives back.

| Function | File | What it does | In → Out | Safe to edit? |
|---|---|---|---|---|
| `hero()` | `src/sections/hero.js` | Builds the first screen | nothing → the section | Careful |
| `showBackground(section, background)` | `src/sections/hero.js` | Swaps the background and the text colors | hero + a background → nothing | Careful |
| `showShoe(section, shoe)` | `src/sections/hero.js` | Swaps the shoe; turns pinning on for shoes that come apart | hero + a shoe → nothing | Careful |
| `setShoeOpening(section, progress)` | `src/sections/hero.js` | Tells the shoe how far apart to be | hero + a number 0–1 → nothing | Careful |
| `setSoleMove(section, move)` | `src/sections/hero.js` | Switches the sole's path | hero + a move → nothing | Careful |
| `separatingShoe(shoe, move)` | `src/components/separating-shoe.js` | Splits the Sketch drawing into body + sole and moves the sole | shoe + move → the shoe and its controls | Ask me |
| `splitDrawing(...)` / `drawTopFace(...)` | `src/components/separating-shoe.js` | Cuts out the gray sole and paints its top surface | drawing + sole settings → two pictures | Ask me |
| `optionSwitcher({ title, options, current, onPick })` | `src/components/option-switcher.js` | Makes one switcher pill | title, list, current pick, what to do on click → the pill | Careful |
| `infoButton()` | `src/components/info-panel.js` | Makes the "i" button and its panel | nothing → the button | Careful |
| `createParallax()` | `src/core/parallax.js` | Moves layers at different speeds on scroll (`data-speed`) | nothing → controls (refresh, stop) | Ask me |
| `watchScrollProgress(element, onProgress)` | `src/core/scroll-progress.js` | Reports scroll through an element as 0–1 | element + what to do with the number → controls | Ask me |
| `loadChoice(name, options)` / `saveChoice(name, option)` | `src/core/remember-choice.js` | Remembers your last pick in this browser | a name + list → the remembered option | Careful |
| `cloudStudio.build()` / `flowerMeadow.build()` | `src/backgrounds/…` | Draws a background | nothing → the background | Careful |

- **Safe:** change freely.
- **Careful:** fine to change the wording or numbers, but not the structure.
- **Ask me:** the logic is fiddly, so tell me what you want and I'll change it.
