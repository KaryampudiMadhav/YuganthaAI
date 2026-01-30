# 🚀 Railway Deployment Guide - MeroSphere

Complete step-by-step guide to deploy MeroSphere (Frontend + Backend) to Railway.

---

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ GitHub account with repository access
- ✅ Railway account ([railway.app](https://railway.app))
- ✅ MongoDB Atlas account with connection string
- ✅ Email credentials for SMTP (if using email features)
- ✅ All environment variables documented

---

## 🎯 Part 1: Prepare Repository for Railway

### Step 1: Verify Package.json Files

**Backend (`backend/package.json`)** - Ensure it has:
```json
{
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

**Frontend (`frontend/package.json`)** - Ensure it has:
```json
{
  "scripts": {
    "build": "vite build",
    "dev": "vite",
    "preview": "vite preview"
  }
}
```

### Step 2: Create Railway Configuration Files

#### A. Create `railway.json` (Root Directory)
```bash
# File: railway.json (in project root)
```

#### B. Backend Dockerfile (Optional but Recommended)
Railway auto-detects Node.js, but a Dockerfile ensures consistency.

---

## 🌐 Part 2: Deploy Backend to Railway

### Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click **"Create New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authenticate with GitHub if needed

### Step 2: Select Your Repository

1. Search for your repository: `MeroSphere`
2. Click to select it
3. Choose `main` branch (or your default branch)

### Step 3: Configure Backend Service

1. **Set Root Directory to `backend`**
   - In Project Settings → Configure
   - Set: `Root Directory: backend`

2. **Environment Variables**
   
   Go to **Variables** tab and add:
   ```
   NODE_ENV=production
   PORT=5000
   
   # MongoDB
   MONGODB_URI=mongodb+srv://[username]:[password]@[cluster].mongodb.net/[database]?retryWrites=true&w=majority
   
   # JWT
   JWT_SECRET=your_very_long_random_secret_key_minimum_32_characters_recommended
   
   # Email Configuration
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_specific_password
   EMAIL_FROM=MeroSphere <your_email@gmail.com>
   
   # CORS Origins (update with your frontend URL after deployment)
   FRONTEND_URL=https://your-frontend-railway-app.up.railway.app
   ```

3. **Start Command**
   - Leave blank - Railway auto-detects `node server.js`
   - Or manually set: `node server.js`

### Step 4: Deploy Backend

1. Click **"Deploy"**
2. Wait for deployment to complete (2-5 minutes)
3. Once complete, copy your Railway backend URL (format: `https://[project]-[service].up.railway.app`)
4. Test it:
   ```bash
   curl https://your-backend-url.up.railway.app/api/courses
   ```

---

## 🎨 Part 3: Deploy Frontend to Railway

### Step 1: Create Second Service

1. In the same Railway project, click **"New"** → **"Service"**
2. Select **"Deploy from GitHub repo"**
3. Select the same `MeroSphere` repository

### Step 2: Configure Frontend Service

1. **Set Root Directory to `frontend`**
   - Project Settings → Configure
   - Set: `Root Directory: frontend`

2. **Build & Start Commands**
   - Build Command: `npm run build`
   - Start Command: `npm run preview` or `npx vite preview --host 0.0.0.0`

3. **Environment Variables**
   
   Go to **Variables** tab and add:
   ```
   VITE_API_URL=https://your-backend-url.up.railway.app
   NODE_ENV=production
   ```
   
   ⚠️ Replace `your-backend-url.up.railway.app` with your actual backend Railway URL

### Step 3: Deploy Frontend

1. Click **"Deploy"**
2. Wait for deployment (2-5 minutes)
3. Once complete, copy your Railway frontend URL
4. Test it in browser: `https://your-frontend-url.up.railway.app`

---

## 🔗 Part 4: Link Services & Update URLs

### Step 1: Update CORS in Backend

1. Go back to **Backend Service** → **Variables**
2. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://your-frontend-url.up.railway.app
   ```

3. The backend will auto-redeploy with updated CORS settings

### Step 2: Verify Connection

1. Open frontend URL in browser
2. Try logging in or accessing protected routes
3. Check browser console for any API errors
4. Check backend logs if issues occur

---

## 📊 Part 5: Environment Variables Reference

### Backend Required Variables

| Variable | Example | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `5000` | Server port |
| `MONGODB_URI` | `mongodb+srv://...` | MongoDB connection string |
| `JWT_SECRET` | `random_long_string` | JWT signing secret (min 32 chars) |
| `EMAIL_USER` | `your@gmail.com` | Email sender address |
| `EMAIL_PASSWORD` | `app_specific_pwd` | Email app password |
| `EMAIL_FROM` | `App <your@gmail.com>` | Email from format |
| `FRONTEND_URL` | `https://app.railway.app` | Frontend URL for CORS |

### Frontend Required Variables

| Variable | Example | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `https://api.railway.app` | Backend API URL |
| `NODE_ENV` | `production` | Environment mode |

---

## 🧪 Part 6: Testing After Deployment

### Test Backend
```bash
# Test API endpoint
curl https://your-backend-url.up.railway.app/api/courses

# Test authentication endpoint
curl https://your-backend-url.up.railway.app/api/auth/login -X POST
```

### Test Frontend
1. Visit: `https://your-frontend-url.up.railway.app`
2. Test user registration/login
3. Test API calls from browser console
4. Check Network tab for API requests

### Debugging
- **Backend logs**: Railway Dashboard → Service → Logs
- **Frontend build errors**: Railway Dashboard → Build logs
- **Network issues**: Check CORS settings in backend
- **Database issues**: Verify MongoDB connection string

---

## 🛠️ Part 7: Monitoring & Maintenance

### Check Service Status
1. Go to Railway Dashboard
2. View each service's status (online/offline)
3. Monitor resource usage (CPU, Memory, Disk)

### View Logs
1. Select service → **Logs** tab
2. Filter by errors or search for specific text
3. Use timestamps to correlate issues

### Redeploy
- **Automatic**: Push to GitHub → automatic redeploy
- **Manual**: Click **"Redeploy"** in Railway Dashboard

### Scale Resources
1. Go to **Service** → **Settings**
2. Adjust CPU/Memory allocation
3. Changes take effect on next deploy

---

## ⚠️ Important Notes

1. **Environment Variables**: Keep sensitive data (JWT_SECRET, EMAIL_PASSWORD) secure
2. **CORS Configuration**: Update CORS origins when URLs change
3. **Database Backups**: Regularly backup MongoDB Atlas data
4. **Monitoring**: Set up email alerts for service failures
5. **Cost**: Check Railway pricing - free tier has limits

---

## 🔗 Useful Links

- [Railway Documentation](https://docs.railway.app)
- [Railway GitHub Integration](https://docs.railway.app/deploy/github)
- [Environment Variables Guide](https://docs.railway.app/develop/variables)
- [MongoDB Atlas Connection](https://docs.mongodb.com/manual/reference/connection-string)

---

## 📝 Deployment Checklist

- [ ] GitHub repository ready with main branch
- [ ] Backend package.json configured
- [ ] Frontend package.json configured
- [ ] MongoDB URI available
- [ ] Email credentials ready
- [ ] Railway project created
- [ ] Backend deployed successfully
- [ ] Backend environment variables set
- [ ] Frontend deployed successfully
- [ ] Frontend environment variables set
- [ ] CORS configured correctly
- [ ] Services linked properly
- [ ] Testing completed
- [ ] Monitoring set up

---

## 🆘 Troubleshooting

### Backend won't start
- Check `server.js` uses correct port from `process.env.PORT`
- Verify all dependencies in `package.json`
- Check MongoDB connection string

### Frontend API calls fail
- Verify `VITE_API_URL` environment variable
- Check CORS settings in backend
- Ensure backend is running

### Build fails
- Check Node.js version compatibility
- Verify all dependencies are listed
- Check build output in Railway logs

### Database connection fails
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has proper permissions

---

## ✅ Success!

Your MeroSphere application should now be live on Railway!

Frontend: `https://your-frontend.up.railway.app`
Backend: `https://your-backend.up.railway.app`
