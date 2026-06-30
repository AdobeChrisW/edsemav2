/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import tabsServicesParser from './parsers/tabs-services.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import cardsSupportParser from './parsers/cards-support.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/nusuk-hajj-cleanup.js';
import sectionsTransformer from './transformers/nusuk-hajj-sections.js';

// PARSER REGISTRY
const parsers = {
  'tabs-services': tabsServicesParser,
  'accordion-faq': accordionFaqParser,
  'cards-support': cardsSupportParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  "name": "faq-support",
  "description": "FAQ/support page: inner-page header + search, a tabbed accordion of Q&A, and a support-channels card grid.",
  "urls": [
    "https://hajj.nusuk.sa/FAQ"
  ],
  "blocks": [
    {
      "name": "tabs-services",
      "instances": [
        "#nav-tab"
      ],
      "section": "white"
    },
    {
      "name": "accordion-faq",
      "instances": [
        "#accordionFaq"
      ]
    },
    {
      "name": "cards-support",
      "instances": [
        "#support-channels .row"
      ],
      "section": "white"
    }
  ],
  "sections": [
    {
      "id": "rc3",
      "name": "Inner-page header",
      "selector": "#dga-inner-page-header",
      "style": "primary-50",
      "blocks": [],
      "defaultContent": [
        "#dga-inner-page-header"
      ]
    },
    {
      "id": "rc4",
      "name": "FAQ category tabs + accordion",
      "selector": "section.dga-pb-5xl",
      "style": "white",
      "blocks": [
        "tabs-services",
        "accordion-faq"
      ],
      "defaultContent": []
    },
    {
      "id": "rc5",
      "name": "Support Contact Channels",
      "selector": "#support-channels",
      "style": "white",
      "blocks": [
        "cards-support"
      ],
      "defaultContent": [
        "#support-channels > div > h1",
        "#support-channels > div > p"
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
