# Visual checks: our playbook

How we check that something **looks** right, the visual partner of [debugging-motion.md](debugging-motion.md). We used it to find why the big FSR was blurry, to prove the fix, and to check that the sketch half lines up with the render.

## The short version
1. **Look at the whole page** at the moments that matter.
2. **Zoom in at 100%** on the details, at Mac sharpness (2×).
3. **Use a real browser** for anything about sharpness.
4. **Compare before and after** by switching the change off with a bit of CSS.
5. **Check the hand-overs:** frames just before, during and after any swap or cross-fade.
6. **Check a phone size.**
7. **Write down** what was checked in the changelog.

---

## 1. Whole page at key moments
`npm run check:shot -- --at 0.5 --out shots/half.png`

`--at` is how far through the hero, from 0 to 1. Useful moments:

| Moment | `--at` (Sketch shoe) |
|---|---|
| The shoe whole | 0 |
| Parts fanned out, labels showing | 0.3 |
| FSR flying | 0.5–0.6 |
| FSR big (end of chapter 2) | 0.68 |
| Door turn / sweep / callouts | 0.75 / 0.85 / 1 |

These numbers shift when chapters change length. Each chapter's share is its length ÷ the total in `src/sections/hero-timeline.js`.

## 2. Zoom in at 100%
Add `--crop x,y,w,h` to save a zoomed crop as well. It's measured in screenshot pixels, which at 2× are double the page's pixels. Example, the FSR pad at the end:

`npm run check:shot -- --at 1 --crop 1160,200,560,640 --out shots/pad.png`

**What to look for:**
- **Edges:** sharp or smeared?
- **Fine lines:** separate or melted together?
- **Text:** crisp?
- **Seams:** do two halves line up?

## 3. Sharpness needs a real browser
Add `--real`. A visible Chrome window opens briefly and uses the graphics card and your screen's 2× density.

**Why:** a hidden browser draws differently. It showed jagged edges on the 3D turn that the real browser drew perfectly, and it did **not** show the blur that real visitors saw. **Layout** checks are fine hidden. **Sharpness** checks must be real.

## 4. Before and after
Take the same shot twice, once with the change switched off using `--css`. For example, to bring back the old blurry behavior:

`npm run check:shot -- --at 1 --real --css ".fsr-flight__mover{will-change:transform}" --out shots/before.png`

## 5. Hand-overs
Wherever one image replaces another (the FSR's swap to the straight-on render) or a line divides two looks (the sweep), shoot a few frames across it. Check there's **no jump** in size, position or color.

## 6. Phone size
`npm run check:shot -- --width 390 --height 844 --at 1 --out shots/phone.png`

Known phone issues are listed in [design-improvements.md](design-improvements.md).

## 7. Write it down
In the changelog entry, note what was checked: "checked at 2× in a real browser", plus the frame time from `npm run debug:stalls`.

## Rules of thumb
- **Every visual change gets at least one zoomed 2× check** before it's called done.
- **A screenshot from you of the exact defect** is the fastest way to start. I zoom into exactly that spot.
- **Big views need their own high-resolution image** (see [electronics-style-guide.md](electronics-style-guide.md)).
