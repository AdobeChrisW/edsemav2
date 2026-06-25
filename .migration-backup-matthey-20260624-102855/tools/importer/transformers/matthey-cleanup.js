/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Johnson Matthey cleanup.
 * Removes non-authorable site chrome (header, footer, nav, breadcrumbs, cookie banner, etc.)
 * Selectors verified from captured DOM in migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent banner (found: #onetrust-consent-sdk)
    // Remove hidden form (found: form#hrefFm)
    // Remove Liferay loading bar (found: .lfr-spa-loading-bar)
    // Remove tooltip container (found: #tooltipContainer)
    // Remove YUI CSS stamp (found: #yui3-css-stamp)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      'form#hrefFm',
      '.lfr-spa-loading-bar',
      '#tooltipContainer',
      '#yui3-css-stamp',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove header with navigation and breadcrumbs (found: header#banner.jmheader--fixed)
    // Remove skip-to-content nav (found: nav#hnew_quickAccessNav)
    // Remove main navigation (found: nav#navigation) - contained in header but explicit for safety
    // Remove breadcrumbs (found: nav#breadcrumbs)
    // Remove footer (found: .container-fluid.bg--theme)
    // Remove social media / copyright bar (found: .socialmedia__list.bg--white)
    // Remove spacer elements (found: .lfr-layout-structure-item-basic-component-spacer)
    // Remove link elements (found: link tags for stylesheets)
    // Remove noscript elements
    WebImporter.DOMUtils.remove(element, [
      'header#banner',
      'nav#hnew_quickAccessNav',
      'nav#navigation',
      'nav#breadcrumbs',
      '.container-fluid.bg--theme',
      '.socialmedia__list.bg--white',
      '.lfr-layout-structure-item-basic-component-spacer',
      'link',
      'noscript',
    ]);
  }
}
