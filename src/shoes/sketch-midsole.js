// Layer 2: the white foam midsole of the Sketch drawing, with the clear pods
// set into it. It's cut from what's left after the gray sole (layer 1) is gone,
// and leaves the cork layer and everything above it on the shoe.
//
// All position numbers are pixels in src/assets/shoe-sketch.png (1356 × 846).

import { sketchSensor } from './sketch-sensor.js';

export const sketchMidsole = {
  name: 'white-midsole',

  // Starts midway through the gray sole's move (0 → 0.3), and finishes a little later.
  stage: { start: 0.15, end: 0.45 },
  // Travels about a third as far as the gray sole (~54px), so there's a bigger
  // gap below it (to the gray sole, ~106px) than above it (to the shoe).
  travel: 0.34,

  // How to find the seam — the line where the white foam meets the cork (or the
  // cream toe cap). Each column is read from the foam's bottom edge upward; the
  // midsole ends where a solid run of clearly coloured pixels begins.
  seam: {
    upperMinColour: 27, // this much colour = cork or cream upper (foam and pods have ~5–20)
    foamRunToStop: 3, // coloured pixels in a row needed to end the midsole
    maxThickness: 320, // safety cap (the foam wraps up the heel, so it's tall there)
    smoothing: 21, // how smooth the cut line is (bigger = smoother)
    edgeBlend: 2, // softness of the cut edge, in pixels
    // Only columns with real white foam near the bottom count (the toe cap is cream, not foam).
    mustContain: { minBrightness: 170, maxColour: 16, within: 10 },
    minThickness: 6, // thinner than this isn't really this layer (e.g. just an outline line), so it's left alone
  },

  // Clean-up just above the cut: un-coloured bits (white foam, gray ink lines)
  // within `band` pixels also leave, so the cork's underside is clean.
  cleanup: { band: 8, maxColour: 14 },

  // Soft sketch outline along the cork's new bottom edge (same as the gray sole's).
  outline: {
    colour: 'rgb(60 56 50 / 0.55)',
    width: 1.6,
    keepWithin: 4, // the clean-up never removes the drawing's own outline this close to the edge
  },

  // Its top surface, revealed once it pulls away: a smooth matte foam tray —
  // a raised lip around the edge and a recessed floor inside.
  topFace: {
    style: 'tray',
    depth: 150, // how deep it looks: deepest mid-foot, nothing at toe and heel
    floorLight: '#f4f1eb', // floor colour near you
    floorDark: '#e3ddd2', // floor colour at the far edge
    lipWidth: 7, // width of the raised lip, in drawing pixels
    lipLight: 0.9, // how bright the lip is (0–1)
    recessShade: 0.22, // shadow where the floor dips below the lip (0–1)
    grain: 0.18, // faint foam grain (0 = perfectly smooth)
    sensor: sketchSensor, // the small charging sensor lying in the middle of the tray
  },
};
