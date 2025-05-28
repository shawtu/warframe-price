// tableSort.js
// Usage: import and call attachTableSorting('syndicate-table') after rendering your table

export function attachTableSorting(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Find the first table inside the container
  const table = container.querySelector('table');
  if (!table) return;

  // Add sorting to all th elements
  const ths = table.querySelectorAll('th');
  ths.forEach((th, idx) => {
    th.style.cursor = 'pointer';
    th.onclick = function () {
      sortTable(table, idx, th.getAttribute('data-type'));
      ths.forEach(h => h.classList.remove('sorted-asc', 'sorted-desc'));
      th.classList.toggle('sorted-asc', !th.classList.contains('sorted-asc'));
      th.classList.toggle('sorted-desc', th.classList.contains('sorted-asc'));
    };
  });
}

function sortTable(table, col, type) {
  const tbody = table.tBodies[0];
  const rows = Array.from(tbody.rows);
  const th = table.tHead.rows[0].cells[col];
  const asc = !th.classList.contains('sorted-asc');
  rows.sort((a, b) => {
    let v1 = a.cells[col].textContent.trim();
    let v2 = b.cells[col].textContent.trim();
    if (type === 'number') {
      v1 = parseFloat(v1.replace(/,/g, '')) || 0;
      v2 = parseFloat(v2.replace(/,/g, '')) || 0;
    }
    if (v1 < v2) return asc ? -1 : 1;
    if (v1 > v2) return asc ? 1 : -1;
    return 0;
  });
  rows.forEach(row => tbody.appendChild(row));
}