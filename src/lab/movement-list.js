// The movements parts list on the right of the lab, and the picked movement's spec
// card under it (description, chart, rule). A movement can be picked only when a
// placed sensor matches one of its kinds AND zones; otherwise it's greyed out with
// the reason. If its sensor is taken off, the pick is remembered and comes back with it.
import { movements, kindNeeds } from './data/movements.js';
import { sensorById } from './data/sensors.js';
import { zoneById } from './data/zones.js';
import { labState } from './lab-state.js';
import { movementChart } from './movement-chart.js';

// The placed sensor that can detect this movement, if any.
const matchingSensor = (movement) =>
  labState
    .placedSensors()
    .map(sensorById)
    .find((sensor) => movement.kinds?.includes(sensor.kind) && movement.zones?.includes(sensor.zone));

function needs(movement) {
  const what = kindNeeds[movement.kinds?.[0]] ?? 'a sensor';
  const where = zoneById(movement.zones?.[0])?.name;
  return `Needs ${what}${where ? ` at the ${where}` : ''}`;
}

const MARKER_SECONDS = 500; // the sensor marker's placing motion: the card waits for it

function specCard(movement) {
  const card = document.createElement('div');
  card.className = 'lab-card';
  card.dataset.movement = movement.id;
  // Slim (illustrator review, piece 4): the one-line description and the chart. The
  // rule's other numbers (rise, cooldown) stay in movements.js.
  card.innerHTML = `<p class="lab-card__text">${movement.description}</p>`;
  card.append(movementChart(movement));
  return card;
}

export function movementList() {
  const element = document.createElement('section');
  element.className = 'lab-list lab-list--movements';
  element.innerHTML = '<h2 class="lab-list__title">Movements</h2>';
  const list = document.createElement('ol');
  list.className = 'lab-list__items';

  const rows = movements.map((movement, i) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'lab-list__item';
    button.innerHTML = `
      <span class="lab-list__number">${String(i + 1).padStart(2, '0')}</span>
      <span class="lab-list__name">${movement.name}</span>
      <span class="lab-list__meta"></span>
      ${movement.status === 'soon' ? '<span class="lab-list__soon">Soon</span>' : ''}`;
    if (movement.status === 'soon') button.disabled = true;
    else button.addEventListener('click', () => labState.pickMovement(movement.id));
    item.append(button);
    list.append(item);
    return { movement, button, meta: button.querySelector('.lab-list__meta') };
  });

  const cards = new Map(
    movements.filter((movement) => movement.status === 'active' && movement.chart).map((movement) => [movement.id, specCard(movement)]),
  );
  element.append(list, ...cards.values());

  let shown = null; // the card showing now
  const drawn = new Set(); // cards whose line has drawn once (it never replays)

  function draw() {
    for (const { movement, button, meta } of rows) {
      const available = Boolean(matchingSensor(movement));
      // Available: what it uses and where ("PRESSURE · HEEL"). Otherwise: what it needs.
      meta.textContent = available ? `${movement.kinds[0]} · ${zoneById(movement.zones[0])?.name}` : needs(movement);
      if (movement.status === 'soon') continue;
      button.classList.toggle('is-unavailable', !available);
      button.setAttribute('aria-disabled', String(!available));
      button.setAttribute('aria-pressed', String(labState.movement() === movement.id && available));
    }

    // The spec card: shown for the picked movement while its sensor is placed.
    const picked = labState.movement();
    const pickedMovement = movements.find((movement) => movement.id === picked);
    const next = pickedMovement && matchingSensor(pickedMovement) ? cards.get(picked) : null;
    if (next === shown) return;
    if (shown) shown.classList.remove('is-shown', 'is-drawing', 'is-returning');
    if (next) {
      const firstTime = !drawn.has(picked);
      drawn.add(picked);
      // First pick: the line draws on. Coming back with its sensor: no replay, it fades
      // in once the sensor's marker has finished (never two motions at once).
      next.classList.add('is-shown', firstTime ? 'is-drawing' : 'is-returning');
      next.style.setProperty('--wait', firstTime ? '0ms' : `${MARKER_SECONDS}ms`);
    }
    shown = next;
  }

  // Unavailable rows look disabled but stay focusable, so their reason can be read.
  list.addEventListener('click', (event) => {
    if (event.target.closest('.is-unavailable')) event.stopImmediatePropagation();
  }, true);

  labState.onChange(draw);
  draw();
  return element;
}
