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
// The figure faces right. Angles are in degrees:
//   lean      torso lean (+ forward, -90 = lying on its back)
//   sA, sB    shoulders, relative to the torso (0 = arm hangs down, + forward)
//   eA, eB    elbows (- bends the forearm forward and up)
//   hA, hB    hips, measured from straight down (+ = leg swings forward)
//   kA, kB    knees (- bends the shin back)
//   aA, aB    ankles (+ toe up)
//   x, y      where the hips are, in figure units (+y = down)
//   spin      turns around the vertical axis (1 = one full turn)
// A = the far side (drawn first), B = the near side.
import { lerp } from '../core/scene.js';

const LEN = { torso: 58, neck: 9, head: 14, upper: 31, fore: 29, thigh: 44, shin: 42, foot: 17 };
export const GROUND = LEN.thigh + LEN.shin; // where the soles are when standing

export const STAND = { x: 0, y: 0, lean: 0, sA: -8, eA: -12, sB: 8, eB: -12, hA: 0, kA: 0, aA: 0, hB: 0, kB: 0, aB: 0, spin: 0 };
const KEYS = Object.keys(STAND);

const rad = (d) => (d * Math.PI) / 180;
const down = (deg, len) => ({ x: Math.sin(rad(deg)) * len, y: Math.cos(rad(deg)) * len });
const add = (p, v) => ({ x: p.x + v.x, y: p.y + v.y });
const clamp01 = (n) => Math.min(Math.max(n, 0), 1);
const TAU = Math.PI * 2;

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
        sA: -22 * Math.sin(w),
        sB: 22 * Math.sin(w),
        eA: -18,
        eB: -18,
      };
    },
    strikes: [[0.25, 'A'], [0.75, 'B']],
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
        sA: -55 * Math.sin(w),
        sB: 55 * Math.sin(w),
        eA: -85,
        eB: -85,
      };
    },
    strikes: [[0.25, 'A'], [0.75, 'B']],
  },
  spin: {
    pose: (f) => ({
      ...STAND,
      y: -4 * Math.sin(f * Math.PI),
      hB: 28,
      kB: -75,
      sA: 55,
      eA: -105,
      sB: 55,
      eB: -105,
      spin: f,
    }),
    strikes: [[0.5, 'both']],
  },
  pose: {
    // Dancer's pose (P-08a): one foot down, the other knee raised, arms out wide.
    pose: (f) => ({
      ...STAND,
      lean: -6 + 3 * Math.sin(f * TAU),
      hB: 72,
      kB: -28,
      aB: 18,
      hA: -2,
      sA: -95,
      eA: 0,
      sB: 95,
      eB: 0,
    }),
    strikes: [[0.0, 'A']],
  },
  kick: {
    // Side kick, sole out (P-09c): chamber the knee, snap the leg straight out, back.
    pose: (f) => {
      const out = 0.5 - 0.5 * Math.cos(f * TAU); // 0 → 1 → 0
      return {
        ...STAND,
        lean: lerp(-4, -22, out),
        hA: -4,
        hB: lerp(45, 95, out),
        kB: lerp(-105, 0, out),
        aB: lerp(0, -15, out),
        sA: -25,
        eA: -20,
        sB: -10,
        eB: -25,
      };
    },
    strikes: [[0.5, 'B']],
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
  },
  heelclick: {
    // Heel-click jump (P-20): up, the inner heels meet mid-air, land.
    pose: (f) => {
      const up = Math.sin(Math.PI * f);
      return {
        ...STAND,
        y: -48 * up,
        lean: 4,
        hA: 18 * up,
        kA: -78 * up,
        hB: -8 * up,
        kB: -62 * up,
        sA: -30,
        eA: -20,
        sB: lerp(10, 150, up),
        eB: -10,
      };
    },
    strikes: [[0.5, 'both'], [0.98, 'both']],
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
    const dx = (leg.toe.x - leg.ankle.x) * s;
    const dy = leg.toe.y - leg.ankle.y;
    return {
      x: ((leg.ankle.x + leg.toe.x) / 2) * s,
      y: (leg.ankle.y + leg.toe.y) / 2,
      length: LEN.foot,
      angle: (-Math.atan2(dy, dx) * 180) / Math.PI,
      flipped: s < 0,
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
