/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract tab content into columns
  function extractTabColumns(tabContentRow) {
    // Get all .col-md-6 children (each is a column)
    const cols = Array.from(tabContentRow.querySelectorAll(':scope > .col-md-6'));
    return cols.map(col => {
      // Each col contains a .row-content
      const content = col.querySelector('.row-content');
      return content ? content : col;
    });
  }

  // Find the main rows
  const container = element.querySelector('.container');
  const mainRow = container ? container.querySelector('.row') : null;
  if (!mainRow) return;

  // Header row
  const headerRow = ['Columns block (columns35)'];

  // First column: left side (title)
  let leftCol = null;
  const leftColDiv = mainRow.querySelector(':scope > .col-md-4');
  if (leftColDiv) {
    leftCol = leftColDiv;
  }

  // Second column: right side (tabs)
  let rightCol = null;
  const rightColDiv = mainRow.querySelector(':scope > .col-md-8');
  if (rightColDiv) {
    // We'll build a two-row columns block:
    // Row 2: Sectors we serve columns
    // Row 3: Services we deliver columns
    const tabs = rightColDiv.querySelectorAll(':scope > ul.nav-tabs > li > button');
    const tabContents = rightColDiv.querySelectorAll(':scope > .tab-content > .tab-pane');
    // Defensive: only process if both tabs and tabContents exist
    if (tabs.length && tabContents.length) {
      // For each tab, extract the tab label and its columns
      // We'll build a table with:
      // - Row 2: columns for tab 1 (Sectors we serve)
      // - Row 3: columns for tab 2 (Services we deliver)
      const tab1Label = tabs[0].textContent.trim();
      const tab2Label = tabs[1].textContent.trim();
      const tab1Cols = extractTabColumns(tabContents[0].querySelector('.row.version-2'));
      const tab2Cols = extractTabColumns(tabContents[1].querySelector('.row.version-2'));
      // Compose the table rows
      // Row 2: Sectors we serve columns
      const row2 = tab1Cols;
      // Row 3: Services we deliver columns
      const row3 = tab2Cols;
      // Table: header, then row2, then row3
      const tableRows = [headerRow, row2, row3];
      const block = WebImporter.DOMUtils.createTable(tableRows, document);
      // Replace the original element
      element.replaceWith(block);
      return;
    }
  }

  // Fallback: if tabs not found, just output left and right columns as a single row
  const rightColContent = rightColDiv ? rightColDiv : '';
  const tableRows = [headerRow, [leftCol, rightColContent]];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
