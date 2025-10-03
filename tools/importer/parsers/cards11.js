/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card data from a .case-study-box anchor
  function extractCardData(cardAnchor) {
    // Find image
    const img = cardAnchor.querySelector('img.casestudy-boxbg');
    // Find category (small)
    const category = cardAnchor.querySelector('small');
    // Find title (h5)
    const h5 = cardAnchor.querySelector('h5');
    let title = null;
    let arrowImg = null;
    if (h5) {
      // The arrow image is inside h5, but not part of the title text
      arrowImg = h5.querySelector('img');
      // Remove arrow image from h5 for clean title
      if (arrowImg) arrowImg.remove();
      title = h5.cloneNode(true);
    }
    // Compose text cell: category (small) + title (h5)
    const textCell = document.createElement('div');
    if (category) textCell.appendChild(category.cloneNode(true));
    if (title) textCell.appendChild(title);
    // Add description if present (look for p, or fallback to text nodes)
    // In this HTML, there is no extra description, so nothing to add
    // If the cardAnchor itself is a link, wrap textCell in a link
    if (cardAnchor.href) {
      const link = document.createElement('a');
      link.href = cardAnchor.href;
      link.appendChild(textCell);
      return [img, link];
    }
    return [img, textCell];
  }

  // Find all card items
  const cards = [];
  // Defensive: find all .casestudy-itembox in the element
  const cardBoxes = element.querySelectorAll('.casestudy-itembox');
  cardBoxes.forEach((box) => {
    const cardAnchor = box.querySelector('.case-study-box');
    if (cardAnchor) {
      const [img, textCell] = extractCardData(cardAnchor);
      cards.push([img, textCell]);
    }
  });

  // Table header
  const headerRow = ['Cards (cards11)'];
  const rows = [headerRow];
  // Add each card row
  cards.forEach((cardRow) => {
    rows.push(cardRow);
  });

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(table);
}
