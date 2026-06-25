/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: nusuk-hajj (https://hajj.nusuk.sa) site-wide cleanup.
 *
 * Removes non-authorable page chrome and third-party widgets so the import
 * contains only the authorable content of #main-content (rc3..rc8).
 *
 * All selectors below were validated against migration-work/cleaned.html.
 * Source line references are noted in comments.
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Third-party live-chat (Infobip) widget + floating eye-catcher.
    // These are overlay widgets that can interfere with block matching, so
    // remove them up front. Selectors from captured DOM:
    //   .loading-overlay        (cleaned.html:855)
    //   .lc-widget-wrapper      (cleaned.html:860)
    //   #ib-button-messaging    (cleaned.html:867)
    //   #ib-iframe-messaging    (cleaned.html:864)
    //   #eye-catcher-container  (rc10, cleaned.html:882)
    WebImporter.DOMUtils.remove(element, [
      '.loading-overlay',
      '.lc-widget-wrapper',
      '#ib-button-messaging',
      '#ib-iframe-messaging',
      '#eye-catcher-container',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome (rc1, rc2, rc9). Selectors from captured DOM:
    //   div.dga-digital-stamp   government digital-stamp bar, rc1 (cleaned.html:2)
    //   header.dga-header       site header + nav, rc2 (cleaned.html:65)
    //   footer.dga-py-6xl       footer, rc9 (cleaned.html:674)
    // The skip-links (a.sr-only.sr-only-focusable, cleaned.html:67-68) and the
    // #external-link-warning helper (cleaned.html:849) live inside header/footer
    // and are removed along with them; any stragglers handled below.
    WebImporter.DOMUtils.remove(element, [
      '.dga-digital-stamp',
      'header.dga-header',
      'footer.dga-py-6xl',
      'a.sr-only.sr-only-focusable',
      '#external-link-warning',
      'iframe',
      'noscript',
      'link',
      'style',
      'script',
    ]);

    // Icon-font glyphs: 41 decorative <i class="hgi ..."> elements
    // (cleaned.html, e.g. lines 22, 37). They carry no text and would render as
    // empty content cells, so strip them after block parsing.
    element.querySelectorAll('i.hgi').forEach((icon) => icon.remove());
  }
}
