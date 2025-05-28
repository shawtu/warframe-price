import express from 'express';
import { getLowestSellOrders, getLowestSellOrdersBatch } from '../services/getLowestSellOrders.js';

const router = express.Router();

// Single item endpoint (unchanged, for compatibility)
router.get('/:item', async (req, res) => {
  try {
    const sellOrders = await getLowestSellOrders(req.params.item);
    res.json(sellOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch data from Warframe Market' });
  }
});

// Batch endpoint: /api/batch?items=item1,item2,item3
router.get('/batch', async (req, res) => {
  try {
    const items = req.query.items
      ? req.query.items.split(',').map(item => item.trim()).filter(Boolean)
      : [];
    if (items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }
    const results = await getLowestSellOrdersBatch(items);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch batch data from Warframe Market' });
  }
});

export default router;