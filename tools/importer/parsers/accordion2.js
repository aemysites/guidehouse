/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the accordion container
  const accordionContainer = element.querySelector('.accordion');
  if (!accordionContainer) return;

  // Get all accordion items
  const accordionItems = accordionContainer.querySelectorAll('.accordion-item');

  // Table header row
  const headerRow = ['Accordion (accordion2)'];
  const rows = [headerRow];

  // For each accordion item, extract title and content
  accordionItems.forEach((item) => {
    // Title cell: get the .accordion-button <h6>, and its <span>
    const button = item.querySelector('.accordion-button');
    let titleContent = null;
    if (button) {
      // Defensive: Use the <span> inside the button for the label
      const span = button.querySelector('span');
      if (span) {
        titleContent = span;
      } else {
        // Fallback: use button text
        titleContent = document.createTextNode(button.textContent.trim());
      }
    } else {
      // Fallback: use first heading or text
      const heading = item.querySelector('h2, h6, h3, h4');
      if (heading) {
        titleContent = heading;
      } else {
        titleContent = document.createTextNode('');
      }
    }

    // Content cell: get the .accordion-body
    const body = item.querySelector('.accordion-body');
    let contentCell = null;
    if (body) {
      // Defensive: use the body element directly
      contentCell = body;
    } else {
      // Fallback: empty cell
      contentCell = document.createTextNode('');
    }

    rows.push([titleContent, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
