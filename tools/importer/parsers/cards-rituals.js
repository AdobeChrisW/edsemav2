/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-rituals. Base: cards.
 * Source: migration-work/block-context/cards-rituals/source.html
 * Repeating set of ritual cards: each = image + "Step NN" label + heading + paragraph.
 * Cards table: 2 columns, one row per card (image cell | text cell [step label, heading, paragraph]).
 */
export default function parse(element, { document }) {
  // Each card is a flex row containing an <img> and a text wrapper.
  const cardEls = Array.from(
    element.querySelectorAll(':scope > div.d-flex.flex-column-reverse, :scope > div.aos-init'),
  ).filter((el) => el.querySelector('img'));

  // Fallback: any direct child div that holds both an image and a heading/paragraph
  let cards = cardEls;
  if (cards.length === 0) {
    cards = Array.from(element.querySelectorAll(':scope > div')).filter(
      (el) => el.querySelector('img') && el.querySelector('h1, h2, h3, h4, p'),
    );
  }

  if (cards.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cards.forEach((card) => {
    const image = card.querySelector('img');
    const heading = card.querySelector('h1, h2, h3, h4');
    const paragraph = card.querySelector('p');
    // Step label: combine the two spans ("Step" + "01")
    const stepSpans = Array.from(card.querySelectorAll('span')).filter(
      (s) => s.textContent.trim(),
    );

    const textCell = [];
    if (stepSpans.length) {
      const stepText = stepSpans.map((s) => s.textContent.trim()).join(' ');
      const stepP = document.createElement('p');
      stepP.textContent = stepText;
      textCell.push(stepP);
    }
    if (heading) textCell.push(heading);
    if (paragraph) textCell.push(paragraph);

    cells.push([image || '', textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-rituals', cells });
  element.replaceWith(block);
}
