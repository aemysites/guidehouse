/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.children).filter(child => child.matches(selector));
  }

  // Find the main row containing the columns
  const mainRow = element.querySelector('.row');
  if (!mainRow) return;

  // Find all direct column divs inside the main row
  const columns = getDirectChildren(mainRow, '[class*="col-"]');

  // Defensive: If less than 2 columns, fallback to just replacing with block header
  if (columns.length < 2) {
    const headerRow = ['Columns block (columns8)'];
    const block = WebImporter.DOMUtils.createTable([headerRow], document);
    element.replaceWith(block);
    return;
  }

  // First column is the left side (title)
  const leftCol = columns[0];
  // Remaining columns contain the actual content blocks
  const rightCol = columns[1];

  // Get the title (if present)
  let leftTitle = leftCol.querySelector('h4');
  if (!leftTitle) {
    // fallback: use all content from leftCol
    leftTitle = leftCol;
  }

  // The rightCol contains another row with 3 col-md-6 blocks
  const rightInnerRow = rightCol.querySelector('.row');
  let serviceCols = [];
  if (rightInnerRow) {
    serviceCols = getDirectChildren(rightInnerRow, '[class*="col-md-6"]');
  }

  // Defensive: If not found, fallback to all children
  if (serviceCols.length === 0) {
    serviceCols = getDirectChildren(rightCol, 'div');
  }

  // Build the second row: left column is the title, right columns are the services
  const secondRow = [leftTitle];
  serviceCols.forEach(col => {
    // Each col contains a cta_box
    const ctaBox = col.querySelector('.cta_box') || col;
    secondRow.push(ctaBox);
  });

  // The number of columns is secondRow.length
  // If there are more serviceCols, add additional rows in the same column count
  // In this HTML, all content is in one row, so no further rows needed

  // Compose table rows
  const headerRow = ['Columns block (columns8)'];
  const cells = [headerRow, secondRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
