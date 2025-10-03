/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Remove arrow images from links (they are decorative)
  function cleanLink(link) {
    // Remove all img children
    Array.from(link.querySelectorAll('img')).forEach(img => img.remove());
    return link;
  }

  // Helper: Remove empty paragraphs and empty spans
  function cleanCardItem(cardItem) {
    Array.from(cardItem.querySelectorAll('p')).forEach(p => {
      if (!p.textContent.trim()) p.remove();
    });
    Array.from(cardItem.querySelectorAll('span')).forEach(span => {
      if (!span.textContent.trim()) span.remove();
    });
    return cardItem;
  }

  // Find all card-item divs
  const cardItems = element.querySelectorAll('.card-item');

  // Build rows: first row is block name
  const rows = [
    ['Cards (cardsNoImages60)']
  ];

  cardItems.forEach(cardItem => {
    // Defensive clone to avoid DOM mutation issues
    const card = cardItem.cloneNode(true);
    cleanCardItem(card);

    // 1. Heading: h3 (may contain a link with an img at the end)
    let heading = card.querySelector('h3');
    let headingElem = null;
    if (heading) {
      // Remove arrow image from link if present
      const link = heading.querySelector('a');
      if (link) {
        cleanLink(link);
      }
      headingElem = heading;
    }

    // 2. Description: h6 (may contain a span)
    let desc = card.querySelector('h6');
    let descElem = null;
    if (desc) {
      descElem = desc;
    }

    // 3. CTA links: all <ul> > <li> > <a> (remove arrow images)
    let ctaList = card.querySelector('ul');
    let ctaElems = [];
    if (ctaList) {
      const links = ctaList.querySelectorAll('a');
      links.forEach(link => {
        cleanLink(link);
        // Make bold
        const strong = document.createElement('strong');
        strong.appendChild(link);
        ctaElems.push(strong);
        ctaElems.push(document.createElement('br'));
      });
      // Remove trailing <br>
      if (ctaElems.length > 0) ctaElems.pop();
    }

    // Compose cell content
    const cellContent = [];
    if (headingElem) cellContent.push(headingElem);
    if (descElem) cellContent.push(descElem);
    if (ctaElems.length > 0) cellContent.push(...ctaElems);

    rows.push([cellContent]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
