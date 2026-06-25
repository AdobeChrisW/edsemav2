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

  // tools/importer/import-hajj-homepage.js
  var import_hajj_homepage_exports = {};
  __export(import_hajj_homepage_exports, {
    default: () => import_hajj_homepage_default
  });

  // tools/importer/parsers/hero-video.js
  function parse(element, { document: document2 }) {
    const video = element.querySelector("video");
    const bgCell = [];
    if (video) {
      const poster = video.getAttribute("poster");
      const srcEl = video.querySelector("source[src]");
      const videoSrc = srcEl ? srcEl.getAttribute("src") : video.getAttribute("src") || "";
      if (poster) {
        const img = document2.createElement("img");
        img.src = poster;
        img.alt = "";
        bgCell.push(img);
      }
      if (videoSrc) {
        const link = document2.createElement("a");
        link.href = videoSrc;
        link.textContent = videoSrc;
        bgCell.push(link);
      }
    }
    const contentRoot = element.querySelector(".dga-hero-content") || element;
    const heading = contentRoot.querySelector('h1, h2, [class*="display"]');
    let subheading = null;
    if (heading && heading.tagName.toLowerCase() === "h1") {
      subheading = contentRoot.querySelector("h2");
    }
    const paragraphs = Array.from(contentRoot.querySelectorAll("p"));
    const ctaLinks = Array.from(contentRoot.querySelectorAll("a[href]"));
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    paragraphs.forEach((p) => contentCell.push(p));
    ctaLinks.forEach((a) => contentCell.push(a));
    if (!heading && paragraphs.length === 0 && ctaLinks.length === 0 && bgCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgCell.length) cells.push([bgCell]);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-banner.js
  function parse2(element, { document: document2 }) {
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

  // tools/importer/parsers/tabs-services.js
  function parse3(element, { document: document2 }) {
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
  function parse4(element, { document: document2 }) {
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

  // tools/importer/parsers/cards-steps.js
  function parse5(element, { document: document2 }) {
    const steps = Array.from(element.querySelectorAll(":scope > .step-item"));
    if (steps.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    steps.forEach((step) => {
      const content = step.querySelector(".step-content") || step;
      const number = content.querySelector("h1, h2, h3, h4, h5, h6");
      const label = content.querySelector("p");
      const cardCell = [];
      if (number) cardCell.push(number);
      if (label) cardCell.push(label);
      if (cardCell.length) cells.push([cardCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-steps", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document: document2 }) {
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
    for (let i = resolved.length - 1; i >= 0; i -= 1) {
      const { section, el } = resolved[i];
      if (section.style) {
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

  // tools/importer/import-hajj-homepage.js
  var parsers = {
    "hero-video": parse,
    "columns-banner": parse2,
    "tabs-services": parse3,
    "carousel-video": parse4,
    "cards-steps": parse5,
    "accordion-faq": parse6
  };
  var PAGE_TEMPLATE = {
    name: "hajj-homepage",
    description: "Nusuk Hajj platform homepage: hero with background video and CTAs, global packages banner, services tabs, 'Hajj in a Glimpse' video carousel, 10-steps registration grid, FAQ accordion, and footer.",
    urls: [
      "https://hajj.nusuk.sa"
    ],
    blocks: [
      {
        name: "hero-video",
        instances: ["#main-content > section.dga-hero-section"]
      },
      {
        name: "columns-banner",
        instances: [".global-packages-banner"],
        section: "white"
      },
      {
        name: "tabs-services",
        instances: ["#nav-tabContent"],
        section: "light-grey"
      },
      {
        name: "carousel-video",
        instances: ["#embla-carousel"]
      },
      {
        name: "cards-steps",
        instances: ["#hajj-steps div.d-flex.flex-wrap.align-items-start"]
      },
      {
        name: "accordion-faq",
        instances: ["#accordionFaq"]
      }
    ],
    sections: [
      {
        id: "rc3",
        name: "Hero",
        selector: "#main-content > section.dga-hero-section",
        style: null,
        blocks: ["hero-video"],
        defaultContent: []
      },
      {
        id: "rc4",
        name: "Global Packages Banner",
        selector: "#main-content > section.dga-py-8xl:nth-of-type(2)",
        style: null,
        blocks: ["columns-banner"],
        defaultContent: []
      },
      {
        id: "rc5",
        name: "Services",
        selector: "#main-content > section.dga-py-5xl.dga-bg-neutral-50",
        style: "light-grey",
        blocks: ["tabs-services"],
        defaultContent: ["#main-content > section.dga-py-5xl.dga-bg-neutral-50 h3", "#main-content > section.dga-py-5xl.dga-bg-neutral-50 > div > div.d-flex a"]
      },
      {
        id: "rc6",
        name: "Hajj In A Glimpse",
        selector: "#hajjInAGlimpse",
        style: null,
        blocks: ["carousel-video"],
        defaultContent: ["#hajjInAGlimpse h3"]
      },
      {
        id: "rc7",
        name: "10 Steps",
        selector: "#hajj-steps",
        style: null,
        blocks: ["cards-steps"],
        defaultContent: ["#hajj-steps h3", "#hajj-steps p"]
      },
      {
        id: "rc8",
        name: "FAQ",
        selector: "#home-faq",
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: ["#home-faq h3", "#home-faq > div > div.d-flex a"]
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
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
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
  var import_hajj_homepage_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
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
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_hajj_homepage_exports);
})();
