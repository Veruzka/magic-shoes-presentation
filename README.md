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

## Twinkle Toes presentation draft (branch `web-presentation-draft`)

On this branch the home page tells the Twinkle Toes story, in this order: hero → the concept (one scene per movement) → what we've built (the 3D shoe breaks apart, then Veruzka's FSR sketch breakdown, then the MVP) → the process (timeline, how we tracked movement, Kimiko's critique, the bodystorm grid) → what's next → the close. One 3D shoe carries the story; its model goes in `public/assets/models/shoe.glb`.

- **Run it:** `npm install`, then `npm run dev`, and open http://localhost:5173.
- **Present it like slides:** arrow keys, space or Page Up/Down jump from scene to scene. Home and End jump to the start and the end.
- **Presenter mode:** press **P** for who speaks and the talking points.
- **Placeholders:** every one has a yellow **TODO** sticker on the page and a `// TODO:` comment in the code (`grep -rn "TODO" src`).
- **Background for agents and teammates:** [cassius-agents/](cassius-agents/).

### Deploying (not done yet, ask first)
- **GitHub Pages (already set up):** `.github/workflows/pages.yml` publishes `main` to https://veruzka.github.io/magic-shoes-presentation/. To publish this draft, merge the branch into `main` (or point the workflow's branch at `web-presentation-draft`), then push.
- **Vercel (alternative):** import the GitHub repo in Vercel and pick the Vite preset (build `npm run build`, output `dist`). No settings needed: `BASE_PATH` is only for Pages.
