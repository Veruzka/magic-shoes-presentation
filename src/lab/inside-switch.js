// The "Show inside" switch under the shoe, and the hardware note shown while the
// shoe is open with the FSR in it. It only sets labState's open/closed;
// lab-shoe.js decides how the shoe moves.
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
  note.textContent = sensorById('fsr').insideNote;

  element.append(button, note);

  function draw() {
    button.setAttribute('aria-checked', String(labState.isOpen()));
    note.classList.toggle('is-shown', labState.isOpen() && labState.isPlaced('fsr'));
  }
  labState.onChange(draw);
  draw();
  return element;
}
