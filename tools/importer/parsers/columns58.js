/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main column wrapper
  const colWrapper = element.querySelector('.insight-deatils-coloum');
  if (!colWrapper) return;

  // Extract left and right columns
  const left = colWrapper.querySelector('.insight-left');
  const right = colWrapper.querySelector('.insight-right');
  const columns = [];

  // Left column: use the insight-description section if present
  if (left) {
    const descSection = left.querySelector('.insight-description');
    columns.push(descSection || left);
  } else {
    columns.push(document.createElement('div'));
  }

  // Right column: use the insight-related-insight section if present
  if (right) {
    const related = right.querySelector('.insight-related-insight');
    columns.push(related || right);
  } else {
    columns.push(document.createElement('div'));
  }

  // Table header row (block name must match exactly)
  const headerRow = ['Columns block (columns58)'];

  // Table content row: two columns
  const contentRow = columns;

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace original element
  element.replaceWith(table);
}
