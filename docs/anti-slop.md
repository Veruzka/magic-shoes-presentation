# Anti-slop rules

Brought over from Cassius's other projects (SVSD, Arcade.ai Hackathon) on 2026-11-18 and adapted to Twinkle Toes. The `anti-slop-reviewer` agent (`.claude/agents/anti-slop-reviewer.md`) checks work against this list.

Our audience (Kimiko, Connie and the class) has seen a lot of AI-made sites. Anything that looks like a default reads as no decision at all. Check every scene and every line of copy against this list.

## Visual
- **No default gradients.** No purple-to-blue hero gradients, glassmorphism everywhere, or glowing orbs. A gradient must earn its place: today it's only on "Stories! Movement!", after the reference.
- **No identical card grids.** Rows of same-size rounded cards with an icon, a title and two lines of text are the most common AI layout. Use hierarchy and varied scale instead.
- **No generic type.** Choose type on purpose, with real contrast in size and weight. Here: Bricolage Grotesque for headlines, Poppins for lines, Barlow Semi Condensed for technical labels (see `my-instructions.md`).
- **No decorative emoji** as icons or bullets.
- **No stock illustrations or 3D blobs.** Use our real material: the shoe, the bodystorm frames, pose tracking and pictograms, the MVP photos.
- **Spacing and alignment are deliberate.** One spacing scale, kept to.

## Interaction and motion
- **Motion explains something.** Every animation shows where something came from, where it went, or how two things relate (the shoe breaking into its parts, the pair landing on the feet, copying making the sound grow). If it only decorates, cut it.
- **No spinner-only loading.** Show progress in the shape of the result, or say what's happening.
- **Every state is designed,** including reduced motion, a missing 3D model (the stand-in) and the shared link without presenter mode.

## Copy
- **No filler microcopy.** Avoid "Unlock your potential", "Seamlessly", "Elevate", "Empower", "Revolutionize", "Your journey starts here".
- **Specific beats clever.** Say what it is in plain words.
- **No AI-voice enthusiasm.** No exclamation marks on every line ("Stories! Movement!" is the one deliberate exception).
- **Our framing, always:** TUI as improv. Sound gives each move a body, for play and social clustering in spaces not built for play. Never "shoes that turn movement into sound".
- **One headline per scene, one line at most.** No em dashes.

## The test
Before handing anything off, ask: **could this scene belong to any other AI-made site?** If yes, it isn't done. Give it a point of view: one memorable interaction, real material from our process, or a real typographic voice.

## Lesson from an earlier project (2026-10-16)
A first build passed every technical check but failed this test. It was scaffolded before the visual direction was concrete, so it filled in invented surfaces and decorative shapes. So, before building:
- Make **one representative scene** concrete enough to review: composition, type, media, motion.
- Confirm it could **only belong to this project**.
- Use **real or deliberately authored material**, never generic shapes standing in for the work.
- Don't expand to more scenes until that one earns approval.
- A clean build, a working layout or a complete click path doesn't make up for a weak point of view.
