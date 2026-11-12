// The movement library: one entry per thing the wearer can do. To add a movement,
// copy an entry and change it (see docs/lab-template.md, step 4).
//
// Fields (reviews 2026-11-12: hardware-engineer, sound-designer, 3d-artist):
//   id, name, status   – status 'active' (pickable) or 'soon' (greyed out)
//   description        – one plain sentence for the spec card
//   kinds              – which sensor kinds can detect it (sensors.js `kind`)
//   zones              – where on the shoe it happens (zones.js ids). A movement can
//                        be picked only when a placed sensor matches a kind AND a zone.
//   rule               – how to recognise it in the strength readings (0–1). Starting
//                        values; tune them for each wearer on the real shoe.
//   gives              – what it hands the sound each time it happens
//   realShoe           – reading settings for the real shoe (piece "real shoe", later)
//   chart              – the illustrative curve drawn on the spec card (not real data)
export const movements = [
  {
    id: 'stomp',
    name: 'Stomp',
    status: 'active',
    description: 'Bring your heel down fast and hard.',
    kinds: ['pressure'],
    zones: ['heel'],
    rule: {
      start: 0.15, // it starts when strength rises above this…
      rearm: 0.08, // …and can't start again until it drops below this
      peakMs: 30, // strength = the highest reading in the first 30 ms
      maxRiseMs: 60, // it must climb from `start` to its peak this fast; slower = a press, not a stomp
      cooldownMs: 200, // ignore new stomps this long after one (stops heel bounce double-firing)
    },
    gives: ['strength', 'sharpness'], // sharpness 0–1 = how fast it rose (brighter thud)
    realShoe: { sampleRateHz: 200, smoothing: 'none or light' }, // heavy smoothing hides the peak
    // The illustrative stomp: near 0, a 10 ms jump that flattens near 0.9 (the FSR
    // saturates), settling to a "standing" level while the foot stays planted, then
    // back to 0 when the foot lifts. Times in seconds.
    chart: { contact: 0.15, riseMs: 10, top: 0.9, standing: 0.5, lift: 0.72 },
  },
  {
    id: 'tiptoe',
    name: 'Tiptoe',
    status: 'soon',
    description: 'Rise onto the ball of your foot and hold it.',
    kinds: ['pressure'],
    zones: ['forefoot'],
    // Sound-designer notes for later: a held press, not a hit. Starts when strength
    // stays between 0.15 and ~0.6 for over 250 ms with a slow rise; sends strength
    // continuously while held (plus heldMs); ends below 0.08 with a ~300 ms fade.
  },
  {
    id: 'twist',
    name: 'Twist',
    status: 'soon',
    description: 'Turn your foot left and right.',
    kinds: ['motion'],
    zones: ['upper-top'],
  },
];

// How to name a sensor kind in "needs …" messages.
export const kindNeeds = { pressure: 'a pressure sensor', motion: 'a gyro', touch: 'a touch sensor' };

export const movementById = (id) => movements.find((movement) => movement.id === id);
