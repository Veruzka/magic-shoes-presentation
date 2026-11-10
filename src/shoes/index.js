// All shoe styles that can float in the middle of the hero.
//
// To add a new style: put a cut-out image (transparent background) in
// src/assets/, import it below, and add one entry to the list.
// A style with `sole` has its gray bottom sole detach as you scroll
// (see src/components/separating-shoe.js); one without just floats.
//
// Set aside for now: the earlier 5-part exploded view (sketch-parts.js and
// src/assets/sketch-parts/). We're rebuilding the fan one part at a time from
// the whole drawing instead, starting with the sole.
import shoePhoto from '../assets/shoe-photo.png';
import shoeSketch from '../assets/shoe-sketch.png';
import { sketchSole } from './sketch-sole.js';

// The first one is shown until you pick another with the switcher.
export const shoes = [
  {
    id: 'photo',
    label: 'Photo',
    image: shoePhoto,
    alt: 'Beige suede low-top sneaker',
  },
  {
    id: 'sketch',
    label: 'Sketch',
    image: shoeSketch,
    alt: 'Marker sketch of a chunky running sneaker with a see-through upper and foam sole',
    sole: sketchSole,
  },
];
