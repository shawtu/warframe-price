import fetch from 'node-fetch';
import { getNameMapping } from './getNameMapping.js';
import { marketNameOverrides } from './marketNameOverrides.js';

// Helper to fetch orders from the market API
async function fetchMarketOrders(slug) {
  const url = `https://api.warframe.market/v1/items/${slug}/orders`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Market API error for ${slug}`);
  const data = await response.json();

  return data.payload.orders
    .filter(order => order.order_type === 'sell' && order.user.status === 'ingame')
    .sort((a, b) => a.platinum - b.platinum)
    .slice(0, 3)
    .map(order => ({
      price: order.platinum,
      user: order.user.ingame_name
    }));
}

export async function getLowestSellOrders(item) {
  const mapping = await getNameMapping();
  const itemKey = item.toLowerCase();

  // 1. Check manual overrides first
  if (Object.prototype.hasOwnProperty.call(marketNameOverrides, itemKey)) {
    const override = marketNameOverrides[itemKey];
    // Not tradeable
    if (override === null) {
      throw new Error(`Item "${item}" is not tradeable on warframe.market`);
    }
    // Hardset price
    if (typeof override === "object" && override.price) {
      return [{
        price: override.price,
        user: "Hardset"
      }];
    }
    // Slug only (string or object)
    const slug = typeof override === "string" ? override : override.slug;
    if (!slug) throw new Error(`No slug for item: ${item}`);
    // fetch from market as normal
    return await fetchMarketOrders(slug);
  }

  // 2. Fallback to market mapping
  const entry = mapping.payload.items.find(
    obj => obj.item_name.toLowerCase() === itemKey
  );
  if (!entry) {
    throw new Error(`No entry found for item: ${item}`);
  }
  return await fetchMarketOrders(entry.url_name);
}