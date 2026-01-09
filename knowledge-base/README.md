# Knowledge Base

This folder contains all data files and sheets needed for the application.

## Contents

### Data Files
- `AI SaaS Biz - Research.csv` - Main research data for AI SaaS businesses
- Additional CSV/data files for company information

### Structure
```
knowledge-base/
├── data/           # Raw data files (CSV, JSON, etc.)
├── sheets/         # Google Sheets exports and references
└── README.md       # This file
```

## Data Sources
- Google Sheets integration for real-time company data
- Static CSV files for offline/backup data

## Adding New Data
1. Place raw data files in the `data/` subfolder
2. Update the relevant parsers in `services/utilities/`
3. Document the data schema below

## Data Schemas

### Company Data Schema
| Field | Type | Description |
|-------|------|-------------|
| name | string | Company name |
| problem | string | Problem they solve |
| description | string | Company description |
| differentiator | string | What makes them unique |
| aiAdvantage | string | AI-related advantages |
| pricing | string | Pricing information |
