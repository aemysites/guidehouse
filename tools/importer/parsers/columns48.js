/* global WebImporter */
export default function parse(element, { document }) {
  // Find all direct children that are columns (class starts with 'col-')
  const columns = Array.from(element.children).filter(child =>
    child.className && child.className.split(' ').some(c => c.startsWith('col-'))
  );

  // If no columns found, fallback to all direct children
  const colEls = columns.length > 0 ? columns : Array.from(element.children);

  // For each column, reference the DOM node directly (no cloning)
  const colCells = colEls.map(col => {
    // Remove any data-hlx-imp-color attributes for cleanliness
    col.querySelectorAll('[data-hlx-imp-color]').forEach(el => el.removeAttribute('data-hlx-imp-color'));
    return col;
  });

  // Table header row must match target block name exactly
  const headerRow = ['Columns (columns48)'];

  // Table body row: one cell per column
  const bodyRow = colCells;

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bodyRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
