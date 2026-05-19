/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroHomepageParser from './parsers/hero-homepage.js';
import searchCourseParser from './parsers/search-course.js';
import cardsPromoParser from './parsers/cards-promo.js';
import cardsStatsParser from './parsers/cards-stats.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import cardsImageCtaParser from './parsers/cards-image-cta.js';
import carouselNewsParser from './parsers/carousel-news.js';
import cardsEventParser from './parsers/cards-event.js';
import columnsLogosParser from './parsers/columns-logos.js';

// TRANSFORMER IMPORTS
import nottinghamCleanupTransformer from './transformers/nottingham-cleanup.js';
import nottinghamSectionsTransformer from './transformers/nottingham-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-homepage': heroHomepageParser,
  'search-course': searchCourseParser,
  'cards-promo': cardsPromoParser,
  'cards-stats': cardsStatsParser,
  'columns-feature': columnsFeatureParser,
  'cards-image-cta': cardsImageCtaParser,
  'carousel-news': carouselNewsParser,
  'cards-event': cardsEventParser,
  'columns-logos': columnsLogosParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'University of Nottingham homepage with hero, featured content, and navigation to key areas',
  urls: ['https://www.nottingham.ac.uk/'],
  blocks: [
    {
      name: 'hero-homepage',
      instances: ['.homepage-hero-banner'],
    },
    {
      name: 'search-course',
      instances: ['.search-section'],
    },
    {
      name: 'cards-promo',
      instances: ['.homepage-campaign-tiles'],
    },
    {
      name: 'cards-stats',
      instances: ['.homepage-rankings'],
    },
    {
      name: 'columns-feature',
      instances: ['.homepage-image-cta-block'],
    },
    {
      name: 'cards-image-cta',
      instances: ['.homepage-image-cta-row'],
    },
    {
      name: 'carousel-news',
      instances: ['.news-carousel'],
    },
    {
      name: 'cards-event',
      instances: ['.events-section .row.g-4'],
    },
    {
      name: 'columns-logos',
      instances: ['.homepage-partnerships'],
    },
  ],
  sections: [
    {
      id: 'section-1-hero',
      name: 'Hero Section',
      selector: '.homepage-hero-banner',
      style: null,
      blocks: ['hero-homepage'],
      defaultContent: [],
    },
    {
      id: 'section-2-search',
      name: 'Course Search Section',
      selector: '.search-section',
      style: null,
      blocks: ['search-course'],
      defaultContent: [],
    },
    {
      id: 'section-3-campaign',
      name: 'Campaign Tiles Section',
      selector: '.homepage-campaign-tiles',
      style: null,
      blocks: ['cards-promo'],
      defaultContent: [],
    },
    {
      id: 'section-4-rankings',
      name: 'Rankings Section',
      selector: '.homepage-rankings',
      style: null,
      blocks: ['cards-stats'],
      defaultContent: [],
    },
    {
      id: 'section-5-research',
      name: 'Research Section',
      selector: '.homepage-bg-container',
      style: 'grey',
      blocks: ['columns-feature', 'cards-image-cta'],
      defaultContent: ['.homepage-bg-container > .container > h2'],
    },
    {
      id: 'section-6-news',
      name: 'News Section',
      selector: '.news-section',
      style: null,
      blocks: ['carousel-news'],
      defaultContent: ['.news-section .news-events-title', '.news-section .news-events-all-link'],
    },
    {
      id: 'section-7-events',
      name: 'Events Section',
      selector: '.events-section',
      style: null,
      blocks: ['cards-event'],
      defaultContent: ['.events-section .news-events-title', '.events-section .news-events-all-link'],
    },
    {
      id: 'section-8-partnerships',
      name: 'Partnerships Section',
      selector: '.homepage-partnerships',
      style: 'dark',
      blocks: ['columns-logos'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  nottinghamCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [nottinghamSectionsTransformer] : []),
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
