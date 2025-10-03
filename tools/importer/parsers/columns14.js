/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main row containing the columns
  const row = element.querySelector('.row');
  if (!row) return;

  // Get all direct column children
  const columns = Array.from(row.children).filter((col) => col.classList.contains('col-md-6'));
  if (columns.length === 0) return;

  // For each column, extract its content, but only include if not empty
  const contentRow = columns
    .map((col) => {
      // Remove empty .iframe-content divs
      const iframeDiv = col.querySelector('.iframe-content');
      if (iframeDiv && iframeDiv.childNodes.length === 0) {
        iframeDiv.remove();
      }
      // If column has content after removing empty iframe-content, include it
      if (col.textContent.trim() || col.querySelector('*')) {
        return Array.from(col.childNodes);
      }
      // Otherwise, skip (will be filtered out)
      return null;
    })
    .filter(cell => cell && cell.length > 0);

  if (contentRow.length === 0) return;

  const headerRow = ['Columns block (columns14)'];
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
