import { moveInstrumentation } from '../../scripts/scripts.js';

// Match a support icon by a keyword in the card title. Order matters: most
// specific first. Falls back to no icon if nothing matches.
const ICON_RULES = [
  { re: /chat|live/i, file: 'support-chat' },
  { re: /e-?mail|mail/i, file: 'support-email' },
  { re: /social|media|facebook|twitter|instagram/i, file: 'support-social' },
  { re: /call|phone|center|centre|contact/i, file: 'support-call' },
];

function iconFor(title = '') {
  const rule = ICON_RULES.find((r) => r.re.test(title));
  return rule ? rule.file : null;
}

function createIcon(file) {
  const base = window.hlx?.codeBasePath || '';
  const span = document.createElement('span');
  span.className = 'cards-support-card-icon';
  const img = document.createElement('img');
  img.src = `${base}/icons/${file}.svg`;
  img.alt = '';
  img.loading = 'lazy';
  img.setAttribute('aria-hidden', 'true');
  span.append(img);
  return span;
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      div.className = 'cards-support-card-body';
    });

    const body = li.querySelector('.cards-support-card-body');
    const title = body?.querySelector('h4')?.textContent || '';
    const file = iconFor(title);
    if (file && body) {
      body.prepend(createIcon(file));
    }

    // A standalone paragraph that contains only a single link is the card's
    // call-to-action button (e.g. "Email Us"). Promote it to a button.
    if (body) {
      [...body.querySelectorAll('p')].forEach((p) => {
        const a = p.querySelector('a');
        if (a && p.childElementCount === 1 && p.textContent.trim() === a.textContent.trim()) {
          p.className = 'cards-support-cta';
          a.className = 'button';
        }
      });
    }

    ul.append(li);
  });
  block.textContent = '';
  block.append(ul);
}
