import express from 'express';
import pLimit from 'p-limit';
import pRetry from 'p-retry';
import { getLowestSellOrders } from '../services/getLowestSellOrders.js';

const router = express.Router();
const limit = pLimit(5); // Max 5 concurrent requests

async function fetchWithRetry(item) {
  return pRetry(() => getLowestSellOrders(item), { retries: 2 });
}

router.get('/batch', async (req, res) => {
  const items = req.query.items ? req.query.items.split(',') : [];
  try {
    const promises = items.map(item => limit(() => fetchWithRetry(item)));
    const results = await Promise.all(promises);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch batch data' });
  }
});

export default router;