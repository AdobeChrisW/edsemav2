export default function decorate(block) {
  // Check if block has a picture in the first row
  const firstRow = block.querySelector(':scope > div:first-child');
  const picture = firstRow ? firstRow.querySelector('picture') : null;

  if (!picture) {
    block.classList.add('no-image');
  }
}
