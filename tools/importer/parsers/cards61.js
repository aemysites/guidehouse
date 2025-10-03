/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a .insight-box element
  function extractCard(cardBox) {
    // Image (always present)
    const img = cardBox.querySelector('img');

    // Text content container
    const desc = cardBox.querySelector('.insight_desc');
    if (!desc) return [img, ''];

    // Title (h5)
    const titleMain = desc.querySelector('.title-main h5');
    // LinkedIn icon (optional)
    const linkedinLink = desc.querySelector('.title-main a.linkedin');
    // Subtitle (span)
    const subtitle = desc.querySelector('.expert-title span');
    // Description (first p)
    let description = '';
    // Find the first non-empty <p> after subtitle
    const ps = Array.from(desc.querySelectorAll('p'));
    for (let p of ps) {
      if (p.textContent.trim()) {
        description = p;
        break;
      }
    }
    // Call to Action (Read More link)
    let cta = null;
    if (description && description.querySelector('a.rich-arrow-button')) {
      cta = description.querySelector('a.rich-arrow-button');
    } else {
      // Sometimes the CTA is a separate <a> in a <p>
      for (let p of ps) {
        const a = p.querySelector('a.rich-arrow-button');
        if (a) {
          cta = a;
          break;
        }
      }
    }

    // Compose the text cell
    const textCell = document.createElement('div');
    // Title
    if (titleMain) {
      const h = document.createElement('h3');
      h.innerHTML = titleMain.innerHTML;
      textCell.appendChild(h);
    }
    // LinkedIn icon (optional, right-aligned)
    if (linkedinLink) {
      const linkDiv = document.createElement('span');
      linkDiv.style.float = 'right';
      linkDiv.appendChild(linkedinLink);
      textCell.appendChild(linkDiv);
    }
    // Subtitle
    if (subtitle) {
      const sub = document.createElement('div');
      sub.style.fontWeight = 'bold';
      sub.style.marginBottom = '4px';
      sub.appendChild(subtitle);
      textCell.appendChild(sub);
    }
    // Description
    if (description) {
      // Remove CTA from description if present
      if (cta) {
        const descClone = description.cloneNode(true);
        const ctaInDesc = descClone.querySelector('a.rich-arrow-button');
        if (ctaInDesc) ctaInDesc.remove();
        textCell.appendChild(descClone);
      } else {
        textCell.appendChild(description);
      }
    }
    // CTA
    if (cta) {
      const ctaDiv = document.createElement('div');
      ctaDiv.style.marginTop = '8px';
      ctaDiv.appendChild(cta);
      textCell.appendChild(ctaDiv);
    }
    return [img, textCell];
  }

  // Get all card containers
  const cardBoxes = Array.from(element.querySelectorAll(':scope > div > div.insight-box'));
  const rows = cardBoxes.map(extractCard);

  // Table header
  const headerRow = ['Cards (cards61)'];
  const tableRows = [headerRow, ...rows];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
