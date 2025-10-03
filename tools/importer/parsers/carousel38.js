/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get the first image for desktop (or fallback to first available)
  function getMainImage(item) {
    const img = item.querySelector('.hero-carousel-img.cta-desktop')
      || item.querySelector('.hero-carousel-img')
      || item.querySelector('img');
    return img;
  }

  // Helper: get the full text content for a slide, including all relevant elements
  function getTextCell(item) {
    const wrapper = item.querySelector('.carousel-content-wrapper');
    if (!wrapper) return '';
    const content = wrapper.querySelector('.carousel-item-content') || wrapper;
    // Clone to avoid modifying the source DOM
    const clone = content.cloneNode(true);
    // Remove empty or decorative elements if needed (optional)
    // Remove classes for clean import (optional)
    clone.querySelectorAll('[class]')?.forEach(el => el.removeAttribute('class'));
    // Remove empty elements
    clone.querySelectorAll('*').forEach(el => {
      if (!el.textContent.trim() && !el.querySelector('img,a')) {
        el.remove();
      }
    });
    // If nothing left, return empty
    if (!clone.textContent.trim() && !clone.querySelector('a')) return '';
    return Array.from(clone.childNodes);
  }

  // Find all carousel items
  const carouselInner = element.querySelector('.carousel-inner');
  if (!carouselInner) return;
  const items = Array.from(carouselInner.querySelectorAll(':scope > .carousel-item'));

  // Table header
  const headerRow = ['Carousel (carousel38)'];
  const rows = [headerRow];

  // Build rows for each slide
  items.forEach((item) => {
    // Image cell
    const img = getMainImage(item);
    if (!img) return;
    // Text cell
    const textCell = getTextCell(item);
    rows.push([img, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
