# Database

This folder contains all database-related configurations, operations, and documentation.

## Overview
The application uses **Supabase** as the primary database solution.

## Folder Structure
```
database/
├── config/
│   └── supabase.config.js    # Database configuration
├── operations/
│   ├── leads.js              # Lead management operations
│   ├── users.js              # User operations
│   └── analytics.js          # Analytics operations
├── migrations/
│   └── ...                   # Database migrations
├── schemas/
│   └── ...                   # Database schemas
└── README.md                 # This file
```

## Database Schema

### Leads Table
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Lead's name |
| email | text | Lead's email |
| domain | text | Selected domain |
| subdomain | text | Selected subdomain |
| outcome_seeked | text | Desired outcome |
| individual_type | text | Type of individual |
| persona | text | User persona |
| nature_of_business | text | Business nature |
| business_website | text | Company website |
| manual_business_details | text | Manual business info |
| problem_description | text | Problem description |
| micro_solutions_tried | text | Previously tried solutions |
| micro_solutions_details | text | Solution details |
| tech_competency_level | text | Technical competency |
| timeline_urgency | text | Timeline urgency |
| problem_due_to_poor_management | boolean | Management issue flag |
| ai_recommendations | jsonb | AI recommendations |
| lead_score | integer | Calculated lead score |
| status | text | Lead status |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

## Connection Details
- **Provider**: Supabase
- **URL**: Configured via environment variables
- **Auth**: Anonymous key for client-side operations

## Environment Variables Required
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Operations

### Lead Operations
- `saveLead(leadData)` - Save a new lead
- `updateLead(id, data)` - Update existing lead
- `getLeads(filters)` - Retrieve leads with filters
- `calculateLeadScore(leadData)` - Calculate lead score

### Usage Example
```javascript
import { saveLead, getLeads } from '../database/operations/leads';

// Save a new lead
const result = await saveLead({
  name: 'John Doe',
  email: 'john@example.com',
  domain: 'saas'
});

// Get all leads
const leads = await getLeads({ status: 'new' });
```

## Best Practices
1. Always use parameterized queries
2. Validate data before database operations
3. Handle errors gracefully
4. Log database operations for debugging
5. Use transactions for multiple operations
