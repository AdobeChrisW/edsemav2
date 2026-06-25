/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-pgm
 * Base block: hero
 * Source: https://matthey.com/future-pgms-partnership
 * Generated: 2026-05-21T00:00:00.000Z
 *
 * This parser handles a Ceros iframe-based hero section. Since the actual
 * content lives inside an embedded Ceros experience (inaccessible to DOM parsing),
 * the parser extracts the page title as the hero heading. The block renders as
 * a dark gradient hero with a single large heading.
 *
 * Structure: Single row with h1 heading derived from page title.
 * Selector: iframe[src*='ceros']
 */
export default function parse(element, { document }) {
  // The source element is a Ceros iframe - content is not accessible via DOM.
  // Extract heading from nearby elements, page title, or meta tags.
  const parentContainer = element.closest('.component-html, section, [class*="hero"], [class*="banner"]');
  const nearbyH1 = parentContainer
    ? parentContainer.querySelector('h1, h2, [class*="heading"], [class*="title"]')
    : null;
  const existingH1 = document.querySelector('h1');
  const pageTitle = document.querySelector('title');
  const metaOgTitle = document.querySelector('meta[property="og:title"]');

  // Create the heading element for the hero block
  const heading = document.createElement('h1');

  if (nearbyH1 && nearbyH1.textContent.trim()) {
    // Prefer a heading near the iframe (in the same section/container)
    heading.textContent = nearbyH1.textContent.trim();
  } else if (existingH1 && existingH1.textContent.trim()) {
    // Fall back to any h1 on the page
    heading.textContent = existingH1.textContent.trim();
  } else if (metaOgTitle && metaOgTitle.getAttribute('content')) {
    // Use og:title meta tag if available
    heading.textContent = metaOgTitle.getAttribute('content').trim();
  } else if (pageTitle && pageTitle.textContent.trim()) {
    // Fall back to page title, cleaning common suffixes like " | Company Name"
    let titleText = pageTitle.textContent.trim();
    const pipeIndex = titleText.indexOf('|');
    if (pipeIndex > 0) {
      titleText = titleText.substring(0, pipeIndex).trim();
    }
    heading.textContent = titleText;
  } else {
    // Last resort fallback
    heading.textContent = 'Developing the future of platinum group metals';
  }

  // Build cells: single row with the heading
  const cells = [
    [heading],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-pgm', cells });
  element.replaceWith(block);
}
