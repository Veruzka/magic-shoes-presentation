// The paper-cut people for the players' scene: a guy in a beanie and a woman
// with long dark hair, in the paper forest's colours, like small cut-paper
// figures. Built in Figma (file "Magic Shoes – assets", page "Paper people"),
// one component per body part, and exported as SVG to src/assets/paper-people/.
//
// Each part is drawn hanging straight down from its joint (the shoulder for an
// upper arm, the knee for a shin, the neck for the torso), so it can follow the
// same skeleton as the old stick figures (joints() in sprite-rig.js): every
// frame, each part is moved to its joint and turned along its bone.
//
//   const person = paperPerson(group, 'guy');   // or 'woman'
//   person.update(pose);                         // each frame
//
// To change a part: edit it in Figma, export it as SVG over the file in
// src/assets/paper-people/, and keep its joint where JOINTS says (in Figma
// pixels from the part's top-left; parts are drawn 4 px per skeleton unit).
import { joints } from './sprite-rig.js';
import guyTorso from '../assets/paper-people/guy-torso.svg?raw';
import guyUpperArm from '../assets/paper-people/guy-upperArm.svg?raw';
import guyForearm from '../assets/paper-people/guy-forearm.svg?raw';
import guyThigh from '../assets/paper-people/guy-thigh.svg?raw';
import guyShin from '../assets/paper-people/guy-shin.svg?raw';
import guyHead from '../assets/paper-people/guy-head.svg?raw';
import womanHairBack from '../assets/paper-people/woman-hairBack.svg?raw';
import womanTorso from '../assets/paper-people/woman-torso.svg?raw';
import womanUpperArm from '../assets/paper-people/woman-upperArm.svg?raw';
import womanForearm from '../assets/paper-people/woman-forearm.svg?raw';
import womanThigh from '../assets/paper-people/woman-thigh.svg?raw';
import womanShin from '../assets/paper-people/woman-shin.svg?raw';
import womanHead from '../assets/paper-people/woman-head.svg?raw';

const SVGNS = 'http://www.w3.org/2000/svg';
const PX = 4; // Figma pixels per skeleton unit

// Where each part's joint is, in Figma pixels from its top-left corner.
const JOINTS = {
  hairBack: [80, 64], // the head's centre
  torso: [56, 48], // the neck
  upperArm: [28, 16], // the shoulder
  forearm: [28, 12], // the elbow
  thigh: [36, 20], // the hip
  shin: [32, 12], // the knee
  head: [72, 96], // the head's centre
};

const ART = {
  guy: { torso: guyTorso, upperArm: guyUpperArm, forearm: guyForearm, thigh: guyThigh, shin: guyShin, head: guyHead },
  woman: { hairBack: womanHairBack, torso: womanTorso, upperArm: womanUpperArm, forearm: womanForearm, thigh: womanThigh, shin: womanShin, head: womanHead },
};

// The SVG file's shapes, without its outer <svg> tag.
const inner = (svg) => svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

// Back to front. "far" = the arm and leg on the far side (drawn first, a touch darker).
const LAYERS = [
  ['hairBack', 'head'],
  ['upperArm', 'armA'],
  ['forearm', 'armA'],
  ['thigh', 'legA'],
  ['shin', 'legA'],
  ['torso', 'torso'],
  ['thigh', 'legB'],
  ['shin', 'legB'],
  ['head', 'head'],
  ['upperArm', 'armB'],
  ['forearm', 'armB'],
];

// The angle of the bone from a to b, measured from straight down (degrees, + toward +x).
const boneAngle = (a, b) => (Math.atan2(b.x - a.x, b.y - a.y) * 180) / Math.PI;

export function paperPerson(parent, who) {
  const art = ART[who];
  const root = document.createElementNS(SVGNS, 'g');
  root.setAttribute('class', `paper-person paper-person--${who}`);
  parent.append(root);
  const parts = LAYERS.filter(([part]) => art[part]).map(([part, bone]) => {
    const g = document.createElementNS(SVGNS, 'g');
    if (bone.endsWith('A')) g.setAttribute('class', 'paper-person__far');
    g.innerHTML = inner(art[part]);
    root.append(g);
    return { g, part, bone };
  });

  return {
    update(pose) {
      const j = joints(pose);
      const torsoAngle = boneAngle(j.neck, j.hip);
      for (const { g, part, bone } of parts) {
        let at;
        let angle;
        if (part === 'torso') {
          at = j.neck;
          angle = torsoAngle;
        } else if (part === 'head' || part === 'hairBack') {
          at = j.head;
          angle = torsoAngle;
        } else {
          const limb = j[bone];
          const from = part === 'upperArm' ? j.neck : part === 'forearm' ? limb.elbow : part === 'thigh' ? j.hip : limb.knee;
          const to = part === 'upperArm' ? limb.elbow : part === 'forearm' ? limb.hand : part === 'thigh' ? limb.knee : limb.ankle;
          at = from;
          angle = boneAngle(from, to);
        }
        const [px, py] = JOINTS[part];
        g.setAttribute('transform', `translate(${at.x.toFixed(2)},${at.y.toFixed(2)}) rotate(${(-angle).toFixed(2)}) scale(${1 / PX}) translate(${-px},${-py})`);
      }
    },
  };
}
