/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Cards (cardsNoImages18)'];
  const rows = [headerRow];

  // Get all direct children that are columns
  const columns = element.querySelectorAll(':scope > div');

  columns.forEach((col) => {
    // Each col contains a .insight-item
    const insight = col.querySelector('.insight-item');
    if (!insight) return;

    // Compose card content
    const cardContent = document.createElement('div');

    // Top label (category)
    const small = insight.querySelector('small');
    if (small) {
      cardContent.appendChild(small.cloneNode(true));
    }

    // Heading (h4 or h6)
    let heading = insight.querySelector('h4, h6');
    if (heading) {
      cardContent.appendChild(heading.cloneNode(true));
    }

    // There is no description element, but the heading may have a link, so nothing extra here

    // CTA link (Read More)
    // Fix: selector should be .ne-card-cta, not .insight-card-cta
    const cta = insight.querySelector('.ne-card-cta');
    if (cta) {
      cardContent.appendChild(cta.cloneNode(true));
    }

    // Add row: single cell with all card content
    rows.push([cardContent]);
  });

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
