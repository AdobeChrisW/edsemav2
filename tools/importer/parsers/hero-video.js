/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-video. Base block: hero.
 * Source: https://hajj.nusuk.sa (#main-content > section.dga-hero-section)
 * Generated for Document Authoring (da) project.
 *
 * Hero library structure: 1 column, 3 rows.
 *   Row 1: block name (handled by createBlock)
 *   Row 2: background media (optional) — here the hero uses a background <video>.
 *          Videos are hosted on cdn.tasheer.com (plain external URLs, NOT Dynamic Media),
 *          so we emit the poster image + a link to the .mp4 source.
 *   Row 3: content — title (H1), subheading (H2), intro paragraph, CTA buttons.
 */
export default function parse(element, { document }) {
  // --- Row 2: background media (video poster + mp4 link) ---
  const video = element.querySelector('video');
  const bgCell = [];
  if (video) {
    const poster = video.getAttribute('poster');
    const srcEl = video.querySelector('source[src]');
    const videoSrc = srcEl ? srcEl.getAttribute('src') : (video.getAttribute('src') || '');
    if (poster) {
      const img = document.createElement('img');
      img.src = poster;
      img.alt = '';
      bgCell.push(img);
    }
    if (videoSrc) {
      const link = document.createElement('a');
      link.href = videoSrc;
      link.textContent = videoSrc;
      bgCell.push(link);
    }
  }

  // --- Row 3: content (heading, subheading, paragraph, CTAs) ---
  const contentRoot = element.querySelector('.dga-hero-content') || element;
  const heading = contentRoot.querySelector('h1, h2, [class*="display"]');
  // subheading: the secondary heading (H2) when H1 is the title
  let subheading = null;
  if (heading && heading.tagName.toLowerCase() === 'h1') {
    subheading = contentRoot.querySelector('h2');
  }
  const paragraphs = Array.from(contentRoot.querySelectorAll('p'));
  const ctaLinks = Array.from(contentRoot.querySelectorAll('a[href]'));

  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  paragraphs.forEach((p) => contentCell.push(p));
  ctaLinks.forEach((a) => contentCell.push(a));

  // Empty-block guard
  if (!heading && paragraphs.length === 0 && ctaLinks.length === 0 && bgCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  if (bgCell.length) cells.push([bgCell]);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-video', cells });
  element.replaceWith(block);
}
