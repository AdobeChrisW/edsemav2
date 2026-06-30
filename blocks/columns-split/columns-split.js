export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-split-${cols.length}-cols`);

  // setup image/card columns: any cell that contains a picture is treated
  // as the media/info-card column (it may also contain caption text)
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        col.classList.add('columns-split-img-col');
        // wrap the picture so it can be rounded/clipped independently
        const picWrapper = pic.closest('p') || pic.parentElement;
        if (picWrapper) {
          picWrapper.classList.add('columns-split-img');
        }
      }
    });
  });
}
