/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find first image in hero block
  function getHeroImage(el) {
    // Find all images in direct children
    const imgs = Array.from(el.querySelectorAll(':scope > div img'));
    // Prefer desktop, fallback to first
    const desktopImg = imgs.find(img => img.classList.contains('hero-large-desktop'));
    return desktopImg || imgs[0] || null;
  }

  // Helper to find heading and subheading
  function getHeroText(el) {
    // Find .container > .banner_main
    const container = el.querySelector(':scope > div.container');
    if (!container) return '';
    const banner = container.querySelector('.banner_main');
    if (!banner) return '';
    // Collect small, h1, and any CTA
    const small = banner.querySelector('small');
    const h1 = banner.querySelector('h1');
    // If there is a CTA (not present in these examples), add it
    const cta = banner.querySelector('a');
    // Compose content
    const frag = document.createDocumentFragment();
    if (small) frag.appendChild(small);
    if (h1) frag.appendChild(h1);
    if (cta) frag.appendChild(cta);
    return frag.childNodes.length ? frag : '';
  }

  // Build table rows
  const headerRow = ['Hero (hero16)'];
  const image = getHeroImage(element);
  const imageRow = [image ? image : ''];
  const textContent = getHeroText(element);
  const textRow = [textContent ? textContent : ''];

  // Compose table
  const rows = [headerRow, imageRow, textRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace element with table
  element.replaceWith(table);
}
