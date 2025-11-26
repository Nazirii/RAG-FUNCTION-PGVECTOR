# 🔷 Azure Deployment Guide - Borneo Eatery Backend

## Prerequisites
- Azure for Students account ($100 credit)
- Azure CLI installed
- Neon PostgreSQL database already setup
- Git repository pushed to GitHub

---

## 🚀 Deploy Laravel to Azure App Service

### Step 1: Install Azure CLI (If not installed)

Download and install:
```powershell
# Download Azure CLI installer
winget install -e --id Microsoft.AzureCLI
```

Or download from: https://aka.ms/installazurecliwindows

**Restart terminal** after installation.

---

### Step 2: Login to Azure

```powershell
az login
```

Browser akan terbuka → Login dengan akun Azure Student kamu.

Verify subscription:
```powershell
az account list --output table
```

Set default subscription (jika punya lebih dari 1):
```powershell
az account set --subscription "Azure for Students"
```

---

### Step 3: Create Resource Group

```powershell
# Create resource group di Southeast Asia (Singapore)
az group create --name rg-borneo-eatery --location southeastasia
```

Verify:
```powershell
az group show --name rg-borneo-eatery
```

---

### Step 4: Create App Service Plan (Linux)

```powershell
# Create Linux App Service Plan - Free tier (F1)
az appservice plan create `
  --name asp-borneo-eatery `
  --resource-group rg-borneo-eatery `
  --location southeastasia `
  --is-linux `
  --sku F1
```

**Note**: F1 (Free tier) limitations:
- 60 CPU minutes/day
- 1GB storage
- No custom domain SSL
- May have cold start

For production, upgrade to B1 (Basic): `--sku B1` (~$13/month)

---

### Step 5: Create Web App with PHP 8.2

```powershell
# Create web app
az webapp create `
  --name borneo-eatery-api `
  --resource-group rg-borneo-eatery `
  --plan asp-borneo-eatery `
  --runtime "PHP:8.2"
```

**Important**: Nama `borneo-eatery-api` harus unique globally! Jika sudah dipakai, ganti dengan nama lain (misal: `borneo-eatery-api-angerinred`).

Your app URL: `https://borneo-eatery-api.azurewebsites.net`

---

### Step 6: Configure Deployment from GitHub

#### Enable GitHub deployment:

```powershell
# Configure deployment source
az webapp deployment source config `
  --name borneo-eatery-api `
  --resource-group rg-borneo-eatery `
  --repo-url https://github.com/angerinred/RAG `
  --branch main `
  --manual-integration
```

Or use GitHub Actions (recommended):

1. Go to Azure Portal → Your App Service → **Deployment Center**
2. Select **GitHub** as source
3. Authorize GitHub
4. Select repository: `angerinred/RAG`
5. Branch: `main`
6. Azure will create GitHub Actions workflow automatically

---

### Step 7: Configure Environment Variables

Set semua env vars yang dibutuhkan:

```powershell
# App settings
az webapp config appsettings set `
  --name borneo-eatery-api `
  --resource-group rg-borneo-eatery `
  --settings `
    APP_NAME="BorneoEatery" `
    APP_ENV="production" `
    APP_DEBUG="false" `
    APP_URL="https://borneo-eatery-api.azurewebsites.net" `
    APP_KEY="base64:YOUR_APP_KEY_HERE"
```

**Generate APP_KEY** locally:
```powershell
cd C:\laragon\www\RESTO
php artisan key:generate --show
```
Copy output dan paste ke command berikutnya.

Set database config (Neon):
```powershell
az webapp config appsettings set `
  --name borneo-eatery-api `
  --resource-group rg-borneo-eatery `
  --settings `
    DB_CONNECTION="pgsql" `
    DB_HOST="ep-proud-rain-a1r5aoxh-pooler.ap-southeast-1.aws.neon.tech" `
    DB_PORT="5432" `
    DB_DATABASE="neondb" `
    DB_USERNAME="neondb_owner" `
    DB_PASSWORD="npg_shPN2LlEgXI3" `
    DB_SSLMODE="require"
```

