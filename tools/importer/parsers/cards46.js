/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a .col-xl-4 element
  function extractCard(col) {
    const link = col.querySelector('a.insight-box');
    if (!link) return null;

    const img = link.querySelector('img');
    const desc = link.querySelector('.insight_desc');
    if (!desc) return null;

    // Compose the text cell
    const textParts = [];

    // Extract all text content in order, preserving structure
    desc.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'SMALL') {
          const div = document.createElement('div');
          div.textContent = node.textContent.trim();
          textParts.push(div);
        } else if (node.tagName === 'H6') {
          const h6Clone = node.cloneNode(true);
          // Remove any inline images (e.g., arrow icon)
          h6Clone.querySelectorAll('img').forEach(img => img.remove());
          const heading = document.createElement('h3');
          heading.textContent = h6Clone.textContent.trim();
          textParts.push(heading);
        } else {
          // Any other element
          const div = document.createElement('div');
          div.textContent = node.textContent.trim();
          textParts.push(div);
        }
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
        const div = document.createElement('div');
        div.textContent = node.textContent.trim();
        textParts.push(div);
      }
    });

    return [img, textParts];
  }

  // Get all visible .col-xl-4 elements (ignore those with d-none)
  const cols = Array.from(element.querySelectorAll(':scope > div'))
    .filter(col => !col.classList.contains('d-none'));

  const headerRow = ['Cards (cards46)'];
  const rows = [headerRow];

  cols.forEach(col => {
    const cardRow = extractCard(col);
    if (cardRow) rows.push(cardRow);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
