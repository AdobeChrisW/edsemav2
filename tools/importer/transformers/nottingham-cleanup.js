/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: University of Nottingham site-wide cleanup.
 * Removes non-authorable content (header, footer, cookie consent, ASP.NET artifacts).
 * All selectors validated against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Cookie consent banner (line 1279 in cleaned.html: <div id="onetrust-consent-sdk">)
    // OneTrust iframe (line 1526: <iframe class="ot-text-resize">)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      'iframe.ot-text-resize',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Header component (line 18: <div class="headerv2-component">)
    // Skip content link (line 20: <div class="headerv2-skip-content-link">)
    // Footer (line 983: <footer id="footer">)
    // ASP.NET hidden fields (lines 3, 1274: <div class="aspNetHidden">)
    // Link elements (line 13-17: preconnect/stylesheet links)
    WebImporter.DOMUtils.remove(element, [
      '.headerv2-component',
      'footer#footer',
      '.aspNetHidden',
      'link',
      'noscript',
    ]);

    // Remove the wrapping form#form1 but keep its children
    // (line 2: <form id="form1">)
    const form = element.querySelector('form#form1');
    if (form) {
      while (form.firstChild) {
        form.parentNode.insertBefore(form.firstChild, form);
      }
      form.remove();
    }
  }
}
