# Checkpoints

A **checkpoint** is a saved snapshot of the whole project at a moment when things worked and looked right. If later changes go wrong, we can go back to it.

You decide when a checkpoint is made. Say something like *"save this as a checkpoint"* and Claude saves one and adds it to the list below.

## How it works (in plain words)
- The project's history is kept by **git**, a tool that records snapshots of every file.
- Each checkpoint is a snapshot with a **name tag**, like `checkpoint-01-gray-sole`, so it's easy to find.
- Checkpoints are saved **on your computer** first. They're copied to GitHub only when you ask for a push. Making a checkpoint never publishes anything to the live site by itself.

## The list
Newest at the bottom.

| # | Name tag | Date | What works at this point | What's still open |
|---|---|---|---|---|
| 1 | `checkpoint-01-gray-sole` (also on GitHub) | 2026-11-09 | **Clouds** (main look) and **Meadow** backgrounds; **Photo** and **Sketch** shoes; switchers for Background, Shoe and Sole. On the Sketch shoe, the **gray sole detaches cleanly** like a puzzle piece (Down-left or Down): the shoe keeps a thin sketch outline, and the sole is solid with flowing molded tread on top. Living docs and the "i" info panel. | The shape of the sole's top surface is a guess. Next: more changes to the sole. |
| 2 | `checkpoint-02-layers-labels-fsr` (also on GitHub) | 2026-11-10 | Everything in checkpoint 1, plus: the **white foam midsole** separates as a second layer with **even gaps**, the **FSR** is a 3D render lying in a keyhole pocket on the midsole, **labels** (Outsole, Midsole, FSR) fade in one by one after the parts fan out, the big **"Magic Shoes" title** sits behind the shoe, motion is **smoothed**, the page stays on the shoe (no scrolling past it), and the **Style lab** card is frosted glass. Live at magic-shoes.vercel.app. | FSR is small at page size; "FSR" is hard to read in the script font; phone layout of labels is tight. |
| 3 | `checkpoint-03-fsr-chapters-docs` | 2026-11-10 | Everything in checkpoint 2, plus: **chapter 2** (the FSR lifts out, turns to face you and grows to the centre; sharp, using its own straight-on render), **chapter 3** (door turn, sweep to a technical sketch on cream paper, red ring, callouts), the first-scroll stall fixed, and the **working toolkit**: screenshot, image and debug tools, saved AI originals, and the playbooks (how we work, visual checks, debugging motion, electronics style guide, tools and setup, glossary). | Phones and reduced motion for chapters 2–3 are open decisions; faint white specks in the straight-on FSR image (see design-improvements.md 8–12). |
| 4 | `checkpoint-04-lab-show-inside` (also on GitHub) | 2026-11-12 | Everything in checkpoint 3, plus: chapter 4 (the FSR settles and explains itself, with Mrs Saint Delafield titles and Poppins paragraphs), the **sound library setup**, the **floating pill** that switches between the story and the new **prototyping lab** (`/lab/`), and in the lab: a technical-style sensor parts list, the **FSR marker at the heel**, and the **"Show inside"** switch that opens the shoe and shows technical labels. The plan is in [lab-roadmap.md](lab-roadmap.md). | 2b's FSR spot at the heel and the open-shoe label positions haven't been checked on screen. Next: 2c, a sketch-style FSR in the pocket. |

## Going back to a checkpoint
Just ask: *"go back to checkpoint 1"*. Claude will:
1. **Save what's there now first**, as a safety snapshot, so nothing is lost even if we go back.
2. Restore every file to how it was at that checkpoint.
3. Restart the preview and tell you what to look at.

**Just looking:** to look at an old checkpoint without giving up newer work, ask *"show me checkpoint 1"*. Claude opens it for a look and can switch back afterwards.

### If you want to do it yourself (optional)
In a terminal, inside the `magic-shoes` folder:
- `git tag` lists all checkpoints.
- `git show --stat checkpoint-01-gray-sole` shows what's in one.
- `git switch --detach checkpoint-01-gray-sole` lets you *look* at one; `git switch main` comes back.

Going back for real (throwing away newer changes) is best left to Claude, so the safety snapshot is always made first.
