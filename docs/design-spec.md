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
| `--color-note` | `#2f2a25` warm near-black | part label text and arrows | base.css |
| `--color-ink` | `#3a332b` warm dark brown-gray | sketch ink and callouts (chapter 3) | base.css; sketch ink also in `src/shoes/fsr-reveal.js` |
| Paper / red accent | `#f2ecdf` with fine grain / `#b5473b` | the sketch half's paper and its one red part | `src/shoes/fsr-reveal.js` |
| `--glass-bg` / `--glass-border` | white at 60% / 80% | info button and panel | base.css |
| `--glass-card-bg`, `--glass-card-border`, `--glass-card-blur`, `--glass-card-grain`, `--glass-card-shadow` | glassmorphism: milky white tint (24% → 8%), thin white border (55%), 40px blur, fine grain (22%), soft wide shadow | the Style lab glass card | base.css |
| `--glass-divider` / `--glass-track` / `--glass-thumb` | white at 45% / lighter glass (white at 28%, border 50%) / white at 92% | the card's hairlines, glass pills and chosen option | base.css |
| Cloud sky | `--cream-top`, `--cream-middle`, `--cream-bottom` | Clouds background | `src/backgrounds/cloud-studio.css` |
| Box | `--box-top`, `--box-left`, `--box-right` | the box under the shoe | cloud-studio.css |
| Meadow | `--meadow-*`, `--flower-*`, `--tint` | Meadow background | `src/backgrounds/flower-meadow.css` |
| Text on a background | `inkColors` | text, outlines and the big title drawn over each background (brown text and a sand title on Clouds; white text and a see-through cream title on Meadow) | each background's `.js` file |

## Typography
| Name | Value | Used for |
|---|---|---|
| `--font-body` / `--font-display` | Inter | everything |
| `--font-script` | Caveat (handwritten) | the handwritten accent word in the old (set-aside) labels |
| `--font-title` | Bricolage Grotesque, extra bold (800), 88% width, about 14.5vw | the big "Magic Shoes" title |
| `--font-signature` | Mrs Saint Delafield (signature script) | part label titles (Outsole, Midsole, FSR) |
| `--font-note` | Poppins, 0.68rem, letter-spaced 0.06em | part label descriptions |
| `--font-callout` / `--text-callout` | Barlow Semi Condensed 500, uppercase, 0.8rem, letter-spaced 0.04em | callout labels on the sketch (chapter 3) |
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
| Chapter lengths | chapter 1 (parts + labels): 1.6 screen-heights; chapter 2 (FSR transition): 1.8; chapter 3 (FSR reveal): 1.6 | how long the pinned hero lasts | `src/sections/hero-timeline.js` |
| FSR transition | labels out 0→6%; lift 0→25% (rises 60px, ×1.2); turn upright + glide to center 20→60%; swap to the straight-on render 42→56%; grow 50→100% to 75% of screen height; scene scrolls away 15→80% (all of chapter 2) | chapter 2 | `src/shoes/fsr-transition.js` |
| FSR reveal | door turn 0→35% (28°); sweep 30→68% (screen first, then the FSR, stops at its middle); callouts from 72%, every 6.5% (all of chapter 3) | chapter 3 | `src/shoes/fsr-reveal.js`; the full recipe is in [electronics-style-guide.md](electronics-style-guide.md) |
| Gray sole stage | 0 → 41% of that scroll | when the gray sole slides away | `stage` in `src/shoes/sketch-sole.js` |
| White midsole stage | 7% → 48% (starts just after the gray sole, so they separate together), travels 0.34 of the path (about 54px vs. the gray sole's 160px) | when the white midsole slides away | `stage` and `travel` in `src/shoes/sketch-midsole.js` |
| Layer paths | Down-left: 120px left, 240px down, 5° tilt; Down: 240px down; both lift the whole shoe 80px | the gray sole's full path; the white midsole moves an 'even' share (equal gaps, ~78px each) | `src/shoes/sole-moves.js` |
| Scroll smoothing | the motion glides toward the scroll position over time (settles in about 0.3s, never more than 15% of the scroll behind; off for reduced motion) | everything driven by scrolling through the hero | `src/core/scroll-progress.js` |
| Label fade | only after the parts finish, one by one with no overlap: Outsole 52→66%, Midsole 66→80%, FSR 80→94% of the scroll (each starts when the previous is fully shown); arrows draw out as they fade in | part labels | `labelTiming` in `src/shoes/sketch-labels.js` |
| Layer easing | soft start and stop (cosine) | every layer's slide | separating-shoe.js |
| Stagger | 0.08 (each part starts 8% later) | the set-aside 5-part view | `STAGGER` in `src/components/exploding-shoe.js` |
| Scroll depth | far layers 0.25–0.35, near −0.15 | how fast background layers move | each background's `LAYER_SPEEDS` |

**Reduced motion:** for visitors who ask their device to reduce motion, the float and the breathing shadow stop, and the scroll-depth effect switches off.
