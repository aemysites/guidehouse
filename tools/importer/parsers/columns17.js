/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .row inside the container
  const row = element.querySelector('.row');
  if (!row) return;

  // Get all columns in the footer row
  const columns = Array.from(row.children);

  // First column: logo, tagline, social icons
  const colLogo = columns.find(col => col.classList.contains('mobile-logo'));
  const colInfo = columns.find(col => col.classList.contains('col-lg-4'));
  // Compose left column: logo + tagline + social links
  const leftColContent = [];
  if (colLogo) leftColContent.push(colLogo);
  if (colInfo) leftColContent.push(colInfo);

  // Remaining columns: navigation columns (Industries, Services, About, etc)
  const navCols = columns.filter(col => col.classList.contains('col-lg') && !col.classList.contains('col-lg-4'));

  // Compose table rows
  // Header row must match block name exactly
  const headerRow = ['Columns block (columns17)'];

  // Second row: left column, then each nav column
  const secondRow = [leftColContent, ...navCols];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    secondRow
  ], document);

  // Replace element with table
  element.replaceWith(table);
}
