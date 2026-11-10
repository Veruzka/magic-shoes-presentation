# What works (and what doesn't)

Notes on how we collaborate best, so good results can be repeated and bad ones avoided.

## Worked
| Date | What you asked (your phrasing) | What I did | Lesson |
|---|---|---|---|
| 2026-11-09 | Clouds looked cartoonish: *"now it looks too cartoonish, i want it to look like the screenshot i provided"*. Reaction: **"yes yes yes!"** | Swapped smooth round puffs for soft fading puffs, roughened their edges with a noise texture (wispy and realistic), and added low mist. | Realistic and soft beats clean and graphic for this brand. Match the reference's *feel*, not just its shapes. |
| 2026-11-09 | *"make the background interchangeable … so I can … evaluate which one i like better"* | Built backgrounds as swappable modules with a switcher. | You like to **compare options side by side**. Offer a switcher whenever there are two good directions. |
| 2026-11-09 | Sole motion: *"let's do both down and to the left, and straight down, and add them as option"* | Built both paths plus a "Sole" switcher. | Same lesson: build both and let you flip. |
| 2026-11-09 | *"we're going to have to do this in small parts"* | Rebuilt the coming-apart effect one part at a time (sole first). | Big multi-part motion goes better in **small, reviewable steps**. |
| 2026-11-09 | Sole cleanup in small rounds, each with a screenshot of the exact defect (*"clean up the remaining dark gray lines…"*, *"remove the string sticking out on the front"*). Reaction: **"the gray sole looks good"**. | Zoomed in on exactly the spot in your screenshot, found the cause, fixed it, and checked zoomed in and at page size. | Your screenshots of specific defects plus zoomed-in checks on my side works well. Small rounds are better than one big pass. |
| 2026-11-09 | Tread texture from a reference photo (topographic-style molded ridges). | Built the ridges in code in the sole's own gray: swirls at the toe and heel, waves in the middle. Left out the photo's brand logo. | A real-world reference photo gives the clearest direction for texture. |
| 2026-11-10 | Bug report: *"after the first text … scrolling doesn't do anything for a while and then jumps … scrolling back … looks correct"*, plus *"use Playwright so you can scroll back and forth … and detect the bug"*. Reaction: **"that was amazing"**. | Checked the logic with real wheel notches (fine), then measured frames in a visible, graphics-card Chrome (4 per second), switched suspects off one by one (the cloud texture filter), baked the clouds into pictures, and proved it (250ms → 9ms per frame). | Your precise "what happened / what's different the second time" report plus a step-by-step, measure-first process. Written up as a reusable playbook: [debugging-motion.md](debugging-motion.md). |

## Didn't work, so avoid
| Date | What happened | Lesson |
|---|---|---|
| 2026-11-09 | First clouds were drawn as clean round bubbles: *"too cartoonish"*. | Avoid hard-edged, cartoon-style shapes; aim for photographic softness. |
| 2026-11-09 | The 5-part exploded view used parts from a **different drawing** than the whole shoe: there was a jump at the start, and the separated upper didn't match. | Every moving part must come from **the same image** the visitor sees whole. |
| 2026-11-09 | My fix (building the closed shoe out of the parts) changed how the closed shoe looked: *"that didn't work, revert"*. | Don't change the look of something you've approved in order to fix a motion problem. Fix the motion and keep the approved look. |
| 2026-11-09 | Glass card: a textured "dimpled lens" glass from a single close-up photo: *"that doesn't look good"*. | A close-up texture photo doesn't translate well to UI glass. Ask for, or use, **UI samples** (whole cards on backgrounds), like the glassmorphism samples that followed. |
| 2026-11-10 | Parts moving and text fading in at the same time: *"the motion is clunky"*. | Keep motion and text in **separate phases**: move first, then reveal text while everything is still. Smooth the scroll-driven motion. |
| 2026-11-10 | My smoothness checks used a hidden test browser without a graphics card, so they missed a real 4-frames-per-second stall caused by a live texture filter. You saw it as *"nothing for a while, then it jumps"*. | Check motion in a **visible Chrome window that uses the graphics card**, frame by frame. Bake expensive effects (like texture filters) into pictures once, instead of running them every frame. |
| 2026-11-09 | Clarifying questions had to come before planning: *"ask any clarifying questions before moving on"*. | For motion and multi-part work, **ask first**, then plan. |
