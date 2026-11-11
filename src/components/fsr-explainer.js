// Short plain-English texts that appear on the left in chapter 4, one after
// the other, each fading and rising in. Reusable for any part.
//
//   const text = fsrExplainer([{ title, body }, …]);
//   text.show([0..1, …], rise);  // each block's progress; rise = px it travels up
import './fsr-explainer.css';

export function fsrExplainer(blocks) {
  const element = document.createElement('div');
  element.className = 'fsr-explainer';

  const items = blocks.map(({ title, body }) => {
    const block = document.createElement('div');
    block.className = 'fsr-explainer__block';
    const heading = document.createElement('h2');
    heading.className = 'fsr-explainer__title';
    heading.textContent = title;
    const text = document.createElement('p');
    text.className = 'fsr-explainer__body';
    text.textContent = body;
    block.append(heading, text);
    element.append(block);
    return block;
  });

  function show(progress, rise = 14) {
    progress.forEach((p, i) => {
      items[i].style.opacity = p;
      items[i].style.translate = `0 ${(1 - p) * rise}px`;
    });
    element.hidden = progress.every((p) => p <= 0);
  }

  show(blocks.map(() => 0));
  return { element, show };
}
