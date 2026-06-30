/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
// (no block parsers — pure default content)

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/nusuk-hajj-cleanup.js';
import sectionsTransformer from './transformers/nusuk-hajj-sections.js';

// PARSER REGISTRY
const parsers = {

};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  "name": "legal-text",
  "description": "Legal/text page: inner-page header (breadcrumb + title) followed by one long single-column section of headings, paragraphs and lists. Pure default content, no blocks.",
  "urls": [
    "https://hajj.nusuk.sa/PrivacyPolicy",
    "https://hajj.nusuk.sa/TermsOfUse"
  ],
  "blocks": [],
  "sections": [
    {
      "id": "rc3",
      "name": "Inner-page header (breadcrumb + title)",
      "selector": "#dga-inner-page-header",
      "style": "primary-50",
      "blocks": [],
      "defaultContent": [
        "#dga-inner-page-header"
      ]
    },
    {
      "id": "rc4",
      "name": "Legal text body",
      "selector": "#main-content > section.dga-bg-white",
      "style": "white",
      "blocks": [],
      "defaultContent": [
        "#main-content > section.dga-bg-white"
      ]
    }
  ]
};

// TRANSFORMER REGISTRY - cleanup first, then sections (sections needs cleaned DOM)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  (template.blocks || []).forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({ name: blockDef.name, selector, element, section: blockDef.section || null });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }];
  },
};
