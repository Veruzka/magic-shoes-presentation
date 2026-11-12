// The floating pill button that switches between the story (/) and the lab (/lab/).
//
//   document.body.append(pageSwitch({ label: 'Start prototyping →', href: '/lab/' }));
import './page-switch.css';

export function pageSwitch({ label, href }) {
  const link = document.createElement('a');
  link.className = 'page-switch';
  link.href = href;
  link.textContent = label;
  return link;
}
