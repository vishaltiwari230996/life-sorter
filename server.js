// Simple local dev server for API routes
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createRequire } from 'module';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// Import API handlers
import chatHandler from './api/chat.js';
import searchCompaniesHandler from './api/search-companies.js';
import companiesHandler from './api/companies.js';
import speakHandler from './api/speak.js';

// API routes
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

app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`   API routes:`);
  console.log(`   - POST /api/chat`);
  console.log(`   - POST /api/search-companies`);
  console.log(`   - GET /api/companies`);
  console.log(`   - POST /api/speak (TTS)`);
});
