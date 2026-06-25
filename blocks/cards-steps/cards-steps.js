import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

// Source icons were an icon font (stripped on import). Map each step number to a
// matching stroke SVG so the migrated cards show the same icons as the source.
const STEP_ICONS = {
  '01': 'step-user-add.svg',
  '02': 'step-file-upload.svg',
  '03': 'step-pencil-edit.svg',
  '04': 'step-checkmark-badge.svg',
  '05': 'step-favourite.svg',
  '06': 'step-credit-card-add.svg',
  '07': 'step-cursor-window.svg',
  '08': 'step-heart-check.svg',
  '09': 'step-calendar.svg',
  10: 'step-route.svg',
};

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-steps-card-image';
      else div.className = 'cards-steps-card-body';
    });

    // Inject the step icon (keyed by the number heading) when no image was authored.
    if (!li.querySelector('.cards-steps-card-image')) {
      const numHeading = li.querySelector('.cards-steps-card-body :is(h1,h2,h3,h4,h5,h6)');
      const num = numHeading ? numHeading.textContent.trim() : '';
      const iconFile = STEP_ICONS[num];
      if (iconFile) {
        const iconWrap = document.createElement('div');
        iconWrap.className = 'cards-steps-card-image';
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
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
