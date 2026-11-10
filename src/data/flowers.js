// Every flower in the background, one per line.
//
//   layer  which depth it lives on:
//            'far'  = small, slightly blurry, moves slowly
//            'mid'  = medium blur, medium speed
//            'near' = big, very blurry, moves fastest (feels closest to you)
//   kind   'bloom' = round flower with petals, in one color
//          'daisy' = white petals with a yellow middle
//          'leaf'  = a long green leaf or stem
//          'glow'  = a big soft patch of color (sunlight, out-of-focus flowers)
//   color  'pink' | 'coral' | 'red' | 'yellow' | 'white' | 'green' | 'sky'
//          (the actual color values live in src/styles/base.css)
//   x, y   where its centre sits, in % of the screen (0,0 = top left)
//   size   how big it is, in % of the screen's shorter side
//   turn   optional rotation in degrees (useful for leaves)
//
// The middle of the screen is kept clear for the shoe automatically,
// so a flower placed too close to the centre simply fades out there.

export const flowers = [
  // Soft color patches that set the mood behind everything.
  { layer: 'far',  kind: 'glow',  color: 'sky',    x: 30, y: 10, size: 60 },
  { layer: 'far',  kind: 'glow',  color: 'sky',    x: 85, y: 15, size: 50 },
  { layer: 'far',  kind: 'glow',  color: 'yellow', x: 92, y: 70, size: 55 },
  { layer: 'far',  kind: 'glow',  color: 'coral',  x: 78, y: 40, size: 40 },
  { layer: 'far',  kind: 'glow',  color: 'pink',   x: 10, y: 85, size: 55 },

  // Far: small, fairly sharp flowers and stems.
  { layer: 'far',  kind: 'leaf',  color: 'green',  x: 20, y: 30, size: 30, turn: 20 },
  { layer: 'far',  kind: 'leaf',  color: 'green',  x: 80, y: 70, size: 32, turn: -15 },
  { layer: 'far',  kind: 'leaf',  color: 'green',  x: 88, y: 20, size: 26, turn: 35 },
  { layer: 'far',  kind: 'bloom', color: 'red',    x: 74, y: 33, size: 16 },
  { layer: 'far',  kind: 'bloom', color: 'coral',  x: 82, y: 48, size: 12 },
  { layer: 'far',  kind: 'daisy', color: 'white',  x: 40, y: 12, size: 10 },
  { layer: 'far',  kind: 'daisy', color: 'white',  x: 24, y: 62, size: 9 },
  { layer: 'far',  kind: 'bloom', color: 'pink',   x: 30, y: 88, size: 11 },
  { layer: 'far',  kind: 'daisy', color: 'white',  x: 62, y: 92, size: 9 },

  // Mid: medium flowers around the edges.
  { layer: 'mid',  kind: 'bloom', color: 'pink',   x: 30, y: 4,  size: 28 },
  { layer: 'mid',  kind: 'bloom', color: 'yellow', x: 12, y: 20, size: 30 },
  { layer: 'mid',  kind: 'bloom', color: 'red',    x: 64, y: 2,  size: 24 },
  { layer: 'mid',  kind: 'bloom', color: 'coral',  x: 88, y: 36, size: 30 },
  { layer: 'mid',  kind: 'bloom', color: 'pink',   x: 98, y: 60, size: 28 },
  { layer: 'mid',  kind: 'daisy', color: 'white',  x: 20, y: 74, size: 22 },
  { layer: 'mid',  kind: 'bloom', color: 'pink',   x: 40, y: 98, size: 26 },
  { layer: 'mid',  kind: 'bloom', color: 'yellow', x: 76, y: 96, size: 24 },
  { layer: 'mid',  kind: 'leaf',  color: 'green',  x: 6,  y: 60, size: 34, turn: -25 },

  // Near: big, very blurry flowers at the corners, like the reference.
  { layer: 'near', kind: 'daisy', color: 'white',  x: 4,  y: 44, size: 56 },
  { layer: 'near', kind: 'bloom', color: 'pink',   x: 12, y: 96, size: 58 },
  { layer: 'near', kind: 'bloom', color: 'yellow', x: 92, y: 86, size: 60 },
  { layer: 'near', kind: 'bloom', color: 'coral',  x: 100, y: 10, size: 46 },
  { layer: 'near', kind: 'bloom', color: 'red',    x: 100, y: 46, size: 40 },
  { layer: 'near', kind: 'bloom', color: 'pink',   x: 0,  y: 2,  size: 40 },
  { layer: 'near', kind: 'daisy', color: 'white',  x: 60, y: 106, size: 36 },
];
