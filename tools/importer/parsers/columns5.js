/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get left and right columns
  const columns = element.querySelectorAll(':scope .insight-deatils-coloum > div');
  let leftCol = null;
  let rightCol = null;
  if (columns.length === 2) {
    leftCol = columns[0];
    rightCol = columns[1];
  } else {
    // fallback: try to find by class
    leftCol = element.querySelector('.insight-left');
    rightCol = element.querySelector('.insight-right');
  }

  // Defensive: get main content from left column
  let leftContent = null;
  if (leftCol) {
    // Find the main description section
    leftContent = leftCol.querySelector('.insight-description, .insight-desc-main');
    if (!leftContent) {
      // fallback: get all children
      leftContent = leftCol;
    } else {
      // If .insight-description is a section, get its main div
      const descMain = leftContent.querySelector('.insight-desc-main');
      if (descMain) leftContent = descMain;
    }
  }

  // Defensive: get related services from right column
  let rightContent = null;
  if (rightCol) {
    // Find the related services block
    rightContent = rightCol.querySelector('.insight-related-services');
    if (!rightContent) {
      rightContent = rightCol;
    }
  }

  // Table header
  const headerRow = ['Columns block (columns5)'];

  // Table row: left and right columns
  const columnsRow = [leftContent, rightContent];

  // Build table
  const cells = [headerRow, columnsRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
