// The small "i" button (bottom-right corner) and the panel it opens.
//
// The panel shows two docs straight from the docs/ folder, so the app and the
// docs never disagree:
//   docs/architecture.md         → the system diagram + what each part does
//   docs/design-improvements.md  → planned design improvements
// To change what the panel says, edit those docs — not this file.
//
// The docs, the Markdown reader (marked) and the diagram drawer (mermaid) are
// only downloaded the first time someone clicks "i", so the page stays fast.
import './info-panel.css';

export function infoButton() {
  const wrapper = document.createElement('div');
  wrapper.className = 'info';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'info__button';
  button.setAttribute('aria-label', 'How this app is built');
  button.setAttribute('aria-expanded', 'false');
  button.textContent = 'i';

  const panel = document.createElement('aside');
  panel.className = 'info__panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'How this app is built');
  panel.hidden = true;
  panel.innerHTML = `
    <button type="button" class="info__close" aria-label="Close">✕</button>
    <div class="info__content"><p class="info__loading">Loading…</p></div>
  `;

  const content = panel.querySelector('.info__content');
  const closeButton = panel.querySelector('.info__close');
  let loaded = false;

  async function open() {
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add('is-open'));
    button.setAttribute('aria-expanded', 'true');
    closeButton.focus();
    if (!loaded) {
      loaded = true;
      try {
        await fillFromDocs(content);
      } catch (error) {
        content.innerHTML = '<p>Couldn’t load the docs. Check the docs/ folder.</p>';
        console.error(error);
      }
    }
  }

  function close() {
    panel.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
    setTimeout(() => (panel.hidden = true), 250);
    button.focus();
  }

  button.addEventListener('click', () => (panel.hidden ? open() : close()));
  closeButton.addEventListener('click', close);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) close();
  });

  wrapper.append(button, panel);
  return wrapper;
}

// Reads the two docs, turns them into page content, and draws the diagram.
async function fillFromDocs(content) {
  const [{ marked }, { default: mermaid }, architecture, improvements] = await Promise.all([
    import('marked'),
    import('mermaid'),
    import('../../docs/architecture.md?raw'),
    import('../../docs/design-improvements.md?raw'),
  ]);

  content.innerHTML = `
    <section class="info__doc">${marked.parse(architecture.default)}</section>
    <section class="info__doc">${marked.parse(improvements.default)}</section>
    <p class="info__source">From <code>docs/architecture.md</code> and <code>docs/design-improvements.md</code>.</p>
  `;

  // Diagram colours follow the app's palette (see docs/design-spec.md).
  const styles = getComputedStyle(document.documentElement);
  const token = (name) => styles.getPropertyValue(name).trim();
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    // Plain drawn text (reliable everywhere); the CSS shrinks it to fit narrow screens.
    flowchart: { htmlLabels: false, useMaxWidth: false },
    themeVariables: {
      fontFamily: 'Inter, system-ui, sans-serif',
      primaryColor: token('--color-surface'),
      primaryTextColor: token('--color-text'),
      primaryBorderColor: token('--color-accent'),
      lineColor: token('--color-muted'),
      clusterBkg: token('--color-bg'),
      clusterBorder: token('--color-accent'),
    },
  });

  // Each ```mermaid block in the docs becomes a drawn diagram.
  const blocks = content.querySelectorAll('code.language-mermaid');
  for (const [i, block] of [...blocks].entries()) {
    const { svg } = await mermaid.render(`info-diagram-${i}`, block.textContent);
    const figure = document.createElement('div');
    figure.className = 'info__diagram';
    figure.innerHTML = svg;
    block.closest('pre').replaceWith(figure);
  }
}
