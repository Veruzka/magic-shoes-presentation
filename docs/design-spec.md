# Design spec

The visual rules we're using. **Shared** values live in one place, `src/styles/base.css` (inside `:root`). Change them there and the whole app updates. Values that belong to only one part are listed with their own file.

## Colors
**Mood:** warm cream, sand and brown, matching the Clouds background. Shadows are always warm brown, never gray.

| Name | Value | Used for | Where |
|---|---|---|---|
| `--color-bg` | `#fbfaf8` cream | page background | base.css |
| `--color-surface` | `#f1e8da` darker cream | panels, the space below the hero | base.css |
| `--color-text` | `#3b3023` warm dark brown | main text, selected switcher option | base.css |
| `--color-muted` | `#8c7b64` soft brown | secondary text | base.css |
| `--color-accent` | `#c9ae84` sand | highlights | base.css |
| `--glass-bg` / `--glass-border` | white at 60% / 80% | info button and panel | base.css |
| `--glass-card-bg`, `--glass-card-border`, `--glass-card-blur`, `--glass-card-grain`, `--glass-card-shadow` | glassmorphism: milky white tint (24% → 8%), thin white border (55%), 40px blur, fine grain (22%), soft wide shadow | the Style lab glass card | base.css |
| `--glass-divider` / `--glass-track` / `--glass-thumb` | white at 45% / lighter glass (white at 28%, border 50%) / white at 92% | the card's hairlines, glass pills and chosen option | base.css |
| Cloud sky | `--cream-top`, `--cream-middle`, `--cream-bottom` | Clouds background | `src/backgrounds/cloud-studio.css` |
| Box | `--box-top`, `--box-left`, `--box-right` | the box under the shoe | cloud-studio.css |
| Meadow | `--meadow-*`, `--flower-*`, `--tint` | Meadow background | `src/backgrounds/flower-meadow.css` |
| Text on a background | `inkColors` | text and outlines drawn over each background (brown on Clouds, white on Meadow) | each background's `.js` file |

## Typography
| Name | Value | Used for |
|---|---|---|
| `--font-body` / `--font-display` | Inter | everything |
| `--font-script` | Caveat (handwritten) | the handwritten accent word in labels |
| `--text-xs` | 0.72rem (about 11.5px) | small descriptions |
| `--text-sm` | 0.8rem (about 13px) | switchers, small UI |
| `--text-md` | 1.05rem (about 17px) | label titles |

The fonts are loaded from Google Fonts in `index.html`.

## Spacing
| Name | Value | Used for |
|---|---|---|
| `--space-edge` | 16px | gap between floating UI and the screen edge |
| `--space-gap` | 8px | gap between stacked UI pieces |
| `--shoe-clear-space` | 32px | empty space around the shoe (in `src/styles/hero.css`) |
| `--shoe-width` | 70% of the screen width, max 460px | the shoe area (hero.css) |

## Corner radius
| Name | Value | Used for |
|---|---|---|
| `--radius-pill` | 999px (fully round) | segmented pills, info button |
| `--radius-card` | 22px | the Style lab glass card |
| `--radius-panel` | 20px | info panel |

## Shadows
| Name | Value | Used for |
|---|---|---|
| `--shadow-ui` | soft, 16px blur, brown at 12% | floating UI |
| `--shadow-panel` | 40px blur, brown at 18% | info panel |
| `--shadow-shoe` | 24px blur, 18px down, brown at 18% | under the shoe |
| Box shadow | blurred brown oval that "breathes" | on the box (cloud-studio.css, `.pedestal__shadow`) |

## Motion
| Name | Value | Used for | Where |
|---|---|---|---|
| `--duration-float` | 4s | one up-and-down float of the shoe; the box shadow breathes in time | base.css |
| `--duration-ui` | 0.25s | panel sliding in, button hover | base.css |
| `--ease-soft` | ease-in-out | the float and shadow | base.css |
| `--fan-scroll-length` | 150% of the screen height | how much scrolling the shoe's coming-apart takes | hero.css |
| Sole stage | 0 → 30% of that scroll | when the gray sole slides away | `SOLE_STAGE` in `src/components/separating-shoe.js` |
| Sole easing | soft start and stop (cosine) | the sole's slide | separating-shoe.js |
| Stagger | 0.08 (each part starts 8% later) | the set-aside 5-part view | `STAGGER` in `src/components/exploding-shoe.js` |
| Scroll depth | far layers 0.25–0.35, near −0.15 | how fast background layers move | each background's `LAYER_SPEEDS` |

**Reduced motion:** for visitors who ask their device to reduce motion, the float and the breathing shadow stop, and the scroll-depth effect switches off.
