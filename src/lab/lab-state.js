// "Your picks" in the lab: which sensors are on the shoe, whether the shoe is shown
// open ("Show inside"), the picked movement and the picked sound. Other parts
// listen with onChange and redraw. The state only says what's chosen; each view
// decides how to animate it (so a 3D shoe can follow the same switch later).
const placed = new Set();
const listeners = new Set();
let open = false;
let movement = null; // the picked movement's id; kept even while its sensor is off
let sound = null; // the picked sound's id


const notify = () => listeners.forEach((listener) => listener());

export const labState = {
  isPlaced: (sensorId) => placed.has(sensorId),
  placedSensors: () => [...placed],
  toggleSensor(sensorId) {
    if (placed.has(sensorId)) placed.delete(sensorId);
    else placed.add(sensorId);
    notify();
  },
  movement: () => movement,
  pickMovement(id) {
    movement = movement === id ? null : id; // picking it again un-picks it
    notify();
  },
  sound: () => sound,
  pickSound(id) {
    sound = sound === id ? null : id;
    notify();
  },
  isOpen: () => open,
  setOpen(value) {
    open = value;
    notify();
  },
  onChange(listener) {
    listeners.add(listener);
  },
};
