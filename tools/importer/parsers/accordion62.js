/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the accordion container
  const accordionCol = Array.from(element.querySelectorAll(':scope > div > div > div'))
    .find(col => col.classList.contains('col-md-8'));
  if (!accordionCol) return;

  // Find the accordion itself
  const accordion = accordionCol.querySelector('.accordion');
  if (!accordion) return;

  // Get all accordion items
  const items = Array.from(accordion.querySelectorAll(':scope > .accordion-item'));

  // Prepare table rows
  const rows = [];
  // Header row as required
  const headerRow = ['Accordion (accordion62)'];
  rows.push(headerRow);

  items.forEach(item => {
    // Title cell: from .accordion-button > span
    const button = item.querySelector('.accordion-button');
    let titleEl = null;
    if (button) {
      const span = button.querySelector('span');
      if (span) {
        // Use the span directly
        titleEl = span;
      } else {
        // Fallback: use button text
        titleEl = document.createElement('span');
        titleEl.textContent = button.textContent.trim();
      }
    } else {
      // Fallback: try to find a heading
      const h2 = item.querySelector('h2');
      if (h2) {
        titleEl = h2;
      } else {
        titleEl = document.createElement('span');
        titleEl.textContent = '';
      }
    }

    // Content cell: from .accordion-body
    const body = item.querySelector('.accordion-body');
    let contentEls = [];
    if (body) {
      // Defensive: filter out empty paragraphs/spans
      contentEls = Array.from(body.childNodes).filter(node => {
        if (node.nodeType === 3) return node.textContent.trim().length > 0; // text node
        if (node.nodeType === 1) {
          if (node.tagName === 'P' || node.tagName === 'SPAN' || node.tagName === 'DIV') {
            // Remove empty paragraphs/spans/divs
            return node.textContent.trim().length > 0;
          }
          return true;
        }
        return false;
      });
      // If nothing left, fallback to body itself
      if (contentEls.length === 0) contentEls = [body];
    } else {
      // Fallback: empty cell
      contentEls = [document.createElement('span')];
    }

    rows.push([titleEl, contentEls]);
  });

  // Create the table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
