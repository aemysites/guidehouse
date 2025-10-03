/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main container for the block content
  const container = element.querySelector('.container') || element;

  // Find the header/title
  let headerRow = ['Columns block (columns36)'];
  let titleCell = null;
  const titleCol = container.querySelector('.row > .col-sm-4, .row > .col-md-3, .row > .col-lg-4');
  if (titleCol) {
    // Use the entire column as the cell for resilience
    titleCell = titleCol;
  }

  // Get the columns content (the right side)
  const columnsWrapper = container.querySelector('.row > .col-sm-8, .row > .col-md-9, .row > .col-lg-8');
  let columnCells = [];
  if (columnsWrapper) {
    // Each .col-md-6 is a column cell
    const colDivs = columnsWrapper.querySelectorAll(':scope > .row > .col-md-6');
    if (colDivs.length) {
      columnCells = Array.from(colDivs).map(col => {
        // Use the entire column as the cell for resilience
        return col;
      });
    }
  }

  // Compose the table rows
  // First row: block name
  // Second row: left title cell, then all columns
  // The layout visually is: [title][col1][col2][col3][col4][col5][col6][col7][col8]
  // But the source screenshot shows the left title as a column, then all service columns side by side
  // So, first row: header, second row: title + all service columns
  const cells = [
    headerRow,
    [titleCell, ...columnCells]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
