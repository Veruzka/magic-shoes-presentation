// The pictogram figure ("sprite") for the concept section: one flat figure,
// rounded strokes, no face, drawn from joint angles so every movement shares
// one rig and blends smoothly into the next. Its poses are based on our
// bodystorm pictograms (P-03 feet to the sky, P-08a dancer's pose, P-09c side
// kick, P-20 heel-click jump).
//
//   const pose = movementPose('walk', phase);  // phase 0 → 1 loops the movement
//   drawFigure(svgGroup, pose);                // updates the figure
//   const feet = feetOf(pose);                 // where each foot is (for the shoes)
//
// Three whimsy moves use our real bodystorm motion (src/data/bodystorm-motion.json):
// the heel click is the tracked video loop; the side kick and dancer's pose use
// the tracked peak pose from the high-resolution still, timed by hand around it.
// Walk, run, spin and feet to the sky are hand-animated.
//
// Each movement also has `seconds` (how long one loop takes in real time) and
// `view` ('side' or 'front': which way the camera sees the feet, for the 3D shoes).
//
// The figure faces right. Angles are in degrees:
//   lean      torso lean (+ forward, -90 = lying on its back)
//   sA, sB    shoulders, relative to the torso (0 = arm hangs down, + forward)
//   eA, eB    elbows (+ bends the forearm forward and up, like a real elbow; - would bend it backwards)
//   hA, hB    hips, measured from straight down (+ = leg swings forward)
//   kA, kB    knees (- bends the shin back)
//   aA, aB    ankles (+ toe up)
//   x, y      where the hips are, in figure units (+y = down)
//   spin      turns around the vertical axis (1 = one full turn)
// A = the far side (drawn first), B = the near side.
import { lerp, ease, slice } from '../core/scene.js';
import motion from '../data/bodystorm-motion.json';

const LEN = { torso: 58, neck: 9, head: 14, upper: 31, fore: 29, thigh: 44, shin: 42, foot: 17 };
export const GROUND = LEN.thigh + LEN.shin; // where the soles are when standing

export const STAND = { x: 0, y: 0, lean: 0, sA: -8, eA: 12, sB: 8, eB: 12, hA: 0, kA: 0, aA: 0, hB: 0, kB: 0, aB: 0, spin: 0 };
const KEYS = Object.keys(STAND);

const rad = (d) => (d * Math.PI) / 180;
const down = (deg, len) => ({ x: Math.sin(rad(deg)) * len, y: Math.cos(rad(deg)) * len });
const add = (p, v) => ({ x: p.x + v.x, y: p.y + v.y });
const clamp01 = (n) => Math.min(Math.max(n, 0), 1);
const TAU = Math.PI * 2;

// Plays a recorded loop: a smooth curve through the frames around this point of
// the loop (Catmull-Rom), so the motion has no corners between video frames.
// If the clip's last frame repeats its first (a closed loop), it's played once,
// so the figure doesn't freeze for a frame every time the loop comes round.
// Ankles and elbows are kept in a natural range (the tracker can wobble there).
const limit = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
// Feet on the ground: the tracked hip height doesn't match the rig's legs (the
// video was filmed from the front), so standing frames floated about 25 units
// up and the crouch sank below the ground. Each frame is moved so its lowest
// foot touches the ground, except for any height above `float`, which is the
// real jump and is kept.
const loopFrames = new WeakMap();
function lowestFoot(pose) {
  const j = joints(pose);
  return Math.max(j.legA.ankle.y, j.legA.toe.y, j.legB.ankle.y, j.legB.toe.y);
}
function framesOf(clip) {
  if (!loopFrames.has(clip)) {
    let all = clip.frames.map((frame) => ({ ...STAND, ...frame }));
    const first = all[0];
    const last = all[all.length - 1];
    const closed = all.length > 2 && KEYS.every((key) => first[key] === last[key]);
    if (closed) all = all.slice(0, -1);
    all.forEach((pose) => {
      pose.aA = limit(pose.aA, -35, 35);
      pose.aB = limit(pose.aB, -35, 35);
    });
    if (clip.float !== undefined) {
      const float = clip.float;
      all.forEach((pose) => {
        const gap = GROUND - lowestFoot(pose); // + = feet above the ground
        const jump = Math.max(gap - float, 0);
        pose.y += gap - jump;
      });
    }
    loopFrames.set(clip, all);
  }
  return loopFrames.get(clip);
}
const catmull = (p0, p1, p2, p3, t) =>
  0.5 * (2 * p1 + (p2 - p0) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (3 * p1 - p0 - 3 * p2 + p3) * t * t * t);
