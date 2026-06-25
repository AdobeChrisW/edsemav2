/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-banner. Base block: columns.
 * Source: https://hajj.nusuk.sa (.global-packages-banner)
 * Generated for Document Authoring (da) project.
 *
 * Columns library structure: flexible columns/rows; row 1 is the block name.
 * This banner is an accent card: content (heading + paragraph) on one side and a
 * single "Register your interest" CTA on the other → emit one 2-column content row.
 */
export default function parse(element, { document }) {
  const content = element.querySelector('.dga-card-content') || element;
  const heading = content.querySelector('h1, h2, h3, [class*="title"]');
  const paragraphs = Array.from(content.querySelectorAll('p'));
  const cta = element.querySelector('.dga-card-actions a[href], a.dga-btn[href], a[href]');

  // Empty-block guard
  if (!heading && paragraphs.length === 0 && !cta) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const contentCell = [];
  if (heading) contentCell.push(heading);
  paragraphs.forEach((p) => contentCell.push(p));

  const actionCell = [];
  if (cta) actionCell.push(cta);

  const cells = [];
  cells.push([contentCell, actionCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-banner', cells });
  element.replaceWith(block);
}
