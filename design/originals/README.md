# AI originals

The untouched images straight from Figma AI, before their backgrounds were removed. Never edit these. They let us redo a cut-out or re-measure at any time (see `docs/tools-and-setup.md`, "Making a new AI image").

All were made in the Figma file **"Magic Shoes – assets"** (Graft team): https://www.figma.com/design/mnHnLX6S7rs63N8YTt9Igh (file key `mnHnLX6S7rs63N8YTt9Igh`), on Page 1, where each one is a frame named "Generated Image", left to right in the order made.

| Original | Figma frame | Became | Cost |
|---|---|---|---|
| `shoe-photo-original.png` (1536 × 1024) | 1:2 | `src/assets/shoe-photo.png` | 1 credit |
| `shoe-sketch-original.png` (1536 × 1024) | 2:2 | `src/assets/shoe-sketch.png` | 1 credit |
| `shoe-exploded-parts-original.png` (1024 × 1024) | 3:2 | `src/assets/sketch-parts/` (set aside) | 1 credit |
| `fsr-render-v1-original.png` (1536 × 1024) | 4:2 | `src/assets/fsr-render-v1.png` (not used) | 1 credit |
| `fsr-render-original.png` (1536 × 864) | 5:2 | `src/assets/fsr-render.png` | 1 credit |
| (discarded: lines ran the wrong way) | 6:2 | — | 1 credit |
| `fsr-render-front-original.png` (864 × 1536) | 7:2 | `src/assets/fsr-render-front.png` | 1 credit |

**Total so far:** 7 credits. The prompts are in `docs/changelog.md`.

The site never loads these files: only the cut-outs in `src/assets/` are published.

## The hero's paper forest (Runway, 2026-11-18)

Made with Runway for the first scene's forest backdrop. Prompts and steps are in `docs/changelog.md`. `tools/forest-layers.py` turns these into the web layers in `src/assets/forest/`.

| Original | What it is | Cost |
|---|---|---|
| (kept on Veruzka's computer only, not in git) `forest-option-a.png`, `forest-option-b.png` | The two options from the prompt; B was picked | 40 credits |
| `forest-b-no-banner.png` (2695 × 1504) | Option B with its blank paper banner removed | 25 credits |
| `forest-layers/1-background.png`, `3-middle.png`, `4-front.png` | Runway's layer split of the forest: back wall with clearing and moon, middle trees with the deer, front frame of leaves | about 10 credits for the split |
| (not in git) `forest-layers/0-base.png`, `2-distant-trees.png` | The split's other outputs: a different forest, and gray-topped trees. Not used | (in the split) |

**Total:** about 75 Runway credits.
