// Simple local dev server for API routes
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Import API handlers
import chatHandler from './api/chat.js';
import searchCompaniesHandler from './api/search-companies.js';
import companiesHandler from './api/companies.js';
import speakHandler from './api/speak.js';
import marketIntelligenceHandler from './api/market-intelligence.js';
import categoriesHandler from './api/categories.js';
import searchToolsHandler from './api/search-tools.js';
import rcaQuestionsHandler from './api/rca-questions.js';
import searchCustomGptsHandler from './api/search-custom-gpts.js';

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

app.post('/api/market-intelligence', async (req, res) => {
  await marketIntelligenceHandler(req, res);
});

app.get('/api/categories', async (req, res) => {
  await categoriesHandler(req, res);
});

app.post('/api/categories', async (req, res) => {
  await categoriesHandler(req, res);
});

app.post('/api/search-tools', async (req, res) => {
  await searchToolsHandler(req, res);
});

app.post('/api/rca-questions', async (req, res) => {
  await rcaQuestionsHandler(req, res);
});

app.post('/api/search-custom-gpts', async (req, res) => {
  await searchCustomGptsHandler(req, res);
});

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// In production, serve the built frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  // Handle SPA routing - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    }
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   API routes:`);
  console.log(`   - POST /api/chat`);
  console.log(`   - POST /api/search-companies`);
  console.log(`   - GET /api/companies`);
  console.log(`   - POST /api/speak (TTS)`);
  console.log(`   - POST /api/market-intelligence`);
  console.log(`   - GET/POST /api/categories`);
  console.log(`   - POST /api/search-tools`);
  console.log(`   - POST /api/rca-questions`);
  console.log(`   - POST /api/search-custom-gpts`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`   Frontend: Serving built files from /dist`);
  }
});
