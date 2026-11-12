// The "Show inside" switch under the shoe, and the hardware notes shown while the
// shoe is open: one per placed sensor that has an `insideNote` (sensors.js).
// It only sets labState's open/closed; lab-shoe.js decides how the shoe moves.
import { sensorById } from './data/sensors.js';
import { labState } from './lab-state.js';

export function insideSwitch() {
  const element = document.createElement('div');
  element.className = 'lab-inside';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'lab-inside__switch';
  button.setAttribute('role', 'switch');
  button.innerHTML = '<span class="lab-inside__track" aria-hidden="true"><span class="lab-inside__thumb"></span></span>Show inside';
  button.addEventListener('click', () => labState.setOpen(!labState.isOpen()));

  const note = document.createElement('p');
  note.className = 'lab-inside__note';

  element.append(button, note);

  function draw() {
    button.setAttribute('aria-checked', String(labState.isOpen()));
    const notes = labState.placedSensors().map(sensorById).map((sensor) => sensor?.insideNote).filter(Boolean);
    if (notes.length) note.textContent = notes.join(' ');
    note.classList.toggle('is-shown', labState.isOpen() && notes.length > 0);
  }
  labState.onChange(draw);
  draw();
  return element;
}
