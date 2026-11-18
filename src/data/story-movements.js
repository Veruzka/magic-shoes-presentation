// The movement vocabulary shown in the concept section, one scene per movement.
// To add a movement: add an entry here. Nothing else needs to change.
//
// Each move is an improv prompt. The headline is the move; the line is a
// "Yes, and…" offer that sets a situation, and the sound is what makes that
// situation real (the goal of the embodied sound). A randomizer picks one offer
// per visit and rolls to it like a slot machine as the scene arrives.
//
//   group   basic | playful | whimsy (for us; not shown on the page)
//   name    the headline
//   offers  the "Yes, and…" offers: `offer` finishes the sentence, `sound` is
//           the sound that makes it real (shown as a small label)
//   motion  how the figure moves; one of the movements in src/components/sprite-rig.js
//           (step, run, spin, pose, kick, sky, heelclick)
export const movementGroups = {
  basic: 'Basic movement',
  playful: 'Playful',
  whimsy: 'Whimsy',
};

export const storyMovements = [
  {
    id: 'walk',
    group: 'basic',
    name: 'Walk',
    motion: 'step',
    offers: [
      { offer: "there's something behind you.", sound: 'your footsteps echo, one beat late' },
      { offer: 'the floor is thin ice.', sound: 'cracking under every step' },
      { offer: "you're sneaking past a sleeping giant.", sound: "snoring that stirs when you're loud" },
    ],
  },
  {
    id: 'run',
    group: 'basic',
    name: 'Run',
    motion: 'run',
    offers: [
      { offer: 'the ground is lava.', sound: 'a sizzle on every step' },
      { offer: "you're being chased.", sound: 'heavy footsteps, gaining' },
      { offer: 'the last train is leaving.', sound: 'a whistle, getting farther away' },
    ],
  },
  // TODO: more basic movements after the meeting with Kimney.
  {
    id: 'spin',
    group: 'playful',
    name: 'Spin',
    motion: 'spin',
    offers: [
      { offer: "you're the eye of a tornado.", sound: 'wind building around you' },
      { offer: "you're casting a spell.", sound: 'a rising shimmer' },
      { offer: "you're a music box, winding down.", sound: 'a melody slowing with you' },
    ],
  },
  {
    id: 'dancers-pose',
    group: 'whimsy',
    name: "Dancer's pose",
    motion: 'pose',
    offers: [
      { offer: 'the world holds its breath.', sound: 'everything goes silent' },
      { offer: "you're a statue in a museum after dark.", sound: "a guard's footsteps passing" },
      { offer: "you're on a rooftop ledge.", sound: 'wind, high up' },
    ],
  },
  {
    id: 'side-kick',
    group: 'whimsy',
    name: 'Side kick',
    motion: 'kick',
    offers: [
      { offer: 'a door needs kicking open.', sound: 'a crash, then echo' },
      { offer: 'your sound flies to your partner.', sound: 'a whoosh that lands on them' },
      { offer: 'thunder answers you.', sound: 'a crack, then rumble' },
    ],
  },
  {
    id: 'feet-to-sky',
    group: 'whimsy',
    name: 'Feet to the sky',
    motion: 'sky',
    offers: [
      { offer: "you're photographing the stars.", sound: 'a shutter, then a twinkle' },
      { offer: 'gravity just switched off.', sound: 'a floaty hum' },
      { offer: 'the sky is the floor now.', sound: 'footsteps from above' },
    ],
  },
  {
    id: 'heel-click',
    group: 'whimsy',
    name: 'Heel click',
    motion: 'heelclick',
    offers: [
      { offer: "it's time to go home.", sound: 'a whoosh and a chime' },
      { offer: 'you wake up from the dream.', sound: 'an alarm, fading out' },
      { offer: 'the curtain falls.', sound: 'applause' },
    ],
  },
];
