/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by selector
  function getDirectChild(parent, selector) {
    return Array.from(parent.children).find((el) => el.matches(selector));
  }

  // Get the left and right columns
  const container = getDirectChild(element, '.container');
  if (!container) return;
  const columnsWrap = getDirectChild(container, '.insight-deatils-coloum');
  if (!columnsWrap) return;

  // Left column: main content
  const leftCol = getDirectChild(columnsWrap, '.insight-left');
  // Right column: related links
  const rightCol = getDirectChild(columnsWrap, '.insight-right');

  // Defensive: if either column missing, fallback to whole content
  let leftContent = leftCol;
  let rightContent = rightCol;

  // For left column, grab the main description section
  if (leftCol) {
    leftContent = getDirectChild(leftCol, 'section.insight-description') || leftCol;
  }
  // For right column, group both related industry and related insight
  let rightGroup = document.createElement('div');
  if (rightCol) {
    Array.from(rightCol.children).forEach((child) => {
      rightGroup.appendChild(child);
    });
    rightContent = rightGroup;
  }

  // Table header
  const headerRow = ['Columns block (columns43)'];
  // Table second row: left and right columns
  const columnsRow = [leftContent, rightContent];

  // Build table
  const cells = [headerRow, columnsRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace element
  element.replaceWith(block);
}
