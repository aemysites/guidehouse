/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per instructions
  const headerRow = ['Columns block (columns4)'];

  // Find all immediate .col-md-6 children (columns)
  const columns = Array.from(element.querySelectorAll(':scope .row > .col-md-6'));

  // Defensive: if no columns found, fallback to .card-item
  let cardItems;
  if (columns.length > 0) {
    cardItems = columns.map(col => col.querySelector('.card-item'));
  } else {
    cardItems = Array.from(element.querySelectorAll('.card-item'));
  }

  // Helper to clean up the card-item for column cell
  function extractCardContent(card) {
    // Defensive: if null, return null (not empty string)
    if (!card) return null;
    // We'll build a fragment to hold the content
    const frag = document.createDocumentFragment();

    // 1. Main heading (h3, possibly with a link and arrow icon)
    const h3 = card.querySelector('h3');
    if (h3) {
      // Remove trailing arrow icon from h3 > a, if present
      const h3clone = h3.cloneNode(true);
      const a = h3clone.querySelector('a');
      if (a) {
        // Remove img inside a (arrow icon)
        const imgs = a.querySelectorAll('img');
        imgs.forEach(img => img.remove());
      }
      frag.appendChild(h3clone);
    }

    // 2. Description (h6 or p)
    // Prefer h6, fallback to first non-empty p
    let desc = card.querySelector('h6');
    if (!desc) {
      desc = Array.from(card.querySelectorAll('p')).find(p => p.textContent.trim());
    }
    if (desc) {
      // Remove empty spans
      const descClone = desc.cloneNode(true);
      Array.from(descClone.querySelectorAll('span')).forEach(span => {
        if (!span.textContent.trim()) span.remove();
      });
      frag.appendChild(descClone);
    }

    // 3. List of links (ul > li > a), remove arrow icons
    const ul = card.querySelector('ul');
    if (ul) {
      const ulClone = ul.cloneNode(true);
      ulClone.querySelectorAll('img').forEach(img => img.remove());
      frag.appendChild(ulClone);
    }

    return frag;
  }

  // Build rows: 2 columns per row (as in screenshot)
  const rows = [];
  for (let i = 0; i < cardItems.length; i += 2) {
    const left = extractCardContent(cardItems[i]);
    const right = extractCardContent(cardItems[i + 1]);
    // Only include the right cell if it has content
    if (right && right.childNodes.length > 0) {
      rows.push([left, right]);
    } else {
      rows.push([left]);
    }
  }

  // Compose table data
  const tableData = [headerRow, ...rows];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
