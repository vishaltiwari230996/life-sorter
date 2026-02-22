// server.js - Fully Corrected
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'url';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// 1. Load env variables immediately
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// 2. FIX: Set port to 8000 to match your Vite Proxy settings
const PORT = process.env.PORT || 8000;

// 3. Import ALL API handlers
import chatHandler from './api/chat.js';
import searchCompaniesHandler from './api/search-companies.js';
import companiesHandler from './api/companies.js';
import speakHandler from './api/speak.js';
import marketIntelligenceHandler from './api/market-intelligence.js';
import saveIdeaHandler from './api/save-idea.js';
import createOrderHandler from './api/v1/payments/create-order.js';

// 4. API routes mapping
app.post('/api/chat', async (req, res) => {
  await chatHandler(req, res);
});

app.post('/api/search-companies', async (req, res) => {
  await searchCompaniesHandler(req, res);
});

app.get('/api/companies', async (req, res) => {
  await companiesHandler(req, res);
});

app.post('/api/speak', async (req, res) => {
  await speakHandler(req, res);
});

app.post('/api/market-intelligence', async (req, res) => {
  await marketIntelligenceHandler(req, res);
});

// FIX: Added missing routes that were causing 404s
app.post('/api/save-idea', async (req, res) => {
  try {
    await saveIdeaHandler(req, res);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/v1/payments/create-order', async (req, res) => {
  try {
    await createOrderHandler(req, res);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve static files
app.use(express.static(join(__dirname, 'public')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(join(__dirname, 'dist', 'index.html'));
    }
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`   Vite Proxy should now connect successfully.`);
});