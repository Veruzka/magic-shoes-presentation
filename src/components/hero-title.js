// The big title behind the shoe ("Magic Shoes"): huge, heavy, slightly condensed
// letters in a soft tone, centred across the top half of the first screen, with
// the shoe floating in front of their lower part. Its colour comes from the
// background (see `inkColors.title` in each file in src/backgrounds/).
import './hero-title.css';

export function heroTitle(text) {
  const title = document.createElement('h1');
  title.className = 'hero-title';
  title.textContent = text;
  return title;
}
