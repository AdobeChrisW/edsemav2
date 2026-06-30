/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroJourneyParser from './parsers/hero-journey.js';
import tabsServicesParser from './parsers/tabs-services.js';
import carouselVideoParser from './parsers/carousel-video.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/nusuk-hajj-cleanup.js';
import sectionsTransformer from './transformers/nusuk-hajj-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-journey': heroJourneyParser,
  'tabs-services': tabsServicesParser,
  'carousel-video': carouselVideoParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  "name": "packages-catalog",
  "description": "Packages catalog: inner-page hero, tabbed sections, a categories carousel, and a tabbed zones section.",
  "urls": [
    "https://hajj.nusuk.sa/PackagesCategories"
  ],
  "blocks": [
    {
      "name": "hero-journey",
      "instances": [
        "main#main-content > section.dga-packages-section"
      ]
    },
    {
      "name": "tabs-services",
      "instances": [
        "#nav-tabContent",
        "#nav-tabContent2"
      ],
      "section": "white"
    },
    {
      "name": "carousel-video",
      "instances": [
        "#preferred-card-carousel"
      ],
      "section": "white"
    }
  ],
  "sections": [
    {
      "id": "s1",
      "name": "Inner-page hero",
      "selector": "main#main-content > section.dga-packages-section",
      "style": null,
      "blocks": [
        "hero-journey"
      ],
      "defaultContent": []
    },
    {
      "id": "s2",
      "name": "Categories and Packages Features (tabbed)",
      "selector": "main#main-content > section.dga-py-8xl.dga-bg-white:nth-of-type(2)",
      "style": "white",
      "blocks": [
        "tabs-services"
      ],
      "defaultContent": [
        "main#main-content > section.dga-py-8xl.dga-bg-white:nth-of-type(2) h3"
      ]
    },
    {
      "id": "s3",
      "name": "Categories Classifications (carousel)",
      "selector": "main#main-content > section.dga-py-8xl.dga-bg-neutral-50:nth-of-type(3)",
      "style": "white",
      "blocks": [
        "carousel-video"
      ],
      "defaultContent": [
        "main#main-content > section.dga-py-8xl.dga-bg-neutral-50:nth-of-type(3) h3"
      ]
    },
    {
      "id": "s4",
      "name": "Additional Factors that Differentiate Packages (tabbed + zone map)",
      "selector": "main#main-content > section.dga-py-8xl.dga-bg-white:nth-of-type(4)",
      "style": "white",
      "blocks": [
        "tabs-services"
      ],
      "defaultContent": [
        "main#main-content > section.dga-py-8xl.dga-bg-white:nth-of-type(4) h3"
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
