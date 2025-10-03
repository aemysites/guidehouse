/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the target block name as the header row
  const cells = [
    ['Cards (cards15)'],
  ];

  // Find all .insight-box elements (each is a card)
  const cardBoxes = element.querySelectorAll('.insight-box');
  cardBoxes.forEach((box) => {
    // Image (mandatory, first cell)
    const img = box.querySelector('img');

    // Text content (second cell)
    const desc = box.querySelector('.insight_desc');
    const textCell = document.createElement('div');

    // Title (h5, styled as heading)
    const title = desc.querySelector('.title-main h5');
    if (title) {
      const titleDiv = document.createElement('div');
      titleDiv.appendChild(title.cloneNode(true));
      // LinkedIn icon (optional, after title)
      const linkedin = desc.querySelector('.title-main a.linkedin');
      if (linkedin) {
        titleDiv.appendChild(linkedin.cloneNode(true));
      }
      textCell.appendChild(titleDiv);
    }
    // Expert Title (optional)
    const expertTitle = desc.querySelector('.expert-title span');
    if (expertTitle) {
      textCell.appendChild(expertTitle.cloneNode(true));
    }
    // Description (all <p> elements with text except those containing CTA)
    const ps = desc.querySelectorAll('p');
    ps.forEach((p) => {
      // Skip if <p> contains the CTA link
      if (!p.querySelector('a.rich-arrow-button') && p.textContent.trim()) {
        textCell.appendChild(p.cloneNode(true));
      }
    });
    // Call-to-Action (optional)
    const cta = desc.querySelector('a.rich-arrow-button');
    if (cta) {
      textCell.appendChild(cta.cloneNode(true));
    }

    cells.push([
      img ? img.cloneNode(true) : '',
      textCell.childNodes.length ? textCell : '',
    ]);
  });

  // Create and replace with table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
