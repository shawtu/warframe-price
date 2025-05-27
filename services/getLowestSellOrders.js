import fetch from 'node-fetch';

export async function getLowestSellOrders(item) {
  const url = `https://api.warframe.market/v1/items/${item}/orders`;
  const response = await fetch(url);
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
