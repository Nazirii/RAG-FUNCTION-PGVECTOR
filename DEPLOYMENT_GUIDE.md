# 🚀 Deployment Guide - Borneo Eatery Backend

## Prerequisites
- GitHub account (with Student Developer Pack)
- Neon account (PostgreSQL serverless - free tier)
- Railway/Render account (for Laravel hosting)
- Gemini API Key

---

## 📦 Deploy Backend (Neon + Railway/Render)

### Step 1: Setup PostgreSQL Database on Neon

1. Go to [Neon Console](https://console.neon.tech)
2. Sign up with GitHub (free tier: 0.5GB storage, always-on)
3. Create New Project:
   - Project name: `borneo-eatery`
   - PostgreSQL version: 16
   - Region: Choose closest to your users (e.g., AWS Singapore)

4. **Enable pgvector Extension**:
   - Click your project → **SQL Editor**
   - Run this SQL:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

5. **Copy Connection String**:
   - Go to **Dashboard** → **Connection Details**
   - Copy the connection string (format: `postgresql://user:pass@host/db?sslmode=require`)
   - Keep this safe - you'll use it in Railway/Render

---

### Step 2A: Deploy Laravel to Railway (Recommended)

#### Deploy Application

1. Go to [Railway](https://railway.app)
2. Login with GitHub
3. Create New Project → "Empty Project"
4. Click **New** → "GitHub Repo"
5. Select `RAG-FUNCTION-PGVECTOR` repository
6. Railway will auto-detect Laravel and deploy

#### Configure Environment Variables

In Railway service → **Variables** tab, add:

```bash
# App Config
APP_NAME=BorneoEatery
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:YOUR_APP_KEY_HERE
APP_URL=https://your-backend.up.railway.app

# Neon PostgreSQL Database
DATABASE_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require

# Or use individual variables:
DB_CONNECTION=pgsql
DB_HOST=ep-xxx.region.aws.neon.tech
DB_PORT=5432
DB_DATABASE=dbname
DB_USERNAME=username
DB_PASSWORD=password
DB_SSLMODE=require

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

#### Generate APP_KEY

Run locally:
```bash
php artisan key:generate --show
```

Copy the output and paste to `APP_KEY` in Railway.

#### Deploy & Run Migrations

1. Railway will auto-deploy after env vars are set
2. Migrations run automatically via `Procfile`
3. Check logs: **Deployments** tab → click latest deployment

#### Seed Database

In Railway CLI or run command:
```bash
railway run php artisan db:seed
```

---

### Step 2B: Deploy Laravel to Render (Alternative)

#### Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Web Service**
3. Connect GitHub account → Select `RAG-FUNCTION-PGVECTOR` repo
4. Configure:
   - **Name**: `borneo-eatery-api`
   - **Region**: Singapore (closest to users)
   - **Branch**: `main`
   - **Runtime**: Docker (or Native - PHP)
   - **Build Command**: `composer install --optimize-autoloader --no-dev`
   - **Start Command**: `php artisan migrate --force && php artisan config:cache && php -S 0.0.0.0:$PORT -t public`
   - **Plan**: Free

#### Environment Variables

Add in Render → **Environment** tab:

```bash
APP_NAME=BorneoEatery
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:YOUR_APP_KEY_HERE
APP_URL=https://borneo-eatery-api.onrender.com

# Neon PostgreSQL
DATABASE_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
DB_CONNECTION=pgsql
DB_SSLMODE=require

# Gemini API
GEMINI_API_KEY=your_gemini_api_key
GEMINI_EMBEDDING_MODEL=text-embedding-004
GEMINI_CHAT_MODEL=gemini-2.0-flash-exp

# CORS
FRONTEND_URL=https://your-frontend.vercel.app

SESSION_DRIVER=database
CACHE_STORE=database
```

#### Deploy

1. Click **Create Web Service**
2. Wait for build (5-10 minutes first time)
3. Check logs for errors

**Note**: Render free tier has cold start (app sleeps after 15 min inactivity)

---

### Step 3: Seed Database (First Time Only)

After successful deployment, seed the menu data:

**Railway**:
```bash
railway run php artisan db:seed
```

**Render**:
Use Render Shell (Dashboard → Shell tab):
```bash
php artisan db:seed
```

---

### Step 4: Test API

Get your backend URL:
- Railway: Check **Settings** → **Domains**
- Render: `https://your-service.onrender.com`

Test endpoints:
```bash
# Health check
curl https://your-backend-url/api/menu

# Test AI chat
curl -X POST https://your-backend-url/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "recommend me a coffee",
    "session_id": "test123",
    "conversation_history": []
  }'
```

---

## 🔧 Troubleshooting

### Issue: pgvector extension not found
**Solution**: Run `CREATE EXTENSION vector;` in Neon SQL Editor

### Issue: Connection refused / SSL error
**Solution**: Add `?sslmode=require` to DATABASE_URL or set `DB_SSLMODE=require`

### Issue: APP_KEY not set
**Solution**: Generate with `php artisan key:generate --show` and set in env vars

### Issue: CORS errors from frontend
**Solution**: Update `FRONTEND_URL` in env vars to match your Vercel URL

### Issue: Migration Error
**Solution**: 
1. Check Neon database is active (not suspended)
2. Verify DATABASE_URL is correct
3. Check pgvector extension is enabled

### Issue: 500 Error
**Solution**: 
1. Check deployment logs
2. Common causes:
   - Missing env vars (APP_KEY, GEMINI_API_KEY)
   - Database connection failed
   - Migration not run

### Issue: Render - Cold Start / Slow Response
**Solution**: Free tier sleeps after 15 min inactivity. Keep alive with uptime monitor (like UptimeRobot) or upgrade to paid plan ($7/mo).

---

## 📊 Monitoring & Maintenance

### Neon Database

- **Dashboard**: https://console.neon.tech
- **Metrics**: Monitor storage, compute time, connections
- **SQL Editor**: Run queries directly
- **Backups**: Automatic point-in-time recovery (24 hours on free tier)

### Railway

- **Logs**: Service → **Observability**
- **Metrics**: CPU/Memory usage in **Metrics** tab
- **CLI**: Install `npm i -g @railway/cli` for local commands

### Render

- **Logs**: Dashboard → **Logs** tab (live stream)
- **Metrics**: Check deploy history and build times
- **Shell**: Run artisan commands directly

---

## 💰 Cost Estimation

### Free Tier Limits:

**Neon (PostgreSQL)**:
- ✅ 0.5GB storage
- ✅ 100 hours compute/month
- ✅ Unlimited databases
- ✅ Auto-suspend after inactivity (saves compute)
- ✅ Always-on available on paid plan ($19/mo)

**Railway**:
- ✅ $5/month usage credit (enough for small app)
- ✅ Pay only for what you use after credit
- Cost: ~$5-10/month after free credit

**Render**:
- ✅ Completely free for web services
- ❌ Cold start (spins down after 15 min inactivity)
- Paid: $7/month for always-on

### Recommended Setup:
- **Neon Free Tier** (database) = $0
- **Railway Hobby** (Laravel) = $5/month OR
- **Render Free** (Laravel) = $0 (with cold starts)

**Total**: $0-5/month for production app! 🎉

---

## 🆘 Quick Start Checklist

### Neon Setup
- [ ] Create Neon project
- [ ] Enable pgvector: `CREATE EXTENSION vector;`
- [ ] Copy DATABASE_URL

### Railway/Render Setup
- [ ] Connect GitHub repo
- [ ] Set environment variables (APP_KEY, DATABASE_URL, GEMINI_API_KEY, FRONTEND_URL)
- [ ] Deploy and check logs
- [ ] Run migrations (automatic via Procfile)
- [ ] Seed database: `php artisan db:seed`

### Testing
- [ ] Test API endpoint: `curl https://your-backend-url/api/menu`
- [ ] Test AI chat endpoint
- [ ] Verify CORS with frontend

---

## 🔐 Security Checklist

- ✅ Set `APP_DEBUG=false` in production
- ✅ Use strong `APP_KEY`
- ✅ Keep `GEMINI_API_KEY` secret (never commit to git)
- ✅ Set proper CORS origin (`FRONTEND_URL`)
- ✅ Enable HTTPS (automatic on Railway/Render)
- ✅ Use `sslmode=require` for Neon connection
- ✅ Neon automatic backups enabled

---

## 🆘 Need Help?

- **Neon Docs**: https://neon.tech/docs
- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **Laravel Deployment**: https://laravel.com/docs/deployment
- **Gemini API**: https://ai.google.dev/docs

---

**Next Step**: Deploy Frontend to Vercel 🚀
