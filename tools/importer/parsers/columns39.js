/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all immediate office columns
  function getOfficeColumns(section) {
    // Find the .container > .row > .col-sm-8 > .row
    const container = section.querySelector('.container');
    if (!container) return [];
    const mainRow = container.querySelector('.row');
    if (!mainRow) return [];
    // The first column is the region heading, the second is the office list
    const columns = mainRow.querySelectorAll(':scope > div');
    if (columns.length < 2) return [];
    // The office columns are inside columns[1] > .row > .col-md-6
    const officeRow = columns[1].querySelector('.row');
    if (!officeRow) return [];
    return Array.from(officeRow.querySelectorAll(':scope > .col-md-6'));
  }

  // Get region heading (e.g., Americas)
  function getRegionHeading(section) {
    const container = section.querySelector('.container');
    if (!container) return null;
    const mainRow = container.querySelector('.row');
    if (!mainRow) return null;
    const columns = mainRow.querySelectorAll(':scope > div');
    if (columns.length < 1) return null;
    // The heading is in columns[0]
    const heading = columns[0].querySelector('h4');
    return heading || null;
  }

  // 1. Header row
  const headerRow = ['Columns block (columns39)'];

  // 2. Collect office blocks into columns
  const officeColumns = getOfficeColumns(element);
  // Defensive: if no columns, do nothing
  if (!officeColumns.length) return;

  // Each office column contains a .cta_box (the office info)
  // We'll group them into 3 columns per row, matching the screenshot's visual layout
  const officesPerRow = 3;
  const rows = [];
  for (let i = 0; i < officeColumns.length; i += officesPerRow) {
    const row = [];
    for (let j = 0; j < officesPerRow; j++) {
      const colIdx = i + j;
      if (colIdx < officeColumns.length) {
        // Get the .cta_box inside
        const ctaBox = officeColumns[colIdx].querySelector('.cta_box');
        if (ctaBox) {
          row.push(ctaBox);
        } else {
          // If missing, push empty cell
          row.push('');
        }
      } else {
        // If not enough offices for the last row, pad with empty
        row.push('');
      }
    }
    rows.push(row);
  }

  // Optionally, add the region heading as a first row after the block name
  const regionHeading = getRegionHeading(element);
  if (regionHeading) {
    // Add as a single cell row after header
    rows.unshift([regionHeading]);
  }

  // Compose the table cells
  const cells = [headerRow, ...rows];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
