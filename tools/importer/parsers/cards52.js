/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from each .insight-box
  function extractCard(cardBox) {
    // Image (mandatory)
    const img = cardBox.querySelector('img');
    // Text content container
    const desc = cardBox.querySelector('.insight_desc');
    let title = '';
    let titleEl = null;
    let linkedinLink = null;
    // Title (h5) and LinkedIn (optional)
    if (desc) {
      const titleMain = desc.querySelector('.title-main');
      if (titleMain) {
        titleEl = titleMain.querySelector('h5');
        linkedinLink = titleMain.querySelector('a.linkedin');
      }
    }
    // Subtitle (role)
    let subtitle = '';
    const expertTitle = desc ? desc.querySelector('.expert-title span') : null;
    if (expertTitle) subtitle = expertTitle.textContent.trim();
    // Description (paragraphs)
    let description = '';
    let descParas = [];
    if (desc) {
      // Get all <p> that are not empty and not just the CTA
      descParas = Array.from(desc.querySelectorAll('p')).filter(p => {
        // Ignore empty <p> and <p> with only a link (CTA)
        return p.textContent.trim() && !p.querySelector('a.rich-arrow-button');
      });
      // If no <p>, try to get text from the .expert-title sibling
      if (descParas.length === 0 && expertTitle) {
        description = expertTitle.textContent.trim();
      } else {
        description = descParas.map(p => p.textContent.trim()).join(' ');
      }
    }
    // CTA (optional)
    let cta = null;
    if (desc) {
      cta = desc.querySelector('a.rich-arrow-button');
    }
    // Compose text cell
    const textCellContent = [];
    // Title
    if (titleEl) {
      const h = document.createElement('h3');
      h.innerHTML = titleEl.innerHTML.replace(/<br\s*\/?>/gi, ' ');
      textCellContent.push(h);
    }
    // LinkedIn icon (optional)
    if (linkedinLink) {
      // Place LinkedIn icon after the title
      const ln = document.createElement('span');
      ln.appendChild(linkedinLink.cloneNode(true));
      textCellContent.push(ln);
    }
    // Subtitle (role)
    if (subtitle) {
      const sub = document.createElement('strong');
      sub.textContent = subtitle;
      textCellContent.push(sub);
    }
    // Description
    if (description) {
      const p = document.createElement('p');
      p.textContent = description;
      textCellContent.push(p);
    }
    // CTA
    if (cta) {
      textCellContent.push(cta);
    }
    return [img, textCellContent];
  }

  // Find all card boxes
  const cardBoxes = Array.from(element.querySelectorAll(':scope > div > div.insight-box'));
  // Table header
  const headerRow = ['Cards (cards52)'];
  // Table rows
  const rows = cardBoxes.map(extractCard);
  // Compose table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
