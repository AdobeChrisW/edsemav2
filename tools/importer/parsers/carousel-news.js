/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-news variant.
 * Base block: carousel
 * Source: https://www.nottingham.ac.uk/
 * Generated: 2026-05-19
 *
 * Source structure: Slick carousel (.news-carousel) with .slick-slide items.
 * Each slide contains a .vertical-card with image (.vertical-card-img),
 * heading (h3.news-title), description (p.news-desc), and link (a.inline-link).
 * Cloned slides (.slick-cloned) are excluded to avoid duplicates.
 *
 * Target structure: One row per slide with two cells: [image] | [heading, description, link]
 */
export default function parse(element, { document }) {
  // Select only non-cloned slides to avoid Slick carousel duplicates
  const slides = element.querySelectorAll('.slick-slide:not(.slick-cloned)');

  const cells = [];

  slides.forEach((slide) => {
    const card = slide.querySelector('.vertical-card');
    if (!card) return;

    // Extract the first image (desktop version; avoid duplicate mobile image)
    const image = card.querySelector('img.vertical-card-img');

    // Extract content elements from the card-content area
    const contentArea = card.querySelector('.card-content');
    const heading = contentArea ? contentArea.querySelector('h3.news-title, h3, h2') : null;
    const description = contentArea ? contentArea.querySelector('p.news-desc, p') : null;
    const link = contentArea ? contentArea.querySelector('a.inline-link, a') : null;

    // Build content cell: heading + description + link
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (link) contentCell.push(link);

    // Build row: [image cell, content cell]
    const imageCell = image ? [image] : [''];
    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-news', cells });
  element.replaceWith(block);
}
