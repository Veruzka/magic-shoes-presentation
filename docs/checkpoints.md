# Checkpoints

A **checkpoint** is a saved snapshot of the whole project at a moment when things worked and looked right. If later changes go wrong, we can go back to it.

You decide when a checkpoint is made. Say something like *"save this as a checkpoint"* and Claude saves one and adds it to the list below.

## How it works (in plain words)
- The project's history is kept by **git**, a tool that records snapshots of every file.
- Each checkpoint is a snapshot with a **name tag**, like `checkpoint-01-gray-sole`, so it's easy to find.
- Checkpoints live **on your computer** until we push to GitHub. Pushing doesn't happen automatically, and a checkpoint never publishes anything to the live site.

## The list
Newest at the bottom.

| # | Name tag | Date | What works at this point | What's still open |
|---|---|---|---|---|
| 1 | `checkpoint-01-gray-sole` | 2026-11-09 | **Clouds** (main look) and **Meadow** backgrounds; **Photo** and **Sketch** shoes; switchers for Background, Shoe and Sole. On the Sketch shoe, the **gray sole detaches cleanly** like a puzzle piece (Down-left or Down): the shoe keeps a thin sketch outline, and the sole is solid with flowing molded tread on top. Living docs and the "i" info panel. | The shape of the sole's top surface is a guess. Next: more changes to the sole. |

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
