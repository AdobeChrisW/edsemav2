/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-support. Base: cards (no images variant).
 * Source: migration-work/block-context/cards-support/source.html
 * Support-channel cards: icon (hgi glyph, stripped) + title + description + CTA link/button.
 * Icons re-supplied at design time. Cards table: 1 column, one row per card
 * (text cell [title, description, details, CTA]).
 */
export default function parse(element, { document }) {
  // Cards are wrapped in bootstrap columns; the card itself is .dga-card
  let cards = Array.from(element.querySelectorAll('.dga-card'));
  if (cards.length === 0) {
    cards = Array.from(element.querySelectorAll(':scope > div'));
  }

  const items = cards.filter((c) => c.querySelector('.dga-card-content, p, .dga-card-title'));
  if (items.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  items.forEach((card) => {
    const content = card.querySelector('.dga-card-content') || card;
    const title = content.querySelector('.dga-card-title, h1, h2, h3, h4');
    // All descriptive paragraphs (description + service availability / response time lines)
    const paras = Array.from(content.querySelectorAll('p')).filter((p) => p.textContent.trim());
    // CTA: anchor links in the actions area (skip icon-only buttons with no text)
    const ctaArea = card.querySelector('.dga-card-actions');
    const ctas = ctaArea
      ? Array.from(ctaArea.querySelectorAll('a')).filter((a) => a.textContent.trim())
      : [];

    const textCell = [];
    if (title) textCell.push(title);
    textCell.push(...paras);
    textCell.push(...ctas);

    if (textCell.length === 0) return;
    cells.push([textCell]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-support', cells });
  element.replaceWith(block);
}
