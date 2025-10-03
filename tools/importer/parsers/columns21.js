/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct child by class
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
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

  // 3. Compose the table rows
  const headerRow = ['Columns block (columns21)'];
  const contentRow = [leftContent, rightContent];

  // 4. Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // 5. Replace the original element
  element.replaceWith(table);
}
