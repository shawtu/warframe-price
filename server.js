import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import marketRoutes from './routes/market.js';
import marketNamesRoutes from './routes/marketNames.js';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', marketRoutes);
app.use('/api', marketNamesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});