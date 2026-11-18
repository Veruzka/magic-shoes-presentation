// The movement vocabulary shown in the concept section, one scene per movement.
// To add a movement: add an entry here. Nothing else needs to change.
//
//   group   basic | playful | whimsy (shown as the small label above the name)
//   name    the headline
//   line    one short sentence
//   sound   what it "makes" (shown under the ripples)
//   motion  how the shoe moves; one of the motions in src/components/movement-scene.js
//           (step, run, spin, pose, kick, sky)
export const movementGroups = {
  basic: 'Basic movement',
  playful: 'Playful',
  whimsy: 'Whimsy',
};

export const storyMovements = [
  { id: 'walk', group: 'basic', name: 'Walk', line: 'Every step makes a sound.', sound: 'soft footsteps', motion: 'step' },
  { id: 'run', group: 'basic', name: 'Run', line: 'Go faster and the sound speeds up with you.', sound: 'a quick drum roll', motion: 'run' },
  // TODO: more basic movements after the meeting with Kimney.
  { id: 'spin', group: 'playful', name: 'Spin', line: 'Turn on the spot and the sound swirls around you.', sound: 'a rising whoosh', motion: 'spin' },
  { id: 'dancers-pose', group: 'whimsy', name: "Dancer's pose", line: 'Hold still on one foot and the world holds its breath.', sound: 'a shimmer, then silence', motion: 'pose' },
  { id: 'side-kick', group: 'whimsy', name: 'Side kick', line: 'Kick out and something erupts.', sound: 'a thunder crack', motion: 'kick' },
  { id: 'feet-to-sky', group: 'whimsy', name: 'Feet to the sky', line: 'Point your feet up and take a picture of the sky.', sound: 'a shutter and a twinkle', motion: 'sky' },
];
