/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main column wrapper
  const colWrapper = element.querySelector('.insight-deatils-coloum');
  if (!colWrapper) return;

  // Get left and right columns
  const leftCol = colWrapper.querySelector('.insight-left');
  const rightCol = colWrapper.querySelector('.insight-right');

  // Defensive: if either column missing, fallback to whole content
  if (!leftCol || !rightCol) {
    const headerRow = ['Columns block (columns1)'];
    const contentRow = [element];
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      contentRow
    ], document);
    element.replaceWith(table);
    return;
  }

  // Gather left column content
  let leftContent = [];
  // Find the main description section
  const descSection = leftCol.querySelector('.insight-description');
  if (descSection) {
    leftContent.push(descSection);
  }

  // Gather right column content
  let rightContent = [];
  // Related services
  const relatedServices = rightCol.querySelector('.insight-related-services');
  if (relatedServices) rightContent.push(relatedServices);
  // Related industry (optional)
  const relatedIndustry = rightCol.querySelector('.insight-related-industry');
  if (relatedIndustry) rightContent.push(relatedIndustry);
  // Related insights (optional)
  const relatedInsights = rightCol.querySelector('.insight-related-insight');
  if (relatedInsights) rightContent.push(relatedInsights);

  // If right column is empty, fallback to whole rightCol
  if (rightContent.length === 0) rightContent.push(rightCol);

  // Table header
  const headerRow = ['Columns block (columns1)'];
  // Table content row: left and right columns
  const contentRow = [leftContent, rightContent];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace original element
  element.replaceWith(table);
}
