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
- `src/shoes/fsr-transition.js`: all the timings and sizes (safe to change). `swap` is when the angled render cross-fades into the straight-on one. Keep it near the end of `turn`, while the FSR is still small.
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

## Adding a new scroll chapter (recipe)
What we did for chapters 2 and 3, so the next one is quick:
1. **Length:** add it to `heroTimeline` in `src/sections/hero-timeline.js`, and to `chapterProgress` and `pinLength` there.
2. **Settings:** a new file in `src/shoes/` with its stages (`{ start, end }` from 0 to 1), sizes and colors, each with a comment.
3. **Motion:** a component in `src/components/` with a `setProgress(0–1)`.
4. **Wiring:** a `setX(section, progress)` in `src/sections/hero.js`, called from the scroll watcher in `src/main.js`.
5. **Checks:**
   - Add its visuals to `SUSPECTS` in `tools/motion-debug/frame-stalls.mjs`. (The debug scripts work out the page's length themselves.)
   - Run `debug:walk`, `debug:stalls`, the visual checks and the build.
6. **Docs:**
   - this file, architecture (and its diagram), design-spec's motion table, the changelog
   - the `--at` table in [visual-checks.md](visual-checks.md), since chapter positions shift

---

## Chapter 3: the FSR reveal (door turn + half sketch)
**What:** after the FSR is big, scrolling on turns it like a door, then a line sweeps in from the right and stops at its middle. Behind the line it becomes a technical sketch on cream paper, and callout labels fade in one by one. The full style recipe is in [electronics-style-guide.md](electronics-style-guide.md).
**Files:**
- `src/shoes/fsr-reveal.js`: all the timings, angles, colors, line weights and callout labels (safe to change).
- `src/sections/hero-timeline.js`: `reveal` is how long chapter 3 lasts, in screen-heights (safe to change).
- `src/components/fsr-reveal.js` (the motion), `src/components/fsr-sketch.js` (the drawing) and `src/components/callouts.js` (the labels): ask me.

**Safe to change** (each stage is a stretch of chapter 3, from 0 to 1):
- `turn`: the door turn. `angle` is in degrees (try 20–40). `perspective` is how strong the 3D looks (lower = stronger).
- `depth`: the pad's thickness edge. `thickness` in px, `shade` how dark it is.
- `sweep`: the line. `stopAt` is where it stops, as a share of the FSR's width (0.5 = the middle).
- `paper`: the paper color and how strong its grain is.
- `ink`: the sketch's color, line weights, hatching, the red accent color, and `accentPart` (`'ring'`, `'traces'` or `'none'`).
- `callouts`: when they start, the step between them, the gap to the FSR, and each label's `text`, `point` (where its line starts, in the straight-on render's pixels: 532 × 1458) and `rise` (moves the label up or down).

> **Example:** to make the turn stronger, change `angle: 28` to `40`. To put the red on the traces instead of the ring, change `accentPart: 'ring'` to `'traces'`. To rename a label, edit its `text`.

