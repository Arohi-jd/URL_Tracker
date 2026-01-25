# Quick Start Guide

## Where to Add Your Supabase Keys

### Backend Configuration

1. Navigate to `backend/` folder
2. Copy the example file:
   ```bash
   cp .env.example .env
   ```
3. Open `backend/.env` and fill in your Supabase credentials:
   ```env
   SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...  # From Supabase → Settings → API
   SUPABASE_ANON_KEY=eyJhbGciOi...           # From Supabase → Settings → API
   PORT=4000
   ```

**⚠️ CRITICAL**: The `SERVICE_ROLE_KEY` **MUST NEVER** be committed to Git or exposed to the frontend. It bypasses Row-Level Security and should only be used server-side.

### Frontend Configuration

1. Navigate to `frontend/` folder
2. Create your local environment file:
   ```bash
   cp .env.example .env.local
   ```
3. Open `frontend/.env.local` and add:
   ```env
   VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...  # Same anon key as backend
   VITE_API_BASE_URL=http://localhost:4000
   ```

The `ANON_KEY` is safe for browser use—it works with Row-Level Security policies.

---

## Finding Your Supabase Keys

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`
   - **service_role** key (click "Reveal" icon) → `SUPABASE_SERVICE_ROLE_KEY`

---

## Running the App

### Terminal 1 - Backend
```bash
cd backend
npm install
npm run dev
```
✅ Backend starts on http://localhost:4000

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend starts on http://localhost:5173

### Database Setup (One-Time)
1. Open Supabase SQL Editor
2. Run [supabase/schema.sql](supabase/schema.sql) — creates tables
3. Run [supabase/policies.sql](supabase/policies.sql) — enables RLS
4. Enable Realtime for `url_status_logs`:
   - Database → Replication → enable `url_status_logs`

---

## Testing the App

1. Visit http://localhost:5173
2. Sign up with a new email/password
3. Add a URL to monitor (e.g., `https://google.com`)
4. Click the URL to see detailed stats and live chart
5. Wait ~1 minute for the first check to run

The backend scheduler checks URLs every minute and logs status updates in real-time to the frontend via Supabase Realtime!

---

## Optional: Notification Providers

To enable real email/SMS alerts, add these to `backend/.env`:

### SendGrid (Email)
```env
SENDGRID_API_KEY=SG.xxxxx
```

### Twilio (SMS)
```env
TWILIO_ACCOUNT_SID=ACxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_FROM_NUMBER=+1234567890
```

Then update [backend/src/worker/scheduler.ts](backend/src/worker/scheduler.ts) to send notifications using these providers when status changes are detected.

---

## Troubleshooting

**Backend won't start:**
- Check that `backend/.env` exists and has valid Supabase keys
- Run `npm install` in backend folder

**Frontend auth errors:**
- Verify `frontend/.env.local` has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Check Supabase → Authentication → Email Auth is enabled

**No data showing:**
- Ensure you ran the SQL migrations in Supabase
- Check backend console for errors
- Verify RLS policies are applied

**Charts not updating:**
- Enable Realtime replication for `url_status_logs` table in Supabase

---

## Commit History

This project was built in stages to show natural development:

1. **chore: scaffold backend + supabase structure** — Core API and database
2. **feat: add frontend scaffold with auth & dashboard** — React app
3. **feat: add monitor detail page with realtime chart** — Charts + WebSockets
4. **docs: comprehensive README with Supabase setup instructions** — Final docs

Each commit is a working milestone! 🚀
