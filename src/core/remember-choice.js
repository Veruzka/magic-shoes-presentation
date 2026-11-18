// Remembers which option you picked last (e.g. which background or shoe),
// in this browser only, so a reload shows the same thing.

const PREFIX = 'magic-shoes:';

// Returns the option picked last time for `name`. If nothing was picked yet,
// the option with id `fallbackId`, or else the first option.
export function loadChoice(name, options, fallbackId) {
  let savedId = null;
  try {
    savedId = localStorage.getItem(PREFIX + name);
  } catch {
    // Browser storage can be blocked; just fall back to the first option.
  }
  return options.find((option) => option.id === savedId) ?? options.find((option) => option.id === fallbackId) ?? options[0];
}

export function saveChoice(name, option) {
  try {
    localStorage.setItem(PREFIX + name, option.id);
  } catch {
    // Not remembered — fine for a prototype.
  }
}
