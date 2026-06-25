/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-services. Base block: tabs.
 * Source: https://hajj.nusuk.sa (#nav-tabContent)
 * Generated for Document Authoring (da) project.
 *
 * Tabs library structure: 2 columns, multiple rows; row 1 is the block name.
 * Each subsequent row = one tab: col1 = tab label, col2 = tab panel content.
 *
 * The element (#nav-tabContent) holds only the panels. Each panel's tab label
 * lives in a separate nav button referenced by the panel's aria-labelledby id
 * (e.g. nav-services). We resolve the label from that button via the document,
 * with a fallback label map keyed by panel id.
 */
export default function parse(element, { document }) {
  const fallbackLabels = {
    services: 'Types of Services',
    shifting: 'Shifting Service',
    accommodation: 'Accommodation Classifications',
    duration: 'Packages Duration',
  };

  const panels = Array.from(element.querySelectorAll(':scope > .tab-pane, :scope > [role="tabpanel"]'));

  // Empty-block guard
  if (panels.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  panels.forEach((panel) => {
    // Resolve the tab label from the controlling nav button, if present.
    let labelText = '';
    const labelledBy = panel.getAttribute('aria-labelledby');
    if (labelledBy) {
      const navBtn = document.getElementById(labelledBy);
      if (navBtn) labelText = navBtn.textContent.trim();
    }
    if (!labelText) {
      labelText = fallbackLabels[panel.id] || (panel.id || '').replace(/[-_]/g, ' ').trim();
    }

    const labelCell = document.createElement('p');
    labelCell.textContent = labelText;

    // Panel content: keep the existing child nodes intact (headings, paragraphs,
    // feature-icon grid, multi-column rows) as the second cell.
    const contentChildren = Array.from(panel.children);
    const contentCell = contentChildren.length ? contentChildren : [panel];

    cells.push([labelCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-services', cells });
  element.replaceWith(block);
}
