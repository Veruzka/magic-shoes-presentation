# Handoff: Twinkle Toes presentation site

**Read this first.** Written 2026-11-18 by Cassius (with Claude Code) for the teammate, and their AI agent, taking over the `web-presentation-draft` branch. Then read `AGENTS.md`, `docs/my-instructions.md` and the top of `docs/changelog.md`.

## What this is
A scroll-story website (in the style of an Apple product page) for our final presentation of **Twinkle Toes** (NWMEDIA C262, Prof. Kimiko Ryokai, TA Connie Gu). Team: Cassius Palacio, Liz Wang, Kimney Nguyen, Veruzka Oropeza, Vinay Thorat.

It lives inside **Veruzka's repo** (the Magic Shoes site). Her original shoe story is kept and reused inside "What we've built".

## The talk it serves
- **5 to 8 minutes, no live demo.** It's shown on a **big TV**. Five speakers each take a section. Press **P** for presenter mode (speaker notes plus the sound for each move).
- **The audience** saw our MVP (the music-sampling lab, which proved the tech works) but **has never seen the bodystorm**. The concept and the process are new to them.
- **Our next steps** are **shoe development** and **sound development**.
- **Story order:** hero → concept (the movements) → what we've built → process (the bodystorm and Kimiko's critique) → what's next → close.

## Expectations (non-negotiable)
1. **Branch only.** Work on `web-presentation-draft`. Never commit, merge or push to `main`, because GitHub Pages publishes `main`. Don't deploy.
2. **Framing: TUI as improv.** Sound gives each move a body, for play and social clustering in spaces not built for play. **Never** say "shoes that turn movement into sound".
3. **The concept's goal:** players piece together different embodied interactions to feel immersed in a story and world they create. That *is* the tangible user interface. Shown with **two players** ("copy and heighten") and an abstract **story picture** behind each "Yes, and…" offer.
4. **Less is more.** One headline per scene, one line at most, no em dashes in site copy.
5. **Refine, don't replace** Veruzka's work. Make the smallest change, one change per commit, and never delete (move to `src/_archive/`). Ask when unsure. See `cassius-agents/claude-code-prompt-keep-integrity.md`.
6. **The shoe drives the story in 3D:**
   - the hero: it spins
   - the concept: it moves onto the players' feet
   - "What we've built": it breaks apart with labels, then Veruzka's sketch breakdown of the FSR
   - the close: it's whole again
7. **How we work** (`AGENTS.md`):
   - Plan and get approval before changing files.
   - Offer 2 or 3 directions on real design choices.
   - Keep changes small and docs updated, in plain English.
   - No screenshots after every change.
   - Run `npm run debug:stalls` after any new moving piece.
8. **Check quality with the anti-slop reviewer** (`.claude/agents/anti-slop-reviewer.md`, checklist in `docs/anti-slop.md`) before calling a round done.

## Where it stands (we're almost in the clear)
Everything is pushed to `web-presentation-draft`.
- **All scenes exist and run in order**, with arrow-key stops (one per scene, one per movement) and presenter mode.
- **The movement scene** (`src/sections/concept-movements.js`):
  - Two stick-figure players. Player 2 copies player 1 a beat late and falls into sync.
  - Seven moves. Walk, run, spin, feet to the sky and the heel click are hand-animated (the tracked heel-click loop came from a front-on video and bent the knees backwards side-on; it's kept in the data). The side kick and dancer's pose use real tracked peak poses (`src/data/bodystorm-motion.json`).
  - **One "Yes, and…" offer per move**, set with `pick` in `src/data/story-movements.js`, plus its story picture (`src/components/story-props.js`). The spare offers and pictures are kept for later.
- **Just fixed:** the players moved erratically while paused, from an unstable spring. The 3D shoes snapped round during the spin. Both are fixed and pass a simulation at 60, 30 and 20 fps, **but haven't been looked at on screen yet.**
- **3D shoe:** a stand-in until the real model is exported (see below).

## What's left, in order
1. **Look at the paused movement scene by eye** (step with the arrow keys, wait a few seconds on each move). Confirm it's calm, and that the story pictures and the four stand-in shoes on the feet look right.
2. **Run the full anti-slop audit.** It was started and stopped before it finished, so no report exists yet. Ask your agent to use `anti-slop-reviewer` on the whole site. **Run no other browser checks at the same time:** they all drive the same Chrome and confuse each other.
3. **Fill in the TODO tags** (they show on the page as stickers):
   - the name: Twinkle Toes or Music Sampling Shoes (`src/sections/tt-hero.js`)
   - the speaker for each part (`src/data/presenter-notes.js`)
   - the MVP demo video and the three takeaways (`src/sections/built-parts.js`)
   - the timeline and owners for next steps (`src/sections/forward.js`)
   - more basic moves after the Kimney meeting (`src/data/story-movements.js`)
   - the per-shoe parts, confirmed with engineering (`src/data/shoe-parts.js`)
4. **The real 3D shoe:** export the Rhino model (`twinkle_toes.3dm`, Cassius has it; still in progress) to `public/assets/models/shoe.glb`. The part names and orientation it needs are in `public/assets/models/README.md`. The site switches from the stand-in automatically.
5. **Rehearse** one full arrow-key run on the TV.

## How to run and check
- `npm install`, then `npm run dev` and open http://localhost:5173/. Scroll or use the arrow keys. Press **P** for presenter mode.
- `npm run build` must pass.
- `npm run debug:stalls` checks for frame stalls. A huge one-off gap usually means the test window was hidden, so rerun before believing it.

## Where things are
- Architecture and how to change things: `docs/architecture.md`, `docs/how-to-change-things.md`
- Standing instructions: `docs/my-instructions.md`. History: `docs/changelog.md`
- Cassius's prompts and project context (concept, bodystorm, critique, MVP): `cassius-agents/`
- Bodystorm images: `src/assets/bodystorm/`. Archived scenes: `src/_archive/`

## Keep out of the repo
The team iMessage export (private) and the Apple screen recording (technique reference only; it's in `.gitignore`).
