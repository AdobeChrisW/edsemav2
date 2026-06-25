/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-video. Base block: carousel.
 * Source: https://hajj.nusuk.sa (#embla-carousel)
 * Generated for Document Authoring (da) project.
 *
 * Carousel library structure: 2 columns, one row per slide; row 1 is the block name.
 *   col1: image (mandatory) — here the slide's video poster image.
 *   col2: text content (optional) — here a link to the .mp4 source so the
 *         carousel-video block can build a <video> at render time.
 *
 * Videos are hosted on cdn.tasheer.com (plain external URLs, NOT Dynamic Media).
 * The .mp4 lives on the <video data-src> / <source src> / <video src>.
 */
export default function parse(element, { document }) {
  const slides = Array.from(element.querySelectorAll('.embla__slide'));

  // Empty-block guard
  if (slides.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  slides.forEach((slide) => {
    const video = slide.querySelector('video');
    if (!video) return;

    const poster = video.getAttribute('poster');
    const sourceEl = video.querySelector('source[src]');
    const videoSrc = video.getAttribute('data-src')
      || (sourceEl ? sourceEl.getAttribute('src') : '')
      || video.getAttribute('src')
      || '';

    // col1: poster image (mandatory image cell)
    const imageCell = [];
    if (poster) {
      const img = document.createElement('img');
      img.src = poster;
      img.alt = '';
      imageCell.push(img);
    }

    // col2: link to the .mp4 (carrier anchor)
    const linkCell = [];
    if (videoSrc) {
      const link = document.createElement('a');
      link.href = videoSrc;
      link.textContent = videoSrc;
      linkCell.push(link);
    }

    cells.push([imageCell, linkCell]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-video', cells });
  element.replaceWith(block);
}
