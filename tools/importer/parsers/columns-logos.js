/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-logos
 * Base block: columns
 * Source: https://www.nottingham.ac.uk/
 * Selector: .homepage-partnerships
 * Structure: Single row with 4 columns, each containing one partner/accreditation logo image
 * Generated: 2026-05-19
 */
export default function parse(element, { document }) {
  // Extract logo images from the desktop/tablet layout to avoid duplicates
  // The source has two layouts: mobile (.d-inline.d-md-none) and desktop (.d-none.d-md-inline)
  // We prefer the desktop layout; fall back to any .partner-icon images if desktop container not found
  const desktopContainer = element.querySelector('.d-none.d-md-inline, .large-display-icons');
  const logoContainer = desktopContainer || element;

  // Get all partner logo images from the chosen container
  const logos = Array.from(logoContainer.querySelectorAll('img.partner-icon, img[alt]'));

  // Build cells: one row with each logo as a separate column cell
  // This produces a columns block where each column contains a single image
  const cells = [];
  if (logos.length > 0) {
    const row = logos.map((logo) => [logo]);
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-logos', cells });
  element.replaceWith(block);
}
