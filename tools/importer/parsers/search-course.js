/* eslint-disable */
/* global WebImporter */

/**
 * Parser: search-course
 * Base block: search
 * Source: https://www.nottingham.ac.uk/
 * Generated: 2026-05-19
 *
 * Extracts course search section content and produces a search-course block.
 * The block JS (search-course.js) reads an optional a[href] for data source,
 * then rebuilds the UI. The heading is preserved as default content above the block.
 *
 * Source structure:
 *   .search-section > .container > .search-content
 *     h2.search-section-title - "Find your dream course"
 *     .row > .col-md-5 .search-keyword (input)
 *     .row > .col-md-4 .search-select (dropdown)
 *     .row > .col-md-3 .search-submit (button)
 *
 * Target block structure:
 *   Row 1: Link to search data source (or placeholder text for authoring)
 */
export default function parse(element, { document }) {
  // Extract heading - will be placed as default content above the block
  const heading = element.querySelector('h2.search-section-title, h2, .search-section-title');

  // Extract any existing links that might serve as the data source
  const existingLink = element.querySelector('a[href]');

  // Extract the search button to determine the search action/destination
  const searchButton = element.querySelector('button#action, button.button--secondary, .search-submit button');

  // Build the cells array for the block
  // The search-course block expects minimal authored content:
  // - Optionally a link to a data source (query-index.json or equivalent)
  const cells = [];

  // Create a content cell with search configuration
  // Since the source doesn't have an explicit link, provide a placeholder
  // that authors can update to point to the correct data source
  const contentCell = [];

  if (existingLink) {
    // If there's an existing link in the source, use it as data source
    contentCell.push(existingLink);
  } else {
    // Create a link to the default query index as the data source
    const dataLink = document.createElement('a');
    dataLink.href = '/query-index.json';
    dataLink.textContent = '/query-index.json';
    contentCell.push(dataLink);
  }

  cells.push(contentCell);

  // Create the block
  const block = WebImporter.Blocks.createBlock(document, { name: 'search-course', cells });

  // If there's a heading, insert it before the block as default content
  if (heading) {
    const fragment = document.createDocumentFragment();
    fragment.append(heading);
    fragment.append(block);
    element.replaceWith(fragment);
  } else {
    element.replaceWith(block);
  }
}
