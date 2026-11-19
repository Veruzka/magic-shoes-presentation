// Gestures from the bodystorm (29 Oct 2026), placed on the 2x2 grid.
//   x  0 = expected → 1 = whimsy
//   y  0 = ambient  → 1 = active
// Positions are a provisional draft, like in the synthesis document.
export const quadrants = [
  { id: 'street', name: 'Street Percussion', x: 0, y: 1 }, // expected + active
  { id: 'play', name: 'Play', x: 1, y: 1 }, // whimsy + active
  { id: 'pause', name: 'Pause', x: 0, y: 0 }, // expected + ambient
  { id: 'reverie', name: 'Reverie', x: 1, y: 0 }, // whimsy + ambient
];

export const gestures = [
  { id: 'P-01', name: 'Stomp', x: 0.1, y: 0.92 },
  { id: 'P-05', name: 'Heel-toe swivel', x: 0.3, y: 0.7 },
  { id: 'P-06', name: 'Sideways slide', x: 0.2, y: 0.78 },
  { id: 'P-07', name: 'Lunge', x: 0.15, y: 0.62 },
  { id: 'P-17', name: 'Tag', x: 0.38, y: 0.88 },
  { id: 'P-18', name: 'Red light, green light', x: 0.42, y: 0.66 },
  { id: 'P-19', name: 'Skip', x: 0.26, y: 0.9 },
  { id: 'P-02', name: 'Foot handshake', x: 0.55, y: 0.6 },
  { id: 'P-09', name: 'Leg shoot', x: 0.88, y: 0.95 },
  { id: 'P-20', name: 'Heel click', x: 0.75, y: 0.82 },
  { id: 'P-21a', name: 'Foot as pointer', x: 0.68, y: 0.62 },
  { id: 'P-22', name: 'Lava tap', x: 0.82, y: 0.7 },
  { id: 'P-08', name: "Dancer's pose", x: 0.3, y: 0.35 },
  { id: 'P-04', name: 'Spell ABCs', x: 0.45, y: 0.3 },
  { id: 'P-12', name: 'Sit on feet', x: 0.12, y: 0.15 },
  { id: 'P-14', name: 'Seated fidget', x: 0.05, y: 0.25 },
  { id: 'P-11', name: 'Tippy-toe together', x: 0.4, y: 0.42 },
  { id: 'P-03', name: 'Feet to the sky', x: 0.7, y: 0.3 },
  { id: 'P-10', name: 'Tightrope', x: 0.62, y: 0.4 },
  { id: 'P-13b', name: 'Sole to sole', x: 0.78, y: 0.18 },
  { id: 'P-21b', name: 'Toe point', x: 0.66, y: 0.12 },
];