function recorded(clip, f) {
  const frames = framesOf(clip);
  const n = frames.length;
  const x = f * n;
  const i = Math.floor(x) % n;
  const t = x - Math.floor(x);
  const [p0, p1, p2, p3] = [-1, 0, 1, 2].map((d) => frames[(i + d + n) % n]);
  const pose = {};
  KEYS.forEach((key) => (pose[key] = catmull(p0[key], p1[key], p2[key], p3[key], t)));
  pose.aA = limit(pose.aA, -35, 35);
  pose.aB = limit(pose.aB, -35, 35);
  pose.eA = limit(pose.eA, -140, 140);
  pose.eB = limit(pose.eB, -140, 140);
  return pose;
}

// The heel click, hand-animated from a side view (the tracked video was filmed
// from the front, so its knees bent backwards in this side-on figure).
// Keyframes through one loop: stand, crouch with the arms back, push off with
// the arms sweeping up, click the heels high in the air with the arms spread
// up and out, land soft, stand. Per key:
//   h/k   hips and knees (A far, B near)    lean  torso    s/e  shoulders, elbows
//   rise  how far the hips are above standing, in the air
//   air   0 on the ground (feet kept flat on the floor) → 1 in the air (toes pointed)
const STAND_KEY = { hA: 0, kA: -4, hB: 0, kB: -4, lean: 2, sA: -8, eA: 14, sB: 6, eB: 16, rise: 0, air: 0 };
const HEEL_CLICK_KEYS = [
  [0, STAND_KEY],
  [0.14, STAND_KEY],
  [0.32, { hA: 55, kA: -100, hB: 50, kB: -95, lean: 28, sA: -50, eA: 25, sB: -45, eB: 25, rise: 0, air: 0 }], // crouch, arms back
  [0.42, { hA: 10, kA: -10, hB: 5, kB: -8, lean: 8, sA: 120, eA: 20, sB: 105, eB: 20, rise: 12, air: 0.7 }], // push off, arms up
  [0.52, { hA: 18, kA: -100, hB: 24, kB: -102, lean: 4, sA: 150, eA: 10, sB: 125, eB: 12, rise: 28, air: 1 }], // heels click
  [0.6, { hA: 20, kA: -96, hB: 26, kB: -98, lean: 4, sA: 155, eA: 8, sB: 130, eB: 10, rise: 26, air: 1 }], // still up
  [0.7, { hA: 12, kA: -15, hB: 8, kB: -12, lean: 6, sA: 55, eA: 25, sB: 45, eB: 25, rise: 6, air: 0.4 }], // legs reach for the floor
  [0.78, { hA: 35, kA: -60, hB: 32, kB: -58, lean: 16, sA: 25, eA: 30, sB: 15, eB: 30, rise: 0, air: 0 }], // land soft
  [0.92, STAND_KEY],
];
const HEEL_KEYS = Object.keys(STAND_KEY);
function heelClick(f) {
  const keys = HEEL_CLICK_KEYS;
  const n = keys.length;
  let i = n - 1;
  while (keys[i][0] > f) i -= 1;
  const t0 = keys[i][0];
  const t1 = i + 1 < n ? keys[i + 1][0] : 1;
  const u = (f - t0) / (t1 - t0);
  const at = (j) => keys[(j + n) % n][1];
  const v = {};
  HEEL_KEYS.forEach((key) => (v[key] = catmull(at(i - 1)[key], at(i)[key], at(i + 1)[key], at(i + 2)[key], u)));
  const air = clamp01(v.air);
  // Feet: flat on the floor on the ground, toes pointed in the air.
  // Knees never bend backwards (the smooth curve can overshoot straight a little).
  const pose = { ...STAND, lean: v.lean, hA: v.hA, kA: Math.min(v.kA, 0), hB: v.hB, kB: Math.min(v.kB, 0), sA: v.sA, eA: v.eA, sB: v.sB, eB: v.eB };
  pose.aA = lerp(-(v.hA + v.kA), -25, air);
  pose.aB = lerp(-(v.hB + v.kB), -25, air);
  // Height: on the ground, the lowest foot touches the floor; in the air, the hips rise.
  const onFloor = GROUND - lowestFoot({ ...pose, y: 0 });
  pose.y = lerp(onFloor, -v.rise, air);
  return pose;
}

