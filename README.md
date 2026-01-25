# URL Monitoring & Uptime Checker

Full-stack web app to monitor URL uptime, log response times, and send alerts.

## Tech Stack
- **Frontend**: React + TypeScript (Vite), Supabase Auth, React Router, Recharts
- **Backend**: Node.js + Express (TypeScript), Axios, node-cron
- **Database**: Supabase (PostgreSQL) with Row-Level Security
- **Real-time**: Supabase Realtime for live status logs

## Features
- Sign up / Sign in with Supabase Auth
- Add & delete URL monitors with configurable check intervals
- Dashboard showing all monitors with status (up/down/unknown)
- Detailed monitor view with:
  - Response time chart (Recharts)
  - Status history table
  - Real-time updates via Supabase Realtime
- Automated URL checks every minute (configurable per monitor)
- Notifications stub (ready to integrate SendGrid/Twilio)

---

## Getting Started

### 1. Supabase Setup

1. Create a [Supabase](https://supabase.com) project
2. Enable **Email Auth** in Authentication settings
3. Enable **Realtime** for `url_status_logs` table (Database → Replication)
4. Run SQL migrations in Supabase SQL Editor:
   - [supabase/schema.sql](supabase/schema.sql)
   - [supabase/policies.sql](supabase/policies.sql)
5. Copy your project credentials:
   - Project URL
   - Anon (public) key
   - Service role key (keep secret!)

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env and add your Supabase credentials
npm install
npm run dev
```

**Environment variables** (backend/.env):
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (server-side only)
- `SUPABASE_ANON_KEY`: Anon key for user token verification
- `PORT`: 4000 (default)

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env.local
# Edit .env.local and add your Supabase credentials
npm install
npm run dev
```

**Environment variables** (frontend/.env.local):
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Anon key (safe for frontend)
- `VITE_API_BASE_URL`: http://localhost:4000

### 4. Run the App

- Backend runs on http://localhost:4000
- Frontend runs on http://localhost:5173

Sign up, add a URL to monitor, and watch the real-time charts!

---

## Project Structure

```
URL_Tracker/
├── backend/
│   ├── src/
│   │   ├── api/          # Express route handlers
│   │   ├── lib/          # Supabase client & utilities
│   │   ├── middleware/   # Auth middleware
│   │   ├── worker/       # Cron scheduler for URL checks
│   │   ├── index.ts      # Main server entry
│   │   └── types.ts      # TypeScript types
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── pages/        # Auth, Dashboard, MonitorDetail
│   │   ├── lib/          # Supabase client & API helpers
│   │   ├── App.tsx       # Router & auth guard
│   │   └── types.ts
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
├── supabase/
│   ├── schema.sql        # Database tables & functions
│   └── policies.sql      # Row-Level Security policies
└── README.md
```

---

## API Endpoints

All endpoints require `Authorization: Bearer <supabase-access-token>` header.

| Method | Endpoint              | Description                    |
|--------|-----------------------|--------------------------------|
| GET    | `/api/monitor`        | List user's monitors           |
| POST   | `/api/monitor`        | Add new monitor                |
| DELETE | `/api/monitor/:id`    | Delete monitor                 |
| GET    | `/api/monitor/:id/status` | Get status history         |

---

## Database Schema

- **monitored_urls**: User's URL monitors (url, interval, last_status)
- **url_status_logs**: Historical check results (status, response_time_ms, error)
- **notifications**: Queued alerts (type: email/sms/push)

---

## Where to Add Supabase Keys

### Backend (Server-Side Only)
Create `backend/.env` from `backend/.env.example`:
```env
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
```

**⚠️ NEVER commit `.env` or expose `SERVICE_ROLE_KEY` to the frontend!**

### Frontend (Public)
Create `frontend/.env.local` from `frontend/.env.example`:
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_BASE_URL=http://localhost:4000
```

Only the **anon key** goes in the frontend; it's safe for browsers.

---

## Optional Integrations

### Email Notifications (SendGrid)
1. Install: `npm install @sendgrid/mail`
2. Add to `backend/.env`: `SENDGRID_API_KEY=your-key`
3. Update [backend/src/worker/scheduler.ts](backend/src/worker/scheduler.ts) to send emails on status change

### SMS Notifications (Twilio)
1. Install: `npm install twilio`
2. Add to `backend/.env`:
   ```
   TWILIO_ACCOUNT_SID=your-sid
   TWILIO_AUTH_TOKEN=your-token
   TWILIO_FROM_NUMBER=+1234567890
   ```
3. Update scheduler to send SMS alerts

---

## Commit History

This project was built incrementally:
1. `chore: scaffold backend + supabase structure` — API, scheduler, SQL schema
2. `feat: add frontend scaffold with auth & dashboard` — React app, auth pages
3. `feat: add monitor detail page with realtime chart` — Charts, realtime updates

Each commit represents a working milestone to demonstrate natural development flow.

---

## Deployment

- **Backend**: Deploy to Railway, Render, or Fly.io (set env vars)
- **Frontend**: Deploy to Vercel, Netlify (set VITE_* env vars)
- **Database**: Hosted by Supabase (production plan recommended)

For production:
- Separate worker process (Bull queue + Redis) from API server
- Enable HTTPS and CORS policies
- Add rate limiting and monitoring

---

## License

MIT

