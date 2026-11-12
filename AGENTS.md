# This is a prototype, not production software

I'm exploring ideas, not building a finished product.

- Before changing any files, describe your plan and wait for my approval.
- Before planning, ask what I'm trying to learn or try out.
- When there's a real design choice, offer 2–3 directions instead of one "best" solution.
- Keep changes small enough that I can see what each one did.
- Tell me what I should look at or click to see the change.
- Don't write automated tests unless I ask.
- Explain changes in plain language, without jargon.
- Speed and variety matter more than polish.

## Documentation rules

The living docs are in `docs/` (start with `docs/README.md`). Write them in plain English for a designer: short sentences, no jargon (or explain it in one line), and examples where helpful. Dates are written YYYY-MM-DD.

- Before saying a task is done, update whichever docs it affected.
- When I give an instruction meant to last, add it to `docs/my-instructions.md` and follow it from then on.
- When I say I like a result, add it to `docs/what-works.md`.
- When you add or change a component or function, update `docs/how-to-change-things.md` and `docs/architecture.md` (including the diagram).
- Keep docs short and current. Edit existing entries instead of piling up duplicates.
- Never write secret keys or passwords in any doc. Only name which keys exist and where they are set.
- When I ask for a checkpoint, commit everything, add a git tag `checkpoint-NN-short-name`, and list it in `docs/checkpoints.md`. Don't push unless I ask. Before going back to a checkpoint, save the current work first.
- Follow the routine in `docs/how-we-work.md`, and put each kind of information in its one home (the table there).
- Don't take screenshots (Playwright or `npm run check:shot`) after every change. You check the result yourself. Use `docs/visual-checks.md` only when I ask, or when I report that something looks wrong.
- For new AI images, keep the original in `design/originals/`, and use the tools and steps in `docs/tools-and-setup.md`.
- When a scroll or motion effect misbehaves, follow `docs/debugging-motion.md` (logic check with real wheel notches → frame check in a visible Chrome → switch off suspects one at a time → fix the cause → prove it → write it down). Run `npm run debug:stalls` after adding any new moving piece.

## Sounds

The folders, naming rule, web format and log are in `docs/sound-library.md`.

- When I add or generate a sound:
  - rename it to the naming rule
  - put the original in the right category and role folder in `sounds/`
  - run `npm run sound:web` to make its web copy
  - add a row to `docs/sound-library.md`
  - add it to `sounds.json`
- The app reads sounds only from `sounds.json`. Never point code straight at a sound file.
- If I don't say the category, shoe action or license, ask me. **Never guess the license.**
- If the project becomes commercial, flag every sound whose license is non-commercial.
- Keep the log in `docs/sound-library.md` sorted by category.
- Before spending credits on a sound generator, follow the paid-tools rule: ask first, with the tool, model and estimated cost.
