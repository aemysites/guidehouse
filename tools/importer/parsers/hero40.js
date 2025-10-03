/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero40)'];

  // 2. Background image row (none in this HTML)
  const imageRow = ['']; // No image found in source HTML

  // 3. Content row: Headline, CTA (link)
  // Defensive: Find the innermost div containing text and link
  let contentDiv = element.querySelector('div.container > div');
  if (!contentDiv) {
    // fallback: try to find any div with a link
    contentDiv = element.querySelector('div');
  }

  // Extract headline text (all text nodes except link)
  let headlineText = '';
  let ctaLink = null;
  if (contentDiv) {
    // Find link
    ctaLink = contentDiv.querySelector('a');
    // Get text content excluding link
    // Remove link node temporarily to get only text
    if (ctaLink) {
      ctaLink.parentNode.removeChild(ctaLink);
    }
    headlineText = contentDiv.textContent.trim();
    // Restore link node if needed
    if (ctaLink) {
      contentDiv.appendChild(ctaLink);
    }
  }

  // Compose content cell
  const contentCell = [];
  if (headlineText) {
    const heading = document.createElement('h1');
    heading.textContent = headlineText;
    contentCell.push(heading);
  }
  if (ctaLink) {
    contentCell.push(ctaLink);
  }

  // Compose table rows
  const rows = [
    headerRow,
    imageRow,
    [contentCell]
  ];

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(table);
}
