# Magic Shoes: start here

## What it is
Magic Shoes is a one-page website prototype. It shows a single sneaker floating in the middle of the screen, over a soft background. As you scroll, the page holds still and the shoe starts to come apart. Right now, the gray bottom sole detaches like a puzzle piece.

It's a **prototype**: we're trying out ideas, not shipping a finished product. Speed and variety matter more than polish.

## Who it's for
- **You (the designer):** to try looks and motion, compare options side by side, and decide what to keep.
- **Later, shoppers:** a playful product page where the shoe "explains itself" by coming apart.

## Run it on your computer
You need [Node.js](https://nodejs.org) installed (the engine that runs the local preview).

1. Open a terminal in the `magic-shoes` folder.
2. Run `npm install`. This downloads the building blocks. You only need it once, or after new ones are added.
3. Run `npm run dev`. This starts a local preview.
4. Open the link it prints, usually **http://localhost:5173**.

Changes you save in the code show up in the browser right away.

**Try it:** use the pills in the top-right corner to switch the **Background**, the **Shoe** and how the **Sole** moves. Click the small **"i"** in the bottom-right corner for a map of how the app is built.

## How it gets published
1. Changes are saved as a "commit" (a snapshot) in git.
2. The commit is pushed to GitHub.
3. **Vercel** notices the push and publishes the new version automatically.

We never publish with the Vercel command-line tool. Pushing to GitHub is the only way.

## The other docs
| Doc | Read it when you want to… |
|---|---|
| [architecture.md](architecture.md) | see a map of all the parts and how they connect |
| [how-to-change-things.md](how-to-change-things.md) | change a color, a size, a timing, or a setting |
| [design-spec.md](design-spec.md) | check the visual rules: colors, type, spacing, shadows, motion |
| [my-instructions.md](my-instructions.md) | see the standing instructions and decisions so far |
| [what-works.md](what-works.md) | remember what worked well (and what didn't) when working together |
| [design-improvements.md](design-improvements.md) | see the list of design ideas and issues |
| [changelog.md](changelog.md) | see what changed in each work session |
| [checkpoints.md](checkpoints.md) | see the saved points we can go back to, and how |
