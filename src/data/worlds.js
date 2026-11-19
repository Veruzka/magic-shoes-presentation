// The worlds made of sound, in the order players move through them.
// A double stomp (both players within 0.25 s) moves everyone to the next one.
//
//   background  the page color while you're in this world
//   ink         text and sound-visual color that reads well on that background
//   shoeFilter  a CSS filter that tints the cream Sketch shoe to this world's color
//               (sepia + saturate turns it into one color; hue-rotate picks which)
//   sounds      what the same movements sound like here (shown as words for now)
// TODO: real sound files per world, from our own sound-effect library.
export const worlds = [
  {
    id: 'sky',
    name: 'Sky',
    background: '#dfe8f6',
    ink: '#24345c',
    shoeFilter: 'sepia(1) saturate(2.2) hue-rotate(185deg) brightness(1.05)',
    sounds: ['stars twinkle', 'wind', 'thunder kicks'],
  },
  {
    id: 'lava',
    name: 'Lava',
    background: '#f6dccd',
    ink: '#6b1f0e',
    shoeFilter: 'sepia(1) saturate(4) hue-rotate(-25deg) brightness(0.95)',
    sounds: ['sizzle', 'rumble', 'bubbling steps'],
  },
  {
    id: 'forest',
    name: 'Forest',
    background: '#dce8d2',
    ink: '#24401c',
    shoeFilter: 'sepia(1) saturate(2.4) hue-rotate(55deg) brightness(0.95)',
    sounds: ['rustling grass', 'snapping twigs', 'birds scattering'],
  },
  {
    id: 'water',
    name: 'Water',
    background: '#d4eceb',
    ink: '#11444a',
    shoeFilter: 'sepia(1) saturate(2.6) hue-rotate(130deg) brightness(0.98)',
    sounds: ['splashes', 'drips', 'waves on a stomp'],
  },
];
