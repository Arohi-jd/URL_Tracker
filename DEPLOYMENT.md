# Deployment Guide

## Prerequisites
- GitHub account
- Render account (free): https://render.com
- Vercel account (free): https://vercel.com

## Step 1: Push to GitHub

```bash
git add .
git commit -m "chore: add deployment configs"
git remote add origin https://github.com/YOUR_USERNAME/URL_Tracker.git
git push -u origin main
```

## Step 2: Deploy Backend on Render

1. Go to https://dashboard.render.com
2. Click **New +** → **Blueprint**
3. Connect your GitHub repository
4. Render will detect `render.yaml` automatically
5. Add environment variables:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: From Supabase Dashboard → Settings → API
   - `SUPABASE_ANON_KEY`: From Supabase Dashboard → Settings → API
6. Click **Apply** and wait for deployment
7. Copy your backend URL (e.g., `https://url-tracker-backend-xxxx.onrender.com`)

**Note**: Free tier sleeps after 15 min inactivity. First request may take 30-60s to wake up.

## Step 3: Deploy Frontend on Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel detects the project automatically
4. Add environment variables:
   - `VITE_API_BASE_URL`: Your Render backend URL from Step 2
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
5. Click **Deploy**
6. Your app will be live at `https://your-project.vercel.app`

## Step 4: Update CORS (if needed)

If you get CORS errors, update `backend/src/index.ts`:

```typescript
app.use(cors({ 
  origin: ['https://your-project.vercel.app', 'http://localhost:5173'],
  credentials: true 
}));
```

Then redeploy backend on Render.

## Step 5: Configure Supabase Auth Redirects

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel URL to **Site URL**: `https://your-project.vercel.app`
3. Add to **Redirect URLs**: `https://your-project.vercel.app/**`

## Done! 🎉

Your app is now live and free to use!

### Free Tier Limits:
- **Render**: 750 hours/month, sleeps after inactivity
- **Vercel**: Unlimited deployments, 100GB bandwidth
- **Supabase**: 500MB database, 50k monthly active users
