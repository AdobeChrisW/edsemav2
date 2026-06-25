/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroVideoParser from './parsers/hero-video.js';
import columnsBannerParser from './parsers/columns-banner.js';
import tabsServicesParser from './parsers/tabs-services.js';
import carouselVideoParser from './parsers/carousel-video.js';
import cardsStepsParser from './parsers/cards-steps.js';
import accordionFaqParser from './parsers/accordion-faq.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/nusuk-hajj-cleanup.js';
import sectionsTransformer from './transformers/nusuk-hajj-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-video': heroVideoParser,
  'columns-banner': columnsBannerParser,
  'tabs-services': tabsServicesParser,
  'carousel-video': carouselVideoParser,
  'cards-steps': cardsStepsParser,
  'accordion-faq': accordionFaqParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'hajj-homepage',
  description: "Nusuk Hajj platform homepage: hero with background video and CTAs, global packages banner, services tabs, 'Hajj in a Glimpse' video carousel, 10-steps registration grid, FAQ accordion, and footer.",
  urls: [
    'https://hajj.nusuk.sa',
  ],
  blocks: [
    {
      name: 'hero-video',
      instances: ['#main-content > section.dga-hero-section'],
    },
    {
      name: 'columns-banner',
      instances: ['.global-packages-banner'],
      section: 'white',
    },
    {
      name: 'tabs-services',
      instances: ['#nav-tabContent'],
      section: 'light-grey',
    },
    {
      name: 'carousel-video',
      instances: ['#embla-carousel'],
    },
    {
      name: 'cards-steps',
      instances: ['#hajj-steps div.d-flex.flex-wrap.align-items-start'],
    },
    {
      name: 'accordion-faq',
      instances: ['#accordionFaq'],
    },
  ],
  sections: [
    {
      id: 'rc3', name: 'Hero', selector: '#main-content > section.dga-hero-section', style: null, blocks: ['hero-video'], defaultContent: [],
    },
    {
      id: 'rc4', name: 'Global Packages Banner', selector: '#main-content > section.dga-py-8xl:nth-of-type(2)', style: null, blocks: ['columns-banner'], defaultContent: [],
    },
    {
      id: 'rc5', name: 'Services', selector: '#main-content > section.dga-py-5xl.dga-bg-neutral-50', style: 'light-grey', blocks: ['tabs-services'], defaultContent: ['#main-content > section.dga-py-5xl.dga-bg-neutral-50 h3', '#main-content > section.dga-py-5xl.dga-bg-neutral-50 > div > div.d-flex a'],
    },
    {
      id: 'rc6', name: 'Hajj In A Glimpse', selector: '#hajjInAGlimpse', style: null, blocks: ['carousel-video'], defaultContent: ['#hajjInAGlimpse h3'],
    },
    {
      id: 'rc7', name: '10 Steps', selector: '#hajj-steps', style: null, blocks: ['cards-steps'], defaultContent: ['#hajj-steps h3', '#hajj-steps p'],
    },
    {
      id: 'rc8', name: 'FAQ', selector: '#home-faq', style: null, blocks: ['accordion-faq'], defaultContent: ['#home-faq h3', '#home-faq > div > div.d-flex a'],
    },
  ],
};

// TRANSFORMER REGISTRY - cleanup first, then sections (sections needs cleaned DOM)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
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

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // already replaced by an earlier parser
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

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized path
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
