/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure we have the expected structure
  if (!element || !document) return;

  // Header row as required
  const headerRow = ['Columns (columns55)'];

  // Find the main content columns
  // The structure is: section > div.container > div.row > div.col-md-4 (title), div.col-md-8 (tabs)
  const container = element.querySelector(':scope > div.container');
  if (!container) return;

  const row = container.querySelector(':scope > div.row');
  if (!row) return;

  const colTitle = row.querySelector(':scope > div.col-md-4');
  const colTabs = row.querySelector(':scope > div.col-md-8');
  if (!colTitle || !colTabs) return;

  // Get the block title ("How we guide")
  const titleEl = colTitle.querySelector('h4');

  // Get the tab navigation ("Sectors we serve", "Services we deliver")
  const tabNav = colTabs.querySelector('ul.nav-tabs');
  const tabContent = colTabs.querySelector('div.tab-content');
  if (!tabNav || !tabContent) return;

  // Find all tab panes (there are two: sectors and services)
  const tabPanes = tabContent.querySelectorAll(':scope > div.tab-pane');

  // We'll create two columns: one for each tab pane
  const columns = [];

  tabPanes.forEach((pane, idx) => {
    // For each pane, get all col-md-6 blocks (each is a column in the visual grid)
    const paneRows = pane.querySelectorAll(':scope > div.row.version-2 > div.col-md-6');
    const colItems = [];
    paneRows.forEach((col) => {
      // Each col contains a div.row-content_row
      const content = col.querySelector(':scope > div.row-content_row');
      if (content) {
        colItems.push(content);
      }
    });
    // Wrap the tab title and its items in a container
    const tabButton = tabNav.querySelectorAll('button')[idx];
    let tabTitle = '';
    if (tabButton) {
      const p = tabButton.querySelector('p');
      if (p) tabTitle = p.textContent.trim();
    }
    // Create a column container
    const colContainer = document.createElement('div');
    if (tabTitle) {
      const tabTitleEl = document.createElement('h4');
      tabTitleEl.textContent = tabTitle;
      colContainer.appendChild(tabTitleEl);
    }
    colItems.forEach(item => colContainer.appendChild(item));
    columns.push(colContainer);
  });

  // Compose the table rows
  // First row: header
  // Second row: two columns (sectors, services)
  const rows = [
    headerRow,
    columns
  ];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(blockTable);
}
