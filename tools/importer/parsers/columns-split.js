/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-split. Base: columns.
 * Source: migration-work/block-context/columns-split/source.html
 * 2-column image/text (or text/card) split: one row, two cells.
 * Left cell = prose (title + paragraphs); right cell = image or card content.
 * Columns table: 2 columns, 1 row.
 */
export default function parse(element, { document }) {
  // The two columns are the direct bootstrap-grid children of the row
  let cols = Array.from(element.querySelectorAll(':scope > [class*="col-"]'));
  if (cols.length < 2) {
    cols = Array.from(element.children).filter((c) => c.matches('[class*="col-"], div'));
  }

  if (cols.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const buildCell = (col) => {
    const cell = [];
    // Drop breadcrumb navigation — not page content
    col.querySelectorAll('nav, .dga-breadcrumb').forEach((n) => n.remove());
    // Strip decorative icon-font glyphs (re-supplied at design time)
    col.querySelectorAll('i.hgi, .dga-featured-icon').forEach((i) => i.remove());

    // Prefer image if this column is primarily an image
    const img = col.querySelector('img');
    const meaningful = Array.from(
      col.querySelectorAll('h1, h2, h3, h4, h5, p, ul, ol, a'),
    ).filter((n) => n.textContent.trim() || n.tagName === 'IMG');

    if (img) cell.push(img);
    // Use top-level content of the column; fall back to the column element itself
    if (meaningful.length) {
      cell.push(...meaningful);
    } else if (!img) {
      cell.push(col);
    }
    return cell;
  };

  // Take the first two columns as the split
  const leftCell = buildCell(cols[0]);
  const rightCell = cols[1] ? buildCell(cols[1]) : [''];

  const cells = [[leftCell.length ? leftCell : '', rightCell.length ? rightCell : '']];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-split', cells });
  element.replaceWith(block);
}
