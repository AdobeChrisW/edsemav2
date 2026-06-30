/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import columnsSplitParser from './parsers/columns-split.js';
import cardsSunnahParser from './parsers/cards-sunnah.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/nusuk-hajj-cleanup.js';
import sectionsTransformer from './transformers/nusuk-hajj-sections.js';

// PARSER REGISTRY
const parsers = {
  'columns-split': columnsSplitParser,
  'cards-sunnah': cardsSunnahParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  "name": "guidelines-article",
  "description": "Guidelines article: inner-page hero (breadcrumb/title/intro, sometimes with a side contacts panel) followed by alternating white/grey content sections mixing prose, image+text splits, and icon grids.",
  "urls": [
    "https://hajj.nusuk.sa/nusuk/navigating",
    "https://hajj.nusuk.sa/nusuk/about",
    "https://hajj.nusuk.sa/nusuk/hajj-rituals",
    "https://hajj.nusuk.sa/nusuk/health/guidelines"
  ],
  "blocks": [
    {
      "name": "columns-split",
      "instances": [
        "main#main-content > section.inner-page-section .row.dga-pt-5xl",
        "main#main-content > section.dga-py-5xl.dga-bg-neutral-50:nth-of-type(2) .d-flex.justify-content-between"
      ]
    },
    {
      "name": "cards-sunnah",
      "instances": [
        "main#main-content > section.dga-py-5xl.dga-bg-neutral-50:nth-of-type(6) .row.g-4"
      ],
      "section": "grey"
    }
  ],
  "sections": [
    {
      "id": "s1",
      "name": "Article header with side contacts panel",
      "selector": "main#main-content > section.inner-page-section",
      "style": "white",
      "blocks": [
        "columns-split"
      ],
      "defaultContent": [
        "main#main-content > section.inner-page-section h1"
      ]
    },
    {
      "id": "s2",
      "name": "Currency Exchange and Fund Transfers (image+text split)",
      "selector": "main#main-content > section.dga-py-5xl.dga-bg-neutral-50:nth-of-type(2)",
      "style": "grey",
      "blocks": [
        "columns-split"
      ],
      "defaultContent": [
        "main#main-content > section.dga-py-5xl.dga-bg-neutral-50:nth-of-type(2) h5"
      ]
    },
    {
      "id": "s3",
      "name": "General Information (prose + inline images)",
      "selector": "main#main-content > section.dga-py-5xl.dga-bg-white:nth-of-type(3)",
      "style": "white",
      "blocks": [],
      "defaultContent": [
        "main#main-content > section.dga-py-5xl.dga-bg-white:nth-of-type(3)"
      ]
    },
    {
      "id": "s4",
      "name": "Airlines prose",
      "selector": "main#main-content > section.dga-py-5xl.dga-bg-neutral-50:nth-of-type(4)",
      "style": "grey",
      "blocks": [],
      "defaultContent": [
        "main#main-content > section.dga-py-5xl.dga-bg-neutral-50:nth-of-type(4)"
      ]
    },
    {
      "id": "s5",
      "name": "Airports prose",
      "selector": "main#main-content > section.dga-py-5xl.dga-bg-white:nth-of-type(5)",
      "style": "white",
      "blocks": [],
      "defaultContent": [
        "main#main-content > section.dga-py-5xl.dga-bg-white:nth-of-type(5)"
      ]
    },
    {
      "id": "s6",
      "name": "Transportation modes (icon grid)",
      "selector": "main#main-content > section.dga-py-5xl.dga-bg-neutral-50:nth-of-type(6)",
      "style": "grey",
      "blocks": [
        "cards-sunnah"
      ],
      "defaultContent": [
        "main#main-content > section.dga-py-5xl.dga-bg-neutral-50:nth-of-type(6) h5"
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
