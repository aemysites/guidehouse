/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by selector
  function getDirectChild(parent, selector) {
    return Array.from(parent.children).find(child => child.matches(selector));
  }

  // 1. Get the left and right columns
  const container = getDirectChild(element, '.container');
  if (!container) return;
  const coloum = getDirectChild(container, '.insight-deatils-coloum');
  if (!coloum) return;
  const left = getDirectChild(coloum, '.insight-left');
  const right = getDirectChild(coloum, '.insight-right');

  // Defensive: if either left or right is missing, fallback to single column
  let leftContent = left ? left : document.createElement('div');
  let rightContent = right ? right : document.createElement('div');

  // 2. Build the table rows
  const headerRow = ['Columns block (columns34)'];
  const columnsRow = [leftContent, rightContent];

  // 3. Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  // 4. Replace the original element
  element.replaceWith(table);
}
