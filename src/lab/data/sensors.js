// The sensor library: one entry per sensor. To add a sensor, copy an entry and
// change it. Only `status: 'active'` sensors can be picked; 'soon' ones show greyed out.
//
// Fields (from the hardware-engineer review, 2026-11-12):
//   id, name, kind      – kind = what it senses; it must match a zone's `fits`
//   status              – 'active' or 'soon'
//   zone                – the id of the zone it goes in (see zones.js)
//   signal              – 'analog', 'i2c' or 'digital'
//   boards              – per board: the pins it uses, the supply voltage, and the
//                         highest reading the board gives (adcMax)
//   currentMa           – how much power it draws, in milliamps
//   parts               – extra parts and how they're wired
//   resting             – the reading when nothing touches it (set after testing)
//   wokwi               – the simulation: which part stands in for it, the project link
//   realWiring, safety  – the note and checklist shown in the Wiring step (piece 5)
export const sensors = [
  {
    id: 'fsr',
    name: 'FSR',
    kind: 'pressure',
    status: 'active',
    zone: 'heel',
    model: 'FSR 402 (round, 13 mm)', // matches the picture; the square FSR 406 (38 mm) is more forgiving: later
    signal: 'analog',
    boards: {
      uno: { pins: { signal: 'A0' }, supply: '5V', adcMax: 1023 },
      nano: { pins: { signal: 'A0' }, supply: '5V', adcMax: 1023 },
      esp32: { pins: { signal: 'GPIO34' }, supply: '3.3V', adcMax: 4095 }, // never 5V on an ESP32
    },
    currentMa: 1, // under 1 mA
    parts: [
      { name: 'resistor', value: '10 kΩ', wiring: 'A0 → GND', note: 'Try 3.3 kΩ if hard stomps max out the reading.' },
    ],
    resting: null,
    wokwi: { standIn: 'slide potentiometer', link: null },
    realWiring: 'FSR leg 1 → 5V (3.3V on an ESP32), FSR leg 2 → A0 (GPIO34 on an ESP32), 10 kΩ resistor from that pin → GND.',
    insideNote: 'The FSR sits flat in a shallow pocket under the insole, sensing side up; its tail leaves at the back of the heel.',
    safety: [
      'Unplug USB before changing any wire.',
      'The resistor goes between A0 and GND. Never connect 5V straight to GND.',
      'Lay the FSR flat on the midsole, under the insole, sensing side up, with no folds.',
      "Don't bend the FSR's thin tail sharply or solder to it: use a clamp-on connector.",
      'Test seated, or tape the USB cable to your leg so it cannot trip or yank.',
    ],
  },
  { id: 'gyro', name: 'Gyro', kind: 'motion', status: 'soon', zone: 'upper-top' },
  { id: 'capacitive', name: 'Capacitive', kind: 'touch', status: 'soon', zone: 'outer-midsole' },
];

export const sensorById = (id) => sensors.find((sensor) => sensor.id === id);
