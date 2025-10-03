/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the desktop background image element (reference, not clone)
  let desktopImg = null;
  const desktopBgImg = element.querySelector('img.banner-bg-desktop');
  if (desktopBgImg) desktopImg = desktopBgImg;

  // Extract all hero text content from .container .banner-main and any additional <h6> outside of it
  let textContent = [];
  const bannerMain = element.querySelector('.container .banner-main');
  if (bannerMain) {
    // Collect all children (including text nodes)
    [...bannerMain.childNodes].forEach((node) => {
      if (
        node.nodeType === Node.ELEMENT_NODE ||
        (node.nodeType === Node.TEXT_NODE && node.textContent.trim())
      ) {
        textContent.push(node);
      }
    });
  }
  // Also include any <h6> that is a direct child of .large-banner-bg but not inside .banner-main
  const largeBannerBg = element.querySelector('.large-banner-bg');
  if (largeBannerBg) {
    [...largeBannerBg.children].forEach((child) => {
      if (
        child.tagName === 'H6' &&
        (!bannerMain || !bannerMain.contains(child))
      ) {
        textContent.push(child);
      }
    });
  }

  // Compose table rows
  const headerRow = ['Hero (hero6)'];
  const imageRow = [desktopImg ? desktopImg : ''];
  const textRow = [textContent.length ? textContent : ''];

  const rows = [headerRow, imageRow, textRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
