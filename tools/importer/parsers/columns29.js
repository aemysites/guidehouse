/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find main column containers
  const row = element.querySelector('.row');
  if (!row) return;

  // Find left and right columns
  // Left: .col-md-9.col-lg-8
  // Right: .offset-lg-1.col-md-3
  const leftCol = row.querySelector('.col-md-9.col-lg-8');
  const rightCol = row.querySelector('.offset-lg-1.col-md-3');

  // Defensive: ensure both columns exist
  if (!leftCol || !rightCol) return;

  // Prepare left column content
  // Featured insight: small, heading, link
  const featuredContent = leftCol.querySelector('.featured-content');
  let leftCellContent = [];
  if (featuredContent) {
    // Get <small>
    const small = featuredContent.querySelector('small');
    if (small) leftCellContent.push(small);
    // Get heading (div.heading-3)
    const heading = featuredContent.querySelector('.heading-3');
    if (heading) leftCellContent.push(heading);
    // Get link
    const link = featuredContent.querySelector('a');
    if (link) leftCellContent.push(link);
  }

  // Prepare right column content
  // Editor's pick: small, list of links
  const topicsList = rightCol.querySelector('.topics-list-wrapper');
  let rightCellContent = [];
  if (topicsList) {
    // Get <small>
    const small = topicsList.querySelector('small');
    if (small) rightCellContent.push(small);
    // Get all topic links
    const topicsItem = topicsList.querySelector('.topics-item');
    if (topicsItem) {
      // Each h6 contains a link
      const links = Array.from(topicsItem.querySelectorAll('a'));
      if (links.length) {
        // Create a list for visual grouping
        const ul = document.createElement('ul');
        links.forEach((a) => {
          const li = document.createElement('li');
          li.appendChild(a);
          ul.appendChild(li);
        });
        rightCellContent.push(ul);
      }
    }
  }

  // Build table rows
  const headerRow = ['Columns block (columns29)'];
  const contentRow = [leftCellContent, rightCellContent];

  // Create block table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
