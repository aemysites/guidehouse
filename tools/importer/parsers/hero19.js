/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main banner background div
  const bannerBg = element.querySelector('.large-banner-bg');
  let imgEl = null;
  if (bannerBg) {
    imgEl = bannerBg.querySelector('img');
  }

  // Defensive: Find the main text container
  let textContainer = null;
  if (bannerBg) {
    const container = bannerBg.querySelector('.container');
    if (container) {
      textContainer = container.querySelector('.banner-main');
    }
  }

  // Compose the table rows
  const headerRow = ['Hero (hero19)'];
  const imageRow = [imgEl ? imgEl : ''];
  const contentRow = [textContainer ? textContainer : ''];

  const rows = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
