/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a .col-xl-4 (or similar) element
  function extractCard(col) {
    // Get image
    const img = col.querySelector('img');
    // Get title (h5)
    const h5 = col.querySelector('h5');
    // Get LinkedIn link (if present)
    const linkedinLink = col.querySelector('a.linkedin');
    // Get expert title (span inside .expert-title)
    const expertTitle = col.querySelector('.expert-title span');
    // Get description (the first non-empty p inside .insight_desc)
    const descContainer = col.querySelector('.insight_desc');
    let description = '';
    if (descContainer) {
      const ps = descContainer.querySelectorAll('p');
      for (const p of ps) {
        if (p.textContent.trim().length > 0) {
          description = p;
          break;
        }
      }
    }
    // Compose text cell
    const textCell = document.createElement('div');
    // Title
    if (h5) {
      const heading = document.createElement('h3');
      heading.innerHTML = h5.innerHTML;
      textCell.appendChild(heading);
    }
    // LinkedIn icon (as CTA)
    if (linkedinLink) {
      // Place to the right, but for import just append after heading
      textCell.appendChild(linkedinLink);
    }
    // Expert title (subtitle)
    if (expertTitle) {
      const subtitle = document.createElement('div');
      subtitle.style.fontWeight = 'bold';
      subtitle.style.fontSize = '1em';
      subtitle.textContent = expertTitle.textContent;
      textCell.appendChild(subtitle);
    }
    // Description
    if (description) {
      textCell.appendChild(description);
    }
    return [img, textCell];
  }

  // Get all card columns
  const cols = element.querySelectorAll(':scope > div');
  // Table header
  const headerRow = ['Cards (cards45)'];
  // Card rows
  const cardRows = [];
  cols.forEach((col) => {
    cardRows.push(extractCard(col));
  });

  // Compose table
  const cells = [headerRow, ...cardRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