// Each movement: pose(phase) for one loop, plus `strikes`: the moments in the
// loop (0 → 1) when a foot makes its sound ('A', 'B' or 'both'), for the rings.
export const MOVES = {
  walk: {
    pose: (f) => {
      const w = f * TAU;
      return {
        ...STAND,
        lean: 4,
        y: 2 * Math.abs(Math.sin(w)),
        hA: 22 * Math.sin(w),
        hB: -22 * Math.sin(w),
        kA: -6 - 30 * Math.max(0, Math.cos(w)),
        kB: -6 - 30 * Math.max(0, -Math.cos(w)),
        // Each arm swings opposite its leg, a little more forward than back, and
        // the elbow bends a little more as the arm comes forward.
        sA: 4 - 22 * Math.sin(w),
        sB: 4 + 22 * Math.sin(w),
        eA: 16 + 14 * Math.max(0, -Math.sin(w)),
        eB: 16 + 14 * Math.max(0, Math.sin(w)),
      };
    },
    strikes: [[0.25, 'A'], [0.75, 'B']],
    seconds: 1.15,
  },
  run: {
    pose: (f) => {
      const w = f * TAU;
      return {
        ...STAND,
        lean: 14,
        y: 6 - 9 * Math.abs(Math.cos(w)),
        hA: 44 * Math.sin(w),
        hB: -44 * Math.sin(w),
        kA: -20 - 75 * Math.max(0, Math.cos(w)),
        kB: -20 - 75 * Math.max(0, -Math.cos(w)),
        // Elbows bent about 90°, forearms forward; each arm drives opposite its
        // leg, the hand coming up to about chin height in front.
        sA: 2 - 45 * Math.sin(w),
        sB: 2 + 45 * Math.sin(w),
        eA: 80 + 8 * Math.max(0, -Math.sin(w)),
        eB: 80 + 8 * Math.max(0, Math.sin(w)),
      };
    },
    strikes: [[0.25, 'A'], [0.75, 'B']],
    seconds: 0.7,
  },
  spin: {
    pose: (f) => ({
      ...STAND,
      y: -4 * Math.sin(f * Math.PI),
      hB: 28,
      kB: -75,
      // Arms pulled in, hands at the chest, like a skater's spin.
      sA: 35,
      eA: 100,
      sB: 35,
      eB: 100,
      spin: f,
    }),
    strikes: [[0.5, 'both']],
    seconds: 1.6,
  },
  pose: {
    // Dancer's pose (P-08a): rise into the real peak pose, hold it, sway a little, come down.
    pose: (f) => {
      const peak = { ...STAND, ...motion.peaks.pose.pose };
      const up = ease(slice(f, 0, 0.22)) * (1 - ease(slice(f, 0.82, 1)));
      const held = blendPose(STAND, peak, up);
      held.lean += 2 * Math.sin(f * TAU * 2) * up; // a balancing sway
      held.sB += 4 * Math.sin(f * TAU * 2 + 1) * up;
      return held;
    },
    strikes: [[0.22, 'A']],
    seconds: 3.4,
    loops: 1,
  },
  kick: {
    // Side kick, sole out (P-09c): chamber the knee, snap out to the real peak pose, hold, return.
    pose: (f) => {
      const peak = { ...STAND, ...motion.peaks.kick.pose };
      const chamber = { ...STAND, lean: -4, hB: 55, kB: -110, sA: -20, sB: -10 };
      if (f < 0.3) return blendPose(STAND, chamber, ease(f / 0.3));
      if (f < 0.42) return blendPose(chamber, peak, ease(slice(f, 0.3, 0.42)));
      if (f < 0.62) return peak;
      return blendPose(peak, STAND, ease(slice(f, 0.62, 1)));
    },
    strikes: [[0.42, 'B']],
    seconds: 2.2,
  },
  sky: {
    // Feet to the sky (P-03): lying on its back, soles up, held like a lens.
    pose: (f) => ({
      ...STAND,
      x: 34,
      y: GROUND - 12,
      lean: -90,
      hA: 176 + 3 * Math.sin(f * TAU),
      hB: 184 - 3 * Math.sin(f * TAU),
      kA: 0,
      kB: 0,
      aA: 0,
      aB: 0,
      sA: 160,
      eA: 0,
      sB: 140,
      eB: 0,
    }),
    strikes: [[0.5, 'both']],
    seconds: 3.2,
    loops: 1,
  },
  heelclick: {
    // Heel-click jump (P-20), hand-animated side-on (see heelClick above). The
    // tracked loop from our front-on video is still in bodystorm-motion.json
    // and can be played with recorded(motion.heelclick, f).
    pose: heelClick,
    strikes: [[0.53, 'both']], // the click
    seconds: 2.2,
    view: 'side',
  },
};

