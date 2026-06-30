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

  // tools/importer/import-guidelines-article.js
  var import_guidelines_article_exports = {};
  __export(import_guidelines_article_exports, {
    default: () => import_guidelines_article_default
  });

  // tools/importer/parsers/columns-split.js
  function parse(element, { document: document2 }) {
    let cols = Array.from(element.querySelectorAll(':scope > [class*="col-"]'));
    if (cols.length < 2) {
      cols = Array.from(element.children).filter((c) => c.matches('[class*="col-"], div'));
    }
    if (cols.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const buildCell = (col) => {
      const cell = [];
      col.querySelectorAll("nav, .dga-breadcrumb").forEach((n) => n.remove());
      col.querySelectorAll("i.hgi, .dga-featured-icon").forEach((i) => i.remove());
      const img = col.querySelector("img");
      const meaningful = Array.from(
        col.querySelectorAll("h1, h2, h3, h4, h5, p, ul, ol, a")
      ).filter((n) => n.textContent.trim() || n.tagName === "IMG");
      if (img) cell.push(img);
      if (meaningful.length) {
        cell.push(...meaningful);
      } else if (!img) {
        cell.push(col);
      }
      return cell;
    };
    const leftCell = buildCell(cols[0]);
    const rightCell = cols[1] ? buildCell(cols[1]) : [""];
    const cells = [[leftCell.length ? leftCell : "", rightCell.length ? rightCell : ""]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-split", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-sunnah.js
  function parse2(element, { document: document2 }) {
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

  // tools/importer/import-guidelines-article.js
  var parsers = {
    "columns-split": parse,
    "cards-sunnah": parse2
  };
  var PAGE_TEMPLATE = {
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
  var import_guidelines_article_default = {
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
  return __toCommonJS(import_guidelines_article_exports);
})();
