/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.querySelectorAll(':scope > ' + selector));
  }

  // Find the main row containing columns
  const container = element.querySelector('.container');
  if (!container) return;
  const mainRow = container.querySelector('.row');
  if (!mainRow) return;

  // Get the first column (title) and the second column (actual columns)
  const topCols = getDirectChildren(mainRow, 'div');
  if (topCols.length < 2) return;

  // First column: section heading (e.g., "Services we deliver")
  const headingCol = topCols[0];
  const heading = headingCol.querySelector('h4');

  // Second column: contains another row with actual columns
  const columnsRow = topCols[1].querySelector('.row');
  if (!columnsRow) return;
  const columns = getDirectChildren(columnsRow, 'div');

  // Each column contains a .cta_box with h5/a and p(s)
  const columnCells = columns.map((col) => {
    const ctaBox = col.querySelector('.cta_box');
    if (!ctaBox) return document.createElement('div');
    // Compose cell content: title (link), paragraphs
    const h5 = ctaBox.querySelector('h5');
    let titleLink = null;
    if (h5) {
      const a = h5.querySelector('a');
      if (a) {
        // Remove trailing image from link if present
        const img = a.querySelector('img');
        if (img) img.remove();
        titleLink = a;
      }
    }
    // Get all non-empty paragraphs
    const paragraphs = Array.from(ctaBox.querySelectorAll('p')).filter(p => p.textContent.trim());
    // Compose cell
    const cellContent = [];
    if (titleLink) {
      // Make bold
      const strong = document.createElement('strong');
      strong.appendChild(titleLink);
      cellContent.push(strong);
    }
    cellContent.push(...paragraphs);
    return cellContent;
  });

  // Compose table rows
  const headerRow = ['Columns block (columns63)'];
  const firstRow = [heading ? heading : ''];
  const secondRow = columnCells;

  // Table: header, then one row for heading, then one row for columns
  const cells = [
    headerRow,
    firstRow,
    secondRow
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