## Chapter 4: the FSR settles (slide into the paper + texts)
**What:** after the callouts, the FSR slides right through the still line and becomes fully drawn. It shrinks a little and turns back flat, the labels ride along, and two short texts appear on the left.
**Files:**
- `src/shoes/fsr-reveal.js` → `settle`: timings, slide, shrink and the texts' wording (safe to change).
- `src/sections/hero-timeline.js`: `settle` is how long chapter 4 lasts, in screen-heights (safe to change).
- `src/components/fsr-reveal.js` (the motion) and `src/components/fsr-explainer.js` + `.css` (the texts' look): ask me.

**Safe to change** (each stage is a stretch of chapter 4, from 0 to 1):
- `slide`: `to` is where the FSR's middle lands, as a share of the cream side's width (0.35 = a bit left of its centre, leaving room for the labels). `scale` is how big it ends up (0.8 = 80%).
- `turnBack`: when the door turn unwinds to flat.
- `texts`: each block's `title`, `body`, and when it fades in (`start`, `end`).
- `rise`: how far each text rises as it fades in, in px.
- The texts' typography, in `src/components/fsr-explainer.css`: the title (Mrs Saint Delafield, `--font-signature`) has its `font-size` and `line-height`. The paragraph (Poppins, `--font-note`) has its `font-weight` (300; Poppins loads 300, 400 and 500), `font-size` and `line-height` (1.7). There's also the `gap` between blocks. Phone sizes are at the bottom of the file. To swap the handwritten font everywhere, change `--font-signature` in `base.css` and the font link in `index.html`.

> **Example:** to have the FSR stay bigger, change `scale: 0.8` to `0.9`. To reword the first text, edit its `body`.

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
- `src/assets/fsr-render.png`: the high-end 3D render of the FSR (made with Figma AI, then cut out), used in the shoe and while it lifts out. `src/assets/fsr-render-front.png` is the same FSR seen straight on, used for the big view in chapter 2 (its measurements are `front` in `sketch-sensor.js`). The earlier render is `fsr-render-v1.png`. To switch back, import it in `sketch-sensor.js` and restore its measurements (in git history).
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

## Page switch pill (story ↔ lab)
**What:** the dark pill in the bottom-right corner that jumps between the story and the lab.
**Files:** `src/components/page-switch.js` and `.css`. The wording is set where it's added: `src/main.js` (story) and `src/lab/main.js` (lab).
**Safe to change:** the wording, the colors (`background`, `color`), the height and padding, the font (the technical `--font-callout`, uppercase, like the lab).

> **Example:** to make the pill sand-colored, change `background: var(--color-text)` to `var(--color-accent)` and `color` to `var(--color-text)`.

## Lab page
**What:** the prototyping lab at `/lab/`. See [lab-roadmap.md](lab-roadmap.md) for the plan.
**Files:** `lab/index.html` (the page and its fonts), `src/lab/main.js` (what's on it), `src/lab/lab.css` (its look), `src/lab/data/` (the sensor and zone lists).
**Safe to change:**
- **The look**, in `lab.css`:
  - `--lab-red` (the crosshair)
  - `--lab-shoe-filter`, to calm the coloured drawing, for example `sepia(0.35) saturate(0.7)`
  - the title's size and `letter-spacing`
  - the marker and label motion timings (in ms, with comments)
- **A sensor**, in `src/lab/data/sensors.js`: its name, kind, status (`'active'` or `'soon'`) and zone, and its wiring and safety details.
- **Where the FSR lies** (story and lab together): `along` in `src/shoes/sketch-sensor.js`, from toe 0 to heel 1 (now `0.78`, the heel).
- **"Show inside"**, at the top of `src/lab/lab-shoe.js`:
  - `OPEN_MOVE` (how far the layers move down; `y: 150`)
  - `OPEN_SECONDS` and `CLOSE_SECONDS` (0.8 and 0.6)
- **The open-shoe labels**, in `src/lab/data/layers.js`: each layer's `label` (where the leader line starts, bends and ends, and its text, in drawing pixels).
- **The hardware note** under the switch: `insideNote` in `sensors.js`.
- **A movement**, in `src/lab/data/movements.js`:
  - its description
  - its `rule` numbers (start, rearm, peakMs, maxRiseMs, cooldownMs)
  - its `chart` numbers (the illustrative curve: when the foot lands, how high, the standing level, when it lifts)
- **The chart's look**, in `lab.css` under "The chart".
- **A sound**, in `src/lab/data/sounds.js`:
  - `preview` (what ▶ plays: strength and sharpness from 0 to 1)
  - the `recipe` numbers: how loud (`loudness`, in dB), how deep the pitch drop is (`octaves`), how long it rings (`length`), how much echo (`wet`), how bright the thud is (`brightness`, in Hz), and when the rumble joins in (`sub.from`)

> **Example:** to make the boom longer, change `length: { light: 0.5, hard: 1.5 }` to `{ light: 0.8, hard: 2.2 }`. If ▶ sounds too quiet, raise `preview.strength` from `0.7` to `0.85`.
- **A zone**, in `src/lab/data/zones.js`: `anchor` (where the crosshair sits), `outline` (the dashed shape) and `label` (where the leader line bends and ends, and its text). They're in the drawing's own pixels (1356 × 846, top-left is 0, 0).

> **Example:** to move the crosshair a little toward the back of the heel, change the heel's `anchor: [1195, 505]` to `[1230, 500]`. To make the gyro clickable, it first needs an `upper-top` zone in `zones.js`, then change its `status` to `'active'`. The lab's technical look comes from the FSR callouts' font (`--font-callout`, Barlow Semi Condensed) in uppercase, set once on `.lab` in `lab.css`.

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

## Sounds
**What:** the sounds the shoe makes. Nothing plays them yet. Rules, naming and the log are in [sound-library.md](sound-library.md).
**Files:** originals in `sounds/`, web copies in `public/sounds/`, the list in `sounds.json`.
- **Swap a sound:** change the `file` line of its entry in `sounds.json`.
- **Add a sound:** just give it to Claude and say its category, shoe action and license. Claude renames it, files it, makes the web copy and logs it.
- **Make web copies by hand:** `npm run sound:web`.

**Safe to change:** anything in `sounds.json`, as long as each path points to a real file in `public/sounds/`.

---

## Set aside: the 5-part exploded view
**Files:** `src/components/exploding-shoe.js`, `src/shoes/sketch-parts.js`, `src/assets/sketch-parts/`. It isn't shown right now. Leave it alone unless we bring it back.

---

## Main functions
"In" is what you give the function; "out" is what it gives back.

| Function | File | What it does | In → Out | Safe to edit? |
|---|---|---|---|---|
| `hero()` | `src/sections/hero.js` | Builds the first screen | nothing → the section | Careful |
| `sensorList()` | `src/lab/sensor-list.js` | The lab's sensor parts list; clicking puts a sensor on the shoe or takes it off | nothing → the list | Careful |
| `labShoe()` | `src/lab/lab-shoe.js` | The lab's shoe: the story's coming-apart shoe with sensor markers (closed) and technical labels (open) | nothing → the shoe | Careful |
| `labState` | `src/lab/lab-state.js` | Your picks: `toggleSensor(id)`, `isPlaced(id)`, `pickMovement(id)`, `movement()`, `pickSound(id)`, `sound()`, `setOpen(true/false)`, `isOpen()`, `onChange(fn)` | – | Ask me |
| `movementList()` | `src/lab/movement-list.js` | The movements list with its matching check, and the picked movement's spec card | nothing → the list | Careful |
| `movementChart(movement)` | `src/lab/movement-chart.js` | The illustrative chart on a spec card (stomp shape only for now) | a movement → the chart | Careful |
| `soundList()` | `src/lab/sound-list.js` | The sounds list with ▶ buttons | nothing → the list | Careful |
| `play(soundId, { strength, sharpness })` | `src/lab/lab-sound.js` | Plays a sound once, shaped by strength and sharpness (call it inside a click) | a sound id + values → nothing | Ask me |
| `insideSwitch()` | `src/lab/inside-switch.js` | The "Show inside" switch and the hardware note under the shoe | nothing → the switch | Safe |
| `pieceFor(layerId)` | `src/lab/data/layers.js` | Which drawing piece shows a layer (the insole → the midsole it rests on) | a layer name → a piece name | Careful |
| `pageSwitch({ label, href })` | `src/components/page-switch.js` | The floating pill that links between the story and the lab | wording + address → the pill | Safe |
| `showBackground(section, background)` | `src/sections/hero.js` | Swaps the background and the text colors | hero + a background → nothing | Careful |
| `showShoe(section, shoe)` | `src/sections/hero.js` | Swaps the shoe; turns pinning on for shoes that come apart | hero + a shoe → nothing | Careful |
| `setShoeOpening(section, progress)` | `src/sections/hero.js` | Tells the shoe how far apart to be | hero + a number 0–1 → nothing | Careful |
| `setSoleMove(section, move)` | `src/sections/hero.js` | Switches the sole's path | hero + a move → nothing | Careful |
| `separatingShoe(shoe, move)` | `src/components/separating-shoe.js` | Splits the Sketch drawing into layers and moves each one on scroll | shoe (with `layers`) + path → the shoe and its controls | Ask me |
| `splitDrawing(...)` / `cutLayer(...)` | `src/components/separating-shoe.js` | Cuts each layer out, bottom up, and draws the outlines | drawing + layer settings → one picture per layer + the body | Ask me |
| `flyingFsr(stage, shoe, settings, sensor)` | `src/components/fsr-transition.js` | The FSR that flies out of the shoe to the center in chapter 2 | the screen + the shoe's controls + timings + the FSR's renders → the FSR, its setProgress(0–1) (chapter 2), setReveal(0–1) (chapter 3) and setSettle(0–1) (chapter 4) | Ask me |
| `chapterProgress(overall, hasExit)` | `src/sections/hero-timeline.js` | Splits the hero's scroll into chapters 1, 2 and 3 | overall 0–1 → each chapter's 0–1 | Careful |
| `fsrReveal(parts, sensor, settings, geometry)` | `src/components/fsr-reveal.js` | Chapter 3: the door turn, the sweep to sketch-on-paper, the callouts | the flying FSR's pieces + settings → its setProgress(0–1) (chapter 3), setSettle(0–1) (chapter 4) and the texts' element | Ask me |
| `fsrSketch(shape, ink, width, height)` | `src/components/fsr-sketch.js` | Draws the FSR as a technical line drawing that lines up with the render | measurements + ink settings → the drawing | Ask me |
| `callouts(texts)` | `src/components/callouts.js` | Camera-style labels with thin leader lines, in one column | the label words → the labels, place(positions) and show(progress) | Careful |
| `fsrExplainer(blocks)` | `src/components/fsr-explainer.js` | Short texts (title + a few sentences) that fade and rise in one after the other (chapter 4) | the blocks' words → the texts and show(progress) | Careful |
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
