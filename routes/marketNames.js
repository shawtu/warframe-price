import express from 'express';
import { getNameMapping } from '../services/getNameMapping.js';

const router = express.Router();

router.get('/market-names', async (req, res) => {
  try {
    const mapping = await getNameMapping();
    res.json(mapping);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch market names' });
  }
});

export default router;