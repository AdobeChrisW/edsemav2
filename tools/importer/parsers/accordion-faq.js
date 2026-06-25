/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base block: accordion.
 * Source: https://hajj.nusuk.sa (#accordionFaq)
 * Generated for Document Authoring (da) project.
 *
 * Accordion library structure: 2 columns, one row per item; row 1 is the block name.
 *   col1: title cell — the question (accordion button / header text).
 *   col2: content cell — the answer (accordion body).
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll(':scope > .accordion-item'));

  // Empty-block guard
  if (items.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  items.forEach((item) => {
    // Question: prefer the button text, fall back to the header element.
    const button = item.querySelector('.accordion-button, button');
    const header = item.querySelector('.accordion-header, h1, h2, h3, h4, h5, h6');
    const questionText = (button && button.textContent.trim())
      || (header && header.textContent.trim())
      || '';

    const titleCell = document.createElement('p');
    titleCell.textContent = questionText;

    // Answer: the accordion body (keep its inner content).
    const body = item.querySelector('.accordion-body')
      || item.querySelector('.accordion-collapse');
    let contentCell;
    if (body) {
      const children = Array.from(body.children);
      contentCell = children.length ? children : [body];
    } else {
      contentCell = [document.createTextNode('')];
    }

    cells.push([titleCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
