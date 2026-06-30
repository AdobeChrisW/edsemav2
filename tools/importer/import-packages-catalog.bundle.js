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

  // tools/importer/import-packages-catalog.js
  var import_packages_catalog_exports = {};
  __export(import_packages_catalog_exports, {
    default: () => import_packages_catalog_default
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

  // tools/importer/parsers/tabs-services.js
  function parse2(element, { document: document2 }) {
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

  // tools/importer/parsers/carousel-video.js
  function parse3(element, { document: document2 }) {
    const slides = Array.from(element.querySelectorAll(".embla__slide"));
    if (slides.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    slides.forEach((slide) => {
      const video = slide.querySelector("video");
      if (!video) return;
      const poster = video.getAttribute("poster");
      const sourceEl = video.querySelector("source[src]");
      const videoSrc = video.getAttribute("data-src") || (sourceEl ? sourceEl.getAttribute("src") : "") || video.getAttribute("src") || "";
      const imageCell = [];
      if (poster) {
        const img = document2.createElement("img");
        img.src = poster;
        img.alt = "";
        imageCell.push(img);
      }
      const linkCell = [];
      if (videoSrc) {
        const link = document2.createElement("a");
        link.href = videoSrc;
        link.textContent = videoSrc;
        linkCell.push(link);
      }
      cells.push([imageCell, linkCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-video", cells });
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

  // tools/importer/import-packages-catalog.js
  var parsers = {
    "hero-journey": parse,
    "tabs-services": parse2,
    "carousel-video": parse3
  };
  var PAGE_TEMPLATE = {
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
  var import_packages_catalog_default = {
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
  return __toCommonJS(import_packages_catalog_exports);
})();
