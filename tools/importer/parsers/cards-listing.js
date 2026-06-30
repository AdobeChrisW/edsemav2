/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-listing. Base: cards.
 * Source: migration-work/block-context/cards-listing/source.html
 * Service-provider cards: logo image + company name + "View Profile" link.
 * Cards table: 2 columns, one row per card (image cell | text/link cell [name, link]).
 */
export default function parse(element, { document }) {
  const cards = Array.from(
    element.querySelectorAll(':scope > article.dga-card, :scope > .dga-card'),
  );

  const items = cards.filter((c) => c.querySelector('img') || c.querySelector('.dga-card-title'));
  if (items.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  items.forEach((card) => {
    const image = card.querySelector('img');
    const title = card.querySelector('.dga-card-title, h1, h2, h3, h4');
    const link = card.querySelector('.dga-card-actions a, a.dga-btn, a');

    const textCell = [];
    if (title) {
      // Use clean heading text (strip nested ids/classes preserved by reference)
      textCell.push(title);
    }
    if (link) {
      // Strip sr-only spans so the visible link text is clean ("View Profile")
      link.querySelectorAll('.sr-only').forEach((sr) => sr.remove());
      textCell.push(link);
    }

    if (textCell.length === 0 && !image) return;
    cells.push([image || '', textCell]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-listing', cells });
  element.replaceWith(block);
}
