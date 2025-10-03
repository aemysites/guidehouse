/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all visible card columns
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'))
    .filter(div => !div.classList.contains('d-none'));

  // Header row per block spec
  const headerRow = ['Cards (cards7)'];
  const rows = [headerRow];

  // For each card
  cardDivs.forEach(cardDiv => {
    // Find the anchor (card wrapper)
    const anchor = cardDiv.querySelector('a.insight-box');
    if (!anchor) return;

    // Find image (mandatory)
    const img = anchor.querySelector('img');

    // Find description block
    const descDiv = anchor.querySelector('.insight_desc');
    let textCellContent = [];
    if (descDiv) {
      // Small (category)
      const small = descDiv.querySelector('small');
      if (small) textCellContent.push(small.cloneNode(true));

      // Heading (title)
      const h6 = descDiv.querySelector('h6');
      if (h6) {
        // Remove trailing link-arrow image from heading
        const h6Clone = h6.cloneNode(true);
        const linkArrow = h6Clone.querySelector('img[alt="link-arrow"]');
        if (linkArrow) linkArrow.remove();
        textCellContent.push(h6Clone);
      }

      // Description: get all text nodes after h6 (if any)
      // In this HTML, description is actually the h6 text, but be flexible
      // If there are additional nodes after h6, include them
      let afterH6 = false;
      descDiv.childNodes.forEach(node => {
        if (node.nodeType === 1 && node.tagName.toLowerCase() === 'h6') {
          afterH6 = true;
        } else if (afterH6) {
          // Only add non-empty text or elements
          if ((node.nodeType === 3 && node.textContent.trim()) || (node.nodeType === 1 && node.textContent.trim())) {
            textCellContent.push(node.cloneNode(true));
          }
        }
      });
    }

    // Compose row: [image, text content]
    rows.push([
      img ? img.cloneNode(true) : '',
      textCellContent.length ? textCellContent : ''
    ]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