Set Gemini API:
```powershell
az webapp config appsettings set `
  --name borneo-eatery-api `
  --resource-group rg-borneo-eatery `
  --settings `
    GEMINI_API_KEY="your_actual_gemini_api_key" `
    GEMINI_EMBEDDING_MODEL="text-embedding-004" `
    GEMINI_CHAT_MODEL="gemini-2.0-flash-exp"
```

Set other configs:
```powershell
az webapp config appsettings set `
  --name borneo-eatery-api `
  --resource-group rg-borneo-eatery `
  --settings `
    SESSION_DRIVER="database" `
    CACHE_STORE="database" `
    QUEUE_CONNECTION="database" `
    FRONTEND_URL="https://your-frontend.vercel.app"
```

---

### Step 8: Configure Startup Command

Azure needs startup command untuk run migrations:

```powershell
az webapp config set `
  --name borneo-eatery-api `
  --resource-group rg-borneo-eatery `
  --startup-file "php artisan migrate --force && php artisan config:cache && php artisan route:cache"
```

---

### Step 9: Enable Logging (Important!)

```powershell
# Enable application logs
az webapp log config `
  --name borneo-eatery-api `
  --resource-group rg-borneo-eatery `
  --application-logging filesystem `
  --detailed-error-messages true `
  --failed-request-tracing true
```

View logs:
```powershell
az webapp log tail `
  --name borneo-eatery-api `
  --resource-group rg-borneo-eatery
```

---

### Step 10: Deploy!

If using manual integration:
```powershell
az webapp deployment source sync `
  --name borneo-eatery-api `
  --resource-group rg-borneo-eatery
```

If using GitHub Actions:
- Just push to `main` branch
- GitHub Actions will auto-deploy

Check deployment status:
```powershell
az webapp deployment list-publishing-credentials `
  --name borneo-eatery-api `
  --resource-group rg-borneo-eatery
```

---

### Step 11: Run Database Migrations

Connect to SSH (if available on your plan):
```powershell
az webapp ssh `
  --name borneo-eatery-api `
  --resource-group rg-borneo-eatery
```

Then run:
```bash
cd /home/site/wwwroot
php artisan migrate --force
php artisan db:seed
```

**Alternative**: Use Kudu console
- Go to: `https://borneo-eatery-api.scm.azurewebsites.net/DebugConsole`
- Navigate to `/home/site/wwwroot`
- Run commands

---

### Step 12: Test API

```powershell
# Test health check
curl https://borneo-eatery-api.azurewebsites.net/api/menu

# Test AI chat
curl -X POST https://borneo-eatery-api.azurewebsites.net/api/ai/chat `
  -H "Content-Type: application/json" `
  -d '{\"message\":\"recommend coffee\",\"session_id\":\"test\",\"conversation_history\":[]}'
```

---

## 🔧 Troubleshooting

### Issue: 500 Internal Server Error

**Check logs**:
```powershell
az webapp log tail --name borneo-eatery-api --resource-group rg-borneo-eatery
```

**Common causes**:
- APP_KEY not set
- Database connection failed
- Missing PHP extensions

### Issue: Database connection timeout

**Solution**: Verify Neon credentials in App Settings
```powershell
az webapp config appsettings list `
  --name borneo-eatery-api `
  --resource-group rg-borneo-eatery
```

### Issue: Laravel shows "No application encryption key"

**Solution**: 
1. Generate key locally: `php artisan key:generate --show`
2. Set in Azure: 
```powershell
az webapp config appsettings set `
  --name borneo-eatery-api `
  --resource-group rg-borneo-eatery `
  --settings APP_KEY="base64:your-key-here"
```

### Issue: Cold start / Slow first request

**Solution**: 
- Free tier (F1) may sleep after inactivity
- Upgrade to B1 for always-on: `--sku B1`
- Or enable "Always On" in Portal

### Issue: Routes not working (404)

**Solution**: Clear cache
```powershell
az webapp config appsettings set `
  --name borneo-eatery-api `
  --resource-group rg-borneo-eatery `
  --settings FORCE_CACHE_CLEAR="true"
```

