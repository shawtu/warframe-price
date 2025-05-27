import express from 'express';
import { getLowestSellOrders } from '../services/getLowestSellOrders.js';

const router = express.Router();

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