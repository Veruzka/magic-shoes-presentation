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
- **Wispiness**, in `cloud-studio.js`, in `TEXTURE`:
  - `baseFrequency`: a smaller number makes bigger, lazier wisps.
  - `scale`: a bigger number makes raggeder edges.
  - Each cloud layer is drawn **once** into a picture with this texture baked in, then just slides for the parallax. (Running the texture live made every frame stutter.)
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

## Chapter 2: FSR transition to the next section
**What:** after the labels appear, scrolling on makes the FSR lift out of the white midsole, turn upright to face you, and grow to the center, while the shoe scene scrolls away and the next section's background rises in. It stops with the FSR big and centered.
**Files:**
- `src/shoes/fsr-transition.js`: all the timings and sizes (safe to change).
- `src/sections/hero-timeline.js`: how long each chapter lasts, in screen-heights (safe to change).
- `src/components/fsr-transition.js`: the motion (ask me).

**Safe to change** (each stage is a stretch of chapter 2, from 0 to 1):
- `labelsOut`: when the labels fade away.
- `lift`: lifting out of the pocket. `rise` is how many pixels up it moves, `grow` how much bigger it gets.
- `turn`: turning upright and gliding to the center.
- `grow`: growing; `finalHeight` is its final size as a share of the screen height.
- `sceneAway`: when the shoe scene scrolls away.
- `nextBackground`: the next section's color.

> **Example:** to make the FSR end bigger, change `finalHeight: 0.75` to `0.85`. To give chapter 2 more scrolling, change `exit: 1.8` to `2.4` in `hero-timeline.js`.

---

## Big title ("Magic Shoes")
**What:** the huge title behind the shoe, with the shoe floating in front of its lower part.
**Files:** `src/components/hero-title.js` and `.css`. The text is set in `src/sections/hero.js` (`heroTitle('Magic Shoes')`).
**Safe to change:**
- in `hero-title.css`: `--title-size` (how big), `--title-top` (how far down; lower means the shoe overlaps more of it), `font-stretch` (narrower or wider letters) and `letter-spacing`
- the font: `--font-title` in `base.css` (Bricolage Grotesque, extra bold)
- the color: `inkColors.title` in each background file (sand on Clouds, see-through cream on Meadow)

> **Example:** to have the shoe cover more of the title, change `--title-top: calc(27vh - 80px)` to `calc(27vh - 40px)`.

---

## Shoe area and float
**What:** how big the shoe is, the empty space around it, and the gentle up-and-down float.
**File:** `src/styles/hero.css`
**Safe to change:**
- `--shoe-width`: the shoe area size. It's `min(70vw, 460px)`: 70% of the screen width, never more than 460px.
- `--shoe-clear-space`: the empty space around the shoe. It's 32px, as you asked.
- How much scrolling the pinned hero takes is set in `src/sections/hero-timeline.js` (chapter 1 `fan: 1.6`, chapter 2 `exit: 1.8`, in screen-heights).
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
1. **Gray rubber sole:** moves during 0–41% of the scroll. Its top surface has the molded tread.
2. **White foam midsole** (with the clear pods): starts just after the gray sole (7%) and finishes at 48%, so the two separate together. It travels about a third as far as the gray sole, so there's more space below it than above it. Its top surface is a smooth matte tray with a raised lip, with the **FSR** (force-sensing resistor) lying in a keyhole-shaped pocket in the middle. The FSR is a 3D render of the real part: a round black pad with silver lines, a mint-teal tail and a white tab with two pins.

**Files:**
- `src/shoes/sketch-sole.js`: the gray sole layer.
- `src/shoes/sketch-midsole.js`: the white midsole layer.
- `src/shoes/sketch-sensor.js`: the FSR on the white midsole (look, position, size, pocket).
- `src/assets/fsr-render.png`: the high-end 3D render of the FSR (made with Figma AI, then cut out), used in the shoe and in chapter 2. The earlier render is `fsr-render-v1.png`. To switch back, import it in `sketch-sensor.js` and restore its measurements (in git history).
- `src/shoes/sketch-labels.js`: the **part labels**: title, description, where the text sits and where the arrow points. Edit the wording here.
- `src/components/part-labels.js` and `.css`: how the labels and arrows are drawn (fonts, sizes, arrow style).
- `src/components/sensor-drawing.js`: how the sensor is drawn (careful).
- `src/shoes/sole-moves.js`: the path all layers follow (Down-left / Down).
- `src/shoes/index.js`: the order of the layers (`layers: [sketchSole, sketchMidsole]`).
- `src/components/separating-shoe.js`: how the cutting and motion work (ask me).

**Safe to change, in each layer file:**
- `stage`: when it moves, as fractions of the scroll. For example `start: 0.15, end: 0.45`.
- `travel`: how far it goes, as a share of the chosen path (`1` is all of it, `0.5` is half). The white midsole uses `'even'`: it's worked out automatically so the gap above it and the gap below it are the same.
- In `sole-moves.js`, `lift` sets how far the whole shoe rises while it opens, so the taller stack stays centered.
- `topFace`:
  - gray sole: `tread` sets the ridges
  - white midsole: `floorLight`, `floorDark`, `lipWidth`, `lipLight`, `recessShade` and `grain` set the tray
