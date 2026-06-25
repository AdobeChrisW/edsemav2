import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates desktop width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code !== 'Escape') return;
  const nav = document.getElementById('nav');
  if (!nav || nav.getAttribute('aria-expanded') !== 'true') return;
  if (!isDesktop.matches) {
    // eslint-disable-next-line no-use-before-define
    toggleMenu(nav, false);
    nav.querySelector('.nav-hamburger button')?.focus();
  }
}

/**
 * Toggle the mobile menu open/closed.
 * @param {Element} nav nav element
 * @param {Boolean|null} forceExpanded force a state, or null to toggle
 */
function toggleMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  if (button) {
    button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  }
  if (!expanded && !isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

/**
 * Build the language selector dropdown from a <ul> of language links.
 * @param {Element} list the <ul> of language links
 * @returns {Element} the locale selector element
 */
function buildLocaleSelector(list) {
  const wrapper = document.createElement('div');
  wrapper.className = 'nav-locale';

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'nav-locale-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-haspopup', 'true');
  // Show the current language code; default EN.
  toggle.innerHTML = '<span class="nav-locale-globe" aria-hidden="true"></span><span class="nav-locale-label">EN</span><span class="nav-locale-caret" aria-hidden="true"></span>';

  const menu = document.createElement('div');
  menu.className = 'nav-locale-menu';
  menu.hidden = true;
  menu.append(list);

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
    menu.hidden = open;
  });

  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
    }
  });

  wrapper.append(toggle, menu);
  return wrapper;
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  let navPath = navMeta ? new URL(navMeta, window.location).pathname : '/content/nav';
  let fragment = await loadFragment(navPath);
  if (!fragment) {
    navPath = '/nav';
    fragment = await loadFragment(navPath);
  }

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';

  const sections = [...fragment.querySelectorAll(':scope .section')];
  // Expected order: 0 = utility bar, 1 = brand/logo, 2 = menu links, 3 = tools
  const [utility, brand, menu, tools] = sections;

  // --- Utility bar (row 0) ---
  if (utility) {
    utility.classList.add('nav-utility');
    nav.append(utility);
  }

  // --- Main bar wrapper (row 1): brand + menu + tools ---
  const mainBar = document.createElement('div');
  mainBar.className = 'nav-main';

  if (brand) {
    brand.classList.add('nav-brand');
    // unwrap any button styling EDS applied to the logo link
    brand.querySelectorAll('a.button').forEach((a) => { a.className = ''; });
    brand.querySelectorAll('.button-container').forEach((c) => { c.className = ''; });
    // mark in-page skip links (href starting with #) as visually-hidden helpers
    brand.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.closest('p')?.classList.add('nav-skip-link');
    });
    mainBar.append(brand);
  }

  if (menu) {
    menu.classList.add('nav-sections');
    // mark the current page link so it gets the active green pill
    const here = window.location.pathname.replace(/\/$/, '') || '/';
    menu.querySelectorAll('a').forEach((a) => {
      const href = (a.getAttribute('href') || '').replace(/\/$/, '') || '/';
      if (href === here) a.setAttribute('aria-current', 'page');
    });
    mainBar.append(menu);
  }

  if (tools) {
    tools.classList.add('nav-tools');
    // Find the language <ul> (list of language links) and convert to a dropdown.
    const localeList = tools.querySelector('ul');
    if (localeList) {
      const locale = buildLocaleSelector(localeList);
      // insert locale where the list used to be (after Search, before Login)
      tools.append(locale);
    }
    mainBar.append(tools);
  }

  // hamburger button (mobile)
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav));
  mainBar.prepend(hamburger);

  nav.append(mainBar);
  nav.setAttribute('aria-expanded', 'false');

  toggleMenu(nav, false);
  isDesktop.addEventListener('change', () => toggleMenu(nav, false));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
