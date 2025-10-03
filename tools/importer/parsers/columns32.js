/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all direct children with a class
  function getDirectChildrenByClass(parent, className) {
    return Array.from(parent.children).filter(child => child.classList.contains(className));
  }

  // Find the two column divs
  const container = element.querySelector('.container');
  if (!container) return;
  const row = container.querySelector('.row');
  if (!row) return;
  const columns = row.querySelectorAll(':scope > .col-md-6');
  if (columns.length < 2) return;

  // First column: text content
  const col1 = columns[0];
  // Second column: visual/gauge content
  const col2 = columns[1];

  // For robustness, grab the main content wrappers inside each col
  const col1Content = col1.querySelector(':scope > .secondary_header_item') || col1;
  const col2Content = col2.querySelector(':scope > .secondary_header_item') || col2;

  // Table structure
  const headerRow = ['Columns block (columns32)'];
  const contentRow = [col1Content, col2Content];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
