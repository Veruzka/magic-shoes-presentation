// Chapter 3 of the hero: the big FSR turns like a door, then a line sweeps in
// from the right and turns the right half into a technical sketch on cream
// paper, with camera-style callout labels. (Drawn by src/components/fsr-reveal.js.)
//
// Every stage is a stretch of chapter 3's scroll, from 0 (start) to 1 (end).
// The full recipe for this style is in docs/electronics-style-guide.md.

export const fsrReveal = {
  // Turns around its upright centre line, like a door: the right side goes back.
  turn: { start: 0, end: 0.35, angle: 28, perspective: 1800 }, // degrees; how strong the 3D is (px: lower = stronger)

  // The pad's thickness, shown as the FSR turns (a dark edge behind the render half).
  depth: { thickness: 12, layers: 6, shade: 0.3 }, // px; copies stacked to build the edge; how dark (0–1)

  // The dividing line sweeps from the right edge of the screen to the FSR's middle.
  sweep: { start: 0.3, end: 0.68, stopAt: 0.5 }, // stopAt: where it stops, as a share of the FSR's width

  // Behind the line: warm paper with a fine grain.
  paper: { colour: '#f2ecdf', grain: 0.16 },

  // The sketch half: warm ink, fine lines, light hatching, one red accent.
  ink: {
    colour: '#3a332b',
    line: 2.6, // main outlines (in the render image's pixels: about 1.2 px on screen)
    fine: 1.5, // inner details: bevels, glass edges, pin highlights
    hatch: 1.1, // shading strokes
    hatchGap: 9, // space between shading strokes
    accent: '#b5473b', // the red accent line
    accentPart: 'ring', // which part is red: 'ring' (the pad's silver ring), 'traces' or 'none'
  },

  // Labels with thin leader lines, fading in one by one after the sweep.
  callouts: {
    start: 0.72, // when the first one begins
    each: 0.065, // step between labels
    fade: 0.09, // how long each one takes (line draws, then text fades in)
    gap: 64, // px between the FSR's right edge and the labels' column
    // point: where the line starts, in the straight-on render's pixels (532 × 1458)
    // rise: px the label sits above (−) or below (+) that point
    items: [
      { text: 'Active area', point: [430, 300], rise: -40 },
      { text: 'Electrodes', point: [386, 360], rise: 30 },
      { text: 'Conductive traces', point: [292, 820], rise: 0 },
      { text: 'Connector', point: [320, 1300], rise: 0 },
    ],
  },

  // Chapter 4 (its own scroll, 0 → 1): the line holds still like a scanner while
  // the FSR slides right through it and becomes fully drawn, shrinks a little,
  // turns back flat, then two short texts appear on the left.
  settle: {
    slide: { start: 0, end: 0.45, to: 0.35, scale: 0.8 }, // to: where the FSR's middle lands, as a share of the cream side's width
    turnBack: { start: 0.3, end: 0.55 }, // the door turn unwinds to flat
    // The texts on the left, one after the other (they fade and rise in).
    texts: [
      {
        start: 0.6,
        end: 0.75,
        title: 'What is an FSR?',
        body: 'FSR stands for force-sensing resistor. It is a thin, bendy pad that lets more electricity through the harder you press on it. Light touch, a little signal. Firm press, a strong one.',
      },
      {
        start: 0.78,
        end: 0.93,
        title: 'What it does in the shoe',
        body: 'Tucked into the midsole, it feels every step. The shoe can tell when your foot lands, how hard, and how often.',
      },
    ],
    rise: 14, // px each text rises as it fades in
  },
};