export function movementPose(motion, phase) {
  const move = MOVES[motion] ?? MOVES.walk;
  return move.pose(((phase % 1) + 1) % 1);
}

export function blendPose(a, b, t) {
  const out = {};
  KEYS.forEach((key) => (out[key] = lerp(a[key], b[key], t)));
  return out;
}

// Changing from one movement to another (t: 0 → 1). Getting up from lying on
// the floor (feet to the sky), or lying down, goes through a tucked sit: a
// straight blend swings the legs up through the middle of the scene.
const TUCK = { ...STAND, y: GROUND - 30, lean: 8, hA: 100, kA: -140, aA: 0, hB: 96, kB: -140, aB: 0, sA: 35, eA: 70, sB: 45, eB: 70 };
export const lying = (pose) => pose.lean < -45;
export function switchPose(from, to, t) {
  if (!lying(from) && !lying(to)) return blendPose(from, to, ease(t));
  return t < 0.5 ? blendPose(from, TUCK, ease(t * 2)) : blendPose(TUCK, to, ease(t * 2 - 1));
}

// Works out every joint's position from the angles (forward kinematics).
export function joints(pose) {
  const hip = { x: pose.x, y: pose.y };
  const up = { x: Math.sin(rad(pose.lean)), y: -Math.cos(rad(pose.lean)) };
  const neck = add(hip, { x: up.x * LEN.torso, y: up.y * LEN.torso });
  const head = add(neck, { x: up.x * (LEN.neck + LEN.head), y: up.y * (LEN.neck + LEN.head) });
  const arm = (s, e) => {
    const elbow = add(neck, down(pose.lean + s, LEN.upper));
    return { elbow, hand: add(elbow, down(pose.lean + s + e, LEN.fore)) };
  };
  const leg = (h, k, a) => {
    const knee = add(hip, down(h, LEN.thigh));
    const ankle = add(knee, down(h + k, LEN.shin));
    const footAngle = h + k + 90 + a; // 90 = pointing forward when the shin is upright
    return { knee, ankle, toe: add(ankle, down(footAngle, LEN.foot)) };
  };
  return {
    hip,
    neck,
    head,
    armA: arm(pose.sA, pose.eA),
    armB: arm(pose.sB, pose.eB),
    legA: leg(pose.hA, pose.kA, pose.aA),
    legB: leg(pose.hB, pose.kB, pose.aB),
  };
}

