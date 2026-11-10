// Prototype tool: the frosted "Style lab" card (top-right corner) for flipping
// between options — backgrounds, shoe styles, … — while we decide which we like.
// Remove it when we've chosen.
//
//   switcherPanel(heading, ...rows)  the glass card, with a small heading on top
//   optionSwitcher({...})            one row: a name on the left, a segmented pill on the right
import './option-switcher.css';

// title     the row's name, e.g. "Background"
// options   list of { id, label, … }
// current   the option that's showing right now
// onPick    called with the option whenever a different one is clicked
export function optionSwitcher({ title, options, current, onPick }) {
  const row = document.createElement('div');
  row.className = 'option-switcher';

  const label = document.createElement('span');
  label.className = 'option-switcher__title';
  label.textContent = title;

  // The segmented pill: options side by side, the chosen one on a soft white "thumb".
  const track = document.createElement('div');
  track.className = 'option-switcher__track';
  track.setAttribute('role', 'group');
  track.setAttribute('aria-label', title);

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
    track.append(button);
    return { button, id: option.id };
  });

  function markSelected() {
    buttons.forEach(({ button, id }) => button.setAttribute('aria-pressed', id === currentId));
  }

  markSelected();
  row.append(label, track);
  return row;
}

// The frosted glass card that holds the rows, with a small heading and accent dot.
export function switcherPanel(heading, ...rows) {
  const card = document.createElement('section');
  card.className = 'switcher-panel';
  card.setAttribute('aria-label', heading);
  card.innerHTML = `
    <header class="switcher-panel__header">
      <h2 class="switcher-panel__heading">${heading}</h2>
      <span class="switcher-panel__dot" aria-hidden="true"></span>
    </header>
  `;
  card.append(...rows);
  return card;
}
