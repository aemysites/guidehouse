/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns block (columns27)'];

  // Defensive: get all direct column divs
  const columnDivs = Array.from(element.querySelectorAll(':scope > .col-lg-4'));

  // For each column, grab the block-wrapper-item (the actual content)
  const contentRow = columnDivs.map(col => {
    // Defensive: find the inner wrapper
    const wrapper = col.querySelector('.block-wrapper-item');
    // If wrapper exists, use it; else, fallback to the column itself
    return wrapper || col;
  });

  // Build the table rows
  const rows = [headerRow, contentRow];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
