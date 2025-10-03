/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main container
  const container = element.querySelector('.container');
  if (!container) return;

  // Find the left column (filter label/title)
  const left = container.querySelector('.news-left');
  if (!left) return;

  // Get the label/title block (first column)
  const labelTitle = left.querySelector('.label-title-insights');
  // Get the dropdowns (second, third, fourth columns)
  const dropdowns = left.querySelectorAll('.news-box');

  // Compose the header row exactly as required
  const headerRow = ['Columns block (columns28)'];

  // Compose the second row: label/title + dropdowns
  // We want 4 columns: label/title, Industry, Service, Type
  const columns = [];
  if (labelTitle) {
    columns.push(labelTitle);
  } else {
    columns.push('');
  }
  dropdowns.forEach((dropdown) => {
    columns.push(dropdown);
  });

  // If fewer than 4 columns, pad with empty strings
  while (columns.length < 4) columns.push('');

  // Build table rows
  const rows = [headerRow, columns];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
