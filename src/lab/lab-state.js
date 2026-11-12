// "Your picks" in the lab: which sensors are on the shoe, and whether the shoe is
// shown open ("Show inside"). Later also the movement and the sound. Other parts
// listen with onChange and redraw. The state only says what's chosen; each view
// decides how to animate it (so a 3D shoe can follow the same switch later).
const placed = new Set();
const listeners = new Set();
let open = false;

const notify = () => listeners.forEach((listener) => listener());

export const labState = {
  isPlaced: (sensorId) => placed.has(sensorId),
  placedSensors: () => [...placed],
  toggleSensor(sensorId) {
    if (placed.has(sensorId)) placed.delete(sensorId);
    else placed.add(sensorId);
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
