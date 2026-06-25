/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-content
 * Base block: columns
 * Source: https://matthey.com/future-pgms-partnership
 * Generated: 2026-05-21
 *
 * This block represents a 2-column layout with text content on one side
 * and an image on the other. The source content is inside a Ceros iframe
 * and cannot be directly extracted. The parser creates a placeholder
 * columns block for manual authoring.
 */
export default function parse(element, { document }) {
  // The source element is an iframe pointing to Ceros interactive content.
  // Content inside the iframe is not accessible for extraction, so we
  // generate placeholder cells that match the columns-content block structure:
  // Row 1 = text content column (heading + paragraph)
  // Row 2 structure: 2 cells per row (text | image)

  const textCell = document.createElement('div');
  const heading = document.createElement('h2');
  heading.textContent = '[Text content]';
  const paragraph = document.createElement('p');
  paragraph.textContent = '[Description paragraph - author to replace with actual content]';
  textCell.append(heading, paragraph);

  const imageCell = document.createElement('div');
  const imgPlaceholder = document.createElement('p');
  imgPlaceholder.textContent = '[Image]';
  imageCell.append(imgPlaceholder);

  const cells = [
    [textCell, imageCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-content', cells });
  element.replaceWith(block);
}
