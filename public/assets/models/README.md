# The 3D shoe model

Drop the model here as **`shoe.glb`**. The site loads it from `/assets/models/shoe.glb` and uses it instead of the stand-in (the Sketch drawing on a card). No code change needed: reload the page.

## What the model needs
- **One file, `.glb`** (glTF binary), under about 10 MB so it loads fast.
- **Each part is its own top-level object**, named exactly like its id in `src/data/shoe-parts.js`:
  `fsr`, `mpu`, `xiao`, `power`, `case` (`minima` is set aside, 2026-11-19). Everything else (upper, sole…) can stay as one object or be named freely.
- **Lying along its length:** the toe pointing to the left (−X), the sole down (−Y), like the Sketch drawing. The site scales it to fit, so the size doesn't matter.
- To control which way a part flies out when the shoe breaks apart, add `explode: [x, y, z]` to that part in `src/data/shoe-parts.js`. Without it, each part flies straight out from the middle of the shoe.

TODO: add `shoe.glb` when the model is ready.
