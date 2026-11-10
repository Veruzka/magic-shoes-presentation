# Magic Shoes

**New here? Start with [docs/README.md](docs/README.md)** — plain-English docs for the whole project.

An interactive parallax website, built with [Vite](https://vite.dev) and plain JavaScript modules.

## Run it locally

```
npm install
npm run dev
```

Then open the URL it prints (usually http://localhost:5173).

## How it's organised

```
index.html            page shell
src/main.js           assembles sections in order, starts effects
src/core/parallax.js  reusable parallax engine (data-speed attribute)
src/core/remember-choice.js  remembers your last background/shoe pick in this browser
src/sections/         one file per page section
src/backgrounds/      swappable hero backgrounds (index.js lists them; one .js + .css each)
src/shoes/index.js    list of shoe styles you can switch between (Photo, Sketch)
src/shoes/sketch-sole.js   where the gray sole is in the Sketch drawing (outline, colour rule, texture)
src/shoes/sole-moves.js    the paths the sole can take as it detaches (Down-left, Down)
src/components/separating-shoe.js  splits the Sketch drawing into body + sole and moves the sole on scroll
src/shoes/sketch-parts.js  (set aside) the earlier 5-part exploded view + labels
src/core/scroll-progress.js  0→1 as you scroll through the hero; drives the shoe fanning open
src/components/exploding-shoe.js  poses the shoe's parts for a given scroll amount
src/components/       small reusable pieces (e.g. the prototype option switchers)
src/assets/           images (shoe-photo.png, shoe-sketch.png, sketch-parts/ — backgrounds already cut out)
src/data/clouds.js    list of clouds (shape, position, size, depth) — edit to change the Clouds background
src/data/flowers.js   list of background flowers (position, size, color, depth) — edit to change the meadow
src/styles/           base.css (shared tokens) + one stylesheet per section
```

### Adding a section

1. Create `src/sections/my-section.js` exporting a function that returns an element.
2. Create `src/styles/my-section.css` and import it from that file.
3. Add the function to the `sections` array in `src/main.js`.

### Making something move

Add `data-speed` to any element inside a section:

| Value | Effect |
|---|---|
| `0` | moves with the page |
| `0.3` | drifts slower (feels far away) |
| `-0.2` | moves against the scroll (feels close) |

Parallax switches off automatically for visitors who prefer reduced motion.

## Publishing

Pushes to `main` deploy automatically through Vercel's GitHub integration. Never deploy with the Vercel CLI.
