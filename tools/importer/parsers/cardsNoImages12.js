/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get all immediate card columns
  const cardCols = element.querySelectorAll(':scope .row > .col-md-6');
  const rows = [];

  // Header row (block name)
  const headerRow = ['Cards (cardsNoImages12)'];
  rows.push(headerRow);

  // For each card column, extract card content
  cardCols.forEach((col) => {
    const insightItem = col.querySelector('.insight-item');
    if (!insightItem) return; // Defensive: skip if missing

    // Gather elements for the card cell
    const cardCellContent = [];

    // 1. Category (small)
    const small = insightItem.querySelector('small');
    if (small) {
      cardCellContent.push(small);
    }

    // 2. Title (h6 > a)
    const h6 = insightItem.querySelector('h6');
    if (h6) {
      cardCellContent.push(h6);
    }

    // 3. CTA (a.dark-link)
    const cta = insightItem.querySelector('a.dark-link');
    if (cta) {
      cardCellContent.push(cta);
    }

    // Add row: single cell with all card content
    rows.push([cardCellContent]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
