# Claude Code prompt: Twinkle Toes scroll-story website (rough draft tonight)

Open your teammate's website repo in VS Code once she has pushed it. Then paste everything below the line into Claude Code from the root of that repo.

---

## Who you are working for

You are building a **scroll-driven, Apple-product-page-style website that doubles as our final presentation** for NWMEDIA C262 Tangible User Interfaces (UC Berkeley, Prof. Kimiko Ryokai, TA Connie Gu). Team: Cassius Palacio, Elizabeth (Liz) Wang, Kimney Nguyen, Veruzka Oropeza, Vinay Thorat.

Tonight's goal is a **rough draft** that tells the full story in the right order. Tomorrow the team refines it, after a meeting with Kimney about the basic movements.

## Step 1: read the repo before writing anything

This repo was started by a teammate who runs **several agents, each owning a different part of the site.** Before you change anything:
0. Read `PROJECT_CONTEXT.md` (in the repo root, or I'll paste it). It is the source of truth for the concept, the bodystorm, the class critique, the MVP, the Figma maps and related work. Where it disagrees with this prompt on the story order or the section content, follow this prompt.
1. Read the README, any `CLAUDE.md` / `AGENTS.md`, `package.json` and the folder structure. Summarize back to me in a few lines: the stack, how the site is run, how the work is split between agents, and where each section lives.
2. **Find the shoe visual that already exists in the repo** (images, SVGs, 3D models, or a component that draws the shoe). Reuse it for the hero and the exploded view. Do not invent a new shoe if one is there. Tell me what you found and how you plan to animate it.
3. Copy the existing conventions: same framework, file layout, naming and styling approach. Mimic her multi-agent split: if you can run subagents, give each section below its own agent, then do one integration pass yourself so the transitions feel continuous.
4. If the repo has no clear stack yet, default to plain HTML/CSS/JS with **GSAP + ScrollTrigger**, and Three.js only if there is a 3D shoe model.

Wait for my OK on that summary before building.

## Workflow rules

- Create a new branch from the current default branch: `git checkout -b web-presentation-draft`. Never commit to `main`.
- Mark every placeholder with a visible `TODO` label on the page and a matching code comment, so teammates can find what to replace.
- When the draft runs locally, commit with a clear message and `git push -u origin web-presentation-draft`. Do not merge, and do not deploy without asking me.
- End with a short summary: what you built, how to run it, and the full TODO list.

## Source material

Extra context lives in our other repo, **github.com/cassiusp-beep/tui-music-sampling-shoes** (the MVP). Use its `README.md` for facts and its `docs/` images (breadboard photos, the 3D-printed tent case, the Tinkercad circuit, the sampler app screenshot) as real media. Clone it into a temp folder to read it; do not edit it.

## The story order (this sequence is the most important part)

The order was changed on purpose: **concept first, then what we built, then the process.** The audience should understand what this is within the first screen. Each section is one or more full-screen "scenes" that pin while visuals animate on scroll, with very little text.

### 0. Hero
- Full screen. Project name **"Twinkle Toes"** (TODO: confirm vs. "Music Sampling Shoes").
- One line: *Shoes that turn your movement into sound, so two people can play their way through imagined worlds.*
- Visual: the shoe fanned out in a spread of colors, rotating as you begin to scroll, inspired by how apple.com fans out the iPhone 17 colors. Each color stands for one world (see section 1). Use our own shoe visual, never Apple's images or branding.

### 1. The concept ("Stories! Movement!")
Say right away what we're doing. As you scroll, the shoes move and each movement "makes" its sound. Show sound visually (ripples, waveforms). Real audio is optional and must stay muted until the viewer clicks an unmute toggle.

**Movement vocabulary**, one movement per scene, with the shoe animating each one:
- **Basic movements:** walk, run. (TODO: expand after the Kimney meeting. Build this as a reusable scene component so new movements are easy to add.)
- **Playful functionality:** spin.
- **Whimsy movements:** dancer's pose, side kick, feet to the sky.

**The world changes.** Two players move through a series of worlds made of sound: **Sky** (stars twinkle, wind, thunder kicks), **Lava** (sizzle, rumble, bubbling steps), **Forest** (rustling grass, snapping twigs, birds scattering) and **Water** (splashes, drips, waves on a stomp). The same movement sounds different in each world. When **both players stomp together within a quarter second**, they swap sound sets and everyone moves to the next world. Play is open-ended, with no winner. A heel click ends the session and sends both players "back home."
- Visual: as you scroll through the worlds, the background color, the shoe's color (matching the hero fan) and the sound visuals change with each one. The double stomp is the transition between worlds.

### 2. What we've built
- **Exploded shoe:** using the existing shoe visual, the shoe "opens up" as you scroll and the parts separate and get labeled, one at a time:
  - FSR pressure sensor in the sole
  - MPU-6050 gyro / accelerometer
  - Arduino UNO R4 Minima
  - XIAO ESP32-C6 (sends data over Bluetooth)
  - USB power bank
  - 3D-printed case (SLA resin print, TODO: final model)
  - (TODO: confirm the per-shoe parts once engineering decides the final hardware.)
- **The MVP, "Music Sampling Shoes":** two players, one shoe each, remixing a song split into 4 parts (drums, bass, vocals, melody). The left player controls drums + bass and the right player controls vocals + melody. Standing brings a part in, lifting drops it, tipping your toes brings in your second part, shaking adds echo, and **both players stomp within 0.25 s to swap parts.** Inspired by Kanye West's Stem Player. Data flow: FSR + gyro → Minima (50x a second) → XIAO → Bluetooth (40x a second) → Chrome sampler app → laptop speakers.
- **Building on that:** the bodystorming interaction we're making next. Each player wears a full pair of shoes (4 shoes in all), with sound effects instead of song parts.
- **Takeaways** (TODO: team to write 2 to 3 short lines).
- Media slots: MVP demo video (TODO), plus the photos from the MVP repo's `docs/`.

### 3. The process
Tell it as a short timeline that reveals step by step:
1. We started with movement and math.
2. We were encouraged to explore embodied interaction and bring back whimsy: unexpected movements, improv and storytelling. (We chose not to frame this as continuing Dor Abrahamson's embodied math work.)
3. We landed on the basics: what can we do with our feet?
4. **Bodystorming session** (29 Oct 2026, outdoors on campus, shoes on, about 26 minutes, 28 gestures recorded). Takeaway: we want people to play with our tool the way we played in the bodystorm.
5. We wrote down the movements we liked and grouped them into **standard** (walk, run, step) and **whimsical** (kick, dancer's pose, feet to the sky).
- Visual: a 2x2 grid that builds on scroll, **Expected ↔ Whimsy** by **Ambient ↔ Active**, with gesture dots dropping into place. Quadrant names: Street Percussion, Play, Pause, Reverie.

### 4. Moving forward
- Two players, each in a full pair of shoes, one FSR + one gyro per shoe.
- Our own sound-effect library for each world.
- TODO: next build steps and timeline.

### 5. Close
Team names, course credit, links to both GitHub repos and Liz's Medium post ("Twinkle Toes").

## Look and feel

- Apple product page energy: huge confident type, lots of empty space, one idea per screen, the shoes lit like products, smooth scroll-scrubbed motion.
- Short text only: a headline and at most one sentence per scene. The visuals do the explaining.
- Smooth on a laptop in Chrome. Respect `prefers-reduced-motion` (fall back to simple fades).
- **Presented live and shared as a link:** add keyboard navigation (arrow keys / space jump scene to scene) so it can be driven like slides, and keep it deployable as a static site (Vercel or GitHub Pages). Write the deploy steps in the README, but don't deploy yet.
- No em dashes in any copy.

## Done tonight means

- [ ] Repo summary and shoe-visual plan approved by me before building.
- [ ] The site runs locally and scrolls through every section in the order above.
- [ ] The hero fan, movement scenes, world changes, exploded shoe and 2x2 grid all animate on scroll, even with placeholders.
- [ ] Basic movements are a reusable component, ready for more tomorrow.
- [ ] Arrow-key navigation works.
- [ ] Every placeholder is labeled TODO.
- [ ] Committed and pushed to `web-presentation-draft`.
