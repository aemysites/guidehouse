/* global WebImporter */
export default function parse(element, { document }) {
  // Find the row containing columns
  const row = element.querySelector('.row');
  if (!row) return;
  const columns = Array.from(row.children).filter(col => col.className && col.className.includes('col-'));

  // Defensive: Expecting two columns
  let leftCell = '';
  let rightCell = '';

  // Left column: overview text (should reference the actual element)
  if (columns[0]) {
    const overview = columns[0].querySelector('.secondary_header_item');
    if (overview) leftCell = overview;
  }

  // Right column: button/link (should reference the actual element)
  if (columns[1]) {
    const headerItem = columns[1].querySelector('.secondary_header_item');
    if (headerItem) rightCell = headerItem;
  }

  // Table header row must match target block name exactly
  const headerRow = ['Columns block (columns33)'];
  // Content row: two columns side by side
  const contentRow = [leftCell, rightCell];

  // Compose table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
