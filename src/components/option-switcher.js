// Prototype tool: a small pill for flipping between options (backgrounds,
// shoe styles, …) while we decide which we like. Remove it when we've chosen.
import './option-switcher.css';

// title     text shown at the start of the pill, e.g. "Background"
// options   list of { id, label, … }
// current   the option that's showing right now
// onPick    called with the option whenever a different one is clicked
export function optionSwitcher({ title, options, current, onPick }) {
  const box = document.createElement('div');
  box.className = 'option-switcher';
  box.setAttribute('role', 'group');
  box.setAttribute('aria-label', title);

  const label = document.createElement('span');
  label.className = 'option-switcher__title';
  label.textContent = title;
  box.append(label);

  let currentId = current.id;

  const buttons = options.map((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'option-switcher__option';
    button.textContent = option.label;
    button.addEventListener('click', () => {
      if (option.id === currentId) return;
      currentId = option.id;
      markSelected();
      onPick(option);
    });
    box.append(button);
    return { button, id: option.id };
  });

  function markSelected() {
    buttons.forEach(({ button, id }) => button.setAttribute('aria-pressed', id === currentId));
  }

  markSelected();
  return box;
}

// Holds all switchers, stacked in the top-right corner.
export function switcherPanel(...switchers) {
  const panel = document.createElement('div');
  panel.className = 'switcher-panel';
  panel.append(...switchers);
  return panel;
}
