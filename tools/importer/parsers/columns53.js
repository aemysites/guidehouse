/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate child divs
  const topDivs = Array.from(element.querySelectorAll(':scope > div'));
  let leftCol, rightCol;

  // Defensive: Find left and right column containers
  for (const div of topDivs) {
    const colDiv = div.querySelector('.insight-deatils-coloum');
    if (colDiv) {
      leftCol = colDiv.querySelector('.insight-left');
      rightCol = colDiv.querySelector('.insight-right');
      break;
    }
  }

  // Defensive fallback if not found
  if (!leftCol || !rightCol) {
    // If structure is different, just put all content in one cell
    const headerRow = ['Columns block (columns53)'];
    const contentRow = [element];
    const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
    element.replaceWith(table);
    return;
  }

  // Left column: main content
  let leftContent = [];
  const descSection = leftCol.querySelector('.insight-description');
  if (descSection) {
    leftContent.push(descSection);
  }

  // There may be a media contact div outside of paragraphs
  const descMain = descSection && descSection.querySelector('.insight-desc-main');
  if (descMain) {
    const mediaContactDiv = descMain.querySelector('div');
    if (mediaContactDiv) {
      leftContent.push(mediaContactDiv);
    }
  }

  // Right column: related services and insights
  let rightContent = [];
  const relatedServices = rightCol.querySelector('.insight-related-services');
  if (relatedServices) rightContent.push(relatedServices);
  const relatedInsights = rightCol.querySelector('.insight-related-insight');
  if (relatedInsights) rightContent.push(relatedInsights);

  // Table construction
  const headerRow = ['Columns block (columns53)'];
  const contentRow = [leftContent, rightContent];

  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  element.replaceWith(table);
}
