# Debugging motion: our playbook

How we track down problems with scroll effects (parallax, fanning parts, things flying in). We used it on 2026-11-10 to fix the "nothing happens, then it jumps to the big FSR" bug in about an hour, after earlier guesses had missed it. Use the same steps whenever a new motion feature feels wrong.

## The short version
1. **You describe it precisely**: what you did, what you expected, what happened, and what's different on a second try.
2. **Check the logic** by scrolling notch by notch and reading the page's numbers (`npm run debug:walk`).
3. **Check the browser keeps up** in a visible Chrome window that uses the graphics card (`npm run debug:stalls`).
4. **Find the culprit** by switching off one suspect at a time (`npm run debug:stalls -- --suspects`).
5. **Fix the cause, not the symptom**, then repeat steps 2–3 to prove it.
6. **Write it down** in the changelog and in what-works.

---

## 1. Describe it precisely (your part)
The most useful bug reports say what happened **and what didn't**. Yours said:
> "after the first text is displayed, scrolling doesn't do anything for a while and then jumps to the scaled version of the FSR … when scrolling back up the motion looks correct, and then scrolling back down also looks correct."

That last part, *only the first time*, was the biggest clue. It meant the logic probably wasn't broken, because the second pass worked. Something was slow **the first time**.

**Helpful things to include next time:**
- **Where in the scroll it goes wrong:** after which label or stage.
- **Whether it happens every time,** only the first time, or only after switching something.
- **Which browser and device:** for example, Chrome on the Mac.

## 2. Check the logic: "Is the page doing the right thing?"
**Tool:** `npm run debug:walk` (`tools/motion-debug/wheel-walk.mjs`)

It opens a **fresh, hidden Chrome** (nothing remembered), switches to Sketch, and scrolls with **real mouse-wheel notches**: down, back up, then down again. After every few notches it prints what the page is doing:
- **scroll:** how far down the page is.
- **progress:** what the page is *showing* (0 is the top, 1 is the end).
- **labels:** how visible each label is, in percent.
- **fsr:** whether the FSR is in its pocket or flying.
- **scene:** how far the shoe scene has slid away.

**What to look for:** both "down" passes should tell the same story, in order. If a stage is missing, out of order, or different on the first pass, the problem is in the logic.

**What we found:** the logic was right on every pass. Nothing was being skipped, so the problem had to be elsewhere.

> **Why real wheel notches:** jumping straight to a scroll position (what my earlier screenshot checks did) skips the in-between moments where these bugs live.

## 3. Check the browser keeps up: "Is it drawing fast enough?"
**Tool:** `npm run debug:stalls` (`tools/motion-debug/frame-stalls.mjs`)

It opens a **visible Chrome window** for about a minute (don't click it) and reports every **stall**: a gap between drawn frames longer than 50ms. Smooth motion is about 16ms per frame.

> **Why visible:** a hidden test browser draws without the graphics card, so it **can't see** the slowdowns real visitors get. My first smoothness tests used one, and reported a perfect 60 frames per second while your Mac was actually stuck at about 4 frames per second.

**What we found:** frames took **about 250ms** each (4 per second) during the labels and while the scene slid away. That explained everything: the smoothing fell behind the scroll ("nothing happens"), then raced through the missed stages ("jumps to the big FSR").

## 4. Find the culprit: switch off one suspect at a time
**Tool:** `npm run debug:stalls -- --suspects`

It repeats step 3 once per suspect, each time **switching off just one visual** with a bit of CSS: labels, glass card, cloud pictures, shoe shadows, flying FSR. Whichever one makes the stalls disappear is the culprit.

**What we found:**

| Switched off | Result |
|---|---|
| nothing (baseline) | stalls of about 250ms |
| labels | label stalls gone, scene stalls remained |
| glass card | no change |
| **cloud texture filter** | **no stalls at all** |
| shoe shadows | most label stalls gone, scene stalls remained |

The labels and shadows only *triggered* the work. The real cost was the clouds' wispy texture filter, recalculated across the whole screen on every frame.

> When you add new visuals, add them to the `SUSPECTS` list in `frame-stalls.mjs`, so they can be tested the same way. Both scripts measure the page's length themselves, so they always scroll to the end. Their shared Chrome helper is `tools/shared/chrome.mjs`. For **looks** rather than motion, see [visual-checks.md](visual-checks.md).

## 5. Fix the cause, then prove it
**The fix:** each cloud layer is drawn **once** into a picture with the texture baked in, and then just slides around. It looks the same and costs almost nothing per frame. Two safety nets were added too:
- the scroll smoothing works in **time**, not frames, and never trails the scroll by more than 15%
- label fades don't repaint the shoe underneath

**The proof:** repeat steps 2 and 3. The logic still ran in order, and the longest frame went from **about 250ms to 9ms** on the first pass, going up, and on the second pass.

## 6. Write it down
- **[changelog.md](changelog.md):** the bug, what testing found, and the fix.
- **[what-works.md](what-works.md):** the lesson (here: test motion in a visible browser, and bake expensive effects).
- **If the fix changed how something works:** [how-to-change-things.md](how-to-change-things.md).

---

## Rules of thumb for new motion features
- **Expensive effects should run once, not every frame.** That means texture filters (like the clouds), big blurs, and shadows on large moving pictures. Bake them into pictures where you can.
- **Move things with "transform" and "opacity" only.** Browsers can do those cheaply. Changing sizes, shadows or filters during motion is costly.
- **Give fading or moving pieces their own layer** (`will-change`), so they don't force big neighbors to repaint. **But not pieces that grow a lot:** the browser snapshots them at their starting size and stretches the snapshot, which turns blurry (the big FSR did this).
- **Big views need their own big image.** Don't enlarge a small or angled picture far past its pixels.
- **Keep motion and text in separate phases.** It reads better and is lighter to draw.
- **Load images before they're needed**, not at the moment they first appear.
- **Run `npm run debug:stalls` after adding any new moving piece.** If the longest frame stays under about 20ms, it's smooth.

## Handy for debugging
- The hero section records what it's currently showing in `data-progress`, a number from 0 to 1. The debug scripts read it. In Chrome's DevTools, it's visible on the `<section class="hero">` element as you scroll.
- **Both scripts need the local preview running** (`npm run dev`) and Google Chrome installed. `debug:stalls` opens a Chrome window on your screen for about a minute.
