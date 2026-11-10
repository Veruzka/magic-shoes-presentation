// Remembers which option you picked last (e.g. which background or shoe),
// in this browser only, so a reload shows the same thing.

const PREFIX = 'magic-shoes:';

// Returns the option picked last time for `name`, or the first option.
export function loadChoice(name, options) {
  let savedId = null;
  try {
    savedId = localStorage.getItem(PREFIX + name);
  } catch {
    // Browser storage can be blocked; just fall back to the first option.
  }
  return options.find((option) => option.id === savedId) ?? options[0];
}

export function saveChoice(name, option) {
  try {
    localStorage.setItem(PREFIX + name, option.id);
  } catch {
    // Not remembered — fine for a prototype.
  }
}
