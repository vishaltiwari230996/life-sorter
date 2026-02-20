# Database Automation

This folder contains all automation scripts and configurations for database operations.

## Purpose
- Automate repetitive database tasks
- Schedule data backups
- Run data synchronization
- Perform data cleanup and maintenance
- Generate automated reports

## Folder Structure
```
database-automation/
├── scripts/
│   ├── backup.js             # Backup automation
│   ├── sync-sheets.js        # Google Sheets sync
│   ├── cleanup.js            # Data cleanup
│   └── reports.js            # Report generation
├── schedules/
│   ├── cron-jobs.md          # Cron job documentation
│   └── scheduled-tasks.js    # Scheduled task configs
├── triggers/
│   └── database-triggers.sql # Database triggers
└── README.md                 # This file
```

## Automation Scripts

### 1. Data Backup (`backup.js`)
Automatically backs up database to cloud storage.

```javascript
// Usage
node scripts/backup.js --full    # Full backup
node scripts/backup.js --incremental  # Incremental backup
```

### 2. Google Sheets Sync (`sync-sheets.js`)
Synchronizes data between Google Sheets and Supabase.

```javascript
// Sync companies data from Google Sheets
node scripts/sync-sheets.js --sheet=companies
```

### 3. Data Cleanup (`cleanup.js`)
Removes stale or invalid data entries.

```javascript
// Remove leads older than 90 days with no activity
node scripts/cleanup.js --older-than=90
```

### 4. Report Generation (`reports.js`)
Generates automated reports.

```javascript
// Generate weekly lead report
node scripts/reports.js --type=weekly-leads
```

## Scheduled Tasks

| Task | Schedule | Description |
|------|----------|-------------|
| Daily Backup | 2:00 AM | Full database backup |
| Sheet Sync | Every 6 hours | Sync Google Sheets data |
| Cleanup | Weekly (Sunday) | Remove stale data |
| Lead Report | Monday 9:00 AM | Weekly lead summary |

## Setting Up Automation

### Prerequisites
- Node.js 18+
- Database access credentials
- Google Sheets API credentials (for sync)

### Environment Variables
```env
DATABASE_URL=your_database_url
BACKUP_STORAGE_PATH=path_to_backup_storage
GOOGLE_SHEETS_API_KEY=your_api_key
```

### Running Locally
```bash
# Install dependencies
npm install

# Run a specific script
node scripts/backup.js

# Run with PM2 for scheduling
pm2 start ecosystem.config.js
```

## Adding New Automation

1. Create script in `scripts/` folder
2. Add schedule configuration
3. Test locally first
4. Document in this README
5. Add monitoring/alerting

## Monitoring

### Logs
All automation scripts log to:
- Console output (development)
- `logs/automation/` folder (production)

### Alerts
Configure alerts for:
- Failed backup operations
- Sync errors
- Cleanup issues
- Report generation failures

## Best Practices
1. Always test scripts in development first
2. Implement proper error handling
3. Add logging for debugging
4. Set up monitoring and alerts
5. Document all changes
6. Use transactions for data modifications
