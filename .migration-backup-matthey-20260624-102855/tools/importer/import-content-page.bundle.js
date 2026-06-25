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

  // tools/importer/import-content-page.js
  var import_content_page_exports = {};
  __export(import_content_page_exports, {
    default: () => import_content_page_default
  });

  // tools/importer/parsers/hero-pgm.js
  function parse(element, { document }) {
    const parentContainer = element.closest('.component-html, section, [class*="hero"], [class*="banner"]');
    const nearbyH1 = parentContainer ? parentContainer.querySelector('h1, h2, [class*="heading"], [class*="title"]') : null;
    const existingH1 = document.querySelector("h1");
    const pageTitle = document.querySelector("title");
    const metaOgTitle = document.querySelector('meta[property="og:title"]');
    const heading = document.createElement("h1");
    if (nearbyH1 && nearbyH1.textContent.trim()) {
      heading.textContent = nearbyH1.textContent.trim();
    } else if (existingH1 && existingH1.textContent.trim()) {
      heading.textContent = existingH1.textContent.trim();
    } else if (metaOgTitle && metaOgTitle.getAttribute("content")) {
      heading.textContent = metaOgTitle.getAttribute("content").trim();
    } else if (pageTitle && pageTitle.textContent.trim()) {
      let titleText = pageTitle.textContent.trim();
      const pipeIndex = titleText.indexOf("|");
      if (pipeIndex > 0) {
        titleText = titleText.substring(0, pipeIndex).trim();
      }
      heading.textContent = titleText;
    } else {
      heading.textContent = "Developing the future of platinum group metals";
    }
    const cells = [
      [heading]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-pgm", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed-video.js
  function parse2(element, { document }) {
    const iframe = element.matches("iframe") ? element : element.querySelector('iframe[src*="ceros"]');
    if (!iframe) return;
    const srcAttr = iframe.getAttribute("src");
    let embedUrl;
    try {
      const url = new URL(srcAttr);
      embedUrl = `${url.origin}${url.pathname}`;
    } catch (e) {
      embedUrl = srcAttr;
    }
    const link = document.createElement("a");
    link.href = embedUrl;
    link.textContent = embedUrl;
    const cells = [[link]];
    const block = WebImporter.Blocks.createBlock(document, { name: "embed-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-logos.js
  function parse3(element, { document }) {
    const logos = [
      "JM Logo",
      "Sibanye-Stillwater Logo",
      "Valterra Platinum Logo"
    ];
    const cells = [
      logos.map((logoText) => {
        const placeholder = document.createElement("p");
        placeholder.textContent = logoText;
        return placeholder;
      })
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-logos", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-content.js
  function parse4(element, { document }) {
    const textCell = document.createElement("div");
    const heading = document.createElement("h2");
    heading.textContent = "[Text content]";
    const paragraph = document.createElement("p");
    paragraph.textContent = "[Description paragraph - author to replace with actual content]";
    textCell.append(heading, paragraph);
    const imageCell = document.createElement("div");
    const imgPlaceholder = document.createElement("p");
    imgPlaceholder.textContent = "[Image]";
    imageCell.append(imgPlaceholder);
    const cells = [
      [textCell, imageCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-content", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/matthey-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "form#hrefFm",
        ".lfr-spa-loading-bar",
        "#tooltipContainer",
        "#yui3-css-stamp"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header#banner",
        "nav#hnew_quickAccessNav",
        "nav#navigation",
        "nav#breadcrumbs",
        ".container-fluid.bg--theme",
        ".socialmedia__list.bg--white",
        ".lfr-layout-structure-item-basic-component-spacer",
        "link",
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/matthey-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const template = payload.template;
      if (!template || !template.sections || template.sections.length < 2) {
        return;
      }
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        let sectionEl = null;
        if (section.selector) {
          if (section.selector === ".component-html" && i > 0) {
            continue;
          }
          sectionEl = element.querySelector(section.selector);
        }
        if (section.style && sectionEl) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0 && sectionEl) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-content-page.js
  var PAGE_TEMPLATE = {
    name: "content-page",
    description: "Johnson Matthey content page about future PGMs partnership",
    urls: ["https://matthey.com/future-pgms-partnership"],
    blocks: [
      {
        name: "hero-pgm",
        instances: ["iframe[src*='ceros']"]
      },
      {
        name: "embed-video",
        instances: ["iframe[src*='ceros']"]
      },
      {
        name: "columns-logos",
        instances: ["iframe[src*='ceros']"]
      },
      {
        name: "columns-content",
        instances: ["iframe[src*='ceros']"]
      }
    ],
    sections: [
      {
        id: "section-1-hero",
        name: "Hero and Video Section",
        selector: ".component-html",
        style: null,
        blocks: ["hero-pgm", "embed-video"],
        defaultContent: []
      },
      {
        id: "section-2-logos",
        name: "Partner Logos Section",
        selector: ".component-html",
        style: null,
        blocks: ["columns-logos"],
        defaultContent: []
      },
      {
        id: "section-3-dependence",
        name: "PGM Dependence Section",
        selector: ".component-html",
        style: null,
        blocks: ["columns-content"],
        defaultContent: []
      },
      {
        id: "section-4-opportunity",
        name: "PGM Opportunity Section",
        selector: ".component-html",
        style: "dark",
        blocks: ["columns-content"],
        defaultContent: []
      },
      {
        id: "section-5-innovation",
        name: "Leading Innovation Section",
        selector: ".component-html",
        style: "blue",
        blocks: ["columns-content"],
        defaultContent: []
      },
      {
        id: "section-6-contact",
        name: "Contact Section",
        selector: ".jmtwo--person-temp",
        style: null,
        blocks: [],
        defaultContent: [".person-heading_align", ".person_card-title", ".btn__person"]
      }
    ]
  };
  var parsers = {
    "hero-pgm": parse,
    "embed-video": parse2,
    "columns-logos": parse3,
    "columns-content": parse4
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
  var import_content_page_default = {
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
  return __toCommonJS(import_content_page_exports);
})();
