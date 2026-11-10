// Chapter 2 of the hero: the FSR lifts out of the white midsole, turns upright
// to face you, and grows to the centre of the screen while the shoe scene
// scrolls away. (Drawn by src/components/fsr-transition.js.)
//
import { fsrReveal } from './fsr-reveal.js';

// Every stage is a stretch of chapter 2's scroll, from 0 (start) to 1 (end).
// Stages overlap a little so it all flows as one movement.

export const fsrTransition = {
  labelsOut: { start: 0, end: 0.06 }, // the part labels fade away first

  // Lifts out of its pocket: rises a little and grows slightly, still lying at the shoe's angle.
  lift: { start: 0, end: 0.25, rise: 60, grow: 1.2 }, // rise: pixels up; grow: ×size

  // Turns upright to face you: pad on top, tail down, flat face toward the screen,
  // and glides to the centre.
  turn: { start: 0.2, end: 0.6 },

  // Near the end of the turn, the angled render cross-fades into the sharp
  // straight-on render (sketch-sensor.js → front), which then does the growing.
  swap: { start: 0.42, end: 0.56 },

  // Grows until it's this share of the screen's height, centred.
  grow: { start: 0.5, end: 1, finalHeight: 0.75 },

  // The shoe scene (shoe, title, clouds, box) scrolls up and away; the next
  // section's background rises in behind it.
  sceneAway: { start: 0.15, end: 0.8 },
  nextBackground: 'var(--color-bg)', // the next section's colour (we'll style it next)

  // Chapter 3: the door turn and the half-sketch (src/shoes/fsr-reveal.js).
  reveal: fsrReveal,
};
