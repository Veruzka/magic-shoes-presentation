// How long each "chapter" of the pinned hero lasts, in screen-heights of
// scrolling. The page's height and the progress of each chapter both come
// from these numbers, so change them here only.
//
//   fan   chapter 1: the shoe's parts fan out, then the labels appear
//   exit  chapter 2: the FSR lifts out, turns to face you and grows to the
//         centre while the shoe scene scrolls away (see src/shoes/fsr-transition.js)
//   reveal chapter 3: the big FSR turns like a door and half of it becomes a
//         sketch, with callouts (see src/shoes/fsr-reveal.js)
export const heroTimeline = {
  fan: 1.6,
  exit: 1.8,
  reveal: 1.6,
};

// Splits the hero's overall scroll (0 → 1) into each chapter's own 0 → 1.
export function chapterProgress(overall, hasExit) {
  const { fan, exit, reveal } = heroTimeline;
  const total = fan + (hasExit ? exit + reveal : 0);
  const scrolled = overall * total;
  const clamp01 = (n) => Math.min(Math.max(n, 0), 1);
  return {
    fan: clamp01(scrolled / fan),
    exit: hasExit ? clamp01((scrolled - fan) / exit) : 0,
    reveal: hasExit ? clamp01((scrolled - fan - exit) / reveal) : 0,
  };
}

// The extra scroll room the pinned hero needs, as a CSS length.
export function pinLength(hasExit) {
  const { fan, exit, reveal } = heroTimeline;
  return `${(fan + (hasExit ? exit + reveal : 0)) * 100}vh`;
}
