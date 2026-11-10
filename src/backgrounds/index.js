// All background options.
//
// To add a new background: create my-background.js (+ .css) in this folder
// following the same shape as flower-meadow.js, then add it to the list below.
import { flowerMeadow } from './flower-meadow.js';
import { cloudStudio } from './cloud-studio.js';

// The first one is the main look, used until you pick another with the switcher.
export const backgrounds = [cloudStudio, flowerMeadow];
