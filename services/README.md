# Services

This folder contains all backend services and utility functions.

## Structure

```
services/
├── api/                     # Vercel serverless API functions
│   ├── chat.js              # AI chat endpoint (OpenAI)
│   ├── companies.js         # Fetch companies from Google Sheets
│   ├── search-companies.js  # Search/filter companies
│   ├── save-idea.js         # Save ideas to Google Sheets
│   └── speak.js             # Text-to-speech endpoint
└── utilities/
    └── csvParser.js         # CSV parsing and company filtering
```

## API Endpoints

### POST /api/chat
AI-powered chat responses using OpenAI.

**Request:**
```json
{
  "message": "user message",
  "persona": "assistant|product|contributor",
  "context": {},
  "conversationHistory": []
}
```

**Response:**
```json
{
  "message": "AI response"
}
```

### GET /api/companies
Fetch companies from Google Sheets.

**Query Params:**
- `domain` - Filter by domain (marketing, sales-support, etc.)

### POST /api/search-companies
Search and score companies based on requirements.

**Request:**
```json
{
  "domain": "marketing",
  "subdomain": "lead generation",
  "requirement": "user's requirement",
  "userContext": {}
}
```

### POST /api/save-idea
Save user interaction to Google Sheets.

## Utilities

### csvParser.js
Functions for working with company data:
- `fetchCompaniesCSV(domain)` - Fetch companies from API
- `searchCompanies(companies, query)` - Search by keywords
- `filterCompaniesByDomain(companies, domain, subdomain)` - Filter
- `formatCompaniesForDisplay(companies, limit)` - Format for chat
- `analyzeMarketGaps(requirement, companies)` - Gap analysis

## Environment Variables

```env
OPENAI_API_KEY=your_key
OPENAI_MODEL_NAME=gpt-4o-mini
```

## Notes

- All APIs are Vercel serverless functions
- Google Sheets used as lightweight database for company data
- OpenAI for AI chat capabilities
