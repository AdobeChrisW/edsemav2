/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-journey. Base: hero.
 * Source: migration-work/block-context/hero-journey/source.html
 * Static image-background inner-page hero: breadcrumb (dropped) + H1 title + subtitle.
 * Hero table: 1 column, 3 rows (name / background image / content [title, subtitle, optional CTA]).
 */
export default function parse(element, { document }) {
  // Background image: first <img> in the hero section (full-bleed background)
  const bgImage = element.querySelector('img');

  // Content lives inside the inner content wrapper (breadcrumb nav is excluded)
  const heading = element.querySelector('h1, h2, [class*="title"]');
  const subtitle = element.querySelector(
    '.dga-text-lg, .dga-service-providers-content p, p',
  );
  // Optional CTA (rare on inner-page heroes) — exclude breadcrumb links inside nav
  const ctaLinks = Array.from(
    element.querySelectorAll('.dga-service-providers-content a.dga-btn, .dga-btn'),
  );

  // Empty-block guard
  if (!heading && !subtitle && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (optional)
  if (bgImage) cells.push([bgImage]);

  // Row 3: content cell (single cell holding all content elements)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subtitle) contentCell.push(subtitle);
  contentCell.push(...ctaLinks);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-journey', cells });
  element.replaceWith(block);
}
