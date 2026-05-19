import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-event-card-image';
      } else {
        div.className = 'cards-event-card-body';
        // Parse date paragraph: first <p> contains "DD Month" text
        const firstP = div.querySelector('p');
        if (firstP && !firstP.querySelector('a') && /^\d{1,2}\s+\w+/.test(firstP.textContent.trim())) {
          const dateText = firstP.textContent.trim();
          const parts = dateText.split(/\s+/);
          const day = parts[0];
          const month = parts.slice(1).join(' ');
          const dateDiv = document.createElement('div');
          dateDiv.className = 'cards-event-date';
          dateDiv.innerHTML = `<span class="cards-event-day">${day}</span><span class="cards-event-month">${month}</span>`;
          firstP.replaceWith(dateDiv);
        }
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
