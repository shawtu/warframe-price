import express from 'express';
import { getLowestSellOrders } from '../services/getLowestSellOrders.js';
import pLimit from 'p-limit';

const router = express.Router();

// Limit concurrent requests to Warframe Market API
const limit = pLimit(3);

// Batch endpoint: /api/batch?items=item1,item2,item3
// NOTE: This must come BEFORE the single-item endpoint!
router.get('/batch', async (req, res) => {
  try {
    const items = req.query.items
      ? req.query.items.split(',').map(item => item.trim()).filter(Boolean)
      : [];
    if (items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    // Use single-item service in parallel for batching, but limit concurrency
    const promises = items.map(item =>
      limit(async () => {
        try {
          const orders = await getLowestSellOrders(item);
          return { item, orders };
        } catch (err) {
          return { item, error: err.message };
        }
      })
    );

    const results = await Promise.all(promises);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch batch data from Warframe Market' });
  }
});

// Single item endpoint (must come AFTER the batch endpoint)
router.get('/:item', async (req, res) => {
  try {
    const sellOrders = await getLowestSellOrders(req.params.item);
    res.json(sellOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch data from Warframe Market' });
  }
});

export default router;