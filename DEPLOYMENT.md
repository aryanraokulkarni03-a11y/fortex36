# SkillSync Deployment Guide

> Deploy your app to production in under 10 minutes

---

## 🚀 Quick Deployment Checklist

- [ ] Frontend deployed to Vercel → Get `https://skillsync.vercel.app`
- [ ] Backend deployed to Railway → Get `https://skillsync-api.railway.app`
- [ ] Environment variables configured
- [ ] MongoDB Atlas connected
- [ ] Test production URLs

**Estimated Time:** 15-20 minutes

---

## 📦 Part 1: Deploy Backend (Railway)

### Step 1: Prepare Backend for Deployment

**Create `Procfile` in `graphrag/` folder:**

```bash
cd graphrag
```

Create file `Procfile` (no extension):
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Create `runtime.txt`:**
```
python-3.11
```

**Update `requirements.txt` (if needed):**
```bash
cd graphrag
pip freeze > requirements.txt
```

---

### Step 2: Deploy to Railway

**Option A: Using Railway CLI**

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login:
```bash
railway login
```

3. Initialize project:
```bash
cd graphrag
railway init
```

4. Deploy:
```bash
railway up
```

5. Get URL:
```bash
railway domain
```

---

**Option B: Using Railway Dashboard (Easier)**

1. Go to https://railway.app
2. Sign up with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your SkillSync repo
6. Set **Root Directory:** `graphrag`
7. Railway auto-detects Python
8. Click **"Deploy"**

**Configure Environment Variables:**
- Go to **Variables** tab
- Add:
  ```
  MONGODB_URI=mongodb+srv://your-atlas-uri
  GROQ_API_KEY=gsk_your_key
  CORS_ORIGINS=https://skillsync.vercel.app
  ```

**Get Your Backend URL:**
- Click **"Settings"** → **"Generate Domain"**
- Copy URL: `https://skillsync-api.railway.app`

---

## 🌐 Part 2: Deploy Frontend (Vercel)

### Step 1: Prepare Frontend

**Update `frontend/.env.production`:**

Create `.env.production`:
```bash
NEXT_PUBLIC_GRAPHRAG_URL=https://skillsync-api.railway.app
NEXTAUTH_URL=https://skillsync.vercel.app
NEXTAUTH_SECRET=your-secret-here
MONGODB_URI=mongodb+srv://your-atlas-uri
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

### Step 2: Deploy to Vercel

**Option A: Vercel CLI**

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login:
```bash
vercel login
```

3. Deploy:
```bash
cd frontend
vercel
```

4. Follow prompts:
   - Set project name: `skillsync`
   - Framework preset: **Next.js**
   - Deploy to production: **Yes**

---

**Option B: Vercel Dashboard (Recommended)**

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click **"Add New Project"**
4. Import your SkillSync repo
5. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

**Add Environment Variables:**
- Click **"Environment Variables"**
- Add all from `.env.production`
- Important ones:
  ```
  NEXT_PUBLIC_GRAPHRAG_URL=https://skillsync-api.railway.app
  NEXTAUTH_URL=https://skillsync.vercel.app
  NEXTAUTH_SECRET=<generated-secret>
  MONGODB_URI=<your-atlas-uri>
  GROQ_API_KEY=gsk_...
  ```

6. Click **"Deploy"**

**Get Your Frontend URL:**
- After deployment: `https://skillsync.vercel.app`
- Custom domain available in Settings

---

## 🗄️ Part 3: Setup MongoDB Atlas

### Step 1: Create Cluster

1. Go to https://mongodb.com/cloud/atlas
2. Sign up (free tier)
3. Create **Free Cluster (M0)**
4. Choose **AWS** → **Mumbai** (closer to India)
5. Name cluster: `skillsync`

---

### Step 2: Configure Database

1. **Create Database User:**
   - Security → Database Access
   - Add New User
   - Username: `skillsync-admin`
   - Password: Generate strong password
   - Permissions: **Read/Write Any Database**

2. **Whitelist IP:**
   - Security → Network Access
   - Add IP Address
   - Choose **"Allow Access from Anywhere"** (0.0.0.0/0)
   - (For production, restrict to Railway/Vercel IPs)

3. **Get Connection String:**
   - Click **"Connect"**
   - Choose **"Connect your application"**
   - Copy URI:
     ```
     mongodb+srv://skillsync-admin:<password>@skillsync.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your user password

---

### Step 3: Seed Database (Optional)

**Option A: Use GraphRAG endpoint**
```bash
curl -X POST https://skillsync-api.railway.app/demo/seed
```

**Option B: Manual import** (MongoDB Compass)
1. Download MongoDB Compass
2. Connect with URI
3. Create database: `skillsync`
4. Import demo data from `graphrag/demo_data.json` (if exists)

---

## ✅ Part 4: Verify Deployment

### Test Backend

```bash
# Health check
curl https://skillsync-api.railway.app/health

# Expected response:
# {"status":"healthy","graph_nodes":15,"db_connected":true}

