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

  // tools/importer/import-journey-rituals.js
  var import_journey_rituals_exports = {};
  __export(import_journey_rituals_exports, {
    default: () => import_journey_rituals_default
  });

  // tools/importer/parsers/hero-journey.js
  function parse(element, { document: document2 }) {
    const bgImage = element.querySelector("img");
    const heading = element.querySelector('h1, h2, [class*="title"]');
    const subtitle = element.querySelector(
      ".dga-text-lg, .dga-service-providers-content p, p"
    );
    const ctaLinks = Array.from(
      element.querySelectorAll(".dga-service-providers-content a.dga-btn, .dga-btn")
    );
    if (!heading && !subtitle && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subtitle) contentCell.push(subtitle);
    contentCell.push(...ctaLinks);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-journey", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-rituals.js
  function parse2(element, { document: document2 }) {
    const cardEls = Array.from(
      element.querySelectorAll(":scope > div.d-flex.flex-column-reverse, :scope > div.aos-init")
    ).filter((el) => el.querySelector("img"));
    let cards = cardEls;
    if (cards.length === 0) {
      cards = Array.from(element.querySelectorAll(":scope > div")).filter(
        (el) => el.querySelector("img") && el.querySelector("h1, h2, h3, h4, p")
      );
    }
    if (cards.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cards.forEach((card) => {
      const image = card.querySelector("img");
      const heading = card.querySelector("h1, h2, h3, h4");
      const paragraph = card.querySelector("p");
      const stepSpans = Array.from(card.querySelectorAll("span")).filter(
        (s) => s.textContent.trim()
      );
      const textCell = [];
      if (stepSpans.length) {
        const stepText = stepSpans.map((s) => s.textContent.trim()).join(" ");
        const stepP = document2.createElement("p");
        stepP.textContent = stepText;
        textCell.push(stepP);
      }
      if (heading) textCell.push(heading);
      if (paragraph) textCell.push(paragraph);
      cells.push([image || "", textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-rituals", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-sunnah.js
  function parse3(element, { document: document2 }) {
    const cards = Array.from(element.querySelectorAll(":scope > .dga-card, :scope > div"));
    const items = cards.filter((c) => c.querySelector(".dga-card-content, p"));
    if (items.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    items.forEach((card) => {
      const content = card.querySelector(".dga-card-content") || card;
      const textNodes = Array.from(content.querySelectorAll("h1, h2, h3, h4, p")).filter(
        (n) => n.textContent.trim()
      );
      if (textNodes.length === 0) return;
      cells.push([textNodes]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-sunnah", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-banner.js
  function parse4(element, { document: document2 }) {
    const content = element.querySelector(".dga-card-content") || element;
    const heading = content.querySelector('h1, h2, h3, [class*="title"]');
    const paragraphs = Array.from(content.querySelectorAll("p"));
    const cta = element.querySelector(".dga-card-actions a[href], a.dga-btn[href], a[href]");
    if (!heading && paragraphs.length === 0 && !cta) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    paragraphs.forEach((p) => contentCell.push(p));
    const actionCell = [];
    if (cta) actionCell.push(cta);
    const cells = [];
    cells.push([contentCell, actionCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/nusuk-hajj-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".loading-overlay",
        ".lc-widget-wrapper",
        "#ib-button-messaging",
        "#ib-iframe-messaging",
        "#eye-catcher-container"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".dga-digital-stamp",
        "header.dga-header",
        "footer.dga-py-6xl",
        ".dga-feedback-section",
        'nav[aria-label="Breadcrumb"]',
        "a.sr-only.sr-only-focusable",
        "#external-link-warning",
        "iframe",
        "noscript",
        "link",
        "style",
        "script"
      ]);
      element.querySelectorAll("i.hgi").forEach((icon) => icon.remove());
    }
  }

  // tools/importer/transformers/nusuk-hajj-sections.js
  var TransformHook2 = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const template = payload && payload.template;
    const sections = template && template.sections;
    if (!sections || sections.length < 2) return;
    const doc = element.ownerDocument || document;
    const resolved = sections.map((section) => ({
      section,
      el: section.selector ? element.querySelector(section.selector) : null
    })).filter((entry) => entry.el);
    if (!resolved.length) return;
    const NOOP_STYLES = /* @__PURE__ */ new Set(["white", "default", "none", ""]);
    for (let i = resolved.length - 1; i >= 0; i -= 1) {
      const { section, el } = resolved[i];
      if (section.style && !NOOP_STYLES.has(String(section.style).trim().toLowerCase())) {
        const metaBlock = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        el.after(metaBlock);
      }
      if (i > 0) {
        el.before(doc.createElement("hr"));
      }
    }
  }

  // tools/importer/import-journey-rituals.js
  var parsers = {
    "hero-journey": parse,
    "cards-rituals": parse2,
    "cards-sunnah": parse3,
    "columns-banner": parse4
  };
  var PAGE_TEMPLATE = {
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
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    (template.blocks || []).forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
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
  var import_journey_rituals_default = {
    transform: (payload) => {
      const { document: document2, url, html, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: { title: document2.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }];
    }
  };
  return __toCommonJS(import_journey_rituals_exports);
})();
