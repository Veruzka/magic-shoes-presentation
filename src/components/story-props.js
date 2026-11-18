// Story props: the background of the movement scene, drawn as a pictogram of
// the current "Yes, and…" offer. Same flat look as the sprite: one color,
// rounded strokes, no faces, no text. They sit behind the players and stay
// faint, so the players stay the hero. Motion tells the story: a crack spreads
// from the foot that hit the ice, the giant gains on the runners.
//
//   const prop = STORY_PROPS.ice(layerGroup);  // builds its shapes once
//   prop.update(ctx);                          // every frame (see below)
//
// ctx: { time, dt, appear, phase, sync, calm, players: [{ x, facing, feet, strike }] }
//   time    seconds since the prop appeared
//   appear  0 → 1 fade-in (the whole prop fades with it)
//   phase   0 → 1 loop of the current movement
//   sync    0 → 1 how in sync the two players are
//   calm    true for reduced motion: a still, readable version
//   players hip x, facing (+1 right, -1 left), feet [{x, y}] (far, near) and
//           strike [a, b]: how loud each foot's sound is right now (1 = impact)
//
// Scene units: viewBox "-480 -270 960 540", y grows downward, ground at y = 150.
// To add a prop: write one entry in STORY_PROPS with prop((g) => (ctx) => {…}),
// then list its id under its movement in PROP_FOR_OFFER.
import { figurePaths, movementPose, STAND, blendPose, feetOf, strikesAt, joints, GROUND } from './sprite-rig.js';

export const GROUND_Y = 150;

// Which prop goes with which offer, in the same order as the offers in
// src/data/story-movements.js.
export const PROP_FOR_OFFER = {
  walk: ['behind', 'ice', 'giantSleep'],
  run: ['lava', 'giantChase', 'train'],
  spin: ['tornado', 'spell', 'musicbox'],
  'dancers-pose': ['silence', 'museum', 'ledge'],
  'side-kick': ['door', 'pass', 'thunder'],
  'feet-to-sky': ['stars', 'float', 'upsideDown'],
  'heel-click': ['home', 'wake', 'curtain'],
};

// ---------- Small shared helpers ----------

const NS = 'http://www.w3.org/2000/svg';
const TAU = Math.PI * 2;
const W = 480; // half the scene width
const TOP = -270;
const BOTTOM = 270;
let uid = 0;

const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};
const easeOut = (t) => 1 - (1 - clamp01(t)) ** 3;
// Glide a value toward a target (rate: higher = faster), frame-rate safe.
const approach = (cur, target, rate, dt) => cur + (target - cur) * (1 - Math.exp(-rate * dt));
const r1 = (v) => Math.round(v * 10) / 10;
const r2 = (v) => Math.round(v * 100) / 100;
const pt = (x, y) => `${r1(x)},${r1(y)}`;
const line = (pts) => 'M' + pts.map((p) => pt(p.x, p.y)).join('L');
const circlePath = (cx, cy, r) => `M${pt(cx - r, cy)}a${r1(r)},${r1(r)} 0 1,0 ${r1(2 * r)},0a${r1(r)},${r1(r)} 0 1,0 ${r1(-2 * r)},0`;
const roundRect = (x, y, w, h, r) =>
  `M${pt(x + r, y)}H${r1(x + w - r)}Q${pt(x + w, y)} ${pt(x + w, y + r)}V${r1(y + h - r)}Q${pt(x + w, y + h)} ${pt(x + w - r, y + h)}H${r1(x + r)}Q${pt(x, y + h)} ${pt(x, y + h - r)}V${r1(y + r)}Q${pt(x, y)} ${pt(x + r, y)}Z`;

function set(node, attrs) {
  for (const key in attrs) node.setAttribute(key, attrs[key]);
  return node;
}
function el(parent, tag, attrs = {}) {
  const node = document.createElementNS(NS, tag);
  set(node, attrs);
  parent.appendChild(node);
  return node;
}
const hide = (node) => node.setAttribute('opacity', 0);
const FILL = { fill: 'currentColor', stroke: 'none' };

// A seeded random: the same "random" layout on every visit.
function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Stand-ins in case the scene passes fewer than two players.
const FALLBACK = [
  { x: -120, facing: 1, feet: [{ x: -128, y: GROUND_Y }, { x: -108, y: GROUND_Y }], strike: [0, 0] },
  { x: 120, facing: -1, feet: [{ x: 128, y: GROUND_Y }, { x: 108, y: GROUND_Y }], strike: [0, 0] },
];
const playerOf = (ctx, i) => ctx.players?.[i] ?? FALLBACK[i];
const loudness = (ctx) => [0, 1].reduce((sum, i) => sum + (playerOf(ctx, i).strike?.[0] ?? 0) + (playerOf(ctx, i).strike?.[1] ?? 0), 0);

// Notices the moment a foot lands (its strike jumps up). Returns the new
// footfalls this frame: [{ player, foot, x, y }]. Nothing lands in calm mode.
function footfalls({ onePerPlayer = false } = {}) {
  const prev = [[0, 0], [0, 0]];
  return (ctx) => {
    const hits = [];
    for (let i = 0; i < 2; i++) {
      const p = playerOf(ctx, i);
      let landed = false;
      for (let f = 0; f < 2; f++) {
        const s = p.strike?.[f] ?? 0;
        if (!ctx.calm && s - prev[i][f] > 0.25 && !(onePerPlayer && landed)) {
          const foot = p.feet?.[f] ?? { x: p.x, y: GROUND_Y };
          hits.push({ player: i, foot: f, x: foot.x, y: foot.y });
          landed = true;
        }
        prev[i][f] = s;
      }
    }
    return hits;
  };
}

// An extra figure in the sprite's exact style (giant, guard, echo).
function figure(parent, attrs = {}) {
  const g = el(parent, 'g', attrs);
  const far = el(g, 'path', { 'stroke-width': 12 });
  const torso = el(g, 'path', { 'stroke-width': 19 });
  const near = el(g, 'path', { 'stroke-width': 12 });
  const head = el(g, 'circle', { r: 14, ...FILL });
  let at = { pose: STAND, x: 0, hipY: 0, facing: 1, scale: 1 };
  const toWorld = (p) => ({ x: at.x + at.facing * at.scale * p.x, y: at.hipY + at.scale * p.y });
  return {
    g,
    // hipY: where the hips go in scene units. Standing on the ground: standY(scale).
    draw(pose, x, hipY, facing, scale) {
      const p = figurePaths(pose);
      far.setAttribute('d', p.far);
      torso.setAttribute('d', p.torso);
      near.setAttribute('d', p.near);
      set(head, { cx: r1(p.head.x), cy: r1(p.head.y) });
      g.setAttribute('transform', `translate(${r1(x)},${r1(hipY)}) scale(${r2(facing * scale)},${r2(scale)})`);
      at = { pose, x, hipY, facing, scale };
    },
    toWorld,
    feet: () => feetOf(at.pose).map(toWorld),
    joints: () => joints(at.pose),
  };
}
const standY = (scale) => GROUND_Y - GROUND * scale;

// Every prop: a root group that fades with `appear`, plus a per-frame function.
const prop = (draw) => (layer) => {
  const g = el(layer, 'g', { fill: 'none', stroke: 'currentColor', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
  const frame = draw(g);
  return {
    update(ctx) {
      const c = { ...ctx, dt: Math.min(ctx.dt ?? 0.016, 0.1), appear: clamp01(ctx.appear ?? 1) };
      g.setAttribute('opacity', r2(c.appear));
      frame(c);
    },
  };
};

// Part of a polyline, from its start to a fraction t of its length (for cracks).
function partialLine(pts, t) {
  if (t >= 1) return line(pts);
  let total = 0;
  for (let i = 1; i < pts.length; i++) total += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  let left = total * t;
  const out = [pts[0]];
  for (let i = 1; i < pts.length && left > 0; i++) {
    const a = pts[i - 1], b = pts[i];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    const k = Math.min(1, left / len);
    out.push({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k) });
    left -= len;
  }
  return out.length > 1 ? line(out) : '';
}

// Part of a flat ellipse (a ring seen from the side), angles in radians.
function ellipseArc(cx, cy, rx, ry, a0, a1, steps = 12) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const a = lerp(a0, a1, i / steps);
    pts.push({ x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) });
  }
  return line(pts);
}

