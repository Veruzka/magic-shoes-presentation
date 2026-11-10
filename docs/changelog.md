# Changelog

One short entry per work session, newest first.

## 2026-11-10: more space + charging sensor
**What changed**
- **More space between the gray sole and the white midsole:**
  - the gray sole now drops 160px instead of 100px (Down-left also shifts 96px toward the toe, with a 5° tilt)
  - the white midsole moves about a third of that (~54px)
  - so the gap below the white midsole roughly doubled
- **A small wireless-charging sensor on the white midsole's tray,** from your photo, with only the sensor itself:
  - a copper coil on a black disc, with a small hub
  - two copper wires
  - a little green circuit board with a silver chip and tiny parts
- **How it's drawn:** in code, in the sketch style (soft outlines, faint shadow), flattened to match the tray's angle.
- **How it fits:** it's smaller than the first version and **lies along the shoe**: the coil (its head) points toward the toe and the board toward the heel, following the midsole's overall toe-to-heel direction. It's laid flat on the same ground as the shoe, so it no longer looks "thrown" on. It shrinks if needed, so it always has space around it and never touches the lip.
- **Sensor angle fine-tuning:** a new `turn` setting in `sketch-sensor.js`. It's set to 10° (the head turns left); we're adjusting it by eye.


## 2026-11-09: white midsole separates
**What changed**
- The Sketch shoe now comes apart in **two layers**. The **white foam midsole** (with its clear pods and the heel cup that wraps up the back) separates after the gray sole: it starts midway through the gray sole's move (15% → 45% of the scroll), follows the same Down-left / Down path, and travels half as far, so the gaps are even.
- **Its top surface** is a smooth matte foam **tray**, with a raised lip, a recessed floor and a faint grain, modeled on your reference photo.
- **Same techniques as the gray sole:**
  - one smooth seam cut, at the cork or cream toe
  - a clean-up strip under the cork
  - the drawing's own outline is kept, and a soft sketch outline is drawn along the cork's new edge
  - the top surface starts at the layer's real top
- **New safeguards against strings:**
  - a layer only exists where its material really is (no white foam at the toe tip)
  - anything thinner than 6px is ignored
  - where a layer runs to the top of the shoe's outline (the heel cup), its faint edge glow leaves with it
- The component now handles any number of layers (`src/shoes/index.js` → `layers`), ready for the next ones.


## 2026-11-09 (after checkpoint 1): Style lab card
**What changed**
- The three switcher pills are now one **frosted-glass card** in the top-right corner, headed **STYLE LAB** with a small accent dot, modeled on your reference.
- It has one row per setting, hairlines between rows, and **segmented pills** where the chosen option sits on a soft white thumb.
- The glass is see-through, so the cream background (or the Meadow flowers) shows through blurred.
- **Glass look, after three tries:**
  - A smoky frosted glass with a light-catching rim: not quite right.
  - A dimpled "lens" glass: *"doesn't look good"*, so it was removed.
  - **Final, from your samples:** classic **glassmorphism**, with a heavy blur, a light milky tint, a thin even white border, fine grain, a soft wide shadow, and pills made of lighter glass.
- New shared glass variables are in `base.css`.


## 2026-11-09 (latest): sole styling
**Saved as checkpoint 1** (`checkpoint-01-gray-sole`) and **pushed to GitHub** (private repo Veruzka/magic-shoes); see [checkpoints.md](checkpoints.md).

**Published:** Vercel is connected to the repo, and the site is live at https://magic-shoes.vercel.app/. It was checked after deploy: the switchers, the sole effect and the "i" panel all work.

**What changed**
- **Tread texture:** the separated sole's top surface now has molded, flowing ridges in its own gray, inspired by your reference photo (without the brand logo). There are swirls at the toe and heel and long waves through the middle, with a slight wobble so they look sculpted.
- **No more string at the toe tip:** the top surface now starts where the rubber really begins, not at the cut line, so nothing sticks out.

## 2026-11-09 (later): clean sole cut
**What changed**
- **The gray sole now comes away cleanly, as one solid piece.** Before, the cut picked pixels one at a time by color. That left gray bits and a ghost outline on the shoe, and made the sole look like loose plastic strips.
- **New method:** cut along one smooth **seam** where the gray meets the white foam. Everything below leaves with the sole, including the shine, ink line and edge glow; the shoe is left "naked" with no trace.
- **The rubber toe bumper** has its own outline (`alsoSole` in `sketch-sole.js`), so its shiny top leaves with the sole too.
- **Clean-up pass:** dark ink lines and gray chips left along the bottom of the white foam now leave with the sole, so the foam is pure white.
- **Outline kept and added:** the drawing's thin ink outline (for example on the back of the heel) is no longer erased near the cut, and the shoe's new bottom edge gets a matching thin outline, so it looks sketched rather than cut. It's a soft warm gray hairline, matching how the drawing's outline looks on screen.
- **Rubber shine:** light rubber bits under the foam's ink line now leave with the sole, removing small bumps under the foam.
- **Toe tip:** retraced the toe bumper outline to run just outside the cream toe's own ink line. This removed a gray sliver on the sole, plus a whisker and a loose "plastic string" (the bumper's rim) that were left on the shoe.

**Known issues and open questions**
- The sole's top surface shape is still a guess ([design-improvements.md](design-improvements.md) #1).

## 2026-11-09
**What changed**
- **Backgrounds:**
  - Built the **Meadow** background (blurry flowers).
  - Built the **Clouds** background (cream sky, misty wispy clouds, beige box) and made it the main look.
  - Made backgrounds switchable.
- **Shoes:**
  - Added the **Photo** shoe (beige low-top) and the **Sketch** shoe (marker drawing of a chunky runner).
  - Both float above the box, with a shadow that breathes in time.
  - Made shoes switchable.
- **Coming apart:**
  - Tried a 5-part exploded view; it's set aside because its parts came from a different drawing.
  - Rebuilt step 1: the Sketch shoe's **gray sole detaches** like a puzzle piece in the first 30% of the scroll.
  - Added two paths (Down-left / Down) with a "Sole" switcher.
- **Style system:**
  - Moved repeated colors, sizes, corners, shadows and motion timings into shared variables in `base.css`.
  - Inter and Caveat fonts.
- **Docs:** added this `docs/` folder, the "i" info panel in the app, and documentation rules in `AGENTS.md`.

**AI images made (Figma AI, gpt-image-2.5-flare, Graft team, 1 credit each)**
- *Photo shoe:* "Photorealistic studio product photograph of a single low-top sneaker… monochrome warm beige / sand nubuck… three-quarter side view, toe pointing left… plain white background, no logo, no text."
- *Sketch shoe:* "Hand-drawn industrial-design concept sketch of an original chunky running sneaker, alcohol markers and fineliner… translucent mesh upper… sculpted white foam midsole with translucent pods… cork-textured insole… red-orange heel stripes… toe pointing left… no text, no logos."
- *5-part exploded drawing (set aside):* the same sketch style, pulled into five layers (upper, insole, footbed, midsole, outsole) with space between them.

**Known issues and open questions**
- The detached sole's top surface shape is a guess (see [design-improvements.md](design-improvements.md) #1).
- Which part detaches next, and how should parts share the scroll?
- Nothing is committed or pushed yet; waiting for your review.
