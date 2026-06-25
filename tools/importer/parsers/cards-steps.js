/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-steps. Base block: cards (no images variant).
 * Source: https://hajj.nusuk.sa (#hajj-steps div.d-flex.flex-wrap.align-items-start)
 * Generated for Document Authoring (da) project.
 *
 * Cards (no images) library structure: 1 column, one row per card; row 1 is the block name.
 * Each step card has a decorative icon glyph (font-based, already stripped by the cleanup
 * transformer), a number (01-10) and an uppercase label. We emit one 1-column row per step
 * containing the number heading + label paragraph.
 */
export default function parse(element, { document }) {
  const steps = Array.from(element.querySelectorAll(':scope > .step-item'));

  // Empty-block guard
  if (steps.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  steps.forEach((step) => {
    const content = step.querySelector('.step-content') || step;
    const number = content.querySelector('h1, h2, h3, h4, h5, h6');
    const label = content.querySelector('p');

    const cardCell = [];
    if (number) cardCell.push(number);
    if (label) cardCell.push(label);

    if (cardCell.length) cells.push([cardCell]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-steps', cells });
  element.replaceWith(block);
}
