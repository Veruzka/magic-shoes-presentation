# Changelog

One short entry per work session, newest first.

## 2026-11-10: fixed the first-scroll stall
**The bug:** on the first scroll down, after the first label, nothing seemed to happen for a while, then the page jumped to the big FSR.

**What testing found:**
- **Real mouse-wheel scrolling, notch by notch, in a fresh browser:** the page's logic was right every time, with every stage in order.
- **A visible Chrome window using the graphics card, like yours:** the page drew only about 4 frames per second during the labels and while the scene slid away. The cause was the clouds' wispy texture filter, which was being recalculated across the whole screen on every frame (about 250ms each). The old smoothing then fell behind and raced ahead, which looked like a jump.

**The fix:**
- Each cloud layer is now drawn **once** into a picture, with the texture baked in, and just slides for the parallax. The look is unchanged. In the same visible-Chrome test, the longest frame is now 9ms (smooth 60+ fps) on every pass.
- The smoothing now works in time, not per frame, and never trails the scroll by more than 15%.
- Label fades no longer repaint the shoe under them.
- The flying FSR's image loads ahead of time.

## 2026-11-10: chapter 2, the FSR transition
**What changed**
- **A second scroll chapter.** After the labels, scrolling on:
  - makes the FSR **lift out** of its pocket, leaving the pocket empty
  - **turns it upright to face you**, with the pad on top and the tail down
  - **grows it** to the center of the screen (75% of the screen height)
  - while the **shoe scene scrolls up and away** and the next section's background (plain cream for now) rises in
- It stops with the FSR big and centered, and that's the end of the page for now. Scrolling back reverses everything, and the FSR settles back into its pocket.
- **How it starts without a jump:** the FSR now lives on its own layer in the white midsole, and three invisible markers tell the flying copy exactly where it lies, at what angle and how foreshortened.
- **New settings:**
  - `src/shoes/fsr-transition.js`: timings and sizes
  - `src/sections/hero-timeline.js`: the length of each chapter
- **Smoothness:** a full scroll down and back ran at a steady 60 frames per second, with no slow frames.

**Known issues and open questions**
- When big, the FSR is the angled render "opened up" to face you, so it's a little soft. A dedicated straight-on render would be crisper (1 Figma credit), which we can do in the styling step.
- On phones, the Style lab card overlaps the top of the big FSR.

## 2026-11-10: checkpoint 2
**Saved as checkpoint 2** (`checkpoint-02-layers-labels-fsr`) and pushed to GitHub; see [checkpoints.md](checkpoints.md).

## 2026-11-10: FSR as a 3D render
- **New look for the sensor on the white midsole:** a high-end 3D render of the real **FSR** (force-sensing resistor), based on your photos and in the style of your third reference. It has a round black pad with silver interlocking lines, a slim mint-teal see-through tail with silver tracks, and a white tab with two pins, lit like a studio product shot.
- It lies in a **keyhole-shaped pocket** that follows its outline: round for the pad, a channel for the tail. The pad points toward the toe.
- The earlier coil drawing is still there (`look: 'drawn'` in `sketch-sensor.js`).
- **AI image:** Figma AI (gpt-image-2.5-flare, Graft team, 1 credit). Prompt: "Photorealistic high-end 3D product render, KeyShot/Octane style, of a single round force-sensing resistor (FSR) lying flat… circular black sensing pad with fine silver interdigitated electrode lines… long thin translucent mint-teal tail with two brushed-silver traces… small matte white tab with two thin metal pins… viewed from about 20° above, pad on the left, tail to the right… soft studio lighting… plain light gray background, no text, no logo." Cut out with Apple's subject lift.

## 2026-11-10: page stays put; labels one by one
- **The page no longer moves on.** I removed the temporary empty block below the hero, so the shoe section is the whole page. Scrolling only fans out the parts and then shows the text, and at the end everything stays in place.
- **Labels one by one, with no overlap:** Outsole (52→66% of the scroll), then Midsole exactly when Outsole is fully shown (66→80%), then FSR (80→94%), all finishing before the end.
- The pinned scroll is shorter (220% → 160% of the screen height). The part timings were rescaled so they fan out at the same pace as before.

## 2026-11-10: stacked labels
- The labels now come in **stacked**, in even steps: Outsole first (from 42% of the scroll), Midsole as Outsole is almost fully shown (54%), then FSR (66%). Scrolling back reverses them.

## 2026-11-10: tighter fan, labels together
- The white midsole now starts just after the gray sole (5% instead of 15%), so the two separate together and the gap between them stays tight while fanning out. The final, even spacing is unchanged.
- All three labels fade in **at the same time**, with the Outsole's timing and fade (from 55% of the scroll, over 15%).

## 2026-11-10: smoother motion, text after the parts
**What changed**
- **Smoother fanning:** the parts now glide toward the scroll position over a few frames instead of jumping on every mouse-wheel notch. In a simulated wheel scroll down and back up, all 342 frames ran at a steady 60 per second, with no slow frames.
- **Motion and text separated:**
  - first the parts fan out, with no text
  - once they're fully out, you keep scrolling and the labels fade in one after another (Outsole, Midsole, FSR) while nothing moves
  - scrolling back fades the text out first, then the shoe closes
- The pinned scroll is longer (150% → 220% of the screen height) to make room for the text phase.

## 2026-11-10: "Magic Shoes" title
**What changed**
- **A big "Magic Shoes" title,** styled and placed like the reference:
  - huge, extra-bold, slightly condensed letters (Bricolage Grotesque) in soft sand
  - centered across the top half, with the shoe floating in front of their lower part
- **On Meadow** it turns into a see-through cream so it reads over the flowers. On phones it scales down to fit.

## 2026-11-10: part labels + equal spacing
**What changed**
- **Labels for Outsole, Midsole and FSR,** styled like your references:
  - a signature-script title (Mrs Saint Delafield)
  - an airy, letter-spaced description (Poppins)
  - a thin hand-drawn arrow pointing at the part (the FSR arrow points at the sensor in its pocket)
- **In sync with the parts:** each label moves with its part and fades in during the second half of that part's move, with its arrow drawing out. They fade back out as you scroll up and the shoe closes. The starter wording is in `src/shoes/sketch-labels.js`.
- **Equal spacing:** the white midsole's travel is now worked out automatically (`travel: 'even'`), so the gap above it and the gap below it match (measured about 78px each).
- **More room overall:** the gray sole travels 240px, and the whole shoe rises 80px while opening so the stack stays centered.

**Known issues and open questions**
- "FSR" in all capitals is hard to read in a signature script. Consider a word title, or FSR in the description font.
- Phones are tight: labels show titles only, and on Down-left the gray sole drifts past the left edge.


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
- **Sensor in a pocket:** the sensor now sits in a shallow pocket pressed into the foam, like the inset panel in your photo. It has a darker recessed floor, a soft shadow along its far wall, a small raised white rim with fine sketch outlines, and a faint wavy molded texture. The sensor is back in the middle of the sole, both lengthwise and across.
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