Then restart:
```powershell
az webapp restart --name borneo-eatery-api --resource-group rg-borneo-eatery
```

---

## 📊 Monitoring

### View Application Insights

```powershell
# Enable Application Insights
az monitor app-insights component create `
  --app borneo-eatery-insights `
  --location southeastasia `
  --resource-group rg-borneo-eatery
```

### Check Resource Usage

```powershell
# View metrics
az monitor metrics list `
  --resource borneo-eatery-api `
  --resource-group rg-borneo-eatery `
  --resource-type "Microsoft.Web/sites" `
  --metric "CpuTime" "Requests"
```

### Azure Portal

Go to: https://portal.azure.com
- Navigate to your App Service
- Check: **Metrics**, **Log Stream**, **Diagnose and solve problems**

---

## 💰 Cost Management

### Monitor Spending

```powershell
# Check remaining credit
az consumption usage list --output table
```

### Free Tier (F1) Includes:
- ✅ 60 CPU minutes/day
- ✅ 1GB storage
- ✅ 165MB outbound data/day
- ❌ No Always On
- ❌ No custom domain SSL

### Upgrade to Basic (B1) - $13/month:
```powershell
az appservice plan update `
  --name asp-borneo-eatery `
  --resource-group rg-borneo-eatery `
  --sku B1
```

Includes:
- ✅ Always On (no cold start)
- ✅ Custom domain SSL
- ✅ 1.75GB RAM
- ✅ Auto-scaling

---

## 🔐 Security Best Practices

### Enable HTTPS only
```powershell
az webapp update `
  --name borneo-eatery-api `
  --resource-group rg-borneo-eatery `
  --https-only true
```

### Set minimum TLS version
```powershell
az webapp config set `
  --name borneo-eatery-api `
  --resource-group rg-borneo-eatery `
  --min-tls-version 1.2
```

### Configure CORS
Already configured in `config/cors.php` - just update `FRONTEND_URL` env var.

---

## 🔄 CI/CD with GitHub Actions

If you selected GitHub Actions in Deployment Center, Azure auto-created `.github/workflows/main_borneo-eatery-api.yml`.

Workflow includes:
- Checkout code
- Setup PHP 8.2
- Install composer dependencies
- Deploy to Azure

Every push to `main` branch will auto-deploy! 🚀

---

## 🆘 Useful Commands

### Restart app
```powershell
az webapp restart --name borneo-eatery-api --resource-group rg-borneo-eatery
```

### Stop app (save credit)
```powershell
az webapp stop --name borneo-eatery-api --resource-group rg-borneo-eatery
```

### Start app
```powershell
az webapp start --name borneo-eatery-api --resource-group rg-borneo-eatery
```

### Delete everything (cleanup)
```powershell
az group delete --name rg-borneo-eatery --yes
```

### Export configuration
```powershell
az webapp config appsettings list `
  --name borneo-eatery-api `
  --resource-group rg-borneo-eatery `
  --output json > azure-settings.json
```

---

## 📝 Post-Deployment Checklist

- [ ] App accessible at `https://borneo-eatery-api.azurewebsites.net`
- [ ] API endpoints working (`/api/menu`)
- [ ] Database connected (check migrations)
- [ ] AI chat responding (`/api/ai/chat`)
- [ ] Logs showing no errors
- [ ] CORS configured for frontend
- [ ] Environment variables set correctly
- [ ] SSL enabled (HTTPS only)

---

## 🆘 Need Help?

- **Azure Docs**: https://docs.microsoft.com/azure/app-service/
- **Azure CLI Reference**: https://docs.microsoft.com/cli/azure/webapp
- **PHP on Azure**: https://docs.microsoft.com/azure/app-service/quickstart-php
- **Azure for Students**: https://azure.microsoft.com/free/students/

---

**Next**: Deploy Frontend to Vercel 🚀

Update `FRONTEND_URL` in Azure after frontend deployment!
