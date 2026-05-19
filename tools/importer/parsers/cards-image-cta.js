/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-image-cta variant.
 * Base block: cards
 * Source: https://www.nottingham.ac.uk/
 * Selector: .homepage-image-cta-row
 * Generated: 2026-05-19
 *
 * Structure: Each card has a background image + overlaid CTA link.
 * Source cards are .imageWhiteCTA-card elements containing:
 *   - img.background-image (the card image)
 *   - a.stripe-white-cta (the CTA link)
 *
 * Target table: One row per card, two columns per row:
 *   - Column 1: image (picture element)
 *   - Column 2: CTA link (anchor element)
 */
export default function parse(element, { document }) {
  // Find all card containers in the source HTML
  const cards = element.querySelectorAll('.imageWhiteCTA-card');

  const cells = [];

  cards.forEach((card) => {
    // Extract the image from the card
    const img = card.querySelector('img.background-image, img');

    // Extract the CTA link from the card
    const link = card.querySelector('a.stripe-white-cta, a');

    // Build row: [image, CTA link]
    const imageCell = [];
    if (img) {
      // Create a picture element wrapping the image for proper AEM handling
      const picture = document.createElement('picture');
      const imgClone = img.cloneNode(true);
      picture.appendChild(imgClone);
      imageCell.push(picture);
    }

    const bodyCell = [];
    if (link) {
      const linkClone = link.cloneNode(true);
      bodyCell.push(linkClone);
    }

    // Only add row if we have content
    if (imageCell.length > 0 || bodyCell.length > 0) {
      cells.push([imageCell, bodyCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-image-cta', cells });
  element.replaceWith(block);
}
