// Ways the gray sole can travel as it detaches — switch between them with
// the "Sole" pill in the top-right corner to compare.
//
//   x, y  how far it ends up, in pixels on a desktop-size shoe
//         (scales down with the shoe on smaller screens)
//   turn  how much it tilts by the end, in degrees
export const soleMoves = [
  { id: 'down-left', label: 'Down-left', x: -96, y: 160, turn: 5 },
  { id: 'down', label: 'Down', x: 0, y: 160, turn: 0 },
];
