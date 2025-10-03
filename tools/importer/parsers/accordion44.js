/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the accordion container
  const container = element.querySelector('.container');
  if (!container) return;

  // Defensive: Find the row with columns
  const row = container.querySelector('.row');
  if (!row) return;

  // Find the right column (accordion)
  const colRight = row.querySelector('.col-md-8');
  if (!colRight) return;

  // Find the accordion block
  const accordion = colRight.querySelector('.accordion');
  if (!accordion) return;

  // Prepare table rows
  const headerRow = ['Accordion (accordion44)'];
  const rows = [headerRow];

  // For each accordion-item, extract title and content
  const items = accordion.querySelectorAll(':scope > .accordion-item');
  items.forEach((item) => {
    // Defensive: Find the title (h6.accordion-button > span)
    const headerBtn = item.querySelector('.accordion-button');
    let title = '';
    if (headerBtn) {
      const span = headerBtn.querySelector('span');
      if (span) {
        title = span;
      } else {
        // fallback: use headerBtn text
        title = document.createTextNode(headerBtn.textContent.trim());
      }
    }
    // Defensive: Find the content (accordion-body)
    let content = '';
    const collapse = item.querySelector('.accordion-collapse');
    if (collapse) {
      const body = collapse.querySelector('.accordion-body');
      if (body) {
        content = body;
      } else {
        // fallback: use collapse text
        content = document.createTextNode(collapse.textContent.trim());
      }
    }
    rows.push([title, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
