import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/aerial-bond', async (req, res) => {
  try {
    const response = await fetch('https://api.warframe.market/v1/items/aerial_bond/orders');
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
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
