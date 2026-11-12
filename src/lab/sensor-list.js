// The sensor parts list on the left of the lab, like the parts list on a
// technical drawing: "01 FSR · PRESSURE · HEEL". Click an active sensor to put
// it on the shoe; click again to take it off. 'soon' sensors are greyed out.
import { sensors } from './data/sensors.js';
import { zoneById } from './data/zones.js';
import { labState } from './lab-state.js';

export function sensorList() {
  const element = document.createElement('section');
  element.className = 'lab-list';
  element.innerHTML = '<h2 class="lab-list__title">Sensors</h2>';
  const list = document.createElement('ol');
  list.className = 'lab-list__items';

  const buttons = sensors.map((sensor, i) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'lab-list__item';
    const where = zoneById(sensor.zone)?.name ?? sensor.zone;
    button.innerHTML = `
      <span class="lab-list__number">${String(i + 1).padStart(2, '0')}</span>
      <span class="lab-list__name">${sensor.name}</span>
      <span class="lab-list__meta">${sensor.kind} · ${where}</span>
      ${sensor.status === 'soon' ? '<span class="lab-list__soon">Soon</span>' : ''}`;
    if (sensor.status === 'soon') {
      button.disabled = true;
    } else {
      button.addEventListener('click', () => labState.toggleSensor(sensor.id));
    }
    item.append(button);
    list.append(item);
    return { sensor, button };
  });
  element.append(list);

  function draw() {
    for (const { sensor, button } of buttons) {
      if (sensor.status === 'soon') continue;
      button.setAttribute('aria-pressed', String(labState.isPlaced(sensor.id)));
    }
  }
  labState.onChange(draw);
  draw();
  return element;
}
