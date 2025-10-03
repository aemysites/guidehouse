/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main banner wrapper
  const bannerBg = element.querySelector('.large-banner-bg');
  // Defensive: Find all images in the banner background
  const imageDivs = bannerBg ? bannerBg.querySelectorAll(':scope > div') : [];
  let backgroundImg = null;
  // Try to find the desktop image first (prefer desktop for import)
  for (const div of imageDivs) {
    const img = div.querySelector('img.hero-large-desktop');
    if (img) {
      backgroundImg = img;
      break;
    }
  }
  // Fallback: Use first image if desktop not found
  if (!backgroundImg) {
    for (const div of imageDivs) {
      const img = div.querySelector('img');
      if (img) {
        backgroundImg = img;
        break;
      }
    }
  }

  // Defensive: Find the text container
  const container = bannerBg ? bannerBg.querySelector('.container') : null;
  const bannerMain = container ? container.querySelector('.banner-main') : null;
  // Find heading (h1) and possible subheading/cta (future-proofing)
  let heading = null;
  let subheading = null;
  let cta = null;
  if (bannerMain) {
    heading = bannerMain.querySelector('h1');
    // Try to find subheading and CTA if present
    // subheading: next element after h1 if it's not <small>
    const h1 = heading;
    if (h1 && h1.nextElementSibling && h1.nextElementSibling.tagName.toLowerCase() !== 'small') {
      subheading = h1.nextElementSibling;
    }
    cta = bannerMain.querySelector('a');
  }

  // Build table rows
  const headerRow = ['Hero (hero59)'];
  const imageRow = [backgroundImg ? backgroundImg : ''];
  // Compose the text cell
  const textCellContent = [];
  if (heading) textCellContent.push(heading);
  if (subheading) textCellContent.push(subheading);
  if (cta) textCellContent.push(cta);
  const textRow = [textCellContent.length ? textCellContent : ''];

  const cells = [
    headerRow,
    imageRow,
    textRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
