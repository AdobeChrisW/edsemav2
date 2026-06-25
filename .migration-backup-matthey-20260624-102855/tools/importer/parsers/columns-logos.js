/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-logos
 * Base block: columns
 * Source: https://matthey.com/future-pgms-partnership
 * Generated: 2026-05-21
 *
 * The columns-logos block represents a row of 3 partner logos
 * (Johnson Matthey, Sibanye-Stillwater, Valterra Platinum).
 * Since the source content is inside a Ceros iframe, logos cannot
 * be extracted directly. This parser creates a placeholder columns
 * block with 3 cells containing descriptive placeholder text for
 * each logo that should be replaced with actual images during
 * content authoring.
 */
export default function parse(element, { document }) {
  // The source element is a Ceros iframe - content is not directly accessible.
  // Create placeholder cells for the 3 known partner logos.
  const logos = [
    'JM Logo',
    'Sibanye-Stillwater Logo',
    'Valterra Platinum Logo',
  ];

  // Build cells: one row with 3 columns, each containing placeholder text
  const cells = [
    logos.map((logoText) => {
      const placeholder = document.createElement('p');
      placeholder.textContent = logoText;
      return placeholder;
    }),
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-logos', cells });
  element.replaceWith(block);
}
