/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all immediate child columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Header row as required
  const headerRow = ['Columns block (columns49)'];

  // We'll build the second row by visually grouping content into columns
  // Screenshot shows: left logo/info/social, then 4 main columns (Industries, Services, About, then a stacked set: Insights, Careers, News & Events, Offices)

  // 1st column: logo, tagline, social
  const leftCol = columns.find(col => col.classList.contains('mobile-logo')) || columns[0];
  const leftColFooterInfo = columns.find(col => col.classList.contains('col-lg-4'));
  // Compose left column content
  const leftColContent = [];
  // Mobile logo block (contains logo and tagline)
  if (leftCol) leftColContent.push(leftCol);
  // Desktop logo/tagline/social (footer-info)
  if (leftColFooterInfo) leftColContent.push(leftColFooterInfo);

  // Next columns: Industries, Services, About, and the stacked set
  // Find all col-lg columns except the first col-lg-4
  const mainCols = columns.filter(col => col.classList.contains('col-lg'));

  // 2nd column: Industries
  const industriesCol = mainCols[0];
  // 3rd column: Services
  const servicesCol = mainCols[1];
  // 4th column: About
  const aboutCol = mainCols[2];
  // 5th column: Insights, Careers, News & Events, Offices (stacked)
  const stackedCol = mainCols[3];

  // Compose the row
  const row = [
    leftColContent,
    industriesCol,
    servicesCol,
    aboutCol,
    stackedCol
  ];

  // Defensive: filter out any undefined columns
  const filteredRow = row.filter(cell => cell && (Array.isArray(cell) ? cell.length : true));

  // Table cells
  const cells = [headerRow, filteredRow];

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
