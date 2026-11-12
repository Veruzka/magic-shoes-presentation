// The lab's sound library: one entry per sound. To add a sound, copy an entry and
// change it (see docs/lab-template.md, step 5).
//
// Fields (sound-designer reviews, 2026-11-12):
//   id, name, status  – status 'active' (playable) or 'soon' (greyed out)
//   source            – 'synth' = made in the browser with Tone.js from `recipe`
//                       'file'  = an id from sounds.json (never a file path; see docs/sound-library.md)
//   type              – 'hit' (one-off, for movements like stomp) or 'held' (swells while held, like tiptoe)
//   takes             – what it uses from the movement (movements.js `gives`)
//   preview           – the values the ▶ button plays it with
//   recipe            – for synth sounds: the instruments and how strength/sharpness shape them
// Matching check (type + takes against the movement): stored now, enforced in the test step (piece 6).
export const sounds = [
  {
    id: 'deep-boom',
    name: 'Deep boom',
    status: 'active',
    source: 'synth',
    type: 'hit',
    takes: ['strength', 'sharpness'],
    preview: { strength: 0.7, sharpness: 0.7 }, // 0.6 can sound timid on laptop speakers
    seconds: 1.5, // about how long it rings (for the ▶ button's playing state)
    recipe: {
      body: { note: 'G1', pitchDecay: 0.08, volume: -8 }, // MembraneSynth, ~49 Hz
      thud: { noise: 'brown', decay: 0.06, volume: -10 }, // short noise through a low-pass filter
      sub: { frequency: 35, decay: 1.2, volume: -12, from: 0.5 }, // joins in above strength 0.5, stays out of the reverb
      reverb: { decay: 2.5 },
      // How strength (0–1) shapes it:
      loudness: { quiet: -20, loud: -3, curve: 1.5 }, // dB; strength^1.5 keeps light taps soft
      octaves: { light: 2, hard: 5 }, // the pitch drop: harder = bigger "whump"
      length: { light: 0.5, hard: 1.5 }, // seconds
      wet: { light: 0.1, hard: 0.3 }, // reverb amount
      // How sharpness (0–1, how fast the stomp rose) shapes it:
      brightness: { dull: 500, bright: 3000 }, // the thud's filter, in Hz
    },
  },
  { id: 'ground-rumble', name: 'Ground rumble', status: 'soon', source: 'synth', type: 'hit', takes: ['strength'] }, // a layer under the boom
  { id: 'giant-hum', name: 'Giant hum', status: 'soon', source: 'synth', type: 'held', takes: ['strength', 'heldMs'] }, // a swell for tiptoe
];

export const soundById = (id) => sounds.find((sound) => sound.id === id);
