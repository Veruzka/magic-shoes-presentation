# Electronics style guide

The recipe for showing a sensor or electronic part on the page, so every part (the FSR now, others later) looks and moves the same way. The FSR is the worked example throughout.

**In short:** each part has two looks, a **studio render** and a **technical sketch**, and one motion sequence: it sits in the shoe, lifts out, faces you, grows, turns, and is half-sketched with labels.

---

## 1. The render look ("studio product photo")
**Feel:** an ultra high-end 3D product render, like premium electronics marketing: crisp, clean and expensive.

| Ingredient | How it looks on the FSR | Use it for other parts |
|---|---|---|
| **Body** | thick, bevelled **glossy black** with a soft curved highlight on the rim | casings, pads, chips |
| **Metal** | **polished silver** lines with a crisp edge, on **matte black** with a fine micro-texture | traces, electrodes, contacts |
| **Clear parts** | thick **crystal-clear glass/acrylic** with edges glowing **faint mint**, real thickness | films, lenses, covers |
| **Plastic** | **matte white** | connectors, housings |
| **Pins** | **chrome**, sharp reflections | pins, screws, leads |
| **Light** | soft, even studio light from the top left; pale light-gray seamless background (removed after) | all |
| **Thickness** | always visible: never paper-thin | all |

### Two images per part
Every part needs **two renders**, made with the same prompt ingredients:

1. **Angled** (camera about 20° above, lying flat, long side left to right). Used **small**, in the shoe's pocket and while lifting out. Example: `src/assets/fsr-render.png`.
2. **Straight-on** (seen from directly above, **upright in a tall frame**, filling it). Used **big**, so it's never enlarged past its pixels. Example: `src/assets/fsr-render-front.png`.

### AI prompt template (Figma AI, Graft team)
Model `gpt-image-2.5-flare`. Use a tall 864×1536 frame for the straight-on view, and 1536×864 for the angled one. Fill in the brackets:

> Photorealistic ultra high-end 3D product render, macro studio product photography, of a single [PART], [VIEW: seen from directly above (straight-on top view), standing vertically in a tall portrait frame / camera about 20° above, lying flat, LEFT to RIGHT], filling about 90% of the frame. [MATERIALS: thick glossy black bevelled body… polished silver… crystal-clear acrylic with faint mint edges… matte white… chrome pins]. [PATTERN DETAILS: say exactly how lines run, e.g. "running VERTICALLY (parallel to the tail)"]. Razor-sharp focus everywhere, extreme fine detail, crisp edges, clean specular highlights, soft diffused studio lighting from the top left, plain pale light-gray seamless background, soft subtle contact shadow. No text, no logo, single object only.

**Tips learned:**
- **Spell out which way the lines run.** The first straight-on FSR had them sideways, which would have flipped visibly at the swap.
- **At most 2–3 tries,** then ask before spending more credits. Log every image in [architecture.md](architecture.md) and the prompt in [changelog.md](changelog.md).

### After generating
0. **Keep the original** in `design/originals/` (see [tools-and-setup.md](tools-and-setup.md)).
1. **Cut it out:** `npm run image:cutout -- design/originals/x-original.png src/assets/x.png`.
2. **Measure it** with `npm run image:outline` and `npm run image:bands`: the pad's centre and width, and for the straight-on render every part's position (`front.shape` in `src/shoes/sketch-sensor.js`). The sketch is drawn from these numbers, so it lines up exactly.

---

## 2. The sketch look ("technical illustration")
**Feel:** like an exploded-view drawing of a camera. Fine ink on warm paper, precise, a little hand-made, with one red accent.

| Ingredient | Setting (in `src/shoes/fsr-reveal.js`) | Value now |
|---|---|---|
| Ink color | `ink.colour` (also `--color-ink` in `base.css`) | `#3a332b`, warm dark brown-gray |
| Outlines | `ink.line` | 2.6 image px (about 1.2 px on screen) |
| Inner details (bevels, glass edges, highlights) | `ink.fine` | 1.5 |
| Shading | `ink.hatch`, `ink.hatchGap` | 1.1, every 9 px, diagonal, on the shadow side only (lower right) |
| **Thickness** | double lines: an outer edge + a bevel line inside it | |
| **Red accent** | `ink.accent`, `ink.accentPart` | `#b5473b` on **one part only** (FSR: the silver ring) |
| Paper | `paper.colour`, `paper.grain` | `#f2ecdf` with a fine baked grain |

