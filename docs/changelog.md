# Changelog

One short entry per work session, newest first.

## 2026-11-18 (evening): "Once upon a step" opening (Veruzka, branch `veruzka-opening-scene`)
- **New title:** the first and last screens now say "Once upon a step" instead of "Twinkle Toes". The browser tab title and Liz's Medium link still say Twinkle Toes.
- **Hero TODO sticker removed:** the name is decided. The stickers in the other scenes stay as reminders.
- **The hero shoe floats instead of spinning:** it bobs up and down (every 4.6 s) and rocks toe up and down (every 6.7 s), out of step so it never looks mechanical, and keeps going while the presenter talks. It fades into the usual glide when you scroll to the next scene. Reduced motion: it stays still. Settings: `FLOAT` in `src/three/shoe-director.js`.
- **Checked:** build; `npm run debug:stalls` three times with the float and three times without. Both sometimes show a stall after the first scene (up to about 250 ms), so that is not new; one run with the float had stalls at the very start (about 100 ms), worth watching. The shoe redraws every frame on the first screen and stops completely once you scroll away. **Not checked on the TV yet.**
- **The wildflower field is set aside** for a paper forest (below). The lighter shoe drawing for the TV (lower the pixel cap from 2 to 1.5) is still an idea, not done.
- **Rebased** on Liz's `main` (the live site), which had the same content as `web-presentation-draft`.
- **Paper forest in the first scene:** scrolling the first scene raises a paper-cut forest behind the title and shoe, in three layers like a pop-up book (back wall with the glowing clearing and moon, then the trees with the deer and mushrooms, then the leafy front frame). "step" slides up and away and "forest" rises into its place; the text turns light over the teal. The full forest lands on the second arrow-key stop. Reduced motion: the forest and the new word fade in. Settings: `RISE`, `SWAP`, `LIGHTEN` in `src/sections/tt-hero.js`.
- **How the art was made (Runway, about 75 credits):** two options from this prompt, option B picked: "Layered paper-cut diorama of an enchanted forest, wide landscape. Handmade cut-paper craft with visible paper edges and soft shadows between layers. Deep teal background. Trees, ferns and leaves in teal, sage, olive and mint paper, with accents in coral pink, warm orange and mustard yellow: pink paper mushrooms, small orange paper birds, a little paper deer, white paper flowers. A soft glowing pale-aqua clearing and path in the center. Dense foliage frames the left, right and bottom edges. The top and middle of the picture stay calm and open, with empty space for a title and a floating object. Whimsical storybook mood. No text, no people." Then a precise edit removed a blank paper banner, and Runway's layer split cut it into layers. The style was inspired by a reference photo Veruzka found (described in words only, not uploaded). Its "distant trees" layer came out gray and was dropped; the back wall was rebuilt from the split's version, so the clearing is a little simpler than the picked picture. Originals and costs: `design/originals/README.md`.
- **Three stops in the first scene (Veruzka's review):** the title stays put (no drift) and keeps "step" until the forest is fully up (stop 2); only on the next scroll does "forest" swap in (stop 3). The scene is a bit longer (2.2 screens) to make room. Settings: `STOPS`, `SWAP` in `src/sections/tt-hero.js`.
- **"Stories! Movement!" set aside:** the two players now follow straight after the first scene. The intro's code stays in `src/sections/concept-movements.js` (`conceptIntro`), with a one-line note on how to bring it back. Its presenter-notes entry is gone.
- **Players' scene on beige (2026-11-19):** no part of the site has a dark background now. The players are forest teal and coral for now (paper people are next), the story pictures a soft teal, the offer line in the forest's teal.
- **The players wear the hero's shoe:** the Sketch drawing on a card, instead of the simpler solid stand-in (kept in `shoe-stage.js` as `standInShoe`, set aside).
- **Thin ice, in paper:** the jagged cracks under the walkers are gone. Each of player 1's steps lays a new sheet of paper ice: a line grows across the ground from left to right and a wavy-edged sheet follows it, each a little lower in the next blue or white tone with a soft paper shadow (six sheets).
- **The "Yes, and…" offer stays readable:** once it has rolled in, it stays at least 3 seconds before the next movement takes over, even if the scroll moves on (`HOLD_SECONDS` in `concept-movements.js`), and each movement has about 1.5 screens of scrolling (the scene is 11 screens, was 6).
- **Paper-cut players:** the stick figures are now two paper-cut people in the forest's colours, after a reference photo of cut-paper figures: a guy in a mustard beanie, striped teal sweater and olive pants (player 1), and a woman with long dark hair, a coral sweater and teal-sage pants (player 2). Built in Figma with plain drawing tools (no Figma AI, no credits) in "Magic Shoes – assets", page "Paper people": one component per body part, each hanging from its joint, plus two previews. Exported as SVG to `src/assets/paper-people/`; `src/components/paper-person.js` moves each part along the same skeleton every frame. One soft paper shadow per figure; the far arm and leg are a touch darker. They wear the Sketch shoe.
- **Checked:** build; hidden-Chrome screenshots (no window on screen) of walk, run, spin, feet to the sky and the heel click: joints bend in the right places, lying down and getting up work, shoes on the feet. Not checked: the TV, and the other moves by eye. The story pictures behind them (the giant, the echo figure) are still in the old stick style.
- **Checked (first version):** build; screenshots at stop 1, mid-slide and stop 2; `npm run debug:stalls` six times. The first run stuttered in the forest (likely the browser decoding the big pictures on first view), so the pictures are now decoded at page load; the next runs were smooth there (only the old ~67 ms stall further down). New suspect "no paper forest (hero)" in `frame-stalls.mjs`. **Not checked on the TV yet.** Known: the rising layers show a straight top edge while they move.

## 2026-11-18 (later afternoon): arrow-key stops (Liz, branch `liz-animation-fixes`)
- **Blank slides (fixed):** the MVP, "How it came together" and "Four shoes, sound effects" put their first arrow-key stop before anything had faded in, so the right arrow landed on a blank screen and the content flashed past on the next press. The MVP now stops on its headline, then with the data flow lit; the other two stop with everything shown (`data-stop-at` in `built-parts.js`).
- **Veruzka's FSR breakdown skipped (fixed):** it only plays with the Sketch shoe, and a fresh browser started on Photo, so her section shrank to one screen. The site now starts on the Sketch (`startShoe` in `src/shoes/index.js`); a pick in the Style Lab is still remembered.
- **What's next overlap (fixed):** the returning shoe pieces covered "Shoe development"; they now gather under the headline.
- **New slide, "What the MVP does" (Liz):** right after the movement scene, before "Inside each shoe". Walk and run ("Every step makes a sound."), Spin ("Spin around to change the sounds."), Whimsy moves ("Unexpected and whimsical movements have their own sounds to be discovered."). One arrow-key stop per item; a figure on the right does each one. Picked from three directions (cards, one at a time, move and sound strip): one at a time, no box behind the figure, no label above it.
- **Kept on purpose:** the Style Lab panel and "Start prototyping" button stay on every slide (Liz's call).
- **Checked:** a fresh-browser arrow-key run through all 44 stops, with screenshots of each.

## 2026-11-18 (afternoon): animation fixes (Liz, branch `liz-animation-fixes`)
- **Legs through each other (fixed):** switching into or out of feet to the sky blended straight between lying down and standing, so both players' legs and shoes swung across the middle and through each other. They now lie down and get up through a tucked sit (one second instead of half a second).
- **Shoes snapping between views (fixed):** going to or from the heel click flipped the four shoes from the side view to the front view in one frame. They now turn over half a second.
- **Heel click hitch (fixed):** the tracked loop's last frame repeated its first, so the players froze for 1/20 s every loop. That frame plays once now, and the tracked frames are joined with a smooth curve instead of straight lines.
- **Checked:** build; a scripted arrow-key run through all seven movements (the shoes stay on the feet every frame; the view turn has no jumps); frame-by-frame screenshots of lying down and getting up. **Not checked by eye on a real screen** at full speed.
- **Arms bent backwards (fixed, Liz's review):** negative elbow values bend the forearm backwards in this rig, so walk, run, spin and standing all had backward elbows (worst in the run). Elbows now bend forward; arms swing opposite the legs, run arms drive at about 90° with the hand up to the chin.
- **Heel click (fixed, Liz's review):** the players floated about 25 units above the ground when standing and sank below it in the crouch (the tracked hip height didn't match the rig); now the feet touch the ground and only the real jump lifts them. The shoes are side-view like the drawn figure (the front-view shoes were narrower than the feet, which poked out). The tracked arms windmilled almost a full turn in half a second; now they swing back in the crouch and up in the jump, smoothed over time.
- **Heel click, take two (Liz's review):** the tracked loop's knees bent backwards in the side-on figure (it was filmed from the front), so it's now hand-animated side-on like a real heel-click jump: crouch with the arms back, push off, click the heels high in the air with the arms up and out, land soft. The sound ring fires on the click. The tracked loop stays in `bodystorm-motion.json`.

## 2026-11-18 (late night): QA fixes
- **Erratic players while paused (fixed):** the springy joints were worked out step by step, which blows up when a frame takes long (a busy laptop, the big TV): limbs flung around. Now the spring is solved exactly, so any frame rate is safe, and it's stiffer, so the joints keep the real motion (they lagged up to about 100° before).
- **Shoes snapping in the spin (fixed):** the 3D shoes flipped 180° in one frame six times every 5 seconds. They now turn smoothly with the spin.
- **Checked:** a simulation of every move at 60, 30 and 20 frames a second: no blowups, and the feet move only as far as the motion itself.

## 2026-11-18 (night): two players, real motion, the story behind them
- **Two players:** player 1 (cyan) leads, player 2 (Veruzka's sand) copies a beat late and falls into sync; the sound rings grow as they sync (copy and heighten). Each wears a pair: four shoes.
- **Real bodystorm motion:** the heel click is our tracked video loop (P-20, clip 3, cleaned, smoothed, looped). The side kick (P-09c) and dancer's pose (P-08a) use the tracked peak pose from the high-resolution stills, timed by hand; the video tracking had lost the feet there (the people were cut off at the bottom of the frame). The dancer's raised knee comes from the pictogram (the tracker was unsure). Walk, run, spin and feet to the sky stay hand-animated. Source: `crops_pose.json` and `windows_5fps.json` in the synthesis Drive folder.
- **Loops while you talk:** scroll picks the movement; the players keep looping it in real time while the scene is on screen.
- **Smoother:** springy joints (arms trail, knees soften), half-second blends between movements.
- **The story behind them:** the badge wall is replaced by an abstract vignette for each "Yes, and…" offer, in the sprite's style (21 vignettes).
- **One offer per move** (your call): walk → thin ice, run → being chased, spin → eye of a tornado, dancer's pose → statue in a museum, side kick → kick a door open, feet to the sky → gravity switched off, heel click → the curtain falls. Set with `pick` in `story-movements.js`; the spare offers and their vignettes stay for later.
- **Checked:** build; a scripted run through all seven movements (two players, the right offer and vignette each time, four feet, no broken drawing values, no errors); frames 9 ms in the movement scene, every scene clean on the rerun. **Not checked by eye:** how the vignettes and the stand-in shoes look in the real scene.
- **Shoes on the feet:** a solid stand-in shoe (not the flat card), seen from the side or the front like the figures. The Rhino model (`~/Documents/TUI/shoe/twinkle_toes.3dm`) will be exported to `shoe.glb` when it's ready.
- **Anti-slop reviewer** brought in from Cassius's other projects: `.claude/agents/anti-slop-reviewer.md` + `docs/anti-slop.md`.

## 2026-11-18 (later): the movement sprite scene
- **From Cassius's motion-sprite prompt** (in `cassius-agents/`), using the Apple Watch screen recording as a technique reference only (the recording stays out of git).
- **One sprite scene replaces the seven movement scenes** (archived): a cyan pictogram figure on Veruzka's warm dark does walk → run → spin → dancer's pose → side kick → feet to the sky → heel click in place. One rig, poses based on our bodystorm pictograms, blends between movements.
- **Pattern wall:** round badges of the same movement at low opacity; pulls back at the start, changes with a ripple from the centre, drifts.
- **The shoes:** the 3D shoe shrinks into a mirrored pair on the figure's feet, rides along, and lifts off into "Inside each shoe".
- **Label:** the movement's name and the rolled "Yes, and…" offer. The sound for that offer shows in presenter mode (P). Gradient type on "Stories! Movement!".
- **Our own scroll engine** (not GSAP), so the arrow-key fix and stops still work: one stop per movement.
- **Checked:** build; a scripted run through the scene (wall 2.6× → 1×, all seven movements and offers, the feet move with each pose, no errors); frames 9 to 10 ms. Two long gaps in the hero were the test window being hidden, not the site. **Not checked by eye:** whether the shoes sit nicely on the feet (the stand-in card will look rough there).

## 2026-11-18: the Twinkle Toes presentation (branch `web-presentation-draft`)
- **Everything is on the branch** `web-presentation-draft`. Nothing is on `main`. The branch was pushed to GitHub on 2026-11-18 (not merged, not deployed).
- **Cassius' agents:** the website prompt, the keep-integrity ground rules and the project, Figma and MVP context files are in `cassius-agents/`.
- **New story order:** hero → concept → what we've built → process → what's next → close. Veruzka's shoe story is kept as it was, as the FSR close-up inside "What we've built".
- **Fewer words:** one headline and one line per scene.
- **One 3D shoe (Three.js)** carries the story: it spins in the hero, does each movement (walk, run, spin, dancer's pose, side kick, feet to the sky, heel click), breaks apart with labels, and comes back together for the close. A stand-in is used until `shoe.glb` arrives.
- **Process:** real bodystorm images (frame, pose tracking, pictogram) for the heel click, the side kick and the toe descent ring, from the synthesis Drive folder. Plus "What Kimiko pushed us on", from Cassius's notes on her critique.
- **What's next:** shoe development and sound development.
- **Presenter mode:** press P. **Keyboard:** arrows and space jump scene to scene.
- **Worlds scene** set aside in `src/_archive/`.
- **Arrow-key jitter fixed:** the browser's smooth scroll and our scroll glide were stacked, so text, ripples and the shoe trailed the page (by up to a quarter of a scene) and kept moving after it stopped. During a keyboard jump they now follow the scroll exactly (`data-key-scrolling` on the page, set by `keyboard-nav.js`, read by `scroll-progress.js` and the 3D shoe). The mouse wheel keeps its glide. Measured with a scripted arrow-key run: lag went from 0.26 to one frame, no stalls.
- **Movements are improv prompts:** "Yes, and…" offers picked at random and rolled in like a slot machine, with the sound that makes each one real.
- **Checked:** `npm run build`; a scripted scroll through every scene (no errors, the shoe shows and hides where it should); `debug:stalls` per scene: no stalls (9 to 33 ms frames). **Not checked by eye yet.**

## 2026-11-17: the team presentation copy
- **This repo is a copy** of Magic Shoes for the team to turn into a presentation: github.com/Veruzka/magic-shoes-presentation (public), with the full history and checkpoint tags.
- **Published with GitHub Pages** on every push to `main`: https://veruzka.github.io/magic-shoes-presentation/. The steps are in `.github/workflows/pages.yml`.
- **For the sub-folder:** `vite.config.js` reads `BASE_PATH` (set by the workflow), and the story ↔ lab pill links use `import.meta.env.BASE_URL`.
- Checked for secrets before going public: none in the files or the history.

## 2026-11-12: the story's FSR moves to the heel
- **The FSR now lies at the heel in the story too**, in the same spot as in the lab: `along: 0.78` in `src/shoes/sketch-sensor.js`, shared by both. The lab's separate copy of that setting is gone.
- Chapter 1's pocket, chapter 2's lift-out and the FSR label's arrow all follow it automatically.
- **To look at:** the FSR label sits on the left of the shoe, so its arrow now runs further, to the heel. If it looks long or crosses the Midsole label, the FSR and Midsole labels could swap sides (`src/shoes/sketch-labels.js`).
- **Checked:** `npm run build`. Not seen on screen yet.

## 2026-11-12: lab piece 4, sounds
- **Reviewed first** by the sound-designer and illustrator agents. Both said it's a good plan. Their notes are in [lab-roadmap.md](lab-roadmap.md).
- **A SOUNDS list** in the right column, under the movements: 01 Deep boom, with 02 Ground rumble and 03 Giant hum "soon". Click a row to pick it.
- **▶ at the right edge of Deep boom** plays it once at strength 0.7. The triangle fills with ink while it rings and a hairline runs under the row.
- **The boom is made in code** with **Tone.js 15.1.22** (free; installed and pinned): a body, a thud, a sub rumble, echo, a compressor and a limiter, from the sound designer's recipe. It loads only when needed (when the page is idle or the pointer reaches ▶).
- **The Stomp card was slimmed** to its description and chart, so the right column fits on a laptop screen.
- **Template updated:** the sound step is now ✅ with its real fields; known gaps added (each synth sound needs a builder, file sounds can't play yet, the matching check comes in piece 6).
- **Checked:** `npm run build` (Tone.js is built into its own file, loaded on demand). Not heard or seen yet.

## 2026-11-12: lab piece 3, movements
- **Reviewed first** by the hardware-engineer, sound-designer, illustrator, motion-director and 3d-artist agents. All said it's a good plan. Their notes are in [lab-roadmap.md](lab-roadmap.md).
- **A MOVEMENTS list** on the right of the lab: 01 Stomp, with 02 Tiptoe and 03 Twist "soon".
  - Stomp can be picked only when a pressure sensor is at the heel. Otherwise it says "NEEDS A PRESSURE SENSOR AT THE HEEL".
  - Taking the FSR off greys Stomp out but remembers the pick.
- **The Stomp spec card** under it:
  - the description and the rule numbers
  - an ink-only chart of an illustrative stomp (a fast jump, a flat top near 0.9, settling to a standing level, the foot lifting), with START and RE-ARM lines and the 30 ms peak window
  - the line draws on in 0.5 s, the first time only
- **New data:** `src/lab/data/movements.js` (with zones, rule, what it gives the sound, and real-shoe settings), and a `forefoot` zone for tiptoe later.
- **Layout:**
  - three columns (sensors, shoe, movements)
  - movements drop under the shoe on smaller laptops
  - everything stacks on phones
  - the room around the shoe now scales with its size
  - the long "empty pocket" label is on two lines
- **Template updated:** the movement step is now ✅ with its real fields; known gaps added.
- **Fixed afterwards:** the shoe's labels had gone invisible. Splitting labels into lines made each line a separate text piece, and the "shapes are hollow" style emptied those too. The rule now applies only to shapes.
- **Checked:** `npm run build`. Not seen on screen yet.

## 2026-11-12: the lab template
- **New doc:** [lab-template.md](lab-template.md), the recipe for adding a sensor, movement, sound or interaction. It covers:
  - the building blocks and how they connect
  - a step-by-step checklist with every required field and the FSR example
  - the safety rules
  - known gaps
  - when to update it
- It's linked from `AGENTS.md`, the docs index and the roadmap.
- **Cleanups so new sensors need only data:**
  - The not-yet-drawn zones (Top, Side) are now entries in `zones.js`.
  - The hardware note under "Show inside" comes from any placed sensor's `insideNote`.
  - The FSR's open-shoe label uses the zone's label text.
- **Checked:** `npm run build`.

## 2026-11-12: lab piece 2b, "Show inside"
- **Reviewed first** by the same four agents. All said it's a good MVP. Their notes are in [lab-roadmap.md](lab-roadmap.md).
- **A "Show inside" switch** under the shoe. The lab's shoe is now the story's coming-apart Sketch shoe:
  - Opening takes 0.8 s: the sole and midsole move straight down, and the FSR render sits in its pocket at the heel.
  - Closing takes 0.6 s. A click midway reverses it.
- **When open:**
  - The red marker fades out.
  - Technical labels draw in one after another: OUTSOLE, MIDSOLE and FSR · HEEL, or "EMPTY · PLACE A SENSOR" when no FSR is placed.
  - The hardware note appears under the switch.
- **Fixes from the hardware review:** the FSR is now listed as the round FSR 402 (to match the picture), and the ESP32 pin is GPIO34.
- **New data:** `src/lab/data/layers.js` (the shoe's layers, for a future 3D shoe).
- **Checked:** `npm run build`. No screenshots, per your rule. `debug:stalls` only scrolls the story, which didn't change, so it wasn't run.

## 2026-11-12: lab piece 2a, the FSR on the shoe
- **Reviewed first** by the illustrator, motion-director, 3d-artist and hardware-engineer agents. All four said it's a good MVP. Their notes are in [lab-roadmap.md](lab-roadmap.md).
- **The lab now shows** the three-quarter Sketch shoe and a sensor parts list: 01 FSR, with 02 Gyro and 03 Capacitive "soon". Clicking FSR draws its marker at the heel: the dashed zone outline, a red crosshair, a leader line and "FSR · HEEL". Clicking again takes it off.
- **The start of the template:** `src/lab/data/sensors.js` (with wiring, voltage and safety details per board) and `src/lab/data/zones.js` (zones named after body parts, with where each is drawn kept separate, so 3D can come later).
- **Checked:** `npm run build`. No screenshots taken, per your rule.

## 2026-11-12: the prototyping lab, piece 1 (the page and the switch)
- **New lab page** at `/lab/`: the title "Magic Shoes Lab" and a "Coming next: sensors" placeholder. It looks **technical**: the FSR callouts' font (Barlow Semi Condensed), in uppercase and spaced out, in the story's colors.
- **Floating pill** in the bottom-right corner, left of the "i": "Start prototyping →" on the story, "← Back to the story" in the lab. Both use the technical font, uppercase.
- **Two pages in one build:** `vite.config.js` includes both, so Vercel publishes `/lab/` too.
- **Lab plan saved** in [lab-roadmap.md](lab-roadmap.md), from a Superpowers brainstorm (including the sound designer's boom recipe).
- **Checked:** `npm run build` makes both pages.

## 2026-11-11: chapter 4 texts read like an article
- **Fonts, matching the shoe's part labels:** handwritten **Mrs Saint Delafield** titles (the part labels' title font) and **Poppins Light** (300) paragraphs. We tried Inter + Source Serif 4, all Poppins, and Homemade Apple first.
- **Paragraphs:** about 18px with roomy line spacing. They're now dark brown instead of light brown, so they're easier to read.
- **Spacing:** a wider text column and more space between the two blocks. Phones get smaller sizes.
- **Words unchanged.** The styles live in `src/components/fsr-explainer.css`. Poppins 300 was added to the font link in `index.html`.
- **Checked:** screenshots at the end of chapter 4 (laptop, zoomed 2×, phone). On a phone the drawing still pokes into the text column and the Style Lab covers the first title. That's the existing phone layout, not this change.

## 2026-11-11: a home for sounds
- **Sound folders:** `sounds/` with 6 categories (giant, lightning, cartoon, music, ambient, experiments), each split into one-shots, loops and layers. Empty for now.
- **Rules and log:** [sound-library.md](sound-library.md) holds the naming rule, the web format and the sound log.
- **App catalog:** `sounds.json`, the only place the app will read sounds from.
- **Web copies:** `npm run sound:web` makes small AAC (.m4a) copies in `public/sounds/` with the Mac's built-in converter.
- **AGENTS.md** has a new Sounds section, so Claude follows the rules every session.
- **Checked:** the converter on a test tone (then deleted it); `npm run build`.

## 2026-11-11: chapter 4, the FSR settles and explains itself
- **New scroll chapter** (1.6 screen-heights) after the callouts. Designed with the Superpowers brainstorming steps; the goal is to test **how the motion feels**.
  1. **Slide + scan:** the line holds still like a scanner. The FSR slides right through it, so it becomes **fully drawn**, and shrinks to 80% to fit the cream side.
  2. **Turn flat:** the door turn unwinds to face you. The **callouts ride along**, pinned to their parts.
  3. **Texts on the left:** "What is an FSR?", then "What it does in the shoe". The wording is a **first draft**.
- **New component:** `src/components/fsr-explainer.js` (texts that fade and rise in, reusable).
- **Checked:** screenshots through chapter 4; `debug:stalls` longest frame 17–33ms over three runs (17 before the change), no stalls.

## 2026-11-10: tools, playbooks and docs for working consistently
- **Image tools are now part of the project** (they used to live in a temporary folder): `npm run image:cutout`, `image:outline` and `image:bands`, in `tools/images/`.
- **A screenshot tool for visual checks:** `npm run check:shot` (any scroll point, 2× sharpness, `--real` browser, zoomed `--crop`, `--css` for before/after).
- **AI originals saved** in `design/originals/`, with the Figma frame each came from and the credits (7 so far).
- **The debug scripts measure the page's length themselves,** so they always reach the end, whatever chapters are added.
- **New docs:**
  - [how-we-work.md](how-we-work.md): our routine, and where each kind of information goes
  - [visual-checks.md](visual-checks.md): the looks playbook
  - [tools-and-setup.md](tools-and-setup.md): every tool, the AI image steps and this Mac's quirks
  - [glossary.md](glossary.md)
- **Updated:**
  - the README's description (all three chapters)
  - a recipe for adding a chapter in how-to
  - known issues and open decisions (phones and reduced motion for chapters 2–3) gathered in [design-improvements.md](design-improvements.md)
- **Checked:** every new tool was run once (re-cutting the saved original reproduces the exact image); `debug:walk` reaches the end; `debug:stalls` longest frame 18ms, no stalls.

## 2026-11-10: chapter 3, the FSR turns and becomes half sketch
- **New scroll chapter** (1.6 screen-heights) after the FSR is big:
  1. **It turns like a door** (28°, real 3D). The pad's thickness shows as a dark glossy edge.
  2. **A line sweeps in** from the right, crosses the FSR and stops at its middle. Behind it the FSR becomes a **technical sketch** (fine warm ink, double lines for thickness, light hatching, the pad's ring in **red**) on **cream paper** with a fine grain, like the camera reference.
  3. **Callouts** fade in one by one: ACTIVE AREA, ELECTRODES, CONDUCTIVE TRACES, CONNECTOR (thin leaders, small condensed uppercase).
- **The sketch is drawn in code** from measurements of the straight-on render, so it lines up exactly and stays sharp. It cost no credits.
- **New font:** Barlow Semi Condensed (callouts).
- **New doc:** [electronics-style-guide.md](electronics-style-guide.md), the full look-and-motion recipe for this and future parts.
- **Checked:** sharp at 2× in a visible Chrome. Longest frame 9ms (one run had a one-off 150ms hiccup; two re-runs were clean). The scroll stages run in order. The debug scripts now scroll far enough to reach chapter 3, and list the paper, sketch, callouts and 3D turn as suspects.
- **Known limit:** on narrow phone screens, the callout column can run off the right edge.

## 2026-11-10: the big FSR is now high-definition
**Why it looked blurry:**
- **The browser was stretching a small snapshot.** The flying FSR was marked "will move" (`will-change`), so the browser photographed it once while it was small and enlarged that photo as it grew.
- **Not enough pixels.** The render is an angled view. To face you, its squashed pad had to be stretched about 1.5× taller, beyond the pixels the image has.

**The fix:**
- **No more snapshot.** The flying FSR is redrawn sharply at every size. Its shadow moved to a still wrapper, so the image itself isn't filtered.
- **A second, straight-on render** (`src/assets/fsr-render-front.png`, 532×1458, upright, pad on top). As the FSR finishes turning to face you, the angled render cross-fades into it, while it's still small. The big view then shows real pixels with no stretching. The angled render is still used in the shoe's pocket and while lifting out.
- **Checked:** at 2× (Mac) sharpness in a visible Chrome, the electrode lines and the glass edges are crisp. The longest frame is 9ms, with no stalls.
- **AI image:** Figma AI (gpt-image-2.5-flare, Graft team, 2 credits). The first try had the lines running the wrong way and was discarded. Prompt: "Photorealistic ultra high-end 3D product render, macro studio product photography, of a single round force-sensing resistor (FSR) lying flat, seen from directly above (straight-on top view), standing vertically in a tall portrait frame: perfectly circular pad at the top, the long straight tail running straight down… thick disc with a glossy black bevelled rim… matte black… precise, perfectly symmetric serpentine electrode pattern: about 14 thin, evenly spaced, perfectly straight polished-silver lines running VERTICALLY (parallel to the tail)… inside a thin silver ring… thick polished crystal-clear acrylic film with bevelled edges glowing faintly mint-green, with two parallel polished silver traces… small white plastic connector tab with two chrome pins pointing straight down. Razor-sharp focus… plain pale light-gray seamless background… No text, no logo." Cut out with Apple's subject lift.
- **Known flaw:** a couple of faint white specks inside the leftmost silver line, which come from the AI image.

## 2026-11-10: FSR as a high-end 3D render
- **A new FSR render** in the style of your references (studio product renders, exploded electronics):
  - a **thick, bevelled glossy black pad** with crisp, high-definition silver electrode lines and a fine texture
  - a **clear, glass-like tail** with real thickness, light refraction and silver traces inside
  - a white tab with **chrome pins**
- **Used everywhere:** in the shoe's pocket, while lifting out, and big in the center of the next scene.
- The previous render is kept as `src/assets/fsr-render-v1.png`.
- **AI image:** Figma AI (gpt-image-2.5-flare, Graft team, 1 credit, 1536×864). Prompt: "Ultra high-end 3D product render, Octane/KeyShot quality, of a single round force-sensing resistor (FSR) lying flat… thick circular sensor pad (about 3mm) with a softly bevelled glossy black edge… crisp, high-definition interdigitated electrode lines in polished silver on matte black, with a fine tactile micro-texture… long flexible tail of thick, polished, crystal-clear transparent film with a faint mint tint, real thickness and clean light refractions… two brushed-and-polished silver conductive traces… small matte white connector tab with two shiny chrome pins… pale light-gray seamless studio background, soft diffused overhead lighting… camera about 20° above, pad on the LEFT, tail to the RIGHT… no text, no logo." Cut out with Apple's subject lift.
- The stall check (`npm run debug:stalls`) still shows no slow frames.

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
