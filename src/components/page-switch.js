// The floating pill button that switches between the story (/) and the lab (/lab/).
//
//   document.body.append(pageSwitch({ label: 'Start prototyping →', href: `${import.meta.env.BASE_URL}lab/` }));
// (BASE_URL keeps links working when the site lives in a sub-folder, like on GitHub Pages.)
import './page-switch.css';

export function pageSwitch({ label, href }) {
  const link = document.createElement('a');
  link.className = 'page-switch';
  link.href = href;
  link.textContent = label;
  return link;
}
