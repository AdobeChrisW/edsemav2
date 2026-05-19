/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-promo variant.
 * Base block: cards
 * Source: https://www.nottingham.ac.uk/
 * Selector: .homepage-campaign-tiles
 *
 * Source structure:
 *   .homepage-campaign-tiles > .container > .row > .tile-container > .campaign-tile
 *     h2.campaign-tile-title
 *     p.campaign-tile-text
 *     div.campaign-tile-links > a.inline-link
 *
 * Target table: one row per card, each cell contains heading + paragraph + CTA link.
 */
export default function parse(element, { document }) {
  // Select all campaign tile cards from the source
  const tiles = element.querySelectorAll('.campaign-tile');
  // Fallback if .campaign-tile not found
  const tileList = tiles.length > 0 ? tiles : element.querySelectorAll('.tile-container > div');

  const cells = [];

  tileList.forEach((tile) => {
    const cellContent = [];

    // Extract heading (h2 primary, fallback to any heading)
    const heading = tile.querySelector('h2.campaign-tile-title, h2, h3, [class*="tile-title"]');
    if (heading) cellContent.push(heading);

    // Extract description paragraph
    const description = tile.querySelector('p.campaign-tile-text, p, [class*="tile-text"]');
    if (description) cellContent.push(description);

    // Extract CTA link(s) - use specific selector first, avoid duplicates
    const links = tile.querySelectorAll('.campaign-tile-links a');
    const linkList = links.length > 0 ? links : tile.querySelectorAll('a.inline-link');
    linkList.forEach((link) => {
      cellContent.push(link);
    });

    // Only add row if we extracted meaningful content
    // Each row is a single cell containing all card content (heading + text + CTA)
    if (cellContent.length > 0) {
      cells.push([cellContent]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-promo', cells });
  element.replaceWith(block);
}
