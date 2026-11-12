// The spots on the shoe where sensors can go. One entry per zone.
//
// Sensors point to a zone by its id (never by x/y numbers), so a view can change
// without touching the sensors. Each zone has:
//   id, name   – named after the part of the shoe
//   fits       – which kinds of sensor can go here (see `kind` in sensors.js)
//   side       – which side of the shoe: 'outer', 'inner' or 'both'
//   layer      – which layer it sits in (outsole, midsole, insole, upper)
//   views      – where it is drawn, one entry per picture of the shoe:
//     sketch34 – the three-quarter Sketch (src/assets/shoe-sketch.png), in the
//                image's own pixels (1356 × 846), so markers stay put at any size:
//                anchor  = the one point the sensor marker sits on
//                outline = the zone's shape (an SVG path)
//                label   = where the leader line bends and ends, and the label text
//     (later: model3d – a 3D position + direction for the rotatable shoe)
export const zones = [
  {
    id: 'heel',
    name: 'Heel',
    fits: ['pressure'],
    side: 'both', // the FSR lies flat across the whole heel
    layer: 'insole', // on top of the midsole, under the insole
    views: {
      sketch34: {
        anchor: [1195, 505],
        outline:
          'M 1000 458 C 1080 425 1180 402 1338 396 C 1356 430 1352 480 1322 540 ' +
          'C 1290 600 1230 640 1130 682 C 1080 702 1040 716 1000 728 C 990 640 992 540 1000 458 Z',
        label: { bend: [1260, 600], end: [1400, 600], text: 'FSR · HEEL' },
      },
    },
  },
];

export const zoneById = (id) => zones.find((zone) => zone.id === id);
