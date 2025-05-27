import fetch from 'node-fetch';

let cachedMarketNames = null;
let lastFetch = 0;

export async function getNameMapping() {
  if (!cachedMarketNames || Date.now() - lastFetch > 3600_000) {
    const resp = await fetch('https://api.warframe.market/v1/items');
    cachedMarketNames = await resp.json();
    lastFetch = Date.now();
  }
  return cachedMarketNames;
}