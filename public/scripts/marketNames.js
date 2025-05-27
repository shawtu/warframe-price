// --- Warframe Market Name Mapping Utility ---

let itemMap = null;
let urlNameMap = null;

/**
 * Fetch and cache the market items.
 * Builds two maps:
 *   - itemMap: display name (lowercase) -> url_name
 *   - urlNameMap: url_name -> display name
 */
export async function ensureMarketNames() {
  if (itemMap && urlNameMap) return { itemMap, urlNameMap };
  const resp = await fetch('https://api.warframe.market/v1/items');
  const data = await resp.json();
  itemMap = {};
  urlNameMap = {};
  for (const entry of data.payload.items) {
    itemMap[entry.item_name.toLowerCase()] = entry.url_name;
    urlNameMap[entry.url_name] = entry.item_name;
  }
  return { itemMap, urlNameMap };
}

/**
 * Given a display name (case-insensitive), returns the market url_name.
 * Returns undefined if not found.
 */
export async function getUrlName(displayName) {
  const { itemMap } = await ensureMarketNames();
  return itemMap[displayName.toLowerCase()];
}

/**
 * Given a url_name, returns the display name.
 * Returns undefined if not found.
 */
export async function getDisplayName(urlName) {
  const { urlNameMap } = await ensureMarketNames();
  return urlNameMap[urlName];
}