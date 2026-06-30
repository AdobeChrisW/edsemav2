/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroJourneyParser from './parsers/hero-journey.js';
import cardsRitualsParser from './parsers/cards-rituals.js';
import cardsSunnahParser from './parsers/cards-sunnah.js';
import columnsBannerParser from './parsers/columns-banner.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/nusuk-hajj-cleanup.js';
import sectionsTransformer from './transformers/nusuk-hajj-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-journey': heroJourneyParser,
  'cards-rituals': cardsRitualsParser,
  'cards-sunnah': cardsSunnahParser,
  'columns-banner': columnsBannerParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  "name": "journey-rituals",
  "description": "The Journey page: inner-page hero, intro text, a numbered Hajj-rituals grid (image + step number + heading + text), a Sunnah-acts icon grid, and a CTA card.",
  "urls": [
    "https://hajj.nusuk.sa/Journey"
  ],
  "blocks": [
    {
      "name": "hero-journey",
      "instances": [
        "#main-content > section.dga-journey-section"
      ]
    },
    {
      "name": "cards-rituals",
      "instances": [
        "#main-content section.dga-py-5xl.dga-bg-neutral-50 .d-flex.flex-column.dga-gap-4xl"
      ]
    },
    {
      "name": "cards-sunnah",
      "instances": [
        ".sonan-grid"
      ]
    },
    {
      "name": "columns-banner",
      "instances": [
        "#main-content section.dga-py-5xl .dga-card-bordered"
      ]
    }
  ],
  "sections": [
    {
      "id": "rc3",
      "name": "Inner-page hero",
      "selector": "#main-content > section.dga-journey-section",
      "style": null,
      "blocks": [
        "hero-journey"
      ],
      "defaultContent": []
    },
    {
      "id": "rc4",
      "name": "Intro text",
      "selector": "#main-content > section.dga-py-5xl:nth-of-type(2)",
      "style": "white",
      "blocks": [],
      "defaultContent": [
        "#main-content > section.dga-py-5xl:nth-of-type(2)"
      ]
    },
    {
      "id": "rc5",
      "name": "Hajj Rituale + Sunnah + CTA",
      "selector": "#main-content > section.dga-py-5xl.dga-bg-neutral-50",
      "style": "light-grey",
      "blocks": [
        "cards-rituals",
        "cards-sunnah",
        "columns-banner"
      ],
      "defaultContent": [
        "#main-content > section.dga-py-5xl.dga-bg-neutral-50 #hajj-steps-title",
        "#tawaf-sunan-title"
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
