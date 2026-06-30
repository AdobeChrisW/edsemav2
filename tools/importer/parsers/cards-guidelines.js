/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-guidelines. Base: cards (no images variant).
 * Source: migration-work/block-context/cards-guidelines/source.html
 * "Learn more" nav cards: icon (hgi glyph, stripped) + title + "Learn More" CTA link.
 * Icons re-supplied at design time. Cards table: 1 column, one row per card
 * (text/link cell [title, CTA]).
 */
export default function parse(element, { document }) {
  let cards = Array.from(element.querySelectorAll(':scope > .dga-card'));
  if (cards.length === 0) {
    cards = Array.from(element.querySelectorAll('.dga-card'));
  }

  const items = cards.filter((c) => c.querySelector('.dga-card-title, h1, h2, h3, h4, a'));
  if (items.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  items.forEach((card) => {
    const title = card.querySelector('.dga-card-title, h1, h2, h3, h4');
    const ctaArea = card.querySelector('.dga-card-actions') || card;
    const cta = Array.from(ctaArea.querySelectorAll('a')).find((a) => a.textContent.trim());

    const textCell = [];
    if (title) textCell.push(title);
    if (cta) textCell.push(cta);

    if (textCell.length === 0) return;
    cells.push([textCell]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-guidelines', cells });
  element.replaceWith(block);
}
