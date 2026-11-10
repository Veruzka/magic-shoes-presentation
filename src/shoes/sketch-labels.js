// Labels for the Sketch shoe's parts: a signature-style title, a short
// description, and a hand-drawn arrow pointing at the part. Each one belongs to
// a part, moves with it, and fades in as that part separates.
// (Drawn by src/components/part-labels.js.)
//
// Positions are in pixels of the Sketch drawing (1356 × 846, top-left = 0,0),
// measured with the part in its starting place — they move along with it.
// Numbers below 0 or above the drawing's size put a label outside the shoe.
//
//   part   which layer it belongs to ('gray-sole' or 'white-midsole')
//   at     where the text sits: [x, y] of its top corner
//   align  'right' = text ends at `at` (label on the left of the shoe),
//          'left'  = text starts at `at` (label on the right of the shoe)
//   arrow  from: where the line starts, to: what it points at
//          ('sensor' = wherever the sensor landed), bend: how much it curves

// When the labels appear, as fractions of the pinned scroll (the whole page).
// They only start once every part has finished moving (the last part ends at
// 0.48), so motion and text never happen at the same time. They come in one by
// one, in list order: each starts exactly when the one before it is fully shown.
// All three are done at 0.94, a little before the end of the page.
//   start  when the first label (Outsole) starts fading in
//   fade   how long each label takes to fade in fully
//   each   how much later each next label starts (= fade: no overlap, even steps)
export const labelTiming = { start: 0.52, fade: 0.14, each: 0.14 };

export const sketchLabels = [
  {
    part: 'gray-sole',
    title: 'Outsole',
    text: 'Durable rubber that grips the ground, absorbs wear and protects every step.',
    at: [-40, 860],
    align: 'right',
    arrow: { from: [-20, 880], to: [300, 812], bend: -70 },
  },
  {
    part: 'white-midsole',
    title: 'Midsole',
    text: 'Cushioning foam with air pods that softens impact and returns energy as you move.',
    at: [1430, 560],
    align: 'left',
    arrow: { from: [1420, 600], to: [1250, 600], bend: 50 },
  },
  {
    part: 'white-midsole',
    title: 'FSR',
    text: 'A force-sensing resistor that reads the pressure under your foot with every step.',
    at: [-60, 560],
    align: 'right',
    arrow: { from: [-40, 590], to: 'sensor', bend: -60 },
  },
];
