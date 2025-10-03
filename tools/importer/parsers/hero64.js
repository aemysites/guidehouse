/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the best background image (desktop preferred)
  function getBackgroundImage() {
    // Get all images in the hero block
    const imgs = Array.from(element.querySelectorAll('img'));
    // Prefer desktop, then tablet, then mobile
    let bgImg = imgs.find(img => img.classList.contains('hero-large-desktop'))
      || imgs.find(img => img.classList.contains('hero-large-tablet'))
      || imgs.find(img => img.classList.contains('hero-large-mobile'))
      || imgs[0];
    return bgImg || '';
  }

  // Helper to get the main heading and subheading
  function getTextContent() {
    // Find the container with text
    const container = element.querySelector('.container');
    if (!container) return '';
    // Find banner_main inside container
    const banner = container.querySelector('.banner_main');
    if (!banner) return '';
    // Get subheading (small)
    const subheading = banner.querySelector('small');
    // Get heading (h1)
    const heading = banner.querySelector('h1');
    // Compose content
    const frag = document.createDocumentFragment();
    if (heading) frag.appendChild(heading);
    if (subheading) frag.appendChild(subheading);
    return frag.childNodes.length ? frag : '';
  }

  // Build table rows
  const headerRow = ['Hero (hero64)'];

  // Row 2: Background image (optional)
  const bgImg = getBackgroundImage();
  const imageRow = [bgImg];

  // Row 3: Headline, subheading, CTA (if present)
  const textContent = getTextContent();
  const textRow = [textContent];

  // Compose table
  const cells = [
    headerRow,
    imageRow,
    textRow,
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
