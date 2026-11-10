# Magic Shoes

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
src/sections/         one file per page section
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

Pushes to `main` deploy automatically through Vercel's GitHub integration.
