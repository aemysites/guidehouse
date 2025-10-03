/* global WebImporter */
export default function parse(element, { document }) {
  // Find all immediate .col- children (columns)
  const columns = Array.from(element.children).filter((child) =>
    child.classList.contains('col-lg') || child.classList.contains('col-12')
  );

  // Defensive fallback: if no .col-lg/.col-12 found, use all direct children
  const mainColumns = columns.length ? columns : Array.from(element.children);

  // For each column, extract its content, preserving semantic structure
  const columnCells = mainColumns.map((col) => {
    // If column has only one direct child, use that
    if (col.children.length === 1) {
      return col.firstElementChild;
    }
    // Otherwise, wrap all children in a fragment
    const frag = document.createDocumentFragment();
    Array.from(col.childNodes).forEach((node) => {
      // Keep elements and non-empty text nodes
      if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())) {
        frag.appendChild(node);
      }
    });
    return frag;
  });

  // Table header row must match block name exactly
  const headerRow = ['Columns block (columns47)'];
  // Table body: one row with as many columns as detected
  const bodyRows = [columnCells];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...bodyRows
  ], document);

  element.replaceWith(table);
}
