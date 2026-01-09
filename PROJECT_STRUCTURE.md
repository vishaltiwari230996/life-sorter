# Project Structure Guide

This document describes the organized folder structure for the Ikshan AI project.

## 📁 Folder Structure Overview

```
life-sorter/
│
├── 📁 frontend/                    # All frontend UI files
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── context/               # React context providers
│   │   ├── styles/                # CSS files
│   │   └── App.jsx, main.jsx      # Entry points
│   └── index.html
│
├── 📁 services/                    # Backend services and utilities
│   ├── api/                       # API endpoints (Vercel serverless)
│   │   ├── chat.js               # AI chat endpoint
│   │   ├── companies.js          # Companies data endpoint
│   │   ├── search-companies.js   # Company search endpoint
│   │   ├── save-idea.js          # Save idea to Google Sheets
│   │   └── speak.js              # Text-to-speech endpoint
│   └── utilities/                 # Shared utility functions
│       └── csvParser.js          # CSV parsing utilities
│
├── 📁 database/                    # Database operations
│   ├── config/                    # Database configuration
│   ├── operations/                # CRUD operations
│   │   └── supabase.js           # Supabase client and operations
│   ├── schemas/                   # Database schemas
│   └── migrations/                # Database migrations
│
├── 📁 database-automation/         # Database automation scripts
│   ├── scripts/                   # Automation scripts
│   ├── schedules/                 # Scheduled tasks configs
│   └── triggers/                  # Database triggers
│
├── 📁 knowledge-base/              # Data files and sheets
│   ├── data/                      # Raw data files (CSV, JSON)
│   │   └── AI SaaS Biz - Research.csv
│   └── sheets/                    # Google Sheets references
│
├── 📁 media/                       # Media assets
│   ├── logos/                     # Brand logos
│   ├── images/                    # Static images
│   └── videos/                    # Video files
│
├── 📁 logs/                        # Development logs
│   └── YYYY/MM/                   # Organized by date
│       └── YYYY-MM-DD.md
│
├── 📁 context-file/                # User context management
│   ├── schemas/                   # Context schemas
│   ├── builders/                  # Context builders
│   ├── questions/                 # Question flows
│   └── templates/                 # Context templates
│
├── 📁 ai-engines/                  # AI documentation
│   ├── engines/                   # Engine documentation
│   ├── prompts/                   # Prompt library
│   │   ├── system-prompts/
│   │   ├── user-prompts/
│   │   └── few-shot-examples/
│   └── configs/                   # Model configurations
│
├── 📁 solution-framework/          # Workflow and prompts
│   ├── workflow/                  # Workflow documentation
│   ├── prompts/                   # Master prompts
│   └── architecture/              # System architecture docs
│
├── 📁 expansion/                   # Future features
│   ├── features/                  # Planned features
│   │   ├── planned/
│   │   ├── research/
│   │   └── backlog/
│   ├── improvements/              # Improvement items
│   └── integrations/              # Planned integrations
│
├── 📁 config/                      # Configuration files
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── vercel.json
│
├── 📁 docs/                        # Project documentation
│   ├── README.md
│   ├── GOOGLE_SHEETS_SETUP.md
│   ├── OPENAI_SETUP.md
│   └── CSV_FORMAT.md
│
└── 📄 Root files
    ├── package.json
    ├── .env
    ├── .gitignore
    └── server.js
```

## 📋 Folder Descriptions

### 1. `frontend/` - Frontend UI
All React components, styles, and frontend logic.
- `src/components/` - Reusable React components
- `src/context/` - React context providers (Theme, Auth, etc.)
- `src/styles/` - CSS and styling files

### 2. `services/` - Services & Utilities
Backend services and shared utilities.
- `api/` - Serverless API functions
- `utilities/` - Helper functions and parsers

### 3. `database/` - Database Operations
All database-related code and configurations.
- `config/` - Connection settings
- `operations/` - CRUD functions
- `schemas/` - Data models

### 4. `database-automation/` - Automation
Scripts for automating database tasks.
- Backup scripts
- Sync operations
- Scheduled jobs

### 5. `knowledge-base/` - Data Files
All data sources for the application.
- Company data CSVs
- Research data
- External data references

### 6. `media/` - Media Assets
Images, videos, and other media.
- Logos and branding
- UI images
- Background videos

### 7. `logs/` - Development Logs
Daily development progress tracking.
- What was done
- Issues encountered
- Next steps

### 8. `context-file/` - User Context
User profile and context building.
- Question flows
- Profile schemas
- Context aggregation

### 9. `ai-engines/` - AI Documentation
Complete AI system documentation.
- Engine roles and purposes
- Prompt library
- Model configurations

### 10. `solution-framework/` - Workflow Docs
Application workflow and master prompts.
- User journey documentation
- Master prompts
- Architecture diagrams

### 11. `expansion/` - Future Plans
Roadmap and future features.
- Planned features
- Research items
- Backlog

### 12. `config/` - Configurations
Build and deployment configs.
- Docker configuration
- Vite build config
- ESLint rules

### 13. `docs/` - Documentation
Project documentation and guides.
- Setup guides
- API documentation
- Integration guides

## 🔄 Import Path Updates

When moving files, update imports as follows:

### Frontend Imports
```javascript
// Old
import ChatBotNew from './components/ChatBotNew';

// New
import ChatBotNew from './components/ChatBotNew';  // stays same within frontend
```

### Service Imports
```javascript
// Old
import { formatCompaniesForDisplay } from '../utils/csvParser';

// New  
import { formatCompaniesForDisplay } from '../../services/utilities/csvParser';
```

### Database Imports
```javascript
// Old
import { supabase } from '../lib/supabase';

// New
import { supabase } from '../../database/operations/supabase';
```

## 📝 Notes

1. **Keep root clean** - Only essential config files at root
2. **Use README.md** - Each folder has its own README
3. **Maintain logs** - Update development logs daily
4. **Document changes** - Update this guide when restructuring

## 🚀 Getting Started After Restructure

1. Install dependencies: `npm install`
2. Update environment variables in `.env`
3. Run development server: `npm run dev`
4. Check all imports resolve correctly

---

*Last updated: January 9, 2025*
