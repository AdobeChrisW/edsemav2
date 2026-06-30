import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

// Source icons were an icon font (stripped on import). The "Sunnah Acts of Tawaf"
// block always renders exactly 4 items in a fixed order, so map each item index to
// a matching stroke SVG. If an author supplies a different count, the unmapped
// items simply render without an icon (graceful degradation).
const SUNNAH_ICONS = [
  'sunnah-shoulder.svg', // 1. Men uncover their right shoulder during Tawaf
  'sunnah-run.svg', //      2. Men walk briskly in the first three circuits
  'sunnah-pray.svg', //     3. Pray two rak'ahs behind Maqam Ibrahim
  'sunnah-run.svg', //      4. Men jog between Safa and Marwa
];

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row, index) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && (div.querySelector('picture') || div.querySelector('img'))) div.className = 'cards-sunnah-card-icon';
      else div.className = 'cards-sunnah-card-body';
    });

    // Inject the matching icon (keyed by item order) when none was authored.
    if (!li.querySelector('.cards-sunnah-card-icon')) {
      const iconFile = SUNNAH_ICONS[index];
      if (iconFile) {
        const iconWrap = document.createElement('div');
        iconWrap.className = 'cards-sunnah-card-icon';
        const img = document.createElement('img');
        img.src = `${window.hlx?.codeBasePath || ''}/icons/${iconFile}`;
        img.alt = '';
        img.loading = 'lazy';
        iconWrap.append(img);
        li.prepend(iconWrap);
      }
    }

    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '120' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
