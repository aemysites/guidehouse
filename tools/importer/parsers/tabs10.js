/* global WebImporter */
export default function parse(element, { document }) {
  // Find the nav container
  const nav = element.querySelector('nav');
  if (!nav) return;

  // Find the .container inside nav
  const container = nav.querySelector('.container');
  if (!container) return;

  // Find the nav-link block (tab links)
  const navLinks = container.querySelector('.nav-link');
  if (!navLinks) return;

  // Get all tab <a> elements (ignore share icon)
  const tabLinks = Array.from(navLinks.querySelectorAll('a')).filter(a => {
    // Exclude share icon (has class 'share-icon')
    return !a.classList.contains('share-icon');
  });

  // Table header row: exactly one column
  const headerRow = ['Tabs (tabs10)'];

  // Each tab row: [Tab Label, Tab Content] -- for nav bars, tab content is not present, so use the href as content
  const rows = tabLinks.map(tab => {
    const tabLabel = tab.textContent.trim();
    const tabContent = tab.getAttribute('href') || '\u00A0';
    return [tabLabel, tabContent];
  });

  // Build cells array: header row as single array, then each row as array of two cells
  const cells = [headerRow, ...rows];

  // Use WebImporter.DOMUtils.createTable to build the table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
