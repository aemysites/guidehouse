/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main columns wrapper
  const columnsWrapper = element.querySelector('.insight-deatils-coloum');
  if (!columnsWrapper) return;

  // Get left and right columns
  const leftCol = columnsWrapper.querySelector('.insight-left');
  const rightCol = columnsWrapper.querySelector('.insight-right');

  // Defensive: If either column is missing, fallback to entire wrapper
  const leftContent = leftCol ? leftCol : document.createElement('div');
  if (!leftCol) leftContent.append(...columnsWrapper.childNodes);

  const rightContent = rightCol ? rightCol : document.createElement('div');
  if (!rightCol) rightContent.append(...columnsWrapper.childNodes);

  // Table header row
  const headerRow = ['Columns block (columns57)'];

  // Second row: two columns, left and right
  const secondRow = [leftContent, rightContent];

  // Build table
  const cells = [headerRow, secondRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with table
  element.replaceWith(table);
}
