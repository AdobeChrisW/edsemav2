// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

// Source feature icons were an icon font (stripped on import). Map each feature
// label to a matching stroke SVG so the migrated panel shows the same icons.
const SERVICE_ICONS = {
  flights: 'svc-flights.svg',
  accommodations: 'svc-accommodations.svg',
  catering: 'svc-catering.svg',
  transportation: 'svc-transportation.svg',
  mashair: 'svc-mashair.svg',
  'tour guide': 'svc-tour-guide.svg',
  'visa issuance': 'svc-visa.svg',
};

// Inject a featured icon into each short label paragraph that matches the map.
function decorateFeatureIcons(block) {
  block.querySelectorAll('.tabs-services-panel p').forEach((p) => {
    if (p.querySelector('img')) return;
    const key = p.textContent.trim().toLowerCase();
    const iconFile = SERVICE_ICONS[key];
    if (!iconFile) return;
    const img = document.createElement('img');
    img.src = `${window.hlx?.codeBasePath || ''}/icons/${iconFile}`;
    img.alt = '';
    img.loading = 'lazy';
    img.className = 'tabs-services-feature-icon';
    p.prepend(img);
    p.classList.add('tabs-services-feature');
  });
}

export default async function decorate(block) {
  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-services-list';
  tablist.setAttribute('role', 'tablist');

  // decorate tabs and tabpanels
  const tabs = [...block.children].map((child) => child.firstElementChild);
  tabs.forEach((tab, i) => {
    const id = toClassName(tab.textContent);

    // decorate tabpanel
    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-services-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    // build tab button
    const button = document.createElement('button');
    button.className = 'tabs-services-tab';
    button.id = `tab-${id}`;

    moveInstrumentation(tab.parentElement, tabpanel.lastElementChild);
    button.innerHTML = tab.innerHTML;

    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);
    tab.remove();
    moveInstrumentation(button.querySelector('p'), null);
  });

  block.prepend(tablist);

  decorateFeatureIcons(block);
}
