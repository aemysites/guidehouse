/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the first direct child by class
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find((child) => child.classList.contains(className));
  }

  // 1. Find the main columns container
  const container = element.querySelector('.container');
  if (!container) return;

  // 2. Find the left and right columns
  const columnsWrapper = getDirectChildByClass(container, 'insight-deatils-coloum');
  if (!columnsWrapper) return;

  const leftCol = getDirectChildByClass(columnsWrapper, 'insight-left');
  const rightCol = getDirectChildByClass(columnsWrapper, 'insight-right');

  // Defensive: if either column is missing, fallback to empty div
  const leftContent = leftCol ? leftCol : document.createElement('div');
  const rightContent = rightCol ? rightCol : document.createElement('div');

  // 3. Build the table rows
  const headerRow = ['Columns block (columns50)'];
  const columnsRow = [leftContent, rightContent];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  element.replaceWith(table);
}
