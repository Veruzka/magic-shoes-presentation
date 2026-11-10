// The FSR (force-sensing resistor) lying in a pocket on top of the white
// midsole's tray (drawn by src/components/sensor-drawing.js). It's seen from
// slightly above, like the tray it sits on.
//
// Sizes are in drawing pixels (src/assets/shoe-sketch.png is 1356 × 846).
import fsrRender from '../assets/fsr-render.png';
import fsrRenderFront from '../assets/fsr-render-front.png';

export const sketchSensor = {
  // 'render' = the 3D render of the real FSR (src/assets/fsr-render.png)
  // 'drawn'  = the earlier copper-coil + green-board drawing, made in code
  look: 'render',

  // About the render image, measured from it (only change these for a new image):
  render: {
    image: fsrRender, // the high-end 3D render (the earlier one is src/assets/fsr-render-v1.png)
    padWidth: 0.32, // the round pad's width, as a share of the image's width
    padCentre: [0.161, 0.47], // where the pad's centre is in the image (share of width, height)
    viewFlatten: 0.66, // how squashed the round pad looks in the image (1 = seen from straight above)
    slope: 4.9, // degrees the tail runs downhill to the right in the image
    tailWidth: 0.3, // the tail's width (it's thicker now) for the pocket channel, as a share of the pad's width
  },

  // The same FSR seen straight on, standing upright (pad on top), in high resolution.
  // The big view in chapter 2 switches to it as the FSR turns to face you, so it
  // never has to stretch the small angled render. Measured from the image:
  front: {
    image: fsrRenderFront, // src/assets/fsr-render-front.png (532 × 1458)
    padWidth: 0.996, // the round pad's width, as a share of the image's width
    padCentre: [0.498, 0.181], // where the pad's centre is in the image (share of width, height)

    // Its parts, measured in the image's pixels, so the sketch half (chapter 3)
    // lines up exactly with the render. Only change these for a new image.
    shape: {
      pad: { cx: 265.5, cy: 258, rx: 265, ry: 259 }, // the black disc's outer edge
      ring: { cx: 265.5, cy: 261, r: 229.5, width: 9 }, // the silver ring around the lines
      loops: [[91, 113.5], [135, 156.5], [176.5, 196], [215, 234], [253, 272.5], [291.5, 311], [329.5, 348.5], [367, 386], [405, 424]], // each slender silver loop: its two legs' x
      singles: [445.5], // lone straight lines
      reach: { cy: 264, a: 232, b: 193 }, // how far the lines run up and down (an oval)
      tail: { left: 209, right: 320, neck: 506, glass: 7 }, // the clear tail; glass = its edge thickness
      traces: [[238, 254], [276, 292]], // the two silver traces (left and right edge x)
      collar: { left: 201, right: 326, top: 1262, bottom: 1322 }, // the tab's wider top
      block: { left: 209, right: 320, top: 1322, bottom: 1362 }, // the tab's lower block
      pins: [[230, 245], [284, 301]], // each pin's left and right x
      pinEnd: 1456,
    },
  },

  along: 0.5, // where it sits from toe (0) to heel (1) — the middle of the sole
  // It always lies along the shoe: coil (its head) toward the toe, board toward the heel.
  turn: 10, // degrees: turns the sensor's head (the coil) to the left (+) or right (−) — fine-tune by eye
  across: 0.5, // where it sits from the tray's near edge (0) to far edge (1) — the middle
  size: 110, // the round pad's width (the whole FSR, with its tail, is about 3× that); shrinks to fit if needed
  flatten: 0.38, // how foreshortened it looks, to match the floor's viewing angle (1 = seen from straight above)

  // The shallow pocket pressed into the foam that the sensor sits in, with a
  // small raised rim around it (like the inset panel on a shoe sole). For the
  // render it's keyhole-shaped: a round pocket for the pad + a channel for the tail.
  pocket: {
    padding: 0.14, // space between the sensor and the pocket's edge (share of the coil size)
    rim: 0.09, // width of the raised rim (share of the coil size)
    roundness: 0.45, // how rounded the pocket's corners are
    floorColour: '#ddd5c7', // the pocket floor — a little darker than the tray
    rimColour: '#efe9df', // the rim's far side (its near side is white)
    wallShade: 0.5, // shadow along the far wall where it dips down (0–1)
    texture: 0.2, // faint wavy molded texture on the floor (0 = none)
  },

  // Only for look: 'drawn' —
  coilRings: 7, // how many copper rings
  colours: {
    copper: '#c8794a', // copper wire
    copperDark: '#8f4f2c', // shadow between the copper rings
    copperLight: '#f0b48a', // shine on the copper
    disc: '#1e1c1a', // black disc under the coil
    hub: '#f2efe9', // the small hole in the middle
    board: '#2f4b37', // green circuit board
    boardEdge: '#46684f', // its lighter top edge
    chip: '#bdbab3', // silver chip on the board
    part: '#1c1c1c', // small black parts on the board
  },
};
