/* global WebImporter */
export default function parse(element, { document }) {
  // Find the nav container holding the tab links
  const navLinksContainer = element.querySelector('.nav-link');
  if (!navLinksContainer) return;
  const tabLinks = Array.from(navLinksContainer.querySelectorAll('a'));
  if (!tabLinks.length) return;

  // Block header row must match target block name exactly
  const headerRow = ['Tabs (tabs56)'];
  const rows = [headerRow];

  // Each tab: label in first cell, content in second cell (content is empty if not present)
  tabLinks.forEach((link) => {
    const tabLabel = link.textContent.trim();
    rows.push([tabLabel, '']);
  });

  // Create and replace with the Tabs block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
