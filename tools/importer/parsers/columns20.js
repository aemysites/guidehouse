/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to clone and clean a node (remove empty headings)
  function cloneAndClean(node) {
    const clone = node.cloneNode(true);
    // Remove empty h5/h4/h3/h2/h1 elements
    clone.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(h => {
      if (!h.textContent.trim()) h.remove();
    });
    return clone;
  }

  // Helper to extract all columns for the columns block
  function getColumnsFromTabPane(tabPane) {
    // Try .row.version-2 (4 columns, 2 rows)
    const version2Row = tabPane.querySelector('.row.version-2');
    if (version2Row) {
      const colDivs = Array.from(version2Row.querySelectorAll(':scope > .col-md-6'));
      if (colDivs.length === 4) {
        const row1 = [];
        const row2 = [];
        colDivs.forEach((col, idx) => {
          const content = col.querySelector('.row-content_row');
          if (content) {
            const cleaned = cloneAndClean(content);
            if (idx < 2) {
              row1.push(cleaned);
            } else {
              row2.push(cleaned);
            }
          }
        });
        if (row1.length === 2 && row2.length === 2) {
          return [row1, row2];
        }
      }
    }
    // Try .row (2 columns: text + image)
    const row = tabPane.querySelector('.row');
    if (row) {
      const colDivs = Array.from(row.querySelectorAll(':scope > .col-md'));
      if (colDivs.length === 2) {
        const firstColContent = colDivs[0].querySelector('.row-content');
        const secondColImg = colDivs[1].querySelector('img');
        const rowCells = [];
        if (firstColContent) rowCells.push(cloneAndClean(firstColContent));
        if (secondColImg) rowCells.push(secondColImg.cloneNode(true));
        if (rowCells.length === 2) {
          return [rowCells];
        }
      }
    }
    // Fallback: all direct children as one row
    return [[cloneAndClean(tabPane)]];
  }

  // Find main row with tabs (ignore left col-md-4)
  const mainRow = element.querySelector('.row');
  if (!mainRow) return;

  // Get tab buttons and tab panes
  const tabButtons = Array.from(mainRow.querySelectorAll('ul.nav-tabs > li > button.nav-link'));
  const tabContents = Array.from(mainRow.querySelectorAll('.tab-content > .tab-pane'));
  if (tabButtons.length === 0 || tabContents.length === 0) return;

  // For each tab, create a columns block table
  tabContents.forEach((tabPane) => {
    const rows = [];
    const headerRow = ['Columns block (columns20)'];
    rows.push(headerRow);
    const contentRows = getColumnsFromTabPane(tabPane);
    contentRows.forEach(row => rows.push(row));
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.parentNode.insertBefore(table, element.nextSibling);
  });
  // Remove original element
  element.remove();
}
