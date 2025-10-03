/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Columns block (columns42)'];

  // Defensive: Find main column containers
  const main = element.querySelector('.believe-main');
  if (!main) return;

  // There are two main columns visually: left (text/links), right (image)
  const leftCol = main.querySelector('.believe-order-1');
  const rightCol = main.querySelector('.believe-order-2');

  // LEFT COLUMN: Compose all left side content
  let leftContent = [];
  if (leftCol) {
    const desc = leftCol.querySelector('.believe-desc');
    if (desc) {
      // Small headline
      const small = desc.querySelector('small.xs');
      if (small) leftContent.push(small);
      // Main paragraph
      const p = desc.querySelector('p.text-2');
      if (p) leftContent.push(p);
      // List of links
      const list = desc.querySelector('.believe_list');
      if (list) {
        // Each h4 contains a link
        const h4s = Array.from(list.querySelectorAll('h4'));
        h4s.forEach(h4 => {
          leftContent.push(h4);
        });
      }
    }
  }

  // RIGHT COLUMN: Compose image
  let rightContent = [];
  if (rightCol) {
    const imgWrap = rightCol.querySelector('.belive_image');
    if (imgWrap) {
      const img = imgWrap.querySelector('img');
      if (img) rightContent.push(img);
    }
  }

  // Build the table rows
  const cells = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
