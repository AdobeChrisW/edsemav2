export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-banner-${cols.length}-cols`);

  // White CTA-card variant (e.g. "Start your journey now!"): the source renders
  // it as a white bordered card with a green pilgrim icon, not the dark gradient
  // promo banner. Detect it by the h4 heading (the dark promo uses h2) and tag it
  // so the CSS applies the white-card treatment + inject the icon (stripped on import).
  if (block.querySelector('h4') && !block.querySelector('h2')) {
    block.classList.add('columns-banner-cta');
    const heading = block.querySelector('h4');
    if (heading && !block.querySelector('.columns-banner-cta-icon')) {
      const icon = document.createElement('img');
      icon.src = `${window.hlx?.codeBasePath || ''}/icons/cta-pilgrim.svg`;
      icon.alt = '';
      icon.loading = 'lazy';
      icon.className = 'columns-banner-cta-icon';
      heading.parentElement.insertBefore(icon, heading);
    }
  }

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-banner-img-col');
        }
      }
    });
  });
}
