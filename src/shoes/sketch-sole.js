// Layer 1 (bottom): the gray rubber sole of the Sketch drawing
// (src/assets/shoe-sketch.png). src/components/separating-shoe.js lifts it out
// like a puzzle piece.
//
// All position numbers are pixels in that image (1356 × 846, top-left = 0,0).

export const sketchSole = {
  name: 'gray-sole',

  // When it moves, as fractions of the scroll (0 = top, 1 = end of the pinned scroll).
  stage: { start: 0, end: 0.41 },
  // How far it travels, as a share of the path chosen in sole-moves.js (1 = all of it).
  travel: 1,

  // How to find the seam — the line where the gray sole meets the white foam.
  // Each column is read from the shoe's bottom edge upward; the sole ends where
  // a solid run of white foam (or the coloured upper) begins. Everything below
  // the seam leaves with the sole; everything above stays on the shoe.
  seam: {
    foamBrightness: 188, // at least this bright (0–255) counts as white foam…
    foamMaxColour: 14, //   …if it's also this un-coloured (rubber is a warmer gray)
    upperMinColour: 26, // this much colour counts as the shoe's upper (cream, cork)
    foamRunToStop: 3, // foam pixels in a row needed to end the sole (skips highlights)
    maxThickness: 170, // safety cap: the sole is never taller than this
    smoothing: 15, // how smooth the cut line is (bigger = smoother)
    edgeBlend: 2, // softness of the cut edge, in pixels
    minThickness: 6, // thinner than this isn't really this layer (e.g. just an outline line), so it's left alone
  },

  // Clean-up just above the cut: leftover bits within `band` pixels also leave
  // if they're darker than `darkerThan` (0–255), so the foam stays pure white.
  cleanup: { band: 14, darkerThan: 178 },

  // The thin ink outline the drawing has around its edges (e.g. the back of the heel).
  outline: {
    colour: 'rgb(60 56 50 / 0.55)', // soft warm gray, like the drawing's own outline on screen
    width: 1.6, // pixels in the drawing (shows up as a hairline on screen)
    keepWithin: 4, // the clean-up never removes outline pixels this close to the shoe's edge
  },

  // Areas that always leave with the sole, even if they look like foam.
  // The rubber toe bumper wraps up the front of the toe and has light-gray
  // shine on it; this outline runs just outside the cream toe's own ink line,
  // so the bumper's rim and outer line leave too, and the cream toe keeps its outline.
  alsoLayer: [
    [0, 546], [21, 549], [24, 553], [44, 569], [59, 590], [65, 610], [69, 621], [74, 640], [80, 700], [0, 700],
  ],

  // The sole's top surface, revealed once it pulls away (the drawing never
  // shows it). It's painted with the gray side's own colours.
  topFace: {
    style: 'tread',
    depth: 130, // how deep it looks: deepest mid-foot, nothing at toe and heel
    grainSoftness: 0.6, // blur on the grain, in pixels (0 = sharp speckle)
    farEdgeShade: 0.25, // how much darker the far edge is (0 = none, 1 = black)
    skipDarkerThan: 110, // ignore the side's dark ink outline when picking colours

    // The molded tread: flowing ridges like topographic lines — curved swirls at
    // the toe and heel, longer waves through the middle.
    tread: {
      spacing: 26, // distance between ridges, in drawing pixels (bigger = fewer, wider ridges)
      ridgeLight: 0.22, // how much the lit side of each ridge brightens (0 = flat)
      grooveDark: 0.5, // how dark the thin groove between ridges is (0 = none)
      waviness: 22, // how much the middle waves meander (0 = straight lines)
    },
  },
};
