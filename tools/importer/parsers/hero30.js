/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content container
  const container = element.querySelector(':scope > .container');
  if (!container) return;

  // Find the row inside the container
  const row = container.querySelector(':scope > .row');
  if (!row) return;

  // Find the left column
  const colLeft = row.querySelector(':scope > .col-md-7');

  // Compose the content cell: include all content from colLeft
  let contentCell = '';
  if (colLeft) {
    // Clone and strip unwanted attributes
    const clone = colLeft.cloneNode(true);
    clone.querySelectorAll('[data-hlx-imp-color]').forEach(el => el.removeAttribute('data-hlx-imp-color'));
    contentCell = clone.innerHTML.trim();
  }

  // Build the table: 1 column, 2 rows (header, content) - omit image row if empty
  const headerRow = ['Hero (hero30)'];
  const cells = [
    headerRow,
    [contentCell]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
