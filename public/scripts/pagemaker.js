// --- 0. Cache for market item mapping ---
let marketItemMap = null;

// --- 0.1. Fetch and cache all market items ---
async function ensureMarketItemMap() {
  if (marketItemMap) return marketItemMap;
  const resp = await fetch('https://api.warframe.market/v1/items');
  const data = await resp.json();
  marketItemMap = {};
  for (const entry of data.payload.items) {
    // Use lowercase for easier matching
    marketItemMap[entry.item_name.toLowerCase()] = entry.url_name;
  }
  return marketItemMap;
}

// --- 1. Fetch and parse CSV data ---
export async function fetchSyndicateData(csvUrl) {
  const response = await fetch(csvUrl);
  const text = await response.text();
  return parseCsvData(text);
}

function parseCsvData(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const items = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = lines[i].split(',').map(v => v.trim());
    const item = {};
    headers.forEach((h, idx) => {
      let val = values[idx] ?? '';
      if (h.toLowerCase() === "reputation") val = Number(val.replace(/,/g, ""));
      if (h.toLowerCase() === "important") val = val.toLowerCase() === "true";
      item[h] = val;
    });
    items.push(item);
  }
  return items;
}

// --- 2. Warframe Market Price Fetcher (uses proxy server) ---
async function getLowestMarketPrices(itemName, count = 5) {
  const endpoint = '/proxy/looter'; // Use your proxy endpoint!
  try {
    const resp = await fetch(endpoint);
    if (!resp.ok) {
      return [`HTTP error ${resp.status}: ${resp.statusText}`];
    }
    const data = await resp.json();
    if (
      data &&
      data.payload &&
      Array.isArray(data.payload.orders) &&
      data.payload.orders.length > 0
    ) {
      return [data.payload.orders[0].platinum];
    } else {
      return ["no order found"];
    }
  } catch (e) {
    return [e?.message || String(e)];
  }
}

// --- 3. Render Table ---
export function renderSyndicateTable(items, container) {
  // Only show important items
  const importantItems = items.filter(it => it.Important === true);

  // Build table
  const table = document.createElement('table');
  table.className = 'syndicate-table';
  table.innerHTML = `
    <thead>
      <tr>
        <th>Name</th>
        <th>Reputation</th>
        <th>Plat (Market Lowest 5)</th>
        <th>Rep/Plat</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  `;

  const tbody = table.querySelector('tbody');
  importantItems.forEach(item => {
    tbody.appendChild(renderSyndicateRow(item));
  });

  if (typeof container === "string") container = document.getElementById(container);
  container.innerHTML = "";
  container.appendChild(table);

  // Fetch prices for each item and update Plat column
  importantItems.forEach((item, idx) => {
    getLowestMarketPrices(item.Name, 5).then(pricesArr => {
      const platCell = tbody.rows[idx].cells[2];
      platCell.textContent = pricesArr.join(', ');
      // Optionally update Rep/Plat with the first price only if it's a number
      const rep = item.Reputation;
      if (
        rep &&
        pricesArr[0] &&
        !isNaN(Number(pricesArr[0])) &&
        pricesArr[0] !== "-"
      ) {
        tbody.rows[idx].cells[3].textContent = (rep / pricesArr[0]).toFixed(1);
      } else {
        tbody.rows[idx].cells[3].textContent = "-";
      }
    });
  });
}

// --- 4. Render a table row ---
function renderSyndicateRow(item) {
  const tr = document.createElement('tr');
  let platValue = ""; // Will be filled async
  let repPerPlat = ""; // Will be filled when plat updates
  tr.innerHTML = `
    <td>${item.Name}</td>
    <td>${formatNumber(item.Reputation)}</td>
    <td>${platValue}</td>
    <td>${repPerPlat}</td>
  `;
  return tr;
}

// --- Utility: format numbers with commas ---
function formatNumber(n) {
  if (!n && n !== 0) return "";
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}