- **Sensor** (`sketch-sensor.js`):
  - `look`: `'render'` (the 3D render of the real FSR) or `'drawn'` (the earlier copper coil and green board, drawn in code)
  - `along`: toe (0) to heel (1)
  - `across`: tray's near edge (0) to far edge (1)
  - `size`: the round pad's width; it shrinks by itself if it wouldn't fit the tray with space around it
  - it always lies along the shoe (coil toward the toe, board toward the heel), flat on the tray floor
  - `turn`: fine-tunes its angle in degrees; positive turns the head (coil) to the left, negative to the right
  - `pocket`: the shallow pocket pressed into the foam that the sensor sits in (keyhole-shaped for the render). `padding` sets the space around the sensor, `rim` the raised edge's width, `floorColour` and `rimColour` the colors, `wallShade` the shadow along the far wall, and `texture` the faint wavy pattern on its floor.
  - `coilRings`, and every color (copper, disc, board…)
- `outline`: the soft sketch line along the new edge (`colour`, `width`).

**How each cut works:** the cut follows one smooth **seam** where a layer meets the part above it, never pixel by pixel.
- **Gray sole:** the cut stops at the white foam.
- **White midsole:** the cut stops at the colored cork or cream toe cap.
- **Below the seam:** everything leaves with the layer.
- **Just above the seam:** a thin clean-up strip catches leftover bits.
- **The drawing's own outer outline** is always kept.

These seam settings are careful territory: `seam`, `cleanup`, `alsoLayer` (traced outline areas, like the toe bumper), `mustContain` (the white layer only exists where real white foam is) and `minThickness` (anything thinner is ignored, so no strings).

> **Labels:** each one in `sketch-labels.js` has `title`, `text`, `part` (which piece it moves with), `at` (where the text sits, in drawing pixels), `align` (`'right'` for labels on the left of the shoe, `'left'` for the right) and `arrow` (`from`, `to` and `bend`; `to: 'sensor'` points at the sensor wherever it lands). Labels only appear **after every part has finished moving**: keep scrolling and they fade in **one by one**: Outsole, then Midsole exactly when Outsole is fully shown, then FSR, in even steps, while nothing moves. The page ends with the hero, so scrolling never moves you past it. When you scroll back, they fade out first and then the shoe closes. The timing is `labelTiming` at the top of `sketch-labels.js`: `start` (when the first one begins), `fade` (how long each fade takes) and `each` (the step between labels; equal to `fade` means each starts right as the previous finishes).

> **Example:** to make the white midsole start later, change `stage: { start: 0.07, end: 0.48 }` to `{ start: 0.15, end: 0.5 }` in `sketch-midsole.js`. To make the gray sole drop even further, change `y: 160` to `y: 200` in `sole-moves.js`. To let the FSR come out bigger, lower `pocket.padding` (the space it keeps around itself) in `sketch-sensor.js`. It's limited by how deep the tray floor is.

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

## Motion debugging tools
**What:** two scripts for checking scroll effects. See the playbook, [debugging-motion.md](debugging-motion.md).
**Files:** `tools/motion-debug/`.
- `npm run debug:walk`: scrolls notch by notch in a hidden Chrome and prints what the page shows at each step (checks the logic).
- `npm run debug:stalls`: measures slow frames in a visible Chrome window. Add `-- --suspects` to switch off one visual at a time.

**Safe to change:** the `SUSPECTS` list in `frame-stalls.mjs` (add new visuals as they're built).

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
| `flyingFsr(stage, shoe, settings)` | `src/components/fsr-transition.js` | The FSR that flies out of the shoe to the center in chapter 2 | the screen + the shoe's controls + timings → the FSR and its setProgress(0–1) | Ask me |
| `chapterProgress(overall, hasExit)` | `src/sections/hero-timeline.js` | Splits the hero's scroll into chapter 1 and chapter 2 | overall 0–1 → each chapter's 0–1 | Careful |
| `heroTitle(text)` | `src/components/hero-title.js` | Makes the big title behind the shoe | the words → the title | Safe |
| `partLabel(note, points)` | `src/components/part-labels.js` | Makes one part label (title, description, arrow) that fades in with its part | a label entry + spots like the sensor → the label and its show(0–1) | Careful |
| `drawSensor(ctx, centre, sensor, outline)` | `src/components/sensor-drawing.js` | Draws the charging sensor (coil, wires, board) flat on the tray | where + settings → the drawing | Ask me |
| `drawTreadFace(...)` / `drawTrayFace(...)` | `src/components/separating-shoe.js` | Paints a layer's top surface (gray tread / white foam tray) | layer settings → painted surface | Ask me |
| `optionSwitcher({ title, options, current, onPick })` | `src/components/option-switcher.js` | Makes one row of the Style lab card (name + segmented pill) | title, list, current pick, what to do on click → the row | Careful |
| `switcherPanel(heading, ...rows)` | `src/components/option-switcher.js` | Makes the frosted Style lab card that holds the rows | heading text + rows → the card | Careful |
| `infoButton()` | `src/components/info-panel.js` | Makes the "i" button and its panel | nothing → the button | Careful |
| `createParallax()` | `src/core/parallax.js` | Moves layers at different speeds on scroll (`data-speed`) | nothing → controls (refresh, stop) | Ask me |
| `watchScrollProgress(element, onProgress, { settle, maxLag })` | `src/core/scroll-progress.js` | Reports scroll through an element as 0–1, gliding smoothly in time (`settle` 0.1s; it never trails by more than `maxLag` 0.15) | element + what to do with the number → controls | Careful |
| `loadChoice(name, options)` / `saveChoice(name, option)` | `src/core/remember-choice.js` | Remembers your last pick in this browser | a name + list → the remembered option | Careful |
| `cloudStudio.build()` / `flowerMeadow.build()` | `src/backgrounds/…` | Draws a background | nothing → the background | Careful |

- **Safe:** change freely.
- **Careful:** fine to change the wording or numbers, but not the structure.
- **Ask me:** the logic is fiddly, so tell me what you want and I'll change it.
