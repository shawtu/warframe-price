import fetch from 'node-fetch';

let cachedMarketNames = null;
let lastFetch = 0;

export async function getNameMapping() {
  // If cache is stale or empty, fetch new data
  if (!cachedMarketNames || Date.now() - lastFetch > 3600_000) {
    const resp = await fetch('https://api.warframe.market/v1/items');
    if (!resp.ok) {
      throw new Error(`Failed to fetch market items: ${resp.statusText}`);
    }
    const json = await resp.json();

    // Confirm the structure is as expected
    if (!json || !json.payload || !Array.isArray(json.payload.items)) {
      throw new Error(
        'Fetched market name mapping is missing payload.items array. Got: ' + JSON.stringify(json)
      );
    }

    cachedMarketNames = json;
    lastFetch = Date.now();
  }
  return cachedMarketNames;
}