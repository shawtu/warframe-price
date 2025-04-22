import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

// Support for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Bond price endpoint
app.get('/api/:item', async (req, res) => {
  const item = req.params.item;
  const url = `https://api.warframe.market/v1/items/${item}/orders`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const sellOrders = data.payload.orders
      .filter(order => order.order_type === 'sell' && order.user.status === 'ingame')
      .sort((a, b) => a.platinum - b.platinum)
      .slice(0, 3)
      .map(order => ({
        price: order.platinum,
        user: order.user.ingame_name
      }));

    res.json(sellOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch data from Warframe Market' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
