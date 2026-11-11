# Glossary

Words we use in the code, the settings and these docs.

## Scrolling and motion
- **Hero:** the first (and for now only) section of the page. It stays **pinned** (holds still) while you scroll through it, and that scrolling drives everything.
- **Progress:** how far through something you are, as a number from **0** (start) to **1** (end). The hero shows its overall progress in `data-progress`, which is handy when debugging.
- **Chapter:** one part of the hero's scroll, with its own progress 0–1. **Chapter 1 (fan):** the shoe comes apart and the labels appear. **Chapter 2 (exit):** the FSR flies out and grows. **Chapter 3 (reveal):** the door turn and the sketch half. **Chapter 4 (settle):** the FSR slides into the paper, fully drawn, turns flat, and the texts appear. Their lengths are in `src/sections/hero-timeline.js`.
- **Screen-height:** a unit of scroll length: one full screen of scrolling. Chapter lengths use it.
- **Stage:** a stretch *within* a chapter, written `{ start, end }`, both from 0 to 1. Example: `lift: { start: 0, end: 0.25 }` means "during the first quarter of chapter 2".
- **Ease:** a soft start and stop instead of a constant speed. Every stage eases.
- **Smoothing:** the page's motion glides toward your scroll position over a fraction of a second, rather than jumping with each wheel notch.
- **Parallax:** background layers moving at different speeds to suggest depth (`data-speed`).
- **Wheel notch:** one "click" of a mouse wheel, which is how the debug scripts scroll, like a real person.
- **Stall:** a frame that takes too long to draw (over 50ms), which feels like a hitch. Smooth is about 16ms.

## The shoe
- **Layer:** one horizontal slice of the Sketch shoe that separates (the gray sole, the white midsole).
- **Seam:** the line where a layer is cut from the shoe, like a puzzle piece's edge.
- **Top face:** the painted top surface of a separated layer (the gray tread, the white tray).
- **Travel / even gaps:** how far each layer moves. "Even" means it's worked out so the gaps between pieces are equal.
- **Pocket:** the keyhole-shaped dip in the white tray where the FSR lies.
- **Labels:** the handwritten-style notes (Outsole, Midsole, FSR) in chapter 1.

## The FSR (force-sensing resistor)
- **Pad:** its round sensing end. **Tail:** the long clear strip. **Connector / tab:** the white block with pins.
- **Angled render:** `fsr-render.png`, seen from slightly above. Used small.
- **Straight-on render:** `fsr-render-front.png`, seen from directly above, upright. Used big.
- **Swap:** the moment the angled render cross-fades into the straight-on one (chapter 2).
- **Door turn:** the 3D turn around its upright centre line (chapter 3).
- **Sweep:** the line that crosses from the right and turns the FSR into a sketch behind it.
- **Scanner:** the same line in chapter 4. It holds still while the FSR slides through it, so the rest of the FSR becomes sketch.
- **Callouts:** the camera-style labels with thin leader lines (chapter 3).

## Pixels and sizes
- **Page pixels (px):** sizes on the web page, as CSS uses them.
- **Screenshot pixels:** at 2× (Mac screens), each page pixel is 2×2 screenshot pixels.
- **Drawing pixels:** positions on the Sketch shoe drawing (`shoe-sketch.png`, 1356 × 846). The shoe's settings use these.
- **Image pixels:** positions on a specific image, e.g. the straight-on FSR (532 × 1458). The sketch's measurements and the callout points use these.
- **Share:** a fraction of something's size, e.g. `padWidth: 0.32` = 32% of the image's width.

## Building and publishing
- **Commit:** a saved snapshot of the code, on your computer.
- **Push:** copying commits to GitHub. Vercel then publishes the live site.
- **Checkpoint:** a commit with a name tag, to come back to (`checkpoint-NN-name`).
- **Headless / hidden Chrome:** a browser with no window, used by scripts. **Real / visible Chrome:** a normal window using the graphics card.
- **Baked:** drawn once into a picture, so it costs nothing to move later (e.g. the cloud texture, the paper grain).
- **Original:** the untouched AI image in `design/originals/`. A **cut-out** is the version with its background removed, in `src/assets/`.
