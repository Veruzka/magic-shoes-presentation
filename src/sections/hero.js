// Hero section: layered scene that separates as you scroll.
// Placeholder shapes for now — swap them for real artwork later.
import '../styles/hero.css';

export function hero() {
  const section = document.createElement('section');
  section.className = 'hero';
  section.innerHTML = `
    <div class="hero__layer hero__sky" data-speed="0.5" aria-hidden="true">
      <span class="hero__star" style="--x: 12%; --y: 18%"></span>
      <span class="hero__star" style="--x: 78%; --y: 12%"></span>
      <span class="hero__star" style="--x: 64%; --y: 30%"></span>
      <span class="hero__star" style="--x: 28%; --y: 36%"></span>
      <span class="hero__star" style="--x: 90%; --y: 42%"></span>
    </div>
    <div class="hero__layer hero__hills hero__hills--far" data-speed="0.3" aria-hidden="true"></div>
    <div class="hero__layer hero__hills hero__hills--near" data-speed="0.15" aria-hidden="true"></div>

    <div class="hero__content" data-speed="0.25">
      <p class="hero__eyebrow">Step into something</p>
      <h1 class="hero__title">Magic Shoes</h1>
      <p class="hero__hint">Scroll to begin ↓</p>
    </div>
  `;
  return section;
}
