/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required by block spec
  const headerRow = ['Columns block (columns41)'];

  // Defensive: get all immediate child columns
  const columns = Array.from(element.querySelectorAll(':scope > .col-md'));

  // For each column, grab its content block (stat-blocks-wrapper-item)
  const contentRow = columns.map(col => {
    // Find the stat-blocks-wrapper-item inside this column
    const item = col.querySelector('.stat-blocks-wrapper-item');
    // Defensive: if not found, fallback to column itself
    return item || col;
  });

  // Build table cells array
  const cells = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
