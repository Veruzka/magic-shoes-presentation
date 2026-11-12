// The little chart on a movement's spec card: what the movement looks like in the
// strength readings (0–1) over one second. It's illustrative, drawn from the
// movement's `chart` and `rule` numbers, not from real data. Ink only (red stays
// meaning "the sensor"); illustrator review, 2026-11-12.
const SVG = 'http://www.w3.org/2000/svg';
const W = 300;
const H = 170;
const PLOT = { left: 30, right: 290, top: 26, bottom: 140 }; // the drawing area
const x = (seconds) => PLOT.left + seconds * (PLOT.right - PLOT.left);
const y = (strength) => PLOT.bottom - strength * (PLOT.bottom - PLOT.top);

function svg(tag, attributes = {}, text) {
  const node = document.createElementNS(SVG, tag);
  for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
  if (text) node.textContent = text;
  return node;
}

const smooth = (t) => t * t * (3 - 2 * t);

// The illustrative stomp, in strength 0–1 at a time in seconds.
function stompAt(t, { contact, riseMs, top, standing, lift }) {
  const rise = riseMs / 1000;
  if (t < contact) return 0.01;
  if (t < contact + rise) return 0.01 + (top - 0.01) * smooth((t - contact) / rise); // the jump
  if (t < contact + 0.045) return top + 0.02 * Math.sin(((t - contact - rise) / 0.035) * Math.PI); // flat top
  if (t < lift) return standing + (top - standing) * Math.exp(-(t - contact - 0.045) / 0.05); // settles
  if (t < lift + 0.08) return standing * (1 - smooth((t - lift) / 0.08)); // the foot lifts
  return 0.01;
}

export function movementChart(movement) {
  const { chart, rule } = movement;
  const element = svg('svg', { class: 'lab-chart', viewBox: `0 0 ${W} ${H}`, role: 'img' });
  element.setAttribute('aria-label', `${movement.name}: what it looks like in the readings (illustrative)`);

  // Axes: a hairline baseline and side line, ticks at 0, 0.5, 1 and 0 s, 1 s.
  const frame = svg('g', { class: 'lab-chart__frame' });
  frame.append(svg('path', { class: 'lab-chart__axis', d: `M ${PLOT.left} ${PLOT.top} V ${PLOT.bottom} H ${PLOT.right}` }));
  for (const value of [0, 0.5, 1]) frame.append(svg('text', { class: 'lab-chart__tick', x: PLOT.left - 6, y: y(value), 'text-anchor': 'end' }, String(value)));
  frame.append(svg('text', { class: 'lab-chart__tick', x: PLOT.left, y: PLOT.bottom + 16, 'text-anchor': 'middle' }, '0'));
  frame.append(svg('text', { class: 'lab-chart__tick', x: PLOT.right, y: PLOT.bottom + 16, 'text-anchor': 'end' }, '1 s'));
  frame.append(svg('text', { class: 'lab-chart__tick', x: PLOT.right, y: 10, 'text-anchor': 'end' }, 'Illustrative'));

  // The peak window: a light sand band, PEAK · 30 MS.
  const windowEnd = chart.contact + rule.peakMs / 1000;
  frame.append(svg('rect', { class: 'lab-chart__window', x: x(chart.contact), y: PLOT.top, width: x(windowEnd) - x(chart.contact), height: PLOT.bottom - PLOT.top }));
  frame.append(svg('text', { class: 'lab-chart__tick', x: x(windowEnd) + 4, y: PLOT.top + 6 }, `Peak · ${rule.peakMs} ms`));

  // The thresholds: fine faded dashes, START above its line and RE-ARM below its own.
  frame.append(svg('path', { class: 'lab-chart__threshold', d: `M ${PLOT.left} ${y(rule.start)} H ${PLOT.right}` }));
  frame.append(svg('path', { class: 'lab-chart__threshold', d: `M ${PLOT.left} ${y(rule.rearm)} H ${PLOT.right}` }));
  frame.append(svg('text', { class: 'lab-chart__tick', x: PLOT.right, y: y(rule.start) - 6, 'text-anchor': 'end' }, `Start ${rule.start}`));
  frame.append(svg('text', { class: 'lab-chart__tick', x: PLOT.right, y: y(rule.rearm) + 10, 'text-anchor': 'end' }, `Re-arm ${rule.rearm}`));
  element.append(frame);

  // The strength line, sampled every 2 ms, and a small ink dot at the peak.
  const points = [];
  let peak = { t: 0, v: 0 };
  for (let ms = 0; ms <= 1000; ms += 2) {
    const v = stompAt(ms / 1000, chart);
    points.push(`${x(ms / 1000).toFixed(1)} ${y(v).toFixed(1)}`);
    if (v > peak.v) peak = { t: ms / 1000, v };
  }
  element.append(svg('path', { class: 'lab-chart__line', d: `M ${points.join(' L ')}`, pathLength: 1 }));
  element.append(svg('circle', { class: 'lab-chart__peak', cx: x(peak.t), cy: y(peak.v), r: 2.6 }));
  return element;
}
