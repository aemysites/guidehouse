/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Columns block (columns24)'];

  // Defensive: find the main row with two columns
  const row = element.querySelector('.row');
  if (!row) return;
  const cols = row.querySelectorAll(':scope > .col-sm-6');
  if (cols.length !== 2) return;

  // First column: image
  let imgEl = null;
  const imgContainer = cols[0].querySelector('.cta-image-half');
  if (imgContainer) {
    imgEl = imgContainer.querySelector('img');
  }

  // Second column: description content (small, h4, a)
  const descContainer = cols[1].querySelector('.cta-half-desc');
  let descContent = [];
  if (descContainer) {
    // Collect all children in order
    descContent = Array.from(descContainer.childNodes).filter(node => {
      // Only keep elements and non-empty text
      return (node.nodeType === 1) || (node.nodeType === 3 && node.textContent.trim());
    });
  }

  // Build the columns row
  const columnsRow = [
    imgEl ? imgEl : '',
    descContent.length ? descContent : ''
  ];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
