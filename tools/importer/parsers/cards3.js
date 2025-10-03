/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to build the text content cell for each card
  function buildTextCell(insightDesc) {
    const frag = document.createDocumentFragment();
    // Title (h5)
    const titleMain = insightDesc.querySelector('.title-main');
    if (titleMain) {
      const h5 = titleMain.querySelector('h5');
      if (h5) {
        const h3 = document.createElement('h3');
        h3.innerHTML = h5.innerHTML;
        frag.appendChild(h3);
      }
      // LinkedIn icon as CTA (optional)
      const linkedinLink = titleMain.querySelector('a.linkedin');
      if (linkedinLink) {
        // Clone the link to avoid moving it from the DOM
        frag.appendChild(linkedinLink.cloneNode(true));
      }
    }
    // Subtitle (expert-title)
    const expertTitle = insightDesc.querySelector('.expert-title');
    if (expertTitle) {
      const strong = document.createElement('strong');
      strong.textContent = expertTitle.textContent.trim();
      frag.appendChild(document.createElement('br'));
      frag.appendChild(strong);
    }
    // Description (all <p> elements with text)
    const ps = Array.from(insightDesc.querySelectorAll('p')).filter(p => p.textContent.trim());
    if (ps.length) {
      frag.appendChild(document.createElement('br'));
      ps.forEach((p, idx) => {
        const span = document.createElement('span');
        span.innerHTML = p.innerHTML;
        frag.appendChild(span);
        if (idx < ps.length - 1) {
          frag.appendChild(document.createElement('br'));
        }
      });
    }
    return frag;
  }

  // Find all cards (each .col-... > .insight-box)
  const cards = Array.from(element.querySelectorAll(':scope > div > .insight-box'));
  const rows = [
    ['Cards (cards3)'],
  ];
  cards.forEach(card => {
    // Image
    const img = card.querySelector('img');
    // Text cell
    const insightDesc = card.querySelector('.insight_desc');
    const textCell = buildTextCell(insightDesc);
    rows.push([img, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
