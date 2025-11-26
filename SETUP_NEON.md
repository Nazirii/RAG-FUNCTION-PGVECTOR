# 🐘 Neon PostgreSQL Setup for Borneo Eatery

## Why Neon?
- ✅ **Serverless PostgreSQL** - Auto-scale, pay-per-use
- ✅ **Native pgvector support** - Perfect for embeddings
- ✅ **Generous free tier** - 0.5GB storage, 100 hours compute/month
- ✅ **Instant branching** - Create database copies for testing
- ✅ **Auto-suspend** - Saves compute when idle
- ✅ **No cold start** - Database ready instantly

---

## Quick Setup (5 minutes)

### 1. Create Neon Account

1. Go to [console.neon.tech](https://console.neon.tech)
2. Sign up with **GitHub** (recommended for Student Pack)
3. Verify email

### 2. Create Project

1. Click **Create a project**
2. Configure:
   - **Project name**: `borneo-eatery`
   - **PostgreSQL version**: `16` (latest)
   - **Region**: Choose closest to your users:
     - 🇸🇬 AWS Singapore (`ap-southeast-1`) - Southeast Asia
     - 🇺🇸 AWS US East (`us-east-1`) - Americas
     - 🇪🇺 AWS EU Central (`eu-central-1`) - Europe
   - **Compute size**: Shared (free tier, 0.25 vCPU)

3. Click **Create project**

### 3. Enable pgvector Extension

1. In your project, click **SQL Editor** (left sidebar)
2. Run this SQL:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
3. You should see: `✓ Extension created successfully`

### 4. Get Connection String

1. Go to **Dashboard** (home icon)
2. Find **Connection Details** section
3. **Connection string** tab shows:
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```
4. Click **Copy** button
5. Save this - you'll use it in Railway/Render environment variables

### 5. (Optional) Test Connection Locally

Update your `.env` file:
```env
DATABASE_URL=postgresql://user:pass@ep-xxx.aws.neon.tech/db?sslmode=require

# Or use individual vars:
DB_CONNECTION=pgsql
DB_HOST=ep-xxx-xxx.region.aws.neon.tech
DB_PORT=5432
DB_DATABASE=neondb
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_SSLMODE=require
```

Run migrations:
```bash
php artisan migrate
```

If successful, you'll see:
```
✓ 2024_11_24_create_menus_table ..... DONE
✓ 2024_11_24_create_carts_table ..... DONE
✓ 2024_11_24_create_transactions_table ..... DONE
```

---

## 📊 Monitor Your Database

### Neon Console Features

1. **Dashboard**
   - Storage usage
   - Compute hours used
   - Active connections
   - Query statistics

2. **SQL Editor**
   - Run queries directly
   - View tables: `SELECT * FROM menus;`
   - Check embeddings: `SELECT name, embedding FROM menus LIMIT 5;`

3. **Tables** Tab
   - Browse data with UI
   - Export to CSV
   - Edit rows directly

4. **Branches** (Powerful!)
   - Create instant database copies
   - Test migrations safely
   - Merge changes back

---

## 🔍 Verify pgvector is Working

Run in SQL Editor:
```sql
-- Check extension
SELECT * FROM pg_extension WHERE extname = 'vector';

-- Test vector operations
SELECT '[1,2,3]'::vector <-> '[4,5,6]'::vector AS distance;

-- Check your embeddings table
SELECT 
  name, 
  category,
  vector_dims(embedding) as embedding_dimensions
FROM menus 
LIMIT 5;
```

Expected output:
- Extension shows: `vector | 0.7.0`
- Distance calculation works
- Embeddings are 768 dimensions (for text-embedding-004)

---

## 💡 Pro Tips

### 1. Connection Pooling
Neon handles this automatically - no need for pgbouncer!

### 2. Auto-suspend
Database auto-suspends after 5 minutes of inactivity (saves compute). Wakes up instantly on first query (~100ms).

### 3. Compute Hours
Free tier: 100 hours/month. With auto-suspend, this is plenty:
- 24/7 always-on = 720 hours (need paid plan)
- Auto-suspend (typical usage) = 10-30 hours/month ✅

### 4. Branching for Testing
Before running risky migrations:
```bash
# Create branch via Neon Console
# Update .env to branch DATABASE_URL
php artisan migrate
# Test
# If good: merge branch in Neon Console
```

### 5. Monitoring
Set up alerts in Neon Console:
- Storage > 400MB (80% of free tier)
- Compute > 80 hours/month

---

## 🚨 Troubleshooting

### Error: "connection refused"
**Solution**: Check region in connection string matches your Neon project region

### Error: "no pg_hba.conf entry"
**Solution**: Add `?sslmode=require` to DATABASE_URL

### Error: "extension vector does not exist"
**Solution**: Run `CREATE EXTENSION vector;` in SQL Editor

### Database suspended
**Normal behavior!** First query after suspend takes ~100ms to wake up.

### Hitting compute limits
**Free tier**: 100 hours/month
**Solution**: 
1. Enable auto-suspend (default)
2. Upgrade to Launch plan ($19/mo) for more compute

---

## 🎓 Student Benefits

With **GitHub Student Developer Pack**:
1. Neon free tier (no credit card required)
2. Railway $5/month credit (for Laravel hosting)
3. Vercel Pro features (for frontend)

Combined = **$0/month** for full production app! 🎉

---

## 📚 Learn More

- **Neon Docs**: https://neon.tech/docs
- **pgvector Guide**: https://neon.tech/docs/extensions/pgvector
- **Laravel + Neon**: https://neon.tech/docs/guides/laravel
- **Connection String Format**: https://neon.tech/docs/connect/connect-from-any-app

---

**Next**: Deploy Laravel to Railway/Render using this DATABASE_URL → See `DEPLOYMENT_GUIDE.md`
