import { moveInstrumentation } from '../../scripts/scripts.js';

const ICON_KEYWORDS = [
  { file: 'guideline-navigating', match: /navigat|kingdom|map|direction/i },
  { file: 'guideline-health', match: /health|medical|safety/i },
  { file: 'guideline-rituals', match: /ritual|hajj rite|umrah|sunnah/i },
  { file: 'guideline-about', match: /nusuk|about|info|overview/i },
];

// Fallback ordering when no keyword matches the title
const ICON_FALLBACK = [
  'guideline-navigating',
  'guideline-health',
  'guideline-rituals',
  'guideline-about',
];

function pickIcon(title, index) {
  const found = ICON_KEYWORDS.find((entry) => entry.match.test(title || ''));
  if (found) return found.file;
  return ICON_FALLBACK[index % ICON_FALLBACK.length];
}

function createIcon(file) {
  const base = window.hlx?.codeBasePath || '';
  const span = document.createElement('span');
  span.className = 'cards-guidelines-icon';
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

  [...block.children].forEach((row, index) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((div) => {
      div.className = 'cards-guidelines-card-body';
    });

    const body = li.querySelector('.cards-guidelines-card-body') || li;
    const title = body.querySelector('h1,h2,h3,h4,h5,h6');
    const file = pickIcon(title?.textContent, index);

    // group icon + title into a header so the link can sit at the card bottom
    if (title) {
      const header = document.createElement('div');
      header.className = 'cards-guidelines-card-header';
      header.append(createIcon(file));
      title.before(header);
      header.append(title);
    }

    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
