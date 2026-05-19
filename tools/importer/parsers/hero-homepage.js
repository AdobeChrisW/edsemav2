/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-homepage
 * Base block: hero
 * Source: https://www.nottingham.ac.uk/
 * Selector: .homepage-hero-banner
 * Structure: background image (row 1) + heading, paragraph, CTA (row 2)
 * Generated: 2026-05-19
 */
export default function parse(element, { document }) {
  // Extract background image - prefer desktop version, fallback to mobile
  const bgImage = element.querySelector('img.desktop-banner-image, img.mobile-banner-image, .banner-background img');

  // Extract heading from banner content
  const heading = element.querySelector('h1.banner-title, .banner-content h1, .banner-content h2');

  // Extract description paragraph
  const description = element.querySelector('p.banner-text, .banner-content p');

  // Extract CTA link
  const ctaLink = element.querySelector('a.stripe-white-cta, .banner-content a');

  // Build cells array matching hero block table structure:
  // Row 1: Background image
  // Row 2: Content (heading + text + CTA)
  const cells = [];

  // Row 1: Background image (if present)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Content cell with heading, description, and CTA
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (ctaLink) contentCell.push(ctaLink);
  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-homepage', cells });
  element.replaceWith(block);
}
