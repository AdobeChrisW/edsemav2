/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-event variant.
 * Base block: cards
 * Source: https://www.nottingham.ac.uk/
 * Selector: .events-section .row.g-4
 * Generated: 2026-05-19
 *
 * Source structure:
 *   .row.g-4 > .col-xs.col-lg-6 > .vertical-card > .row.h-100
 *     .col-md-4 > img.vertical-card-img
 *     .card-content.col-md-8
 *       .date > span.day + span.month
 *       h3.event-title
 *       a.inline-link
 *
 * Target table: one row per card, each row has two cells:
 *   Cell 1: image
 *   Cell 2: date + heading + CTA link
 */
export default function parse(element, { document }) {
  // Select all event cards from the source container
  const cards = element.querySelectorAll('.vertical-card');
  // Fallback: try direct column children if .vertical-card not found
  const cardList = cards.length > 0 ? cards : element.querySelectorAll(':scope > [class*="col"]');

  const cells = [];

  cardList.forEach((card) => {
    // Extract image
    const img = card.querySelector('img.vertical-card-img, img[class*="card-img"], img');

    // Extract date components
    const dayEl = card.querySelector('.date .day, .day');
    const monthEl = card.querySelector('.date .month, .month');

    // Extract event title
    const heading = card.querySelector('h3.event-title, h3, h2, [class*="event-title"]');

    // Extract CTA link
    const link = card.querySelector('a.inline-link, .card-content a, a');

    // Build image cell
    const imageCell = [];
    if (img) {
      imageCell.push(img);
    }

    // Build body cell with date + heading + link
    const bodyCell = [];

    // Combine date into a paragraph element
    if (dayEl || monthEl) {
      const datePara = document.createElement('p');
      const dayText = dayEl ? dayEl.textContent.trim() : '';
      const monthText = monthEl ? monthEl.textContent.trim() : '';
      datePara.textContent = `${dayText} ${monthText}`.trim();
      bodyCell.push(datePara);
    }

    if (heading) {
      bodyCell.push(heading);
    }

    if (link) {
      bodyCell.push(link);
    }

    // Only add row if we have meaningful content
    if (imageCell.length > 0 || bodyCell.length > 0) {
      cells.push([imageCell, bodyCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-event', cells });
  element.replaceWith(block);
}
