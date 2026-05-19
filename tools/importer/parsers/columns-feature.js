/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-feature
 * Base block: columns
 * Source: https://www.nottingham.ac.uk/
 * Selector: .homepage-image-cta-block
 * Structure: Two-column layout with text content (heading + description + CTA) on left, image on right
 * Generated: 2026-05-19
 */
export default function parse(element, { document }) {
  // Extract text content from the left column
  const textContainer = element.querySelector('.text-content');
  const heading = element.querySelector('.text-content h3, .text-content h2, .text-content h1');
  const description = element.querySelector('.text-content p');
  const ctaLink = element.querySelector('a.stripe-white-cta, a.cta, a.button, .block-content a');

  // Extract image from the right column
  const image = element.querySelector('.image-container img, .col-lg-6 img, img');

  // Build text cell content (heading + description + CTA)
  const textCell = [];
  if (heading) textCell.push(heading);
  if (description) textCell.push(description);
  if (ctaLink) textCell.push(ctaLink);

  // Build image cell content
  const imageCell = [];
  if (image) imageCell.push(image);

  // Columns block: one row with two cells (text column, image column)
  const cells = [
    [textCell, imageCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
