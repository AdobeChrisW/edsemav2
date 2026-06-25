/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: nusuk-hajj (https://hajj.nusuk.sa) section breaks + metadata.
 *
 * Driven by payload.template.sections (page-templates.json). For each section
 * (processed in reverse DOM order so insertions don't shift earlier matches):
 *   - inserts a <hr> section break before the section, except for the first
 *     section that actually exists in the DOM;
 *   - appends a "Section Metadata" block (style cell) after the section when
 *     the section defines a `style`.
 *
 * Section selectors come from page-templates.json (validated against
 * migration-work/cleaned.html). For hajj-homepage that is:
 *   rc3 hero    #main-content > section.dga-hero-section          (style: null)
 *   rc4 banner  #main-content > section.dga-py-8xl:nth-of-type(2) (style: null)
 *   rc5 services#main-content > section.dga-py-5xl.dga-bg-neutral-50 (style: light-grey)
 *   rc6 glimpse #hajjInAGlimpse                                    (style: null)
 *   rc7 steps   #hajj-steps                                        (style: null)
 *   rc8 faq     #home-faq                                          (style: null)
 * Expected: 5 <hr> (sections - 1) and 1 Section Metadata block (rc5).
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const template = payload && payload.template;
  const sections = template && template.sections;
  if (!sections || sections.length < 2) return;

  const doc = element.ownerDocument || document;

  // Resolve each configured section to its DOM element (preserving order).
  const resolved = sections
    .map((section) => ({
      section,
      el: section.selector ? element.querySelector(section.selector) : null,
    }))
    .filter((entry) => entry.el);

  if (!resolved.length) return;

  // Process in reverse so DOM insertions do not invalidate earlier matches.
  for (let i = resolved.length - 1; i >= 0; i -= 1) {
    const { section, el } = resolved[i];

    // Section Metadata block after the section, when a style is defined.
    if (section.style) {
      const metaBlock = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      el.after(metaBlock);
    }

    // Section break before every section except the first resolved one.
    if (i > 0) {
      el.before(doc.createElement('hr'));
    }
  }
}
