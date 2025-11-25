# 🚀 Deployment Guide - Borneo Eatery Backend

## Prerequisites
- GitHub account (with Student Developer Pack)
- Railway account (sign up with GitHub)
- Gemini API Key

---

## 📦 Deploy to Railway (Recommended)

### Step 1: Setup PostgreSQL with pgvector

1. Go to [Railway](https://railway.app)
2. Login with GitHub
3. Create New Project → "Deploy PostgreSQL"
4. Wait for PostgreSQL to be provisioned
5. Click PostgreSQL service → **Variables** tab
6. Copy connection details (will be auto-injected)

### Step 2: Enable pgvector Extension

1. In Railway PostgreSQL service, click **Data** tab
2. Click **Query** button
3. Run this SQL:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Step 3: Deploy Laravel Backend

1. In Railway project, click **New** → "GitHub Repo"
2. Connect your GitHub account
3. Select `RESTO` repository
4. Railway will auto-detect Laravel and deploy

### Step 4: Configure Environment Variables

In Railway Laravel service → **Variables** tab, add:

```bash
# App Config
APP_NAME=BorneoEatery
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:YOUR_APP_KEY_HERE
APP_URL=https://your-backend.up.railway.app

# Database (auto-injected by Railway, but verify)
DATABASE_URL=${{Postgres.DATABASE_URL}}
# Or manually set:
DB_CONNECTION=pgsql
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_DATABASE=${{Postgres.PGDATABASE}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}

# Gemini API
GEMINI_API_KEY=your_actual_gemini_api_key
GEMINI_EMBEDDING_MODEL=text-embedding-004
GEMINI_CHAT_MODEL=gemini-2.0-flash-exp

# CORS (update after frontend deployed)
FRONTEND_URL=https://your-frontend.vercel.app

# Session & Cache
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
```

### Step 5: Generate APP_KEY

Run locally to generate key:
```bash
php artisan key:generate --show
```

Copy the output (starts with `base64:`) and paste to `APP_KEY` in Railway.

### Step 6: Deploy & Run Migrations

1. Railway will auto-deploy after env vars are set
2. Check **Deployments** tab for build logs
3. Migrations will run automatically via `Procfile`
4. If migration fails, run manually in Railway CLI:
```bash
railway run php artisan migrate --force
```

### Step 7: Seed Database (First Time Only)

In Railway service → **Settings** → **Deploy**, run:
```bash
railway run php artisan db:seed --class=MenuSeeder
```

Or use Railway CLI:
```bash
railway run php artisan db:seed
```

### Step 8: Test API

Get your Railway URL from **Settings** → **Domains**

Test endpoints:
```bash
# Health check
curl https://your-backend.up.railway.app/api/menu

# Test AI chat
curl -X POST https://your-backend.up.railway.app/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "recommend me a coffee",
    "session_id": "test123",
    "conversation_history": []
  }'
```

---

## 🔧 Troubleshooting

### Issue: Migration Error - pgvector extension not found
**Solution**: Make sure you ran `CREATE EXTENSION vector;` in PostgreSQL

### Issue: APP_KEY not set
**Solution**: Generate key with `php artisan key:generate --show` and set in env vars

### Issue: CORS errors from frontend
**Solution**: Update `FRONTEND_URL` in Railway env vars to match your Vercel URL

### Issue: 500 Error
**Solution**: 
1. Check Railway logs: Service → **Deployments** → click latest deployment
2. Common causes:
   - Missing env vars (especially `APP_KEY`, `GEMINI_API_KEY`)
   - Database connection failed
   - Migration not run

### Issue: Cold Start / Slow Response
**Solution**: Railway free tier may sleep after inactivity. Upgrade to Hobby plan ($5/mo) for always-on.

---

## 📊 Monitoring

- **Logs**: Railway → Service → **Observability** tab
- **Metrics**: Check CPU/Memory usage in **Metrics** tab
- **Database**: PostgreSQL service → **Data** tab to browse tables

---

## 🔄 CI/CD

Railway auto-deploys on every push to `main` branch:
1. Push changes to GitHub
2. Railway detects change
3. Auto-build and deploy
4. Migrations run automatically

---

## 💰 Cost Estimation

**Railway Free Tier:**
- $5/month credit (enough for hobby project)
- PostgreSQL included
- After free credit: ~$5-10/month for small app

**Railway Hobby Plan ($5/month):**
- Always-on (no cold starts)
- Better performance
- Priority support

---

## 🔐 Security Checklist

- ✅ Set `APP_DEBUG=false` in production
- ✅ Use strong `APP_KEY`
- ✅ Keep `GEMINI_API_KEY` secret (never commit to git)
- ✅ Set proper CORS origin (`FRONTEND_URL`)
- ✅ Enable HTTPS (Railway provides this automatically)
- ✅ Regular backups of PostgreSQL (Railway provides daily backups)

---

## 📝 Post-Deployment

1. Update frontend `API_BASE_URL` to Railway URL
2. Test all features (AI chat, cart, checkout)
3. Monitor logs for errors
4. Setup alerts (optional, Railway Pro feature)

---

## 🆘 Need Help?

- Railway Docs: https://docs.railway.app
- Laravel Deployment: https://laravel.com/docs/deployment
- Gemini API: https://ai.google.dev/docs

---

**Next Step**: Deploy Frontend to Vercel (see frontend README)
