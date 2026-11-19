# Claude Code prompt: improve the site without losing what's there

Paste everything below the line into Claude Code after it has read the repo, or alongside the main website prompt. It sets the ground rules for how much to change.

---

## Ground rules: refine, don't replace

This site was started by a teammate, and the work already in it matters. I do **not** want you to rebuild or restyle everything. Some things do need to change so the presentation lands. Your job is to make those changes while keeping the original integrity of what is there.

### What to protect

- **Her design language:** the colors, typography, spacing, motion style and overall feel she chose. Extend it; don't swap it out for your own taste.
- **Her structure and code:** the framework, file layout, component names, and how her agents split the work. Work inside that structure.
- **Her content and voice:** existing copy, visuals and sections stay unless they conflict with the story order or the facts in `PROJECT_CONTEXT.md`. When copy needs to change, edit it lightly and keep her tone.
- **Anything that already works.** If a section animates and reads well, leave it alone.

### What is allowed to change (only for the good of the presentation)

- **The story order:** concept first, then what we've built, then the process. Moving sections is fine; rewriting them is not.
- **Clarity:** a first screen that says what this is right away, and less text where visuals can carry it.
- **Gaps:** adding the sections or scenes the story needs that don't exist yet (for example the movement scenes or the exploded shoe), built in her style.
- **Facts:** correcting anything that disagrees with `PROJECT_CONTEXT.md`, `FIGMA_CONTEXT.md` or `MVP_CONTEXT.md`.
- **Presenting:** keyboard navigation, readable text from the back of a room, and smooth performance on a laptop.

### How to work

1. **Audit before touching anything.** Give me a short table of every existing section or major piece with one label each:
   - **Keep:** works as is.
   - **Adjust:** small changes needed (say what and why).
   - **Change:** needs real rework for the presentation (say why it can't be a small adjustment).
   - **Add:** missing and needed.
2. **Wait for my OK on that table.** I may move items between Keep, Adjust and Change.
3. **Make the smallest change that does the job.** No broad refactors, renames, reformatting, dependency swaps or "while I'm here" cleanups.
4. **Never delete her work outright.** If something has to go, move it to an `_archive/` folder or comment it out, and tell me.
5. **One change per commit**, each with a clear message, so any single change is easy to undo. Stay on the working branch; don't merge to `main`.
6. **If you're unsure whether something is intentional, ask.** Assume her choices were deliberate until I say otherwise.
7. **At the end, list every change** in plain language: what changed, why it helps the presentation, and what you deliberately left alone.

The test for every edit: *does this make the presentation clearer or stronger, and would my teammate still recognize her work?* If the answer to either is no, don't make it.
