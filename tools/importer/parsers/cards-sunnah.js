/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-sunnah. Base: cards (no images variant).
 * Source: migration-work/block-context/cards-sunnah/source.html
 * Icon + short text grid. Icons are hgi icon-font glyphs (stripped on import) —
 * modeled as text-only cells; icons re-supplied at design time.
 * Cards table: 1 column, one row per item (text cell).
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll(':scope > .dga-card, :scope > div'));

  const items = cards.filter((c) => c.querySelector('.dga-card-content, p'));
  if (items.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  items.forEach((card) => {
    const content = card.querySelector('.dga-card-content') || card;
    const textNodes = Array.from(content.querySelectorAll('h1, h2, h3, h4, p')).filter(
      (n) => n.textContent.trim(),
    );
    if (textNodes.length === 0) return;
    cells.push([textNodes]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-sunnah', cells });
  element.replaceWith(block);
}
