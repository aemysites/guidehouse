/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Extract the background image element (reference, do not clone)
  let bgImg = null;
  const bgDiv = element.querySelector('.insight-highlight-bg');
  if (bgDiv) {
    bgImg = bgDiv.querySelector('img');
  }

  // 2. Extract the banner main content (headline, subheading, CTA)
  let contentElements = [];
  if (bgDiv) {
    const container = bgDiv.querySelector('.container');
    if (container) {
      const bannerMain = container.querySelector('.banner-main');
      if (bannerMain) {
        // Reference all children of bannerMain, preserving semantic order
        contentElements = Array.from(bannerMain.children);
      }
    }
  }

  // 3. Compose table rows
  const headerRow = ['Hero (hero25)']; // Must match target block name exactly
  const imageRow = [bgImg ? bgImg : '']; // Reference image element, not URL
  const contentRow = [contentElements.length ? contentElements : '']; // Reference all content elements

  // 4. Create the table using WebImporter.DOMUtils.createTable
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  // 5. Replace the original element with the new table
  element.replaceWith(table);
}
