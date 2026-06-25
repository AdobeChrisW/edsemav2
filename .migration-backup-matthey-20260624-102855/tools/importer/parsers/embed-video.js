/* eslint-disable */
/* global WebImporter */

/**
 * Parser: embed-video
 * Base block: embed
 * Source: https://matthey.com/future-pgms-partnership
 * Generated: 2026-05-21T00:00:00.000Z
 *
 * Extracts the Ceros iframe src URL and creates an embed-video block
 * with a link to the embed source. The block decorate function expects
 * an anchor element (<a>) with the embed URL.
 */
export default function parse(element, { document }) {
  // Extract the iframe src URL from the Ceros embed
  // Source HTML: <iframe src="https://johnson-matthey.ceros.site/indaba-landing-page?embed=true&embed-version=1">
  const iframe = element.matches('iframe') ? element : element.querySelector('iframe[src*="ceros"]');

  if (!iframe) return;

  // Get the src and strip query parameters to get the clean embed URL
  const srcAttr = iframe.getAttribute('src');
  let embedUrl;
  try {
    const url = new URL(srcAttr);
    // Use the base URL without query parameters as the embed source
    embedUrl = `${url.origin}${url.pathname}`;
  } catch (e) {
    // Fallback: use src as-is if URL parsing fails
    embedUrl = srcAttr;
  }

  // Create a link element for the embed URL
  // The embed-video block decorate function expects an <a> with the embed href
  const link = document.createElement('a');
  link.href = embedUrl;
  link.textContent = embedUrl;

  // Build cells: single row with the link to the embed source
  const cells = [[link]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-video', cells });
  element.replaceWith(block);
}