# Stats
curl https://skillsync-api.railway.app/stats

# Seed demo data
curl -X POST https://skillsync-api.railway.app/demo/seed
```

---

### Test Frontend

1. Open: https://skillsync.vercel.app
2. Check:
   - ✅ Landing page loads
   - ✅ Login page accessible
   - ✅ No console errors
   - ✅ API calls work (Network tab)

3. Test Login:
   - Use SRM email: `test@srmap.edu.in`
   - Complete authentication
   - Dashboard should load

---

## 🔧 Troubleshooting

### Issue: Backend 500 Error

**Symptoms:** `/health` returns error  
**Fix:**
```bash
# Check Railway logs
railway logs

# Common issues:
- MongoDB URI incorrect → Verify in Variables
- Missing dependencies → Check requirements.txt
- Port binding → Use $PORT environment variable
```

---

### Issue: Frontend Build Fails

**Symptoms:** Vercel deployment fails  
**Fix:**
1. Check build logs in Vercel
2. Common issues:
   - TypeScript errors → Run `npm run build` locally first
   - Missing env vars → Add to Vercel dashboard
   - Import errors → Check file paths (case-sensitive in production)

**Test build locally:**
```bash
cd frontend
npm run build
npm start
```

---

### Issue: CORS Errors

**Symptoms:** Frontend can't connect to backend  
**Fix:**

Update `graphrag/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://skillsync.vercel.app",
        "http://localhost:3000"  # For local testing
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Redeploy backend.

---

### Issue: Database Connection Fails

**Symptoms:** `db_connected: false`  
**Fix:**
1. Verify MongoDB URI format:
   ```
   mongodb+srv://<user>:<password>@<cluster>.mongodb.net/skillsync?retryWrites=true&w=majority
   ```
2. Check IP whitelist (0.0.0.0/0)
3. Verify user credentials
4. Add `/skillsync` database name to URI

---

## 🎯 Quick Deploy Commands

**All-in-One Script (after Railway/Vercel setup):**

```bash
# 1. Deploy backend
cd graphrag
railway up

# 2. Deploy frontend
cd ../frontend
vercel --prod

# 3. Test both
curl https://skillsync-api.railway.app/health
open https://skillsync.vercel.app
```

---

## 📊 Post-Deployment Checklist

- [ ] Backend health check returns `200 OK`
- [ ] Frontend loads without errors
- [ ] Login flow works
- [ ] MongoDB shows connected users
- [ ] GraphRAG matching works
- [ ] No CORS errors in browser console
- [ ] Demo data seeded (if needed)
- [ ] Environment variables set correctly
- [ ] Custom domain configured (optional)
- [ ] Analytics added (optional - Vercel Analytics)

---

## 🚀 Performance Optimization (Optional)

### Vercel

1. Enable **Vercel Analytics**
2. Add **Vercel Speed Insights**
3. Configure **Edge Functions** for API routes
4. Use **ISR** (Incremental Static Regeneration) for dynamic pages

### Railway

1. Add **Redis** for caching
2. Enable **Auto-scaling**
3. Monitor with Railway metrics
4. Set up **Health checks**

---

## 💰 Cost Breakdown (Free Tier)

| Service | Free Tier | Limits | Upgrade Cost |
|---------|-----------|--------|--------------|
| **Vercel** | ✅ Free | 100GB bandwidth/month | $20/month (Pro) |
| **Railway** | ✅ $5 credit/month | 500 hours, 512MB RAM | $0.000231/GB-hr |
| **MongoDB Atlas** | ✅ Free | 512MB storage | $9/month (M10) |
| **Groq** | ✅ Free | 14,400 requests/day | $0.10/1M tokens |

**Total Monthly Cost (Free):** $0  
**Expected Usage for 10K students:** Still within free tier for first 3 months

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** → Add to `.gitignore`
2. **Rotate secrets regularly** → Monthly for NEXTAUTH_SECRET
3. **Use environment-specific vars** → Different for dev/prod
4. **Enable HTTPS only** → Already enabled on Vercel/Railway
5. **Restrict MongoDB IP** → Use Railway/Vercel IP ranges (after testing)
6. **Rate limit API** → Add middleware in FastAPI

---

## 📖 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [MongoDB Atlas Guide](https://www.mongodb.com/docs/atlas/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [FastAPI Production](https://fastapi.tiangolo.com/deployment/)

---

## ✅ What You Get After Deployment

1. **Live URL:** `https://skillsync.vercel.app`
2. **API URL:** `https://skillsync-api.railway.app`
3. **Auto-deployments** on Git push
4. **Preview deployments** for branches
5. **Production-ready** infrastructure
6. **Free SSL certificates**
7. **Global CDN** (fast worldwide)
8. **Zero server management**

---

**Ready to deploy?** Start with Part 1 (Railway) → Part 2 (Vercel) → Part 3 (MongoDB) → Part 4 (Verify)

Good luck! 🚀