**Rules:**
- **Outlines first, then details:** outer shape, then thickness lines, then the pattern (electrodes), then a little hatching.
- **Hatching only where the render is in shadow,** never everywhere.
- **Red marks one part**, and it's the one a callout points to.

### Callout labels
Built with `src/components/callouts.js` (reusable).

- **Leader lines:** a thin 1 px ink line from a point on the part, with a short slant, then straight across to the label.
- **Labels:** small uppercase, `Barlow Semi Condensed` 500, slightly spaced out (`--font-callout`, `--text-callout`). They sit in **one column**, to the right of the part, on the sketch side.
- **Wording:** 1–3 words naming the part (e.g. ACTIVE AREA, ELECTRODES, CONDUCTIVE TRACES, CONNECTOR).
- **Settings:** in `callouts.items`. Each item has `text`, `point` (in the straight-on render's pixels) and `rise` (moves the label up or down so they don't crowd).

---

## 3. The motion
One continuous sequence, driven by scrolling. Every number below is a share of its chapter's scroll (0 to 1).

| # | Stage | What happens | Setting | Now |
|---|---|---|---|---|
| 1 | **In the shoe** | lies in a keyhole pocket on the midsole, aligned with the shoe | `sketch-sensor.js` | |
| 2 | **Lift** | rises out, grows a little | `fsr-transition.js → lift` | 0–0.25, up 60 px, ×1.2 |
| 3 | **Face you** | turns upright (pad on top), glides to the centre | `turn` | 0.2–0.6 |
| 4 | **Swap** | the angled render cross-fades into the straight-on one, **while still small**, so it's invisible | `swap` | 0.42–0.56 |
| 5 | **Grow** | grows to the centre | `grow` | 0.5–1, 75% of the screen's height |
| 6 | **Door turn** | turns around its upright centre line in real 3D; the pad's thickness shows as a dark edge | `fsr-reveal.js → turn`, `depth` | 0–0.35, 28°, 12 px thick |
| 7 | **Sweep** | a line crosses the screen from the right, then the part (half the time each), and stops at its middle; behind it, sketch on paper | `sweep` | 0.3–0.68, stops at 0.5 |
| 8 | **Callouts** | one by one: the line draws, then the text fades in | `callouts` | from 0.72, every 0.065 |

Chapter lengths (in screen-heights of scrolling) are in `src/sections/hero-timeline.js`: `fan` 1.6, `exit` 1.8, `reveal` 1.6.

**Motion rules:**
- **Every stage eases in and out** (soft start and stop). Stages overlap slightly so it flows as one movement.
- **One thing at a time:** motion first, then text.
- **The paper's edge always lines up** with the sketch's edge, even mid-turn: the page works out where the line lands after the 3D turn.

---

## 4. Keeping it sharp and smooth
- **Big views get their own high-resolution image.** Never enlarge a small or angled image past its pixels.
- **Don't mark things that grow a lot as `will-change`.** The browser snapshots them small and stretches the snapshot.
- **Shadows go on a still wrapper,** not on the moving image.
- **Bake textures** (paper grain, clouds) into pictures once; never run live filters every frame.
- **Sketches are vector lines**, so they're sharp at any size.
- **Check at 2× (Mac) sharpness in a visible Chrome** (`npm run check:shot -- --real`, see [visual-checks.md](visual-checks.md)): hidden test browsers show jagged edges that real ones don't. Then run `npm run debug:stalls` (see [debugging-motion.md](debugging-motion.md)).

## 5. Adding a new part: checklist
1. Generate both renders (template above), cut them out, and save them in `src/assets/`.
2. Measure: pad/body centre and width (angled), and every part's position (straight-on, for the sketch).
3. Add a settings file like `src/shoes/sketch-sensor.js`.
4. Write its sketch, like `src/components/fsr-sketch.js` (ask me).
5. Write its callouts and timings, like `src/shoes/fsr-reveal.js`.
6. Check it at 2×, run `debug:stalls`, and update this guide if anything new was learned.
