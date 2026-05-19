/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-stats variant.
 * Base block: cards
 * Source: https://www.nottingham.ac.uk/
 * Selector: .homepage-rankings
 * Generated: 2026-05-19
 *
 * Extracts ranking/statistics tiles from the source page.
 * Each tile has: a stat number (heading), description (strong text), and source link.
 * Maps to cards-stats block where each row is one card with body content.
 */
export default function parse(element, { document }) {
  // Find all ranking tile containers
  const tiles = element.querySelectorAll('.ranking-tile-container .ranking-tile, .ranking-tile');

  const cells = [];

  tiles.forEach((tile) => {
    // Extract the stat number from .ranking-title span
    const statEl = tile.querySelector('.ranking-title span, .ranking-title');
    // Extract the description and source from .ranking-text
    const textContainer = tile.querySelector('.ranking-text');

    const cellContent = [];

    // Add stat number as a heading
    if (statEl) {
      const heading = document.createElement('h3');
      heading.textContent = statEl.textContent.trim();
      cellContent.push(heading);
    }

    // Add description and source link from ranking-text paragraphs
    if (textContainer) {
      const paragraphs = textContainer.querySelectorAll('p');
      paragraphs.forEach((p) => {
        // Clone the paragraph to preserve links and formatting
        const clone = p.cloneNode(true);
        cellContent.push(clone);
      });
    }

    if (cellContent.length > 0) {
      // Each row is one card; all content goes in a single cell
      cells.push([cellContent]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-stats', cells });
  element.replaceWith(block);
}
