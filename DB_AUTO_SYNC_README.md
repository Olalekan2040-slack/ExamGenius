# Database Auto-Sync Configuration

## Overview
When `DB_AUTO_SYNC=true` is set, the API automatically:
1. Imports questions from the `JAMB copy` folder if database has < 20,000 questions
2. Tags all questions with appropriate topics using keyword matching
3. Logs the sync status on startup

## Environment Variables

### Required
- `DATABASE_URL`: PostgreSQL connection string (e.g., `postgresql://user:password@host:port/dbname`)

### Optional
- `DB_AUTO_SYNC`: Enable automatic database synchronization (default: `false`)
  - Set to `true` in production to enable auto-import
  - Set to `false` to skip sync and start server faster

## Usage

### Development (Manual Import)
```bash
# Default - sync disabled
uvicorn main:app --reload
```

### Production (Auto-Sync Enabled)
```bash
# Set environment variable
export DB_AUTO_SYNC=true
export DATABASE_URL=postgresql://prod_user:prod_pass@prod-host:5432/examgenius

# Start server - questions will auto-import
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Docker Deployment
```yaml
# docker-compose.yml
services:
  api:
    environment:
      - DB_AUTO_SYNC=true
      - DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@db:5432/examgenius
```

### .env File
```env
# Enable auto-sync
DB_AUTO_SYNC=true
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/ExamgeniusDB
```

## How It Works

### 1. Startup Check
On application startup, if `DB_AUTO_SYNC=true`:
- Connects to database using `DATABASE_URL`
- Checks current question count
- Logs connection status and current state

### 2. Question Import (if needed)
If database has < 20,000 questions:
- Scans `JAMB copy` folder for subject directories
- Parses `.txt` files for questions and options
- Upserts questions (updates existing, inserts new)
- Uses deterministic IDs: `JAMB_{subject}_{year}_{number}`

### 3. Topic Tagging
For all subjects with empty topics:
- Art, Commerce, French, Geography, Hausa, History, Igbo, Music
- Uses keyword matching against pre-defined topic dictionaries
- Updates `topic` and `subtopic` fields

### 4. Status Logging
```
Starting ExamGenius API...
Version: 1.0.0
Database: prod-host:5432/examgenius
DB_AUTO_SYNC enabled - starting database synchronization...
  - Initial questions: 1250
  - Imported: 21403 new
  - Updated: 1250 existing
  - Tagged: 15533 questions
  - Final questions: 22653
✓ Database sync successful!
```

## Benefits

1. **Zero-Downtime Deployment**: Deploy to new servers without manual imports
2. **Idempotent**: Safe to run multiple times (upserts only)
3. **Production-Ready**: Only runs when explicitly enabled
4. **Fast Startup**: Skips sync in development (set `DB_AUTO_SYNC=false`)
5. **Automatic Updates**: Keep questions and topics in sync

## Data Source

Questions are imported from:
```
JAMB copy/
  ├── Physics/
  │   ├── 2010.txt
  │   ├── 2011.txt
  │   └── ...
  ├── Chemistry/
  ├── Biology/
  └── ...
```

## Monitoring

Check logs on startup:
```bash
# Look for these messages
grep "Database sync" logs/app.log
grep "✓ Database sync successful" logs/app.log
```

## Troubleshooting

### Sync Not Running
- Verify `DB_AUTO_SYNC=true` is set
- Check environment variables: `printenv | grep DB_AUTO_SYNC`

### Import Errors
- Ensure `JAMB copy` folder exists
- Check file permissions
- Verify database connection

### Performance
- Initial sync may take 2-5 minutes for 26,000+ questions
- Subsequent startups skip import if > 20,000 questions exist
- Disable sync in dev: `DB_AUTO_SYNC=false`

## Security Notes

- Credentials in `DATABASE_URL` must have INSERT/UPDATE permissions
- Keep `.env` file out of version control (add to `.gitignore`)
- Use different credentials for dev vs production
