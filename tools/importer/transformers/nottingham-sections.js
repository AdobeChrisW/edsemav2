/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: University of Nottingham section breaks and section metadata.
 * Inserts <hr> between sections and adds Section Metadata blocks for styled sections.
 * All selectors validated against migration-work/cleaned.html.
 *
 * Sections from page-templates.json:
 *   1. Hero Section (selector: .homepage-hero-banner) - no style
 *   2. Course Search Section (selector: .search-section) - no style
 *   3. Campaign Tiles Section (selector: .homepage-campaign-tiles) - no style
 *   4. Rankings Section (selector: .homepage-rankings) - no style
 *   5. Research Section (selector: .homepage-bg-container) - style: grey
 *   6. News Section (selector: .news-section) - no style
 *   7. Events Section (selector: .events-section) - no style
 *   8. Partnerships Section (selector: .homepage-partnerships) - style: dark
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to avoid index shifting
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue;

      // Add Section Metadata block after the section content if section has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        // Insert the metadata block after the section element
        if (sectionEl.nextSibling) {
          sectionEl.parentNode.insertBefore(metaBlock, sectionEl.nextSibling);
        } else {
          sectionEl.parentNode.appendChild(metaBlock);
        }
      }

      // Insert <hr> before each section except the first
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    }
  }
}
