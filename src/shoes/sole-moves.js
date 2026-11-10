// Ways the gray sole can travel as it detaches — switch between them with
// the "Sole" pill in the top-right corner to compare.
//
//   x, y  how far the gray sole ends up, in pixels on a desktop-size shoe
//         (scales down with the shoe on smaller screens); other layers move a share of it
//   turn  how much it tilts by the end, in degrees
//   lift  how far the whole shoe rises while it opens, so the taller stack stays centred
export const soleMoves = [
  { id: 'down-left', label: 'Down-left', x: -120, y: 240, turn: 5, lift: 80 },
  { id: 'down', label: 'Down', x: 0, y: 240, turn: 0, lift: 80 },
];
