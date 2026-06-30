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

  // tools/importer/import-legal-text.js
  var import_legal_text_exports = {};
  __export(import_legal_text_exports, {
    default: () => import_legal_text_default
  });

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

  // tools/importer/import-legal-text.js
  var parsers = {};
  var PAGE_TEMPLATE = {
    "name": "legal-text",
    "description": "Legal/text page: inner-page header (breadcrumb + title) followed by one long single-column section of headings, paragraphs and lists. Pure default content, no blocks.",
    "urls": [
      "https://hajj.nusuk.sa/PrivacyPolicy",
      "https://hajj.nusuk.sa/TermsOfUse"
    ],
    "blocks": [],
    "sections": [
      {
        "id": "rc3",
        "name": "Inner-page header (breadcrumb + title)",
        "selector": "#dga-inner-page-header",
        "style": "primary-50",
        "blocks": [],
        "defaultContent": [
          "#dga-inner-page-header"
        ]
      },
      {
        "id": "rc4",
        "name": "Legal text body",
        "selector": "#main-content > section.dga-bg-white",
        "style": "white",
        "blocks": [],
        "defaultContent": [
          "#main-content > section.dga-bg-white"
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
  var import_legal_text_default = {
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
  return __toCommonJS(import_legal_text_exports);
})();
