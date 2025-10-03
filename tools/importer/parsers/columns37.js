/* global WebImporter */
export default function parse(element, { document }) {
  // Find the row containing columns
  const row = element.querySelector('.row');
  if (!row) return;
  const columns = Array.from(row.children).filter(child => child.classList.contains('col-md-8') || child.classList.contains('col-md-4'));
  if (columns.length < 2) return;

  // Column 1: text content
  let col1Content = [];
  const headerItem = columns[0].querySelector('.secondary_header_item');
  if (headerItem) {
    // Use the actual header element for semantic meaning
    const h4 = headerItem.querySelector('h4');
    if (h4) col1Content.push(h4);
  }

  // Column 2: image + cta content
  let col2Content = [];
  const imageCtaWrapper = columns[1].querySelector('.image-cta-wrapper');
  if (imageCtaWrapper) {
    // Reference the image element
    const img = imageCtaWrapper.querySelector('img');
    if (img) col2Content.push(img);
    // Reference the cta-wrapper-content block
    const ctaContent = imageCtaWrapper.querySelector('.cta-wrapper-content');
    if (ctaContent) col2Content.push(ctaContent);
  }

  // Build table rows
  const headerRow = ['Columns block (columns37)'];
  const contentRow = [col1Content, col2Content];

  // Create table block
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace original element with block table
  element.replaceWith(table);
}
