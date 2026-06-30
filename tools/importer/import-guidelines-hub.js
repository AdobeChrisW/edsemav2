/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroJourneyParser from './parsers/hero-journey.js';
import cardsGuidelinesParser from './parsers/cards-guidelines.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/nusuk-hajj-cleanup.js';
import sectionsTransformer from './transformers/nusuk-hajj-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-journey': heroJourneyParser,
  'cards-guidelines': cardsGuidelinesParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  "name": "guidelines-hub",
  "description": "Guidelines hub: inner-page hero, intro text, and a 4-card 'learn more' grid linking to guideline articles.",
  "urls": [
    "https://hajj.nusuk.sa/nusuk/guidelines"
  ],
  "blocks": [
    {
      "name": "hero-journey",
      "instances": [
        "main#main-content > section.dga-guidelines-section"
      ]
    },
    {
      "name": "cards-guidelines",
      "instances": [
        ".guidelines-grid"
      ],
      "section": "grey"
    }
  ],
  "sections": [
    {
      "id": "s1",
      "name": "Inner-page hero",
      "selector": "main#main-content > section.dga-guidelines-section",
      "style": null,
      "blocks": [
        "hero-journey"
      ],
      "defaultContent": []
    },
    {
      "id": "s2",
      "name": "Intro prose",
      "selector": "main#main-content > section.dga-py-5xl.dga-bg-white",
      "style": "white",
      "blocks": [],
      "defaultContent": [
        "main#main-content > section.dga-py-5xl.dga-bg-white"
      ]
    },
    {
      "id": "s3",
      "name": "Prepare yourself - 4-card Learn More grid",
      "selector": "main#main-content > section.dga-py-8xl.dga-bg-neutral-50",
      "style": "grey",
      "blocks": [
        "cards-guidelines"
      ],
      "defaultContent": [
        "main#main-content > section.dga-py-8xl.dga-bg-neutral-50 h1"
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
