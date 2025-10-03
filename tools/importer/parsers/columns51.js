/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main columns wrapper
  const columnsWrapper = element.querySelector('.insight-deatils-coloum');
  if (!columnsWrapper) return;

  // Get left and right columns
  const leftCol = columnsWrapper.querySelector('.insight-left');
  const rightCol = columnsWrapper.querySelector('.insight-right');

  // Defensive: ensure both columns exist
  if (!leftCol || !rightCol) return;

  // Left column: main content (description section)
  const leftSection = leftCol.querySelector('.insight-description');
  let leftContent;
  if (leftSection) {
    // Use the entire section as the left column cell
    leftContent = leftSection;
  } else {
    // Fallback: use everything in leftCol
    leftContent = leftCol;
  }

  // Right column: related services
  let rightContent;
  const relatedServices = rightCol.querySelector('.insight-related-services');
  if (relatedServices) {
    rightContent = relatedServices;
  } else {
    rightContent = rightCol;
  }

  // Table header row
  const headerRow = ['Columns block (columns51)'];
  // Content row: two columns
  const contentRow = [leftContent, rightContent];

  // Build the table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
