# PolicyMate
PolicyMate intelligently matches students with government schemes they are eligible for and provides clear, actionable guidance to apply.

## Live Scheme Sync (No Dummy Data)

The backend seeder now pulls schemes from a live API and upserts them into MongoDB.

1. Add this in your backend environment file:

```env
SCHEMES_API_URL=https://your-live-schemes-api/endpoint
# Optional if your provider requires auth
SCHEMES_API_KEY=your_api_key
```

2. Run live sync:

```bash
cd backend
npm run seed:schemes
```

Notes:
- Existing schemes are marked inactive before sync.
- Latest records from the API are upserted as active.
- Your API response can be an array or use one of these keys: `schemes`, `data`, `results`, `records`.