// How wide the figure looks while spinning (1 = side view, 0 = edge on).
export function spinScale(pose) {
  const c = Math.cos(pose.spin * TAU);
  return Math.sign(c || 1) * Math.max(Math.abs(c), 0.15);
}

const seg = (a, b) => `M${a.x.toFixed(1)},${a.y.toFixed(1)}L${b.x.toFixed(1)},${b.y.toFixed(1)}`;

// The figure as SVG path data, far side first. Used for the big sprite and the
// small badges in the wall.
export function figurePaths(pose) {
  const j = joints(pose);
  const limb = (from, part) => seg(from, part.elbow ?? part.knee) + seg(part.elbow ?? part.knee, part.hand ?? part.ankle);
  return {
    far: limb(j.neck, j.armA) + limb(j.hip, j.legA) + seg(j.legA.ankle, j.legA.toe),
    torso: seg(j.hip, j.neck),
    near: limb(j.hip, j.legB) + seg(j.legB.ankle, j.legB.toe) + limb(j.neck, j.armB),
    head: j.head,
  };
}

// A small static SVG of a pose (for the wall's badges).
export function figureSVG(pose, { stroke = 'currentColor' } = {}) {
  const p = figurePaths(pose);
  return `<svg viewBox="-80 -110 160 210" aria-hidden="true"><g fill="none" stroke="${stroke}" stroke-linecap="round" stroke-linejoin="round" transform="scale(${spinScale(pose)},1)">
    <path d="${p.far}" stroke-width="12"/><path d="${p.torso}" stroke-width="19"/><path d="${p.near}" stroke-width="12"/>
    <circle cx="${p.head.x.toFixed(1)}" cy="${p.head.y.toFixed(1)}" r="14" fill="${stroke}" stroke="none"/></g></svg>`;
}

// Each foot: the middle of the foot, its length and its angle (degrees, 0 =
// pointing forward, + = toe up), in figure units. A = far foot, B = near foot.
export function feetOf(pose) {
  const j = joints(pose);
  const s = spinScale(pose);
  return [j.legA, j.legB].map((leg) => {
    // The angle is measured in the figure's own drawing, before the spin squash,
    // so it stays steady while spinning (the 3D shoe turns with `spin` instead).
    const dx = leg.toe.x - leg.ankle.x;
    const dy = leg.toe.y - leg.ankle.y;
    return {
      x: ((leg.ankle.x + leg.toe.x) / 2) * s,
      y: (leg.ankle.y + leg.toe.y) / 2,
      length: LEN.foot,
      angle: (-Math.atan2(dy, dx) * 180) / Math.PI,
      flipped: s < 0,
      spin: pose.spin ?? 0,
    };
  });
}

// How loud each foot's "sound" is right now (0 → 1), for the rings at the feet.
export function strikesAt(motion, phase, width = 0.3) {
  const move = MOVES[motion] ?? MOVES.walk;
  const f = ((phase % 1) + 1) % 1;
  const level = { A: 0, B: 0 };
  move.strikes.forEach(([at, foot]) => {
    const since = (f - at + 1) % 1;
    const v = since < width ? clamp01(1 - since / width) : 0;
    if (foot !== 'B') level.A = Math.max(level.A, v);
    if (foot !== 'A') level.B = Math.max(level.B, v);
  });
  return level;
}
MOVES.step = MOVES.walk; // story-movements.js calls walking 'step'
