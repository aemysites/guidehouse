/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main row containing the columns
  const mainRow = element.querySelector('.container > .row');
  if (!mainRow) return;

  // Get all direct children columns in the row
  const columns = Array.from(mainRow.children);
  // Defensive: Only proceed if there are at least two columns
  if (columns.length < 2) return;

  // First column: Region label (left)
  const leftCol = columns[0];
  // Second column: Content (right)
  const rightCol = columns[1];

  // Find all office boxes in the right column
  const officeBoxes = Array.from(rightCol.querySelectorAll('.cta_box'));

  // If no office boxes found, fallback to rightCol itself
  let officeCells;
  if (officeBoxes.length > 0) {
    // For each office box, extract its full content as a cell
    officeCells = officeBoxes.map(box => {
      // Clone the box to avoid modifying the original DOM
      return box.cloneNode(true);
    });
  } else {
    officeCells = [rightCol.cloneNode(true)];
  }

  // Build the table rows
  const headerRow = ['Columns block (columns9)'];
  // The left column cell: include all content from leftCol (e.g., the region heading)
  const leftCell = leftCol.cloneNode(true);
  // Compose the content row: left cell, then all office cells
  const contentRow = [leftCell, ...officeCells];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
