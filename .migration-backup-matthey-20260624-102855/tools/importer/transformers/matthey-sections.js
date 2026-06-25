/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Johnson Matthey sections.
 * Adds section breaks (<hr>) between content sections and
 * inserts Section Metadata blocks for styled sections.
 *
 * Template has 6 sections:
 *   1. Hero and Video Section (no style) - selector: .component-html
 *   2. Partner Logos Section (no style) - selector: .component-html
 *   3. PGM Dependence Section (no style) - selector: .component-html
 *   4. PGM Opportunity Section (style: dark) - selector: .component-html
 *   5. Leading Innovation Section (style: blue) - selector: .component-html
 *   6. Contact Section (no style) - selector: .jmtwo--person-temp
 *
 * Selectors verified from captured DOM in migration-work/cleaned.html:
 *   - .component-html found at line 1247
 *   - .jmtwo--person-temp found at line 1264
 *
 * Note: Sections 1-5 are inside a single Ceros iframe (.component-html).
 * Block parsers handle the extraction and internal section boundaries.
 * This transformer handles the DOM-level section break before the
 * contact section and inserts Section Metadata for styled sections.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = payload;
    const template = payload.template;

    if (!template || !template.sections || template.sections.length < 2) {
      return;
    }

    const sections = template.sections;

    // Process sections in reverse order to preserve DOM positions
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      let sectionEl = null;

      // Find the section element using its selector
      if (section.selector) {
        // For sections sharing .component-html (Ceros iframe container),
        // only the first section maps to the actual DOM element
        if (section.selector === '.component-html' && i > 0) {
          // Sections 2-5 are internal to the Ceros content;
          // block parsers handle their boundaries
          continue;
        }
        sectionEl = element.querySelector(section.selector);
      }

      // Add Section Metadata block for sections with a style
      if (section.style && sectionEl) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(sectionMetadata);
      }

      // Add <hr> before each non-first section to create section breaks
      if (i > 0 && sectionEl) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
