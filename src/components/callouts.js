// Camera-style callout labels (like an exploded-view illustration): a thin
// leader line from a point on the object to a small uppercase label, all
// labels in one column. Reusable for any part.
//
//   const labels = callouts(['Active area', 'Connector']);
//   labels.place([{ point: {x, y}, label: {x, y} }, …]);  // screen px, every frame it moves
//   labels.show([0..1, …]);  // each one's progress: the line draws, then the text fades in
import './callouts.css';

const SVG = 'http://www.w3.org/2000/svg';

export function callouts(texts) {
  const element = document.createElement('div');
  element.className = 'callouts';
  element.setAttribute('aria-hidden', 'true');
  const svg = document.createElementNS(SVG, 'svg');
  svg.classList.add('callouts__lines');
  element.append(svg);

  const items = texts.map((text) => {
    const path = document.createElementNS(SVG, 'path');
    path.setAttribute('pathLength', '1'); // so "how much is drawn" is simply 0 → 1
    svg.append(path);
    const label = document.createElement('span');
    label.className = 'callouts__label';
    label.textContent = text;
    element.append(label);
    return { path, label };
  });

  function place(positions) {
    positions.forEach(({ point, label }, i) => {
      const { path, label: text } = items[i];
      // From the point, a short slant to the label's height, then straight across.
      const knee = { x: point.x + Math.min(28, (label.x - point.x) / 3), y: label.y };
      path.setAttribute('d', `M${point.x},${point.y} L${knee.x},${knee.y} L${label.x - 10},${label.y}`);
      text.style.translate = `${label.x}px ${label.y}px`;
    });
  }

  function show(progress) {
    progress.forEach((p, i) => {
      const { path, label } = items[i];
      const drawn = Math.min(p / 0.6, 1); // the line draws in the first 60%…
      const text = Math.max((p - 0.45) / 0.55, 0); // …and the text fades in as it lands
      path.style.strokeDashoffset = 1 - drawn;
      path.style.opacity = drawn > 0 ? 1 : 0;
      label.style.opacity = text;
    });
    element.hidden = progress.every((p) => p <= 0);
  }

  show(texts.map(() => 0));
  return { element, place, show };
}
