// The small wireless-charging sensor lying on top of the white midsole's tray
// (drawn by src/components/sensor-drawing.js). It's seen from slightly above,
// like the tray it sits on.
//
// Sizes are in drawing pixels (src/assets/shoe-sketch.png is 1356 × 846).

export const sketchSensor = {
  along: 0.42, // where it sits from toe (0) to heel (1) — the middle area, where the floor is widest
  // It always lies along the shoe: coil (its head) toward the toe, board toward the heel.
  across: 0.58, // where it sits from the tray's near edge (0) to far edge (1) — a touch past the middle, to even out the space
  size: 115, // the coil's width; the whole sensor (coil + wires + board) is about twice that
  flatten: 0.38, // how foreshortened it looks, to match the floor's viewing angle (1 = seen from straight above)

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
