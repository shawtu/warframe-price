import express from 'express';
import { getMarketNameMapping } from '../services/nameMappingService.js';

const router = express.Router();

router.get('/market-names', async (req, res) => {
  try {
    const mapping = await getMarketNameMapping();
    res.json(mapping);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch market names' });
  }
});

export default router;