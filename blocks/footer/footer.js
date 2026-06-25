import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Group each <h3> + following <ul> into a column block, then lay the blocks out
 * into 3 grid columns. The 3rd and later blocks (e.g. "Follow us on" +
 * "Accessibility Tools") stack together in the final column, matching the source.
 * @param {Element} section the link-columns section
 */
function buildColumns(section) {
  const blocks = [];
  let current = null;
  [...section.children].forEach((child) => {
    if (child.tagName === 'H3') {
      current = document.createElement('div');
      current.className = 'footer-block';
      current.append(child);
      blocks.push(current);
    } else if (current) {
      current.append(child);
    }
  });

  section.textContent = '';
  // First two blocks each get their own column; remaining blocks share column 3.
  const col1 = document.createElement('div');
  col1.className = 'footer-column';
  const col2 = document.createElement('div');
  col2.className = 'footer-column';
  const col3 = document.createElement('div');
  col3.className = 'footer-column';

  if (blocks[0]) col1.append(blocks[0]);
  if (blocks[1]) col2.append(blocks[1]);
  blocks.slice(2).forEach((b) => col3.append(b));

  section.append(col1, col2, col3);
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  let footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/content/footer';
  let fragment = await loadFragment(footerPath);
  if (!fragment) {
    footerPath = '/footer';
    fragment = await loadFragment(footerPath);
  }

  block.textContent = '';
  const footer = document.createElement('div');

  const sections = [...fragment.querySelectorAll(':scope .section')];
  const [linkSection, legalSection] = sections.length ? sections : [];

  if (linkSection) {
    linkSection.classList.add('footer-columns');
    const wrapper = linkSection.querySelector('.default-content-wrapper') || linkSection;
    buildColumns(wrapper);
    footer.append(linkSection);
  }

  if (legalSection) {
    legalSection.classList.add('footer-legal');
    footer.append(legalSection);
  }

  // fallback: if no .section elements, append everything
  if (!sections.length) {
    while (fragment.firstElementChild) footer.append(fragment.firstElementChild);
  }

  block.append(footer);
}
