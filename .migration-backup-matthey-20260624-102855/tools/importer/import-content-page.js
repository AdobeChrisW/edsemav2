/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroPgmParser from './parsers/hero-pgm.js';
import embedVideoParser from './parsers/embed-video.js';
import columnsLogosParser from './parsers/columns-logos.js';
import columnsContentParser from './parsers/columns-content.js';

// TRANSFORMER IMPORTS
import mattheyCleanupTransformer from './transformers/matthey-cleanup.js';
import mattheySectionsTransformer from './transformers/matthey-sections.js';

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'content-page',
  description: 'Johnson Matthey content page about future PGMs partnership',
  urls: ['https://matthey.com/future-pgms-partnership'],
  blocks: [
    {
      name: 'hero-pgm',
      instances: ["iframe[src*='ceros']"],
    },
    {
      name: 'embed-video',
      instances: ["iframe[src*='ceros']"],
    },
    {
      name: 'columns-logos',
      instances: ["iframe[src*='ceros']"],
    },
    {
      name: 'columns-content',
      instances: ["iframe[src*='ceros']"],
    },
  ],
  sections: [
    {
      id: 'section-1-hero',
      name: 'Hero and Video Section',
      selector: '.component-html',
      style: null,
      blocks: ['hero-pgm', 'embed-video'],
      defaultContent: [],
    },
    {
      id: 'section-2-logos',
      name: 'Partner Logos Section',
      selector: '.component-html',
      style: null,
      blocks: ['columns-logos'],
      defaultContent: [],
    },
    {
      id: 'section-3-dependence',
      name: 'PGM Dependence Section',
      selector: '.component-html',
      style: null,
      blocks: ['columns-content'],
      defaultContent: [],
    },
    {
      id: 'section-4-opportunity',
      name: 'PGM Opportunity Section',
      selector: '.component-html',
      style: 'dark',
      blocks: ['columns-content'],
      defaultContent: [],
    },
    {
      id: 'section-5-innovation',
      name: 'Leading Innovation Section',
      selector: '.component-html',
      style: 'blue',
      blocks: ['columns-content'],
      defaultContent: [],
    },
    {
      id: 'section-6-contact',
      name: 'Contact Section',
      selector: '.jmtwo--person-temp',
      style: null,
      blocks: [],
      defaultContent: ['.person-heading_align', '.person_card-title', '.btn__person'],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-pgm': heroPgmParser,
  'embed-video': embedVideoParser,
  'columns-logos': columnsLogosParser,
  'columns-content': columnsContentParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  mattheyCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [mattheySectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
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

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
