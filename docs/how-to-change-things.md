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

## Layers coming apart (Sketch shoe)
**What:** as you scroll, the Sketch shoe comes apart from the bottom up, like puzzle pieces. Each piece leaves a clean gap and a soft sketch outline on what's left.
1. **Gray rubber sole:** moves during 0–30% of the scroll. Its top surface has the molded tread.
2. **White foam midsole** (with the clear pods): starts midway (15%) and finishes at 45%. It travels about a third as far as the gray sole, so there's more space below it than above it. Its top surface is a smooth matte tray with a raised lip, with a small **wireless-charging sensor** lying in the middle: a copper coil on a black disc, two copper wires, and a green circuit board.

**Files:**
- `src/shoes/sketch-sole.js`: the gray sole layer.
- `src/shoes/sketch-midsole.js`: the white midsole layer.
- `src/shoes/sketch-sensor.js`: the sensor on the white midsole (position, size, colors).
- `src/components/sensor-drawing.js`: how the sensor is drawn (careful).
- `src/shoes/sole-moves.js`: the path all layers follow (Down-left / Down).
- `src/shoes/index.js`: the order of the layers (`layers: [sketchSole, sketchMidsole]`).
- `src/components/separating-shoe.js`: how the cutting and motion work (ask me).

**Safe to change, in each layer file:**
- `stage`: when it moves, as fractions of the scroll. For example `start: 0.15, end: 0.45`.
- `travel`: how far it goes, as a share of the chosen path (`1` is all of it, `0.5` is half).
- `topFace`:
  - gray sole: `tread` sets the ridges
  - white midsole: `floorLight`, `floorDark`, `lipWidth`, `lipLight`, `recessShade` and `grain` set the tray
- **Sensor** (`sketch-sensor.js`):
  - `along`: toe (0) to heel (1)
  - `across`: tray's near edge (0) to far edge (1)
  - `size`: the coil's width; it shrinks by itself if it wouldn't fit the tray
  - it always lies along the shoe (coil toward the toe, board toward the heel), flat on the tray floor
  - `coilRings`, and every color (copper, disc, board…)
- `outline`: the soft sketch line along the new edge (`colour`, `width`).

**How each cut works:** the cut follows one smooth **seam** where a layer meets the part above it, never pixel by pixel.
- **Gray sole:** the cut stops at the white foam.
- **White midsole:** the cut stops at the colored cork or cream toe cap.
- **Below the seam:** everything leaves with the layer.
- **Just above the seam:** a thin clean-up strip catches leftover bits.
- **The drawing's own outer outline** is always kept.

These seam settings are careful territory: `seam`, `cleanup`, `alsoLayer` (traced outline areas, like the toe bumper), `mustContain` (the white layer only exists where real white foam is) and `minThickness` (anything thinner is ignored, so no strings).

> **Example:** to make the white midsole start later, change `stage: { start: 0.15, end: 0.45 }` to `{ start: 0.25, end: 0.55 }` in `sketch-midsole.js`. To make the gray sole drop even further, change `y: 160` to `y: 200` in `sole-moves.js`. To make the sensor bigger, change `size: 115` to `size: 140` in `sketch-sensor.js`.

---

## Style lab card (prototype tool)
**What:** the glass card in the top-right corner, headed "STYLE LAB". It has one row per setting (Background, Shoe, Sole). Each row has a segmented pill, and the chosen option sits on a soft white "thumb".
**Files:** `src/components/option-switcher.js` and `.css`. The card's heading and rows are set in `src/main.js`.
**Safe to change:**
- the heading text (`'Style lab'` in `main.js`) and each row's `title`
- the glass look ("glassmorphism"), in `base.css`:
  - `--glass-card-bg`: the milky tint
  - `--glass-card-blur`: how strongly what's behind is blurred
  - `--glass-card-border`: the thin white border
  - `--glass-card-grain`: the fine grain
  - `--glass-card-shadow`: the soft shadow
  - `--glass-divider`, `--glass-track`, `--glass-track-border` and `--glass-thumb`: the hairlines and the glass pills

> **Example:** for a milkier glass, raise the `0.24` in `--glass-card-bg` to `0.35`. For a stronger grain, raise `--glass-card-grain` from `0.22` to `0.3`.

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
| `separatingShoe(shoe, move)` | `src/components/separating-shoe.js` | Splits the Sketch drawing into layers and moves each one on scroll | shoe (with `layers`) + path → the shoe and its controls | Ask me |
| `splitDrawing(...)` / `cutLayer(...)` | `src/components/separating-shoe.js` | Cuts each layer out, bottom up, and draws the outlines | drawing + layer settings → one picture per layer + the body | Ask me |
| `drawSensor(ctx, centre, sensor, outline)` | `src/components/sensor-drawing.js` | Draws the charging sensor (coil, wires, board) flat on the tray | where + settings → the drawing | Ask me |
| `drawTreadFace(...)` / `drawTrayFace(...)` | `src/components/separating-shoe.js` | Paints a layer's top surface (gray tread / white foam tray) | layer settings → painted surface | Ask me |
| `optionSwitcher({ title, options, current, onPick })` | `src/components/option-switcher.js` | Makes one row of the Style lab card (name + segmented pill) | title, list, current pick, what to do on click → the row | Careful |
| `switcherPanel(heading, ...rows)` | `src/components/option-switcher.js` | Makes the frosted Style lab card that holds the rows | heading text + rows → the card | Careful |
| `infoButton()` | `src/components/info-panel.js` | Makes the "i" button and its panel | nothing → the button | Careful |
| `createParallax()` | `src/core/parallax.js` | Moves layers at different speeds on scroll (`data-speed`) | nothing → controls (refresh, stop) | Ask me |
| `watchScrollProgress(element, onProgress)` | `src/core/scroll-progress.js` | Reports scroll through an element as 0–1 | element + what to do with the number → controls | Ask me |
| `loadChoice(name, options)` / `saveChoice(name, option)` | `src/core/remember-choice.js` | Remembers your last pick in this browser | a name + list → the remembered option | Careful |
| `cloudStudio.build()` / `flowerMeadow.build()` | `src/backgrounds/…` | Draws a background | nothing → the background | Careful |

- **Safe:** change freely.
- **Careful:** fine to change the wording or numbers, but not the structure.
- **Ask me:** the logic is fiddly, so tell me what you want and I'll change it.
