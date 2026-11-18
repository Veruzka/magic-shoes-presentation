// A visible "TODO" sticker for placeholders, so teammates can find what to
// replace. Always pair it with a `// TODO:` comment in the code next to it.
//   el.append(todoTag('confirm the name'));
import './todo-tag.css';

export function todoTag(text) {
  const tag = document.createElement('span');
  tag.className = 'todo-tag';
  tag.textContent = `TODO · ${text}`;
  return tag;
}
