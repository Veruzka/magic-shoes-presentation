// The Sketch shoe, taken apart: its five layers and the labels that appear
// when it fans open. Used by src/components/exploding-shoe.js.
//
// All numbers are on a 1024 × 1024 "drawing canvas" — the size of the
// original exploded drawing the parts were cut from.
//
//   x, y, width, height  where the part sat in that drawing
//   layer                stacking order (higher = drawn on top)
//   closed               how far to slide/turn it so the parts stack into a whole shoe
//   open                 how far to slide/turn it when the fan is fully open
//                        (x/y in canvas units, turn in degrees; 0 = as in the drawing)
//
// Each part turns around its toe (left end), which is what makes it "fan".
import upper from '../assets/sketch-parts/upper.png';
import insole from '../assets/sketch-parts/insole.png';
import footbed from '../assets/sketch-parts/footbed.png';
import midsole from '../assets/sketch-parts/midsole.png';
import outsole from '../assets/sketch-parts/outsole.png';

// Listed top to bottom. The top layers start moving first when the fan opens.
export const sketchParts = [
  {
    name: 'upper', image: upper, x: 182, y: 14, width: 738, height: 382, layer: 5,
    closed: { x: 0, y: 215, turn: 0 },
    open:   { x: 80, y: -190, turn: -6 },
  },
  {
    name: 'insole', image: insole, x: 190, y: 296, width: 716, height: 242, layer: 2,
    closed: { x: 0, y: 260, turn: 0 },
    open:   { x: 20, y: -140, turn: -3 },
  },
  {
    name: 'footbed', image: footbed, x: 182, y: 438, width: 722, height: 214, layer: 1,
    closed: { x: 0, y: 150, turn: 0 },
    open:   { x: -40, y: -100, turn: 0 },
  },
  {
    name: 'midsole', image: midsole, x: 134, y: 548, width: 814, height: 314, layer: 4,
    closed: { x: 0, y: 0, turn: 0 },
    open:   { x: -100, y: -60, turn: 3 },
  },
  {
    name: 'outsole', image: outsole, x: 98, y: 806, width: 836, height: 192, layer: 3,
    closed: { x: 0, y: -110, turn: 0 },
    open:   { x: -160, y: 0, turn: 6 },
  },
];

// Labels that fade in once the shoe is open.
//   bold / script  the two-part title (bold block word + handwritten word)
//   text           the short description underneath
//   side           which side of the shoe the label sits on
//   x, y           where the label sits on the drawing canvas
//                  (for 'left' labels, x is the label's right edge)
export const sketchLabels = [
  {
    bold: 'LOCK', script: 'in',
    text: 'Wraparound strap holds your midfoot steady',
    side: 'right', x: 1000, y: 40,
  },
  {
    bold: 'CLOUD', script: 'step',
    text: 'Foam pods soften every landing',
    side: 'left', x: -40, y: 520,
  },
  {
    bold: 'GRIP &', script: 'go',
    text: 'Multi-directional tread for quick turns',
    side: 'right', x: 900, y: 860,
  },
];
