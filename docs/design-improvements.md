# Design improvements

The one list of design ideas, known issues and open decisions. Status: **idea**, **open decision**, **known issue**, **in progress** or **done**. (Known issues found during a session are moved here from the changelog.)

| # | Problem | Suggested fix | Status |
|---|---|---|---|
| 1 | **The detached sole's top surface shape is a guess.** The drawing never shows it, so its shape is an even curve that can look wavy or too deep. | Trace the far edge from the real foot outline (or the upper's sole line), and give the slab a slightly thicker, even edge so it reads as one solid piece. (The tread texture is done; the outline shape is still a guess.) | in progress |
| 2 | **The first screen has no menu or product info yet.** The big "Magic Shoes" title is in, but the menu, the "New" tag and the product info are still missing, so it reads more like a demo than a product page. | Build the rest from the reference as separate components: the pill menu, the "New" tag, color dots and the "Buy now" block. | in progress |
| 3 | **The shoe images are heavy** (1–1.5 MB each), so the shoe can pop in late on slow connections. | Save smaller WebP versions (about 150–300 KB) and show a soft placeholder while loading. | idea |
| 4 | **Text is hard to read over Meadow.** White labels sit on busy, bright flowers, (The Style lab card's glass pills fixed its own readability.) | Add a soft dark glow behind text on Meadow, or a slightly stronger tint where text sits. | idea |
| 5 | **There was an empty cream block below the first screen** (a temporary spacer), so the scroll ended without a payoff. | Removed: the page now ends on the fully separated shoe with its labels. When we add more sections, they'll go after the hero. | done |
| 6 | **Glass needs something behind it.** Glassmorphism (like your samples) shines when soft colored shapes pass behind the glass. Over the plain cream sky, the Style lab card is a quiet milky pane. | Optionally add a few soft, blurred warm orbs or cloud wisps near the top-right, so the glass has color to frost. | idea |
| 7 | **Part labels on phones are cramped.** On narrow screens the Down-left path pushes the gray sole past the left edge, and the FSR title sits on its own arrow. | On phones, use straight-down movement, place labels above or below the pieces, and shorten the arrows. | idea |
| 8 | **Callouts on phones (chapter 3).** On narrow screens the callout column can run off the right edge. | Options: stack the labels below the FSR, or shrink the FSR and labels to fit on the right. | open decision (2026-11-10: document for now) |
| 9 | **Reduced motion for chapters 2–3.** Visitors who ask their device for less motion still get the FSR's flight, 3D turn and sweep (only the float and parallax switch off). | Options: simple fades through the same story; or the same sequence without the 3D turn and smoothing. | open decision (2026-11-10: document for now) |
| 10 | **Faint white specks in the straight-on FSR,** inside the leftmost silver line (from the AI image). | Retouch the cut-out, or regenerate (1 credit). | known issue |
| 11 | **The old "drawn" FSR look** (copper coil and green board, `look: 'drawn'` in `sketch-sensor.js`) is still in the code, unused. | Keep it as an option, or remove it to simplify `sensor-drawing.js`. | open decision |
| 12 | **The callout leader lines cross the sketch's lines** where a point sits deep inside the pad. | Move the `point`s nearer the edge, or add a small dot at each line's start like technical drawings. | idea |

