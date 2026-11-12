// The lab's sound engine. Tone.js is loaded only when it's about to be needed
// (when the page is idle, or when the pointer reaches a ▶ button), so the page
// stays fast. Instruments are built once; play() then shapes each hit.
//
//   warmUp();                                   // start loading early (safe to call often)
//   play('deep-boom', { strength, sharpness }); // call inside a click
//
// Sound-designer notes: start audio inside the click (Safari blocks it after a
// delay), use an "interactive" context with a 10 ms look-ahead for a quick
// response, and wait for the reverb to be ready or the first boom plays dry.
import { soundById } from './data/sounds.js';

let tone = null; // the Tone.js module, once loaded
let loading = null;
const built = new Map(); // sound id → its instruments (a promise)

export function warmUp() {
  if (!loading) {
    loading = import('tone').then((module) => {
      tone = module;
      tone.setContext(new tone.Context({ latencyHint: 'interactive', lookAhead: 0.01 }));
      return tone;
    });
  }
  return loading;
}

const mix = (a, b, t) => a + (b - a) * t;
const clamp01 = (n) => Math.min(Math.max(n, 0), 1);

// The deep boom: body + thud through a reverb, sub straight to the end of the chain.
function buildBoom(T, recipe) {
  const limiter = new T.Limiter(-1).toDestination(); // nothing ever distorts
  const compressor = new T.Compressor(-18, 4).connect(limiter);
  const reverb = new T.Reverb({ decay: recipe.reverb.decay, wet: recipe.wet.light }).connect(compressor);
  const body = new T.MembraneSynth({
    pitchDecay: recipe.body.pitchDecay,
    octaves: 4,
    envelope: { attack: 0.001, decay: 1, sustain: 0, release: 0.3 },
    volume: recipe.body.volume,
  }).connect(reverb);
  const filter = new T.Filter(1500, 'lowpass').connect(reverb);
  const thud = new T.NoiseSynth({
    noise: { type: recipe.thud.noise },
    envelope: { attack: 0.001, decay: recipe.thud.decay, sustain: 0 },
    volume: recipe.thud.volume,
  }).connect(filter);
  const sub = new T.Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 0.005, decay: recipe.sub.decay, sustain: 0, release: 0.2 },
    volume: recipe.sub.volume,
  }).connect(compressor);

  function hit({ strength, sharpness }) {
    const s = clamp01(strength);
    const r = recipe;
    const loudDb = mix(r.loudness.quiet, r.loudness.loud, s ** r.loudness.curve);
    const velocity = Math.min(T.dbToGain(loudDb) / T.dbToGain(r.loudness.loud), 0.9);
    const length = mix(r.length.light, r.length.hard, s);
    body.octaves = mix(r.octaves.light, r.octaves.hard, s);
    body.envelope.decay = length;
    filter.frequency.value = mix(r.brightness.dull, r.brightness.bright, clamp01(sharpness));
    reverb.wet.value = mix(r.wet.light, r.wet.hard, s);
    const now = T.now();
    body.triggerAttackRelease(r.body.note, length, now, velocity);
    thud.triggerAttackRelease(r.thud.decay, now, velocity);
    if (s > r.sub.from) sub.triggerAttackRelease(r.sub.frequency, r.sub.decay, now, velocity * ((s - r.sub.from) / (1 - r.sub.from)));
  }

  return reverb.ready.then(() => hit);
}

// Which builder makes each synth sound. A new synth sound needs its own builder here.
const builders = { 'deep-boom': buildBoom };

function instrumentsFor(sound) {
  if (!built.has(sound.id)) {
    built.set(sound.id, warmUp().then((T) => builders[sound.id](T, sound.recipe)));
  }
  return built.get(sound.id);
}

export async function play(soundId, values) {
  const sound = soundById(soundId);
  if (!sound || sound.source !== 'synth' || !builders[sound.id]) return;
  // Start audio straight away while still inside the click, if Tone is already here.
  if (tone) tone.start();
  const T = await warmUp();
  await T.start();
  const hit = await instrumentsFor(sound);
  hit(values ?? sound.preview);
}
