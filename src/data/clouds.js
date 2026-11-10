// Clouds for the "Clouds" background (src/backgrounds/cloud-studio.js).
//
// 1) cloudShapes: what each kind of cloud looks like.
//    Each shape is a bunch of round puffs drawn on a 200 × 100 canvas:
//    [x, y, radius] — x/y = where the puff's centre is, radius = how big.
//    Overlapping puffs merge into one cloud outline.
//
// 2) clouds: where each cloud goes on the screen.
//    layer  'back'  = behind the box, slightly softer, moves slowly
//           'front' = in front of the box, moves faster (feels close)
//    shape  one of the names in cloudShapes
//    x, y   where its centre sits, in % of the screen (0,0 = top left)
//    size   how wide it is, in % of the screen width
//    flip   true to mirror it left-to-right (adds variety)

export const cloudShapes = {
  puffy: [
    [22, 80, 16], [42, 68, 26], [76, 50, 34], [114, 42, 38],
    [150, 58, 30], [178, 76, 20], [100, 76, 30],
  ],
  long: [
    [20, 80, 16], [46, 66, 24], [78, 56, 30], [112, 58, 28],
    [144, 64, 24], [174, 76, 20],
  ],
  tall: [
    [56, 72, 28], [86, 44, 34], [118, 34, 30], [140, 62, 30], [100, 76, 28],
  ],
};

export const clouds = [
  // Back: behind the box.
  { layer: 'back',  shape: 'tall',  x: 14, y: 70, size: 24 },
  { layer: 'back',  shape: 'puffy', x: 6,  y: 82, size: 34, flip: true },
  { layer: 'back',  shape: 'long',  x: 32, y: 84, size: 30 },
  { layer: 'back',  shape: 'puffy', x: 68, y: 84, size: 32 },
  { layer: 'back',  shape: 'tall',  x: 86, y: 68, size: 24, flip: true },
  { layer: 'back',  shape: 'long',  x: 96, y: 80, size: 30 },

  // Front: in front of the box, around its base.
  { layer: 'front', shape: 'puffy', x: 4,  y: 98,  size: 40 },
  { layer: 'front', shape: 'long',  x: 22, y: 102, size: 34, flip: true },
  { layer: 'front', shape: 'long',  x: 50, y: 112, size: 30 },
  { layer: 'front', shape: 'puffy', x: 80, y: 102, size: 36, flip: true },
  { layer: 'front', shape: 'long',  x: 98, y: 96,  size: 36 },
];