// ---------- The props ----------

export const STORY_PROPS = {
  // WALK · "There's something behind you." A tall shadow of player 1 walks
  // behind them, half a step late, like an echo. When they stop, it stops.
  behind: prop((g) => {
    const S = 1.6;
    const shadow = figure(g, { opacity: 0.2 });
    const echoes = [0, 1].map(() => el(g, 'ellipse', { 'stroke-width': 3, opacity: 0 }));
    let lastPhase = null;
    let lastMove = -9;
    let walking = 0;
    return (ctx) => {
      const p1 = playerOf(ctx, 0);
      if (lastPhase !== null && Math.abs(ctx.phase - lastPhase) > 1e-4) lastMove = ctx.time;
      lastPhase = ctx.phase;
      // It keeps going a moment after you stop, then stops too.
      walking = ctx.calm ? 0 : approach(walking, ctx.time - lastMove < 0.45 ? 1 : 0, 5, ctx.dt);
      const late = ctx.phase - 0.25;
      const pose = blendPose(STAND, movementPose('walk', late), walking);
      const x = p1.x - p1.facing * (170 + 50 * (1 - ctx.appear));
      shadow.draw(pose, x, standY(S), p1.facing, S);
      // Its footsteps: a ring where each of its feet lands.
      const level = strikesAt('walk', late);
      const feet = shadow.feet();
      [level.A, level.B].forEach((v, i) => {
        const r = 14 + (1 - v) * 46;
        set(echoes[i], { cx: r1(feet[i].x), cy: GROUND_Y, rx: r1(r), ry: r1(r * 0.28), opacity: r2(0.4 * v * walking) });
      });
    };
  }),

  // WALK · "The floor is thin ice." A pale band of ice; each footfall starts a
  // crack that spreads out from that foot, and the cracks stay.
  ice: prop((g) => {
    const rand = seeded(11);
    el(g, 'rect', { x: -W, y: GROUND_Y, width: 2 * W, height: 44, ...FILL, opacity: 0.07 });
    el(g, 'path', { d: `M${-W},${GROUND_Y}H${W}`, 'stroke-width': 2, opacity: 0.35 });
    let glints = '';
    for (let i = 0; i < 7; i++) {
      const x = -440 + i * 140 + rand() * 40;
      glints += `M${pt(x, GROUND_Y + 32)}l16,-16M${pt(x + 13, GROUND_Y + 34)}l8,-8`;
    }
    el(g, 'path', { d: glints, 'stroke-width': 2, opacity: 0.16 });

    // A crack: 3 or 4 jagged arms running along the ice, some with a twig.
    const crackArms = (x) => {
      const arms = [];
      const count = 3 + Math.floor(rand() * 2);
      for (let a = 0; a < count; a++) {
        const side = a % 2 ? 1 : -1;
        const pts = [{ x, y: GROUND_Y + 1 }];
        let px = x, py = GROUND_Y + 1;
        const steps = 3 + Math.floor(rand() * 2);
        for (let s = 0; s < steps; s++) {
          const len = 16 + rand() * 26;
          const ang = (0.1 + rand() * 0.5) * (a < 2 ? 1 : 1.6);
          px += side * len * Math.cos(ang);
          py = Math.min(GROUND_Y + 40, py + len * Math.sin(ang) * (rand() < 0.3 ? -0.6 : 1));
          py = Math.max(GROUND_Y + 1, py);
          pts.push({ x: px, y: py });
          if (s === 1 && rand() < 0.6) arms.push([{ x: px, y: py }, { x: px + side * 14, y: Math.min(GROUND_Y + 42, py + 12) }]);
        }
        arms.push(pts);
      }
      return arms;
    };
    const cracks = Array.from({ length: 14 }, () => ({ node: el(g, 'path', { 'stroke-width': 2.5, opacity: 0.5 }), arms: null, born: 0, done: true }));
    let next = 0;
    let stillDrawn = false;
    const hits = footfalls();
    const spawn = (x, time) => {
      const c = cracks[next++ % cracks.length];
      Object.assign(c, { arms: crackArms(x), born: time, done: false });
    };
    return (ctx) => {
      if (ctx.calm && !stillDrawn) {
        stillDrawn = true;
        [0, 1].forEach((i) => (playerOf(ctx, i).feet ?? []).forEach((f) => spawn(f.x, -99)));
      }
      hits(ctx).forEach((h) => spawn(h.x + (rand() - 0.5) * 50, ctx.time));
      cracks.forEach((c) => {
        if (c.done || !c.arms) return;
        const grow = easeOut((ctx.time - c.born) / 0.7);
        c.node.setAttribute('d', c.arms.map((arm) => partialLine(arm, grow)).join(''));
        c.done = grow >= 1;
      });
    };
  }),

  // WALK · "You're sneaking past a sleeping giant." A huge figure lies on its
  // back, breathing slowly, snoring rings rising. Loud steps make it lift its head.
  giantSleep: prop((g) => {
    const S = 1.8;
    const HIP_X = 90;
    const HIP_Y = GROUND_Y - 10 * S;
    const giant = figure(g, { opacity: 0.2 });
    const snores = [0, 1, 2].map(() => el(g, 'circle', { 'stroke-width': 2.5, opacity: 0 }));
    let stir = 0;
    return (ctx) => {
      // Both feet or both players landing together counts as loud.
      const loud = clamp01((loudness(ctx) - 0.6) / 1.2);
      stir = ctx.calm ? 0 : approach(stir, loud, loud > stir ? 10 : 0.7, ctx.dt);
      const breath = ctx.calm ? 0 : Math.sin((ctx.time * TAU) / 4.5);
      const pose = {
        ...STAND,
        lean: -90 + 3.5 * breath + 18 * stir,
        hA: 92, kA: -4, aA: 0,
        hB: 128, kB: -98, aB: -30,
        sA: 172, eA: -6, sB: 160, eB: 30,
      };
      giant.draw(pose, HIP_X, HIP_Y, 1, S);
      const head = giant.toWorld(giant.joints().head);
      snores.forEach((ring, i) => {
        const k = ctx.calm ? 0.2 + i * 0.3 : (ctx.time / 4.5 + i / 3) % 1;
        set(ring, {
          cx: r1(head.x + 10 + k * 34),
          cy: r1(head.y - 26 - k * 70),
          r: r1(4 + k * 12),
          opacity: r2(0.35 * Math.sin(Math.PI * k) * (1 - stir)),
        });
      });
    };
  }),

  // RUN · "The ground is lava." A wavy molten floor; every footfall pops
  // bubbles where the foot landed.
  lava: prop((g) => {
    const rand = seeded(23);
    const pool = el(g, 'path', { ...FILL, opacity: 0.1 });
    const surface = el(g, 'path', { 'stroke-width': 3, opacity: 0.4 });
    const bubbles = Array.from({ length: 10 }, () => ({
      dot: el(g, 'circle', { ...FILL, opacity: 0 }),
      ring: el(g, 'circle', { 'stroke-width': 2, opacity: 0 }),
      born: -99, x: 0, size: 1,
    }));
    const STILL_X = [-300, -60, 90, 330];
    let next = 0;
    let ambient = 0;
    const hits = footfalls();
    const surf = (x, t) => GROUND_Y + 6 + 4 * Math.sin(x * 0.021 + t * 1.7) + 2.5 * Math.sin(x * 0.053 - t * 2.6);
    const spawn = (x, time, size) => Object.assign(bubbles[next++ % bubbles.length], { x, born: time, size });
    return (ctx) => {
      const t = ctx.calm ? 0 : ctx.time;
      let d = '';
      for (let x = -W; x <= W; x += 30) d += (x === -W ? 'M' : 'L') + pt(x, surf(x, t));
      surface.setAttribute('d', d);
      pool.setAttribute('d', `${d}L${W},${BOTTOM}L${-W},${BOTTOM}Z`);
      hits(ctx).forEach((h) => {
        spawn(h.x + (rand() - 0.5) * 16, ctx.time, 1);
        spawn(h.x + (rand() - 0.5) * 50, ctx.time + 0.1, 0.6);
      });
      if (!ctx.calm && (ambient -= ctx.dt) <= 0) {
        ambient = 0.4 + rand() * 0.6;
        spawn(-W + rand() * 2 * W, ctx.time, 0.5);
      }
      bubbles.forEach((b, i) => {
        const still = ctx.calm && i < STILL_X.length;
        const age = still ? 0.6 : (ctx.time - b.born) / 0.9;
        const x = still ? STILL_X[i] : b.x;
        const size = still ? 0.8 : b.size;
        const base = surf(x, t);
        if (age >= 0 && age < 1) {
          set(b.dot, { cx: r1(x), cy: r1(base - 26 * easeOut(age)), r: r1(size * (3 + 7 * age)), opacity: 0.4 });
          hide(b.ring);
        } else if (age >= 1 && age < 1.35) {
          const k = (age - 1) / 0.35;
          set(b.ring, { cx: r1(x), cy: r1(base - 26), r: r1(size * (10 + 18 * k)), opacity: r2(0.45 * (1 - k)) });
          hide(b.dot);
        } else {
          hide(b.dot);
          hide(b.ring);
        }
      });
    };
  }),

  // RUN · "You're being chased." A giant runs in from the left, lunging closer
  // in bursts; each of its heavy steps kicks up dust.
  giantChase: prop((g) => {
    const S = 1.7;
    const giant = figure(g, { opacity: 0.22 });
    const dust = Array.from({ length: 8 }, () => ({ node: el(g, 'circle', { ...FILL, opacity: 0 }), born: -99, x: 0, dir: 1 }));
    let next = 0;
    let prev = { A: 0, B: 0 };
    return (ctx) => {
      const t = ctx.time;
      const stride = ctx.calm ? 0.15 : t * 0.85; // slower, bigger strides than the players
      const k = (t * 0.45) % 1;
      const lunge = k < 0.25 ? smooth(k / 0.25) : 1 - smooth((k - 0.25) / 0.75);
      const x = ctx.calm ? -340 : lerp(-640, -370, easeOut(t / 3)) + 45 * lunge;
      const pose = movementPose('run', stride);
      giant.draw(pose, x, standY(S), 1, S);
      const level = strikesAt('run', stride);
      const feet = giant.feet();
      ['A', 'B'].forEach((key, i) => {
        if (!ctx.calm && level[key] - prev[key] > 0.25) {
          for (const dir of [-1, 1]) Object.assign(dust[next++ % dust.length], { born: t, x: feet[i].x, dir });
        }
      });
      prev = level;
      dust.forEach((d) => {
        const a = (t - d.born) / 0.8;
        if (a < 0 || a > 1) return hide(d.node);
        set(d.node, { cx: r1(d.x + d.dir * (8 + 30 * easeOut(a))), cy: r1(GROUND_Y - 4 - 14 * easeOut(a)), r: r1(4 + 10 * a), opacity: r2(0.3 * (1 - a)) });
      });
    };
  }),

  // RUN · "The last train is leaving." A train pulls away along the tracks
  // into the distance, puffing. Running in sync slows it down (you're catching up).
  train: prop((g) => {
    const VX = 470; // where the rails meet the horizon
    const VY = 104;
    const START = 330;
    const railY = (x) => VY + ((GROUND_Y - 2 - VY) * (VX - x)) / (VX + W);
    el(g, 'path', { d: `M${-W},${GROUND_Y - 2}L${VX},${VY}M${-W},${GROUND_Y + 16}L${VX},${VY + 2}`, 'stroke-width': 2, opacity: 0.25 });
    const body = el(g, 'g', { opacity: 0.4 });
    // Drawn with the front of the engine at x = 0 and the wheels on y = 0.
    el(body, 'path', {
      'stroke-width': 5,
      d: roundRect(-150, -84, 150, 70, 22) + roundRect(-150, -122, 62, 40, 8) + `M-44,-84V-108H-22V-84` +
        roundRect(-326, -78, 164, 64, 18) + roundRect(-502, -78, 164, 64, 18) + 'M-162,-34H-150M-338,-34H-326',
    });
    let windows = roundRect(-138, -112, 38, 22, 5);
    for (const cx of [-300, -250, -200, -476, -426, -376]) windows += roundRect(cx, -64, 34, 22, 5);
    el(body, 'path', { d: windows, ...FILL, opacity: 0.6 });
    let wheels = '';
    for (const cx of [-120, -40, -300, -190, -476, -366]) wheels += circlePath(cx, -11, 11);
    el(body, 'path', { d: wheels, ...FILL });
    const puffs = Array.from({ length: 6 }, () => ({ node: el(g, 'circle', { ...FILL, opacity: 0 }), born: -99, x: 0, y: 0, s: 1 }));
    let next = 0;
    let gone = 0;
    let puffTimer = 0;
    return (ctx) => {
      if (!ctx.calm) gone += ctx.dt * 0.16 * (1 - 0.7 * (ctx.sync ?? 0));
      const u = ctx.calm ? 0.45 : 0.97 * (1 - Math.exp(-gone));
      const fx = lerp(START, VX, u);
      const s = (0.85 * (VX - fx)) / (VX - START); // perspective: smaller as it nears the horizon
      const fy = railY(fx);
      body.setAttribute('transform', `translate(${r1(fx)},${r1(fy)}) scale(${r2(s)})`);
      if (!ctx.calm && (puffTimer -= ctx.dt) <= 0) {
        puffTimer = 0.45;
        Object.assign(puffs[next++ % puffs.length], { born: ctx.time, x: fx - 33 * s, y: fy - 110 * s, s });
      }
      puffs.forEach((p, i) => {
        const a = ctx.calm ? [0.3, 0.7][i] ?? -1 : (ctx.time - p.born) / 1.6;
        const px = ctx.calm ? fx - 33 * s : p.x;
        const py = ctx.calm ? fy - 110 * s : p.y;
        const ps = ctx.calm ? s : p.s;
        if (a < 0 || a > 1) return hide(p.node);
        set(p.node, { cx: r1(px - 40 * ps * a), cy: r1(py - 60 * ps * easeOut(a)), r: r1(ps * (7 + 18 * a)), opacity: r2(0.3 * (1 - a)) });
      });
    };
  }),

  // SPIN · "You're the eye of a tornado." Rings of wind circle the players,
  // stacking into a funnel and spinning faster over time.
  tornado: prop((g) => {
    const N = 11;
    const rand = seeded(5);
    const arcs = Array.from({ length: N }, (_, i) => el(g, 'path', { 'stroke-width': r1(2 + 3 * (i / N)), opacity: 0 }));
    const debris = Array.from({ length: 8 }, () => ({ node: el(g, 'circle', { ...FILL, opacity: 0 }), level: rand(), a: rand() * TAU, r: 2 + rand() * 3 }));
    let spin = 0;
    const ring = (k) => ({ y: lerp(GROUND_Y, -240, k), rx: lerp(150, 470, k * k * 0.6 + k * 0.4) });
    return (ctx) => {
      const build = ctx.calm ? 0.75 : smooth(ctx.time / 7);
      if (!ctx.calm) spin += ctx.dt * (0.6 + 2.2 * build + 0.6 * (ctx.sync ?? 0));
      arcs.forEach((arc, i) => {
        const k = i / (N - 1);
        const { y, rx } = ring(k);
        const shown = clamp01(build * N * 1.2 - i); // the funnel grows from the ground up
        const a0 = spin * (1.3 - k * 0.5) + i * 2.1;
        set(arc, { d: ellipseArc(0, y, rx, rx * 0.13, a0, a0 + 1.4 + build * 1.4), opacity: r2((0.15 + 0.25 * k) * shown) });
      });
      debris.forEach((d) => {
        const { y, rx } = ring(d.level);
        const a = spin * 1.5 + d.a;
        set(d.node, { cx: r1(rx * Math.cos(a)), cy: r1(y + rx * 0.13 * Math.sin(a)), r: d.r, opacity: r2(0.4 * clamp01(build * 1.3 - d.level)) });
      });
    };
  }),

  // SPIN · "You're casting a spell." Sparkles spiral up around each player in
  // a rising helix; each landing makes them flare outward.
  spell: prop((g) => {
    const N = 9; // per player
    const sparks = Array.from({ length: 2 * N }, () => el(g, 'path', { d: 'M-7,0H7M0,-7V7', 'stroke-width': 3, opacity: 0 }));
    const hits = footfalls();
    let flare = 0;
    return (ctx) => {
      if (hits(ctx).length) flare = 1;
      flare = approach(flare, 0, 2.5, ctx.dt);
      const t = ctx.calm ? 2 : ctx.time;
      sparks.forEach((spark, j) => {
        const i = j % N;
        const who = j < N ? 0 : 1;
        const p = playerOf(ctx, who);
        const k = (t * 0.2 + i / N) % 1; // 0 at the feet, 1 at the top
        const a = k * TAU * 2.2 + t * 1.6 + who * Math.PI;
        const R = 48 + 22 * k + 36 * flare;
        const depth = (Math.sin(a) + 1) / 2; // 1 = in front
        const size = (0.55 + 0.45 * depth) * (1 + 0.6 * flare) * (1 - 0.35 * k);
        set(spark, {
          transform: `translate(${pt(p.x + R * Math.cos(a), GROUND_Y - 12 - k * 300)}) rotate(${r1(t * 90 + j * 20)}) scale(${r2(size)})`,
          opacity: r2((0.15 + 0.3 * depth) * Math.sin(Math.PI * k) + 0.15 * flare),
        });
      });
    };
  }),

  // SPIN · "You're a music box, winding down." The players stand on the drum
  // of a music box. Its key turns slower and slower, and the notes rising from
  // it slow down too. Then it's wound up again.
  musicbox: prop((g) => {
    const RX = 300, RY = 24, H = 48;
    const TOPY = GROUND_Y, BY = GROUND_Y + H;
    const rand = seeded(7);
    el(g, 'path', { d: `M${-RX},${TOPY}V${BY}A${RX},${RY} 0 0,0 ${RX},${BY}V${TOPY}Z`, ...FILL, opacity: 0.06 });
    el(g, 'path', { d: `M${-RX},${TOPY}V${BY}A${RX},${RY} 0 0,0 ${RX},${BY}V${TOPY}`, 'stroke-width': 3, opacity: 0.35 });
    el(g, 'ellipse', { cx: 0, cy: TOPY, rx: RX, ry: RY, 'stroke-width': 3, opacity: 0.35 });
    const pins = Array.from({ length: 14 }, () => el(g, 'path', { 'stroke-width': 3, opacity: 0 }));
    const key = el(g, 'g', { transform: `translate(${RX},${TOPY + H / 2})`, opacity: 0.45 });
    el(key, 'path', { d: 'M0,0H36', 'stroke-width': 6 });
    const bow = el(key, 'path', { d: 'M0,0C-16,-26 16,-26 0,0C-16,26 16,26 0,0', 'stroke-width': 5 });
    const notes = Array.from({ length: 6 }, () => {
      const n = el(g, 'g', { opacity: 0 });
      el(n, 'ellipse', { cx: 0, cy: 0, rx: 7, ry: 5.5, transform: 'rotate(-20)', ...FILL });
      el(n, 'path', { d: 'M6,-2V-28L15,-20', 'stroke-width': 3 });
      return { n, x: 0, y: 0, born: -99, live: false, sway: rand() * TAU };
    });
    let turn = 0;
    let rise = 0;
    let noteTimer = 0;
    let next = 0;
    return (ctx) => {
      // 12 s of slowing down, then a quick wind-up.
      const c = ctx.time % 14;
      const wind = c < 12 ? 1 - c / 12 : 0;
      const speed = ctx.calm ? 0 : c < 12 ? 0.2 + 3.4 * wind * wind : -9 * Math.sin(Math.PI * (c - 12) / 2);
      turn += ctx.dt * speed;
      const angle = ctx.calm ? 0.7 : turn;
      bow.setAttribute('transform', `translate(50,0) scale(1,${r2(Math.max(0.08, Math.abs(Math.cos(angle))))})`);
      pins.forEach((pin, i) => {
        const a = (i / pins.length) * TAU + angle * 0.5;
        const s = Math.sin(a);
        if (s <= 0) return hide(pin);
        const x = RX * 0.96 * Math.cos(a);
        const y = TOPY + RY * s;
        set(pin, { d: `M${pt(x, y + 10)}V${r1(y + 22)}`, opacity: r2(0.35 * s) });
      });
      // Notes: born faster while the box plays fast, and they all float slower as it winds down.
      const pace = Math.max(0, speed) / 3.6;
      if (!ctx.calm && pace > 0.05 && (noteTimer -= ctx.dt * (0.4 + 1.6 * pace)) <= 0) {
        noteTimer = 1;
        Object.assign(notes[next++ % notes.length], { x: (rand() - 0.5) * RX * 1.6, y: TOPY - 20, born: ctx.time, live: true });
      }
      rise = ctx.calm ? 0 : 12 + 70 * pace;
      notes.forEach((note, i) => {
        if (ctx.calm) {
          if (i > 2) return hide(note.n);
          return set(note.n, { transform: `translate(${pt(-180 + i * 170, 40 - i * 50)})`, opacity: 0.35 });
        }
        if (!note.live) return hide(note.n);
        note.y -= rise * ctx.dt;
        const age = ctx.time - note.born;
        const fade = clamp01(age / 0.4) * clamp01((note.y + 230) / 80);
        if (fade <= 0 && age > 0.5) note.live = false;
        set(note.n, { transform: `translate(${pt(note.x + 10 * Math.sin(age * 1.5 + note.sway), note.y)})`, opacity: r2(0.4 * fade) });
      });
    };
  }),

  // DANCER'S POSE · "The world holds its breath." The rings from the feet
  // spread out and freeze mid-air, and drops stop mid-fall. Then nothing moves.
  silence: prop((g) => {
    const rand = seeded(31);
    const rings = [];
    [0, 1].forEach((who) => [44, 96, 160].forEach((size, k) => rings.push({ who, size, k, node: el(g, 'ellipse', { 'stroke-width': r1(3 - k * 0.6), opacity: 0 }) })));
    const drops = Array.from({ length: 12 }, () => ({
      node: el(g, 'circle', { ...FILL, opacity: 0 }),
      x: -440 + rand() * 880,
      y: -230 + rand() * 300,
      r: 2 + rand() * 3,
    }));
    return (ctx) => {
      const freeze = ctx.calm ? 1 : easeOut(ctx.time / 1.4); // movement stops for good
      rings.forEach((ring) => {
        const p = playerOf(ctx, ring.who);
        const r = ring.size * freeze;
        set(ring.node, { cx: r1(p.x), cy: r1(GROUND_Y - 30 - ring.k * 30 * freeze), rx: r1(r), ry: r1(r * 0.3), opacity: r2((0.4 - ring.k * 0.08) * clamp01(freeze * 3)) });
      });
      drops.forEach((d) => set(d.node, { cx: r1(d.x), cy: r1(d.y - 40 * (1 - freeze)), r: d.r, opacity: r2(0.3 * freeze) }));
    };
  }),

  // DANCER'S POSE · "You're a statue in a museum after dark." Frames on the
  // wall, a rope barrier, and a night guard walking past, sweeping a flashlight.
  museum: prop((g) => {
    const WALL = 96; // where the back wall meets the floor
    const S = 0.72; // the guard is further back, so smaller
    el(g, 'path', { d: `M${-W},${WALL}H${W}`, 'stroke-width': 2, opacity: 0.2 });
    const frames = [[-370, -190, 150, 110], [-90, -214, 110, 140], [170, -184, 190, 120]];
    let outer = '', inner = '';
    frames.forEach(([x, y, w, h]) => {
      outer += `M${x},${y}h${w}v${h}h${-w}Z`;
      inner += `M${x + 14},${y + 14}h${w - 28}v${h - 28}h${-w + 28}Z`;
    });
    el(g, 'path', { d: outer, 'stroke-width': 6, opacity: 0.3 });
    el(g, 'path', { d: inner, 'stroke-width': 2, opacity: 0.2 });
    // What hangs in them: hills, a sun, a bowl.
    el(g, 'path', {
      d: `M-342,-102L-310,-140L-288,-118L-268,-142L-246,-102` + circlePath(-35, -150, 18) + `M210,-110Q265,-80 320,-110`,
      'stroke-width': 3,
      opacity: 0.22,
    });
    el(g, 'path', { d: `M-300,${GROUND_Y}V90M0,${GROUND_Y}V90M300,${GROUND_Y}V90M-300,92Q-150,128 0,92Q150,128 300,92`, 'stroke-width': 4, opacity: 0.22 });
    const beam = el(g, 'path', { ...FILL, opacity: 0.1 });
    const guard = figure(g, { opacity: 0.25 });
    return (ctx) => {
      // 40 s loop: walks right to left, waits, walks back, waits.
      const t = ctx.calm ? 0 : ctx.time + 2;
      const c = t % 40;
      let x, facing;
      if (ctx.calm) [x, facing] = [300, -1];
      else if (c < 17) [x, facing] = [lerp(560, -560, c / 17), -1];
      else if (c < 20) [x, facing] = [-600, 1];
      else if (c < 37) [x, facing] = [lerp(-560, 560, (c - 20) / 17), 1];
      else [x, facing] = [600, -1];
      const pose = { ...movementPose('walk', ctx.calm ? 0 : (x + 600) / (66 * S)), sB: 75, eB: -12 };
      guard.draw(pose, x, WALL - GROUND * S, facing, S);
      const hand = guard.toWorld(guard.joints().armB.hand);
      const a = 0.3 + 0.25 * Math.sin(t * 0.9); // the beam sweeps up and down
      const half = 0.2;
      const L = 560;
      const end = (ang) => pt(hand.x + facing * L * Math.cos(ang), hand.y + L * Math.sin(ang));
      beam.setAttribute('d', `M${pt(hand.x, hand.y)}L${end(a - half)}L${end(a + half)}Z`);
    };
  }),

  // DANCER'S POSE · "You're on a rooftop ledge." The players stand on a
  // rooftop, the city far below, gusts of wind streaking past.
  ledge: prop((g) => {
    const rand = seeded(41);
    const EDGE = 330;
    el(g, 'path', { d: `M${-W},${GROUND_Y}H${EDGE}V${GROUND_Y + 24}H${-W}Z`, ...FILL, opacity: 0.1 });
    el(g, 'path', { d: `M${-W},${GROUND_Y}H${EDGE}V${BOTTOM}`, 'stroke-width': 3, opacity: 0.35 });
    let city = '', lights = '';
    for (let x = -W; x < W; ) {
      const w = 22 + rand() * 44;
      const top = 206 + rand() * 46;
      city += `M${pt(x, BOTTOM)}V${r1(top)}H${r1(x + w - 4)}V${BOTTOM}Z`;
      for (let wy = top + 8; wy < BOTTOM - 6; wy += 11) {
        for (let wx = x + 5; wx < x + w - 10; wx += 10) if (rand() < 0.35) lights += `M${pt(wx, wy)}h3v3h-3Z`;
      }
      x += w;
    }
    el(g, 'path', { d: city, ...FILL, opacity: 0.1 });
    el(g, 'path', { d: lights, ...FILL, opacity: 0.3 });
    const streaks = Array.from({ length: 10 }, () => ({
      node: el(g, 'path', { 'stroke-width': 2.5, opacity: 0 }),
      y: -240 + rand() * 330,
      len: 60 + rand() * 120,
      speed: 380 + rand() * 360,
      offset: rand() * 2000,
      sway: rand() * TAU,
    }));
    return (ctx) => {
      const t = ctx.calm ? 0 : ctx.time;
      const gust = 0.5 + 0.5 * Math.sin(t * 0.6);
      streaks.forEach((s, i) => {
        const span = 2 * W + s.len + 300;
        const x = ctx.calm ? -W + ((i * 173) % (2 * W)) : W + 150 - ((s.offset + t * s.speed * (0.6 + 0.6 * gust)) % span);
        const y = s.y + 6 * Math.sin(t * 2 + s.sway);
        set(s.node, { d: `M${pt(x, y)}q${r1(s.len / 2)},-5 ${r1(s.len)},0`, opacity: r2(ctx.calm ? 0.2 : 0.12 + 0.28 * gust) });
      });
    };
  }),

  // SIDE KICK · "A door needs kicking open." A closed door between the
  // players; a kick bursts it open (pieces fly, light spills out), then it
  // swings slowly shut for the next kick.
  door: prop((g) => {
    const L = -52, R = 52, T = -36;
    const DW = R - L;
    const light = el(g, 'path', { d: `M${L},${GROUND_Y}H${R}L${R + 90},${BOTTOM}H${L - 90}Z`, ...FILL, opacity: 0 });
    const glow = el(g, 'rect', { x: L, y: T, width: DW, height: GROUND_Y - T, ...FILL, opacity: 0 });
    el(g, 'path', { d: `M${L - 8},${GROUND_Y}V${T - 8}H${R + 8}V${GROUND_Y}`, 'stroke-width': 6, opacity: 0.35 });
    const panel = el(g, 'g', { opacity: 0.45 });
    el(panel, 'rect', { x: 0, y: T, width: DW, height: GROUND_Y - T, rx: 3, 'stroke-width': 5 });
    el(panel, 'path', { d: `M12,${T + 16}H${DW - 12}M12,${GROUND_Y - 16}H${DW - 12}M12,${T + 16}L${DW - 12},${GROUND_Y - 16}`, 'stroke-width': 3 });
    el(panel, 'circle', { cx: DW - 14, cy: 60, r: 5, ...FILL });
    const rand = seeded(13);
    const bits = Array.from({ length: 7 }, () => ({ node: el(g, 'path', { 'stroke-width': 4, opacity: 0 }), vx: 0, vy: 0, spin: 0, len: 0, born: -99 }));
    const hits = footfalls({ onePerPlayer: true });
    let open = 0;
    let kickedAt = -99;
    return (ctx) => {
      hits(ctx).forEach((h) => {
        if (open < 0.4) {
          const dir = h.player === 0 ? 1 : -1; // pieces fly away from the kicker
          bits.forEach((b) => Object.assign(b, { born: ctx.time, vx: dir * (60 + rand() * 220), vy: -120 - rand() * 200, spin: (rand() - 0.5) * 720, len: 8 + rand() * 14 }));
        }
        kickedAt = ctx.time;
      });
      const want = ctx.time - kickedAt < 0.9 ? 1 : 0;
      open = ctx.calm ? 0.6 : approach(open, want, want ? 18 : 1.6, ctx.dt);
      const squash = Math.max(0.1, Math.cos(open * 1.4)); // swinging away looks narrower
      panel.setAttribute('transform', `translate(${L},0) scale(${r2(squash)},1)`);
      light.setAttribute('opacity', r2(0.12 * open));
      glow.setAttribute('opacity', r2(0.12 * open));
      bits.forEach((b) => {
        const a = ctx.time - b.born;
        if (a < 0 || a > 1.1) return hide(b.node);
        const x = b.vx * a, y = 60 + b.vy * a + 380 * a * a;
        set(b.node, { d: `M${-b.len / 2},0H${b.len / 2}`, transform: `translate(${pt(x, y)}) rotate(${r1(b.spin * a)})`, opacity: r2(0.45 * (1 - a / 1.1)) });
      });
    };
  }),

  // SIDE KICK · "Your sound flies to your partner." A kick throws a comet
  // along the arc from the kicker's foot to the partner, where it lands as a ring.
  pass: prop((g) => {
    const path = el(g, 'path', { 'stroke-width': 2, 'stroke-dasharray': '2 12', opacity: 0.18 });
    const comets = Array.from({ length: 3 }, () => ({
      tail: [4, 3, 2, 1].map((k) => el(g, 'circle', { ...FILL, r: 2 + k, opacity: 0 })),
      head: el(g, 'circle', { ...FILL, r: 8, opacity: 0 }),
      ring: el(g, 'ellipse', { 'stroke-width': 3, opacity: 0 }),
      from: 0, born: -99, still: false,
    }));
    const hits = footfalls({ onePerPlayer: true });
    let next = 0;
    const TRAVEL = 0.75;
    const along = (a, b, k) => {
      const cx = (a.x + b.x) / 2, cy = -130;
      const m = 1 - k;
      return { x: m * m * a.x + 2 * m * k * cx + k * k * b.x, y: m * m * a.y + 2 * m * k * cy + k * k * b.y };
    };
    return (ctx) => {
      const foot = (i) => playerOf(ctx, i).feet?.[1] ?? { x: playerOf(ctx, i).x, y: GROUND_Y };
      const ends = [foot(0), foot(1)];
      path.setAttribute('d', `M${pt(ends[0].x, ends[0].y)}Q${pt((ends[0].x + ends[1].x) / 2, -130)} ${pt(ends[1].x, ends[1].y)}`);
      hits(ctx).forEach((h) => Object.assign(comets[next++ % comets.length], { from: h.player, born: ctx.time }));
      comets.forEach((c, i) => {
        const a = ctx.calm ? (i === 0 ? 0.55 * TRAVEL : -1) : ctx.time - c.born;
        const start = ends[c.from], goal = ends[1 - c.from];
        const k = a / TRAVEL;
        if (a >= 0 && k <= 1) {
          const e = smooth(k);
          const p = along(start, goal, e);
          set(c.head, { cx: r1(p.x), cy: r1(p.y), opacity: 0.5 });
          c.tail.forEach((dot, j) => {
            const q = along(start, goal, Math.max(0, e - 0.05 * (j + 1)));
            set(dot, { cx: r1(q.x), cy: r1(q.y), opacity: r2(0.35 - j * 0.07) });
          });
        } else {
          hide(c.head);
          c.tail.forEach(hide);
        }
        const land = (a - TRAVEL) / 0.6;
        if (land >= 0 && land < 1) {
          const r = 12 + 70 * easeOut(land);
          set(c.ring, { cx: r1(goal.x), cy: GROUND_Y, rx: r1(r), ry: r1(r * 0.3), opacity: r2(0.5 * (1 - land)) });
        } else hide(c.ring);
      });
    };
  }),

  // SIDE KICK · "Thunder answers you." A cloud hangs above; a kick brings a
  // lightning bolt down toward the kicker, a flash, and the cloud rumbles.
  thunder: prop((g) => {
    const rand = seeded(17);
    const flash = el(g, 'rect', { x: -W, y: TOP, width: 2 * W, height: 2 * -TOP, ...FILL, opacity: 0 });
    const cloud = el(g, 'g', { opacity: 0.22 });
    // Group opacity, so the overlapping puffs read as one flat shape.
    [[-70, -192, 40], [-18, -214, 52], [42, -202, 44], [88, -184, 30]].forEach(([cx, cy, r]) => el(cloud, 'circle', { cx, cy, r, ...FILL }));
    el(cloud, 'rect', { x: -110, y: -192, width: 228, height: 40, rx: 20, ...FILL });
    const bolt = el(g, 'path', { 'stroke-width': 6, opacity: 0 });
    const hits = footfalls({ onePerPlayer: true });
    let struck = -99;
    const strike = (targetX) => {
      let x = -20 + rand() * 40, y = -152;
      const pts = [{ x, y }];
      let fork = '';
      for (let i = 1; i <= 7; i++) {
        y = lerp(-152, GROUND_Y, i / 7);
        x = lerp(pts[0].x, targetX, i / 7) + (i < 7 ? (rand() - 0.5) * 50 : 0);
        pts.push({ x, y });
        if (i === 3) fork = `M${pt(x, y)}l${r1((rand() - 0.5) * 60)},40l${r1((rand() - 0.5) * 30)},30`;
      }
      bolt.setAttribute('d', line(pts) + fork);
    };
    strike(-50);
    return (ctx) => {
      hits(ctx).forEach((h) => {
        strike(lerp(0, h.x, 0.6));
        struck = ctx.time;
      });
      const a = ctx.time - struck;
      // Flicker: on, dim, on, fade.
      const lit = ctx.calm ? 0.35 : a < 0.08 ? 0.85 : a < 0.14 ? 0.3 : a < 0.22 ? 0.85 : a < 0.45 ? 0.85 * (1 - (a - 0.22) / 0.23) : 0;
      bolt.setAttribute('opacity', r2(lit));
      flash.setAttribute('opacity', r2(ctx.calm ? 0 : 0.09 * clamp01(1 - a / 0.3)));
      const rumble = ctx.calm ? 0 : Math.exp(-Math.max(0, a - 0.1) * 2.5) * (a > 0.1 ? 1 : 0);
      const drift = ctx.calm ? 0 : 12 * Math.sin(ctx.time * 0.25);
      cloud.setAttribute('transform', `translate(${r1(drift + 5 * rumble * Math.sin(ctx.time * 47))},${r1(3 * rumble * Math.sin(ctx.time * 31))})`);
    };
  }),

  // FEET TO THE SKY · "You're photographing the stars." A twinkling star
  // field, and an iris above the players' raised feet that snaps shut and open
  // (a shutter) with each landing.
  stars: prop((g) => {
    const rand = seeded(29);
    const stars = Array.from({ length: 28 }, () => {
      const s = { x: -460 + rand() * 920, y: -255 + rand() * 300, r: 1.2 + rand() * 2.2, base: 0.18 + rand() * 0.28, speed: 1 + rand() * 2.5, ph: rand() * TAU };
      s.node = el(g, 'circle', { cx: r1(s.x), cy: r1(s.y), r: r1(s.r), ...FILL, opacity: s.base });
      return s;
    });
    const CX = 0, CY = -110, R = 64;
    const shot = el(g, 'circle', { cx: CX, cy: CY, r: R, ...FILL, opacity: 0 });
    el(g, 'circle', { cx: CX, cy: CY, r: R, 'stroke-width': 3, opacity: 0.3 });
    const blades = Array.from({ length: 6 }, () => el(g, 'path', { 'stroke-width': 3, opacity: 0.32 }));
    const hits = footfalls({ onePerPlayer: true });
    let shutAt = -99;
    return (ctx) => {
      if (hits(ctx).length) shutAt = ctx.time;
      const t = ctx.calm ? 0 : ctx.time;
      if (!ctx.calm) stars.forEach((s) => s.node.setAttribute('opacity', r2(s.base * (0.55 + 0.45 * Math.sin(t * s.speed + s.ph)))));
      const a = (ctx.time - shutAt) / 0.45;
      const close = !ctx.calm && a >= 0 && a < 1 ? Math.sin(Math.PI * a) : 0;
      const r = lerp(R * 0.8, 2, close); // the opening in the middle
      const turn = close * 0.6;
      // Each blade edge touches a circle of radius r: together they make the iris.
      blades.forEach((blade, k) => {
        const f = (k / 6) * TAU + turn;
        const px = CX + r * Math.cos(f), py = CY + r * Math.sin(f);
        const dx = -Math.sin(f), dy = Math.cos(f);
        const len = Math.sqrt(R * R - r * r);
        blade.setAttribute('d', `M${pt(px - dx * len, py - dy * len)}L${pt(px + dx * len, py + dy * len)}`);
      });
      shot.setAttribute('opacity', r2(a >= 0 && a < 0.6 ? 0.3 * (1 - a / 0.6) : 0));
    };
  }),

  // FEET TO THE SKY · "Gravity just switched off." Pebbles and little things
  // drift up from the ground, turning slowly; landings shake more loose.
  float: prop((g) => {
    const rand = seeded(37);
    const shapes = [
      (s) => ({ d: circlePath(0, 0, s), ...FILL }),
      (s) => ({ d: roundRect(-s, -s, 2 * s, 2 * s, s * 0.3), 'stroke-width': 3 }),
      (s) => ({ d: `M${-s * 1.4},0H${s * 1.4}`, 'stroke-width': 4 }),
      (s) => ({ d: `M0,${-s}L${s},${s * 0.8}H${-s}Z`, 'stroke-width': 3 }),
    ];
    const things = Array.from({ length: 16 }, (_, i) => {
      const size = 3 + rand() * 6;
      return {
        node: el(g, 'path', { ...shapes[i % shapes.length](size), opacity: 0 }),
        x: -450 + rand() * 900, speed: 14 + rand() * 22, offset: rand() * 430, turn: (rand() - 0.5) * 80, ph: rand() * TAU, base: 0.2 + rand() * 0.25,
      };
    });
    const loose = Array.from({ length: 6 }, () => ({ node: el(g, 'path', { d: circlePath(0, 0, 3 + rand() * 3), ...FILL, opacity: 0 }), x: 0, born: -99, drift: 0 }));
    const hits = footfalls();
    let next = 0;
    return (ctx) => {
      const t = ctx.calm ? 10 : ctx.time;
      things.forEach((th) => {
        const y = GROUND_Y - ((t * th.speed + th.offset) % 430);
        const fade = clamp01((GROUND_Y - y) / 40) * clamp01((y - TOP) / 60);
        set(th.node, { transform: `translate(${pt(th.x + 10 * Math.sin(t * 0.8 + th.ph), y)}) rotate(${r1(t * th.turn)})`, opacity: r2(th.base * fade) });
      });
      hits(ctx).forEach((h) => Object.assign(loose[next++ % loose.length], { x: h.x, born: ctx.time, drift: (rand() - 0.5) * 40 }));
      loose.forEach((l) => {
        const a = (ctx.time - l.born) / 3;
        if (a < 0 || a > 1) return hide(l.node);
        set(l.node, { transform: `translate(${pt(l.x + l.drift * a, GROUND_Y - 4 - 160 * easeOut(a) - 30 * a)})`, opacity: r2(0.4 * (1 - a)) });
      });
    };
  }),

  // FEET TO THE SKY · "The sky is the floor now." A second ground hangs at the
  // top, upside down. Footprints walk across it, and each landing leaves a
  // print up there, right above the foot.
  upsideDown: prop((g) => {
    const CEIL = -232;
    const rand = seeded(43);
    el(g, 'rect', { x: -W, y: TOP, width: 2 * W, height: CEIL - TOP, ...FILL, opacity: 0.07 });
    el(g, 'path', { d: `M${-W},${CEIL}H${W}`, 'stroke-width': 3, opacity: 0.35 });
    let tufts = '';
    for (let x = -460; x < W; x += 50 + rand() * 60) tufts += `M${pt(x, CEIL)}l-4,10M${pt(x + 4, CEIL)}l2,13M${pt(x + 8, CEIL)}l5,9`;
    el(g, 'path', { d: tufts, 'stroke-width': 2, opacity: 0.25 });
    // A footprint seen from above, toes pointing right: ball of the foot plus heel.
    const PRINT = 'M-2,-6C6,-8 12,-5 12,0C12,5 6,7 -2,5C-5,4 -5,-5 -2,-6Z' + circlePath(-10, 0, 4.5);
    const prints = Array.from({ length: 16 }, () => ({ node: el(g, 'path', { d: PRINT, ...FILL, opacity: 0 }), x: 0, y: 0, dir: 1, born: -99, life: 4 }));
    const thump = el(g, 'ellipse', { 'stroke-width': 2, opacity: 0 });
    const hits = footfalls();
    let next = 0;
    let walkerX = -440, walkerDir = 1, stepTimer = 0, side = 0, lastPrint = null;
    const place = (x, y, dir, time, life) => {
      lastPrint = Object.assign(prints[next++ % prints.length], { x, y, dir, born: time, life });
    };
    let stillDone = false;
    return (ctx) => {
      if (ctx.calm && !stillDone) {
        stillDone = true;
        for (let i = 0; i < 8; i++) place(-300 + i * 70, CEIL + (i % 2 ? 20 : 10), 1, 0, 1e9);
      }
      if (!ctx.calm && (stepTimer -= ctx.dt) <= 0) {
        stepTimer = 0.55;
        walkerX += 52 * walkerDir;
        if (Math.abs(walkerX) > 440) walkerDir *= -1;
        side = 1 - side;
        place(walkerX, CEIL + (side ? 20 : 10), walkerDir, ctx.time, 3.5);
      }
      hits(ctx).forEach((h) => place(h.x, CEIL + 15, playerOf(ctx, h.player).facing, ctx.time, 5));
      prints.forEach((p) => {
        const a = ctx.time - p.born;
        if (a < 0 || a > p.life) return hide(p.node);
        const pop = 1 + 0.5 * (1 - easeOut(a / 0.25));
        set(p.node, { transform: `translate(${pt(p.x, p.y)}) scale(${r2(p.dir * pop)},${r2(-pop)})`, opacity: r2(0.45 * clamp01((p.life - a) / 1.5)) });
      });
      // A small ring where the latest step lands ("footsteps from above").
      const a = lastPrint ? (ctx.time - lastPrint.born) / 0.5 : 2;
      if (!ctx.calm && a >= 0 && a < 1) set(thump, { cx: r1(lastPrint.x), cy: r1(lastPrint.y), rx: r1(10 + 30 * a), ry: r1(4 + 10 * a), opacity: r2(0.35 * (1 - a)) });
      else hide(thump);
    };
  }),

  // HEEL CLICK · "It's time to go home." A little house draws itself between
  // the players; the heel click switches its window light on, with a chime ring.
  home: prop((g) => {
    const house = el(g, 'path', {
      d: `M-90,${GROUND_Y}V40L0,-36L90,40V${GROUND_Y}ZM-18,${GROUND_Y}V84H18V${GROUND_Y}M48,1V-34H66V15`,
      pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-width': 5, opacity: 0.4,
    });
    const spill = el(g, 'ellipse', { cx: 46, cy: GROUND_Y + 14, rx: 80, ry: 10, ...FILL, opacity: 0 });
    const pane = el(g, 'rect', { x: 32, y: 48, width: 30, height: 28, rx: 3, ...FILL, opacity: 0 });
    el(g, 'path', { d: 'M32,48h30v28h-30ZM47,48V76M32,62H62', 'stroke-width': 3, opacity: 0.35 });
    const chime = el(g, 'circle', { cx: 47, cy: 62, 'stroke-width': 2.5, opacity: 0 });
    const smoke = [0, 1, 2].map(() => el(g, 'circle', { ...FILL, opacity: 0 }));
    const hits = footfalls({ onePerPlayer: true });
    let lit = 0;
    let rungAt = -99;
    let on = false;
    return (ctx) => {
      if (hits(ctx).length) {
        on = true;
        rungAt = ctx.time;
      }
      const drawn = ctx.calm ? 1 : easeOut(ctx.time / 2.4);
      house.setAttribute('stroke-dashoffset', r2(1 - drawn));
      lit = ctx.calm ? 1 : approach(lit, on ? 1 : 0, 6, ctx.dt);
      const ring = (ctx.time - rungAt) / 0.9;
      const bump = !ctx.calm && ring >= 0 && ring < 1 ? 1 - ring : 0;
      pane.setAttribute('opacity', r2(lit * (0.4 + 0.2 * bump)));
      spill.setAttribute('opacity', r2(lit * 0.1));
      if (bump > 0) set(chime, { r: r1(20 + 70 * (1 - bump)), opacity: r2(0.4 * bump) });
      else hide(chime);
      smoke.forEach((s, i) => {
        const k = ctx.calm ? i / 3 + 0.15 : (ctx.time * 0.3 + i / 3) % 1;
        set(s, { cx: r1(57 - 20 * k), cy: r1(-42 - 70 * k), r: r1(5 + 10 * k), opacity: r2(0.25 * lit * Math.sin(Math.PI * k)) });
      });
    };
  }),

  // HEEL CLICK · "You wake up from the dream." An alarm clock rings and
  // wobbles, then the dream around it blurs and fades. A heel click rings it again.
  wake: prop((g) => {
    const id = `story-props-blur-${++uid}`;
    const filter = el(g, 'filter', { id, x: '-50%', y: '-50%', width: '200%', height: '200%' });
    const blur = el(filter, 'feGaussianBlur', { stdDeviation: 0 });
    const dream = el(g, 'g', {});
    [[-280, -110, 100], [270, -50, 130], [60, -220, 70]].forEach(([cx, cy, r]) => el(dream, 'circle', { cx, cy, r, ...FILL, opacity: 0.06 }));
    const clock = el(dream, 'g', { opacity: 0.45 });
    el(clock, 'path', { d: circlePath(-30, -48, 14) + circlePath(30, -48, 14), ...FILL });
    el(clock, 'circle', { cx: 0, cy: 0, r: 48, 'stroke-width': 7 });
    el(clock, 'path', { d: 'M0,0V-30M0,0L22,9M-28,40L-40,58M28,40L40,58M-8,-60H8', 'stroke-width': 5 });
    const buzz = el(clock, 'path', { d: 'M-64,-22l-12,-8M-68,0h-14M-64,22l-12,8M64,-22l12,-8M68,0h14M64,22l12,8', 'stroke-width': 4, opacity: 0 });
    const hits = footfalls({ onePerPlayer: true });
    let rangAt = 0;
    return (ctx) => {
      if (hits(ctx).length) rangAt = ctx.time;
      const since = ctx.calm ? 4 : ctx.time - rangAt;
      const ring = clamp01(1 - since / 3);
      const fade = ctx.calm ? 0.35 : smooth((since - 3) / 3.5);
      const wobble = 9 * ring * Math.sin(ctx.time * 38);
      clock.setAttribute('transform', `translate(${r1(2 * ring * Math.sin(ctx.time * 53))},-110) rotate(${r1(wobble)})`);
      buzz.setAttribute('opacity', r2(ring * (0.5 + 0.5 * Math.sin(ctx.time * 30))));
      dream.setAttribute('opacity', r2(1 - 0.8 * fade));
      blur.setAttribute('stdDeviation', r1(7 * fade));
      if (fade > 0.02) dream.setAttribute('filter', `url(#${id})`);
      else dream.removeAttribute('filter');
    };
  }),

  // HEEL CLICK · "The curtain falls." Two curtains slide in from the sides
  // behind the players and meet; a last little pool of light stays on the
  // floor at the seam, for the bow.
  curtain: prop((g) => {
    const half = (side) => {
      const wrap = el(g, 'g', { transform: `scale(${side},1)` });
      const move = el(wrap, 'g', {});
      const shape = `M${-W - 30},${TOP}H0C-18,-60 -4,80 -10,${GROUND_Y + 40}H${-W - 30}Z`;
      el(move, 'path', { d: shape, ...FILL, opacity: 0.12 });
      el(move, 'path', { d: `M0,${TOP}C-18,-60 -4,80 -10,${GROUND_Y + 40}`, 'stroke-width': 3, opacity: 0.3 });
      let folds = '';
      for (const x of [-100, -200, -300, -400]) folds += `M${x},${TOP + 10}C${x - 12},-40 ${x + 12},60 ${x - 4},${GROUND_Y + 36}`;
      el(move, 'path', { d: folds, 'stroke-width': 2.5, opacity: 0.18 });
      return move;
    };
    const left = half(1);
    const right = half(-1);
    let scallops = `M${-W},${TOP}V-238`;
    for (let x = -W; x < W; x += 80) scallops += `Q${x + 40},-214 ${x + 80},-238`;
    el(g, 'path', { d: `${scallops}V${TOP}Z`, ...FILL, opacity: 0.14 });
    el(g, 'path', { d: scallops.replace(`M${-W},${TOP}V-238`, `M${-W},-238`), 'stroke-width': 3, opacity: 0.3 });
    const pool = el(g, 'ellipse', { cx: 0, cy: GROUND_Y + 6, ry: 9, ...FILL, opacity: 0 });
    const seam = el(g, 'path', { d: `M0,-236V${GROUND_Y}`, 'stroke-width': 3, opacity: 0 });
    const hits = footfalls({ onePerPlayer: true });
    let sway = 0;
    return (ctx) => {
      if (hits(ctx).length) sway = 1;
      sway = approach(sway, 0, 2, ctx.dt);
      const shut = ctx.calm ? 0.92 : smooth((ctx.time - 0.6) / 4);
      const swing = 8 * sway * Math.sin(ctx.time * 9);
      const x = -(1 - shut) * (W + 30);
      left.setAttribute('transform', `translate(${r1(x + swing)},0)`);
      right.setAttribute('transform', `translate(${r1(x - swing)},0)`);
      const end = clamp01((shut - 0.85) / 0.15);
      set(pool, { rx: r1(lerp(170, 60, end)), opacity: r2(0.08 + 0.22 * end) });
      seam.setAttribute('opacity', r2(0.3 * end * (0.8 + 0.2 * Math.sin(ctx.time * 2))));
    };
  }),
};
