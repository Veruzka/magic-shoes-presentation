# Design improvements

A running list of design ideas and issues. Status: **idea**, **in progress** or **done**.

| # | Problem | Suggested fix | Status |
|---|---|---|---|
| 1 | **The detached sole's top surface shape is a guess.** The drawing never shows it, so its shape is an even curve that can look wavy or too deep. | Trace the far edge from the real foot outline (or the upper's sole line), and give the slab a slightly thicker, even edge so it reads as one solid piece. (The tread texture is done; the outline shape is still a guess.) | in progress |
| 2 | **The first screen has no headline or menu yet.** Without the big "Magic Shoes" title, the menu, the "New" tag and product info, the page feels like a demo, not a product page. | Build step 3 from the reference: the title behind the shoe, the pill menu, color dots and the "Buy now" block, as separate components. | idea |
| 3 | **The shoe images are heavy** (1–1.5 MB each), so the shoe can pop in late on slow connections. | Save smaller WebP versions (about 150–300 KB) and show a soft placeholder while loading. | idea |
| 4 | **Text is hard to read over Meadow.** White labels sit on busy, bright flowers, (The Style lab card's glass pills fixed its own readability.) | Add a soft dark glow behind text on Meadow, or a slightly stronger tint where text sits. | idea |
| 5 | **Below the first screen there's just an empty cream block** (a temporary spacer), so the scroll ends without a payoff. | Replace it with the next section (for example a parts breakdown or "shop the colors"), or end the page on the fully separated shoe. | idea |
| 6 | **Glass needs something behind it.** Glassmorphism (like your samples) shines when soft colored shapes pass behind the glass. Over the plain cream sky, the Style lab card is a quiet milky pane. | Optionally add a few soft, blurred warm orbs or cloud wisps near the top-right, so the glass has color to frost. | idea |
| 7 | **Part labels on phones are cramped.** On narrow screens the Down-left path pushes the gray sole past the left edge, and the FSR title sits on its own arrow. | On phones, use straight-down movement, place labels above or below the pieces, and shorten the arrows. | idea |
