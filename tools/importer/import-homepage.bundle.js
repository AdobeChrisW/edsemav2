/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-homepage.js
  function parse(element, { document }) {
    const bgImage = element.querySelector("img.desktop-banner-image, img.mobile-banner-image, .banner-background img");
    const heading = element.querySelector("h1.banner-title, .banner-content h1, .banner-content h2");
    const description = element.querySelector("p.banner-text, .banner-content p");
    const ctaLink = element.querySelector("a.stripe-white-cta, .banner-content a");
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (ctaLink) contentCell.push(ctaLink);
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-homepage", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/search-course.js
  function parse2(element, { document }) {
    const heading = element.querySelector("h2.search-section-title, h2, .search-section-title");
    const existingLink = element.querySelector("a[href]");
    const searchButton = element.querySelector("button#action, button.button--secondary, .search-submit button");
    const cells = [];
    const contentCell = [];
    if (existingLink) {
      contentCell.push(existingLink);
    } else {
      const dataLink = document.createElement("a");
      dataLink.href = "/query-index.json";
      dataLink.textContent = "/query-index.json";
      contentCell.push(dataLink);
    }
    cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "search-course", cells });
    if (heading) {
      const fragment = document.createDocumentFragment();
      fragment.append(heading);
      fragment.append(block);
      element.replaceWith(fragment);
    } else {
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/cards-promo.js
  function parse3(element, { document }) {
    const tiles = element.querySelectorAll(".campaign-tile");
    const tileList = tiles.length > 0 ? tiles : element.querySelectorAll(".tile-container > div");
    const cells = [];
    tileList.forEach((tile) => {
      const cellContent = [];
      const heading = tile.querySelector('h2.campaign-tile-title, h2, h3, [class*="tile-title"]');
      if (heading) cellContent.push(heading);
      const description = tile.querySelector('p.campaign-tile-text, p, [class*="tile-text"]');
      if (description) cellContent.push(description);
      const links = tile.querySelectorAll(".campaign-tile-links a");
      const linkList = links.length > 0 ? links : tile.querySelectorAll("a.inline-link");
      linkList.forEach((link) => {
        cellContent.push(link);
      });
      if (cellContent.length > 0) {
        cells.push([cellContent]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-stats.js
  function parse4(element, { document }) {
    const tiles = element.querySelectorAll(".ranking-tile-container .ranking-tile, .ranking-tile");
    const cells = [];
    tiles.forEach((tile) => {
      const statEl = tile.querySelector(".ranking-title span, .ranking-title");
      const textContainer = tile.querySelector(".ranking-text");
      const cellContent = [];
      if (statEl) {
        const heading = document.createElement("h3");
        heading.textContent = statEl.textContent.trim();
        cellContent.push(heading);
      }
      if (textContainer) {
        const paragraphs = textContainer.querySelectorAll("p");
        paragraphs.forEach((p) => {
          const clone = p.cloneNode(true);
          cellContent.push(clone);
        });
      }
      if (cellContent.length > 0) {
        cells.push([cellContent]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-stats", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse5(element, { document }) {
    const textContainer = element.querySelector(".text-content");
    const heading = element.querySelector(".text-content h3, .text-content h2, .text-content h1");
    const description = element.querySelector(".text-content p");
    const ctaLink = element.querySelector("a.stripe-white-cta, a.cta, a.button, .block-content a");
    const image = element.querySelector(".image-container img, .col-lg-6 img, img");
    const textCell = [];
    if (heading) textCell.push(heading);
    if (description) textCell.push(description);
    if (ctaLink) textCell.push(ctaLink);
    const imageCell = [];
    if (image) imageCell.push(image);
    const cells = [
      [textCell, imageCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-image-cta.js
  function parse6(element, { document }) {
    const cards = element.querySelectorAll(".imageWhiteCTA-card");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector("img.background-image, img");
      const link = card.querySelector("a.stripe-white-cta, a");
      const imageCell = [];
      if (img) {
        const picture = document.createElement("picture");
        const imgClone = img.cloneNode(true);
        picture.appendChild(imgClone);
        imageCell.push(picture);
      }
      const bodyCell = [];
      if (link) {
        const linkClone = link.cloneNode(true);
        bodyCell.push(linkClone);
      }
      if (imageCell.length > 0 || bodyCell.length > 0) {
        cells.push([imageCell, bodyCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-image-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-news.js
  function parse7(element, { document }) {
    const slides = element.querySelectorAll(".slick-slide:not(.slick-cloned)");
    const cells = [];
    slides.forEach((slide) => {
      const card = slide.querySelector(".vertical-card");
      if (!card) return;
      const image = card.querySelector("img.vertical-card-img");
      const contentArea = card.querySelector(".card-content");
      const heading = contentArea ? contentArea.querySelector("h3.news-title, h3, h2") : null;
      const description = contentArea ? contentArea.querySelector("p.news-desc, p") : null;
      const link = contentArea ? contentArea.querySelector("a.inline-link, a") : null;
      const contentCell = [];
      if (heading) contentCell.push(heading);
      if (description) contentCell.push(description);
      if (link) contentCell.push(link);
      const imageCell = image ? [image] : [""];
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-event.js
  function parse8(element, { document }) {
    const cards = element.querySelectorAll(".vertical-card");
    const cardList = cards.length > 0 ? cards : element.querySelectorAll(':scope > [class*="col"]');
    const cells = [];
    cardList.forEach((card) => {
      const img = card.querySelector('img.vertical-card-img, img[class*="card-img"], img');
      const dayEl = card.querySelector(".date .day, .day");
      const monthEl = card.querySelector(".date .month, .month");
      const heading = card.querySelector('h3.event-title, h3, h2, [class*="event-title"]');
      const link = card.querySelector("a.inline-link, .card-content a, a");
      const imageCell = [];
      if (img) {
        imageCell.push(img);
      }
      const bodyCell = [];
      if (dayEl || monthEl) {
        const datePara = document.createElement("p");
        const dayText = dayEl ? dayEl.textContent.trim() : "";
        const monthText = monthEl ? monthEl.textContent.trim() : "";
        datePara.textContent = `${dayText} ${monthText}`.trim();
        bodyCell.push(datePara);
      }
      if (heading) {
        bodyCell.push(heading);
      }
      if (link) {
        bodyCell.push(link);
      }
      if (imageCell.length > 0 || bodyCell.length > 0) {
        cells.push([imageCell, bodyCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-event", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-logos.js
  function parse9(element, { document }) {
    const desktopContainer = element.querySelector(".d-none.d-md-inline, .large-display-icons");
    const logoContainer = desktopContainer || element;
    const logos = Array.from(logoContainer.querySelectorAll("img.partner-icon, img[alt]"));
    const cells = [];
    if (logos.length > 0) {
      const row = logos.map((logo) => [logo]);
      cells.push(row);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-logos", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/nottingham-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "iframe.ot-text-resize"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".headerv2-component",
        "footer#footer",
        ".aspNetHidden",
        "link",
        "noscript"
      ]);
      const form = element.querySelector("form#form1");
      if (form) {
        while (form.firstChild) {
          form.parentNode.insertBefore(form.firstChild, form);
        }
        form.remove();
      }
    }
  }

  // tools/importer/transformers/nottingham-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          if (sectionEl.nextSibling) {
            sectionEl.parentNode.insertBefore(metaBlock, sectionEl.nextSibling);
          } else {
            sectionEl.parentNode.appendChild(metaBlock);
          }
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.parentNode.insertBefore(hr, sectionEl);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-homepage": parse,
    "search-course": parse2,
    "cards-promo": parse3,
    "cards-stats": parse4,
    "columns-feature": parse5,
    "cards-image-cta": parse6,
    "carousel-news": parse7,
    "cards-event": parse8,
    "columns-logos": parse9
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "University of Nottingham homepage with hero, featured content, and navigation to key areas",
    urls: ["https://www.nottingham.ac.uk/"],
    blocks: [
      {
        name: "hero-homepage",
        instances: [".homepage-hero-banner"]
      },
      {
        name: "search-course",
        instances: [".search-section"]
      },
      {
        name: "cards-promo",
        instances: [".homepage-campaign-tiles"]
      },
      {
        name: "cards-stats",
        instances: [".homepage-rankings"]
      },
      {
        name: "columns-feature",
        instances: [".homepage-image-cta-block"]
      },
      {
        name: "cards-image-cta",
        instances: [".homepage-image-cta-row"]
      },
      {
        name: "carousel-news",
        instances: [".news-carousel"]
      },
      {
        name: "cards-event",
        instances: [".events-section .row.g-4"]
      },
      {
        name: "columns-logos",
        instances: [".homepage-partnerships"]
      }
    ],
    sections: [
      {
        id: "section-1-hero",
        name: "Hero Section",
        selector: ".homepage-hero-banner",
        style: null,
        blocks: ["hero-homepage"],
        defaultContent: []
      },
      {
        id: "section-2-search",
        name: "Course Search Section",
        selector: ".search-section",
        style: null,
        blocks: ["search-course"],
        defaultContent: []
      },
      {
        id: "section-3-campaign",
        name: "Campaign Tiles Section",
        selector: ".homepage-campaign-tiles",
        style: null,
        blocks: ["cards-promo"],
        defaultContent: []
      },
      {
        id: "section-4-rankings",
        name: "Rankings Section",
        selector: ".homepage-rankings",
        style: null,
        blocks: ["cards-stats"],
        defaultContent: []
      },
      {
        id: "section-5-research",
        name: "Research Section",
        selector: ".homepage-bg-container",
        style: "grey",
        blocks: ["columns-feature", "cards-image-cta"],
        defaultContent: [".homepage-bg-container > .container > h2"]
      },
      {
        id: "section-6-news",
        name: "News Section",
        selector: ".news-section",
        style: null,
        blocks: ["carousel-news"],
        defaultContent: [".news-section .news-events-title", ".news-section .news-events-all-link"]
      },
      {
        id: "section-7-events",
        name: "Events Section",
        selector: ".events-section",
        style: null,
        blocks: ["cards-event"],
        defaultContent: [".events-section .news-events-title", ".events-section .news-events-all-link"]
      },
      {
        id: "section-8-partnerships",
        name: "Partnerships Section",
        selector: ".homepage-partnerships",
        style: "dark",
        blocks: ["columns-logos"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
