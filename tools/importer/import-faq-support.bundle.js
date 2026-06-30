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

  // tools/importer/import-faq-support.js
  var import_faq_support_exports = {};
  __export(import_faq_support_exports, {
    default: () => import_faq_support_default
  });

  // tools/importer/parsers/tabs-services.js
  function parse(element, { document: document2 }) {
    const fallbackLabels = {
      services: "Types of Services",
      shifting: "Shifting Service",
      accommodation: "Accommodation Classifications",
      duration: "Packages Duration"
    };
    const panels = Array.from(element.querySelectorAll(':scope > .tab-pane, :scope > [role="tabpanel"]'));
    if (panels.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    panels.forEach((panel) => {
      let labelText = "";
      const labelledBy = panel.getAttribute("aria-labelledby");
      if (labelledBy) {
        const navBtn = document2.getElementById(labelledBy);
        if (navBtn) labelText = navBtn.textContent.trim();
      }
      if (!labelText) {
        labelText = fallbackLabels[panel.id] || (panel.id || "").replace(/[-_]/g, " ").trim();
      }
      const labelCell = document2.createElement("p");
      labelCell.textContent = labelText;
      const contentChildren = Array.from(panel.children);
      const contentCell = contentChildren.length ? contentChildren : [panel];
      cells.push([labelCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-services", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse2(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(":scope > .accordion-item"));
    if (items.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    items.forEach((item) => {
      const button = item.querySelector(".accordion-button, button");
      const header = item.querySelector(".accordion-header, h1, h2, h3, h4, h5, h6");
      const questionText = button && button.textContent.trim() || header && header.textContent.trim() || "";
      const titleCell = document2.createElement("p");
      titleCell.textContent = questionText;
      const body = item.querySelector(".accordion-body") || item.querySelector(".accordion-collapse");
      let contentCell;
      if (body) {
        const children = Array.from(body.children);
        contentCell = children.length ? children : [body];
      } else {
        contentCell = [document2.createTextNode("")];
      }
      cells.push([titleCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-support.js
  function parse3(element, { document: document2 }) {
    let cards = Array.from(element.querySelectorAll(".dga-card"));
    if (cards.length === 0) {
      cards = Array.from(element.querySelectorAll(":scope > div"));
    }
    const items = cards.filter((c) => c.querySelector(".dga-card-content, p, .dga-card-title"));
    if (items.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    items.forEach((card) => {
      const content = card.querySelector(".dga-card-content") || card;
      const title = content.querySelector(".dga-card-title, h1, h2, h3, h4");
      const paras = Array.from(content.querySelectorAll("p")).filter((p) => p.textContent.trim());
      const ctaArea = card.querySelector(".dga-card-actions");
      const ctas = ctaArea ? Array.from(ctaArea.querySelectorAll("a")).filter((a) => a.textContent.trim()) : [];
      const textCell = [];
      if (title) textCell.push(title);
      textCell.push(...paras);
      textCell.push(...ctas);
      if (textCell.length === 0) return;
      cells.push([textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-support", cells });
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

  // tools/importer/import-faq-support.js
  var parsers = {
    "tabs-services": parse,
    "accordion-faq": parse2,
    "cards-support": parse3
  };
  var PAGE_TEMPLATE = {
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
  var import_faq_support_default = {
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
  return __toCommonJS(import_faq_support_exports);
})();
