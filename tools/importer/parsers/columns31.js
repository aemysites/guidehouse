/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main container
  const container = element.querySelector(':scope > .container');
  if (!container) return;

  // Find the main content area
  const heroMain = container.querySelector('.hero-insight-main');
  if (!heroMain) return;

  // Left column: collect all text content (including NEWS, h1, h2)
  const left = heroMain.querySelector('.hero-insight-left');
  let leftContent = '';
  if (left) {
    const desc = left.querySelector('.hero-insight-desc');
    if (desc) {
      // Collect all child nodes (including text and elements)
      const frag = document.createDocumentFragment();
      Array.from(desc.childNodes).forEach((node) => {
        frag.appendChild(node.cloneNode(true));
      });
      leftContent = frag;
    }
  }

  // Right column: image
  const right = heroMain.querySelector('.hero-insight-right');
  let rightContent = '';
  if (right) {
    const banner = right.querySelector('.hero-insight-banner');
    if (banner) {
      const img = banner.querySelector('img');
      if (img) {
        rightContent = img.cloneNode(true);
      }
    }
  }

  // Defensive: if both columns are empty, do nothing
  if (!leftContent && !rightContent) return;

  // Build the table rows
  const headerRow = ['Columns block (columns31)'];
  const contentRow = [leftContent || '', rightContent || ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
