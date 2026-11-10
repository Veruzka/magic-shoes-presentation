// One label for a shoe part: a signature-style title, a short description and
// a hand-drawn arrow pointing at the part (like the labels on a product sheet).
// The label lives inside its part, so it moves with it; `show(0…1)` fades the
// text in and draws the arrow out.
//
// Wording and positions: src/shoes/sketch-labels.js
import './part-labels.css';

const DRAWING = { width: 1356, height: 846 }; // the Sketch drawing's size
const percent = (value, size) => `${(value / size) * 100}%`;

// note    one entry from sketch-labels.js
// points  named spots found while splitting the drawing (e.g. { sensor: { x, y } })
export function partLabel(note, points) {
  const element = document.createElement('div');
  element.className = 'part-note';

  // The text: title + description.
  const text = document.createElement('div');
  text.className = `part-note__text part-note__text--${note.align}`;
  const [x, y] = note.at;
  text.style.top = percent(y, DRAWING.height);
  if (note.align === 'right') text.style.right = percent(DRAWING.width - x, DRAWING.width);
  else text.style.left = percent(x, DRAWING.width);
  text.innerHTML = `
    <p class="part-note__title">${note.title}</p>
    <p class="part-note__description">${note.text}</p>
  `;

  // The arrow: a gently curved line and a small open arrowhead.
  const target = note.arrow.to === 'sensor' ? points.sensor : null;
  const [toX, toY] = target ? [target.x, target.y] : note.arrow.to;
  const [fromX, fromY] = note.arrow.from;
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;
  const length = Math.hypot(toX - fromX, toY - fromY) || 1;
  // Bend: push the middle of the line sideways (perpendicular to it).
  const bendX = midX + (-(toY - fromY) / length) * note.arrow.bend;
  const bendY = midY + ((toX - fromX) / length) * note.arrow.bend;
  // Arrowhead: two short strokes back from the tip, along the curve's final direction.
  const angle = Math.atan2(toY - bendY, toX - bendX);
  const head = 22;
  const wing = (side) =>
    `${toX - head * Math.cos(angle + side * 0.45)},${toY - head * Math.sin(angle + side * 0.45)}`;

  element.innerHTML = `
    <svg class="part-note__arrow" viewBox="0 0 ${DRAWING.width} ${DRAWING.height}" preserveAspectRatio="none" aria-hidden="true">
      <path d="M ${fromX} ${fromY} Q ${bendX} ${bendY} ${toX} ${toY}" pathLength="1" />
      <path d="M ${wing(1)} L ${toX} ${toY} L ${wing(-1)}" class="part-note__head" />
    </svg>
  `;
  element.append(text);

  // 0 = hidden, 1 = fully shown (arrow drawn out, text faded in).
  function show(amount) {
    element.style.opacity = amount;
    element.style.setProperty('--drawn', amount);
  }
  show(0);

  return { element, show };
}
