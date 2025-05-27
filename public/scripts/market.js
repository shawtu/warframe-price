// --- Market Price Lookup Utilities (with automatic name mapping) ---

import { getUrlName } from './marketNames.js';

/**
 * Gets the lowest Warframe Market prices for a given item (by display name).
 * @param {string} itemName - The name from your CSV (e.g., "Companion Riven")
 * @param {number} count - Number of lowest prices to return
 * @returns {Promise<number[]|string[]>} - An array of price numbers, or error strings
 */
export async function getLowestMarketPrices(itemName, count = 5) {
  const urlName = await getUrlName(itemName);
  if (!urlName) {
    return [`No market entry for "${itemName}"`];
  }
  const endpoint = `/api/${urlName}`;
  try {
    const resp = await fetch(endpoint);
    if (!resp.ok) return [`HTTP error ${resp.status}: ${resp.statusText}`];
    const data = await resp.json();
    if (Array.isArray(data) && data.length > 0) {
      return data.slice(0, count).map(order => order.price);
    } else {
      return ["no order found"];
    }
  } catch (e) {
    return [e?.message || String(e)];
  }
}