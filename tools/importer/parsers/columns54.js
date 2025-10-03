/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get direct children by selector
  const getDirectChild = (parent, selector) => {
    return Array.from(parent.children).find((el) => el.matches(selector));
  };

  // 1. Header row
  const headerRow = ['Columns block (columns54)'];

  // 2. Find left and right columns
  // The structure is: section > div.container > div.insight-deatils-coloum > div.insight-left & div.insight-right
  const coloumDiv = getDirectChild(element, '.container')?.querySelector('.insight-deatils-coloum');
  if (!coloumDiv) return;

  const leftCol = getDirectChild(coloumDiv, '.insight-left');
  const rightCol = getDirectChild(coloumDiv, '.insight-right');

  // Defensive: If left/right columns not found, fallback to all children
  // Left column: main content (description)
  let leftContent = null;
  if (leftCol) {
    // Find the main description section
    leftContent = leftCol.querySelector('.insight-description, .insight-desc-main, section');
    if (!leftContent) {
      // Fallback: use leftCol itself
      leftContent = leftCol;
    } else {
      // If .insight-description contains .insight-desc-main, use that
      const descMain = leftContent.querySelector('.insight-desc-main');
      if (descMain) leftContent = descMain;
    }
  }

  // Right column: related services
  let rightContent = null;
  if (rightCol) {
    // Find the related services block
    rightContent = rightCol.querySelector('.insight-related-services');
    if (!rightContent) {
      rightContent = rightCol;
    }
  }

  // 3. Build the table rows
  // Second row: two columns (left: main content, right: related services)
  const secondRow = [leftContent, rightContent].map((cell) => cell || document.createElement('div'));

  // 4. Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    secondRow,
  ], document);

  // 5. Replace the original element
  element.replaceWith(table);
}
