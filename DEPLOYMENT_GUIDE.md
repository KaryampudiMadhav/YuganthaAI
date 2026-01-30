# 🚀 YuganthaAI Deployment Guide

Complete step-by-step guide to deploy YuganthaAI to production.

---

## 📋 Prerequisites

- GitHub account
- Vercel account (for frontend)
- Railway account (for backend)
- MongoDB Atlas account (already set up ✅)

---
## 🎯 Part 1: Backend Deployment on Railway
### Step 1: Prepare Backend for Deployment

1. **Ensure all dependencies are in package.json**
   ```bash
   cd backend
   ```

2. **Verify your `.env` file has all required variables**
   - ✅ MONGODB_URI
   - ✅ JWT_SECRET
   - ✅ EMAIL_USER
   - ✅ EMAIL_PASSWORD
   - ✅ EMAIL_FROM

### Step 2: Deploy to Railway

1. **Go to [Railway.app](https://railway.app)** and sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository: `KaryampudiMadhav/YuganthaAI`

3. **Configure Railway Settings**
   - Root Directory: `backend`
   - Build Command: Leave empty (Railway auto-detects)
   - Start Command: `node server.js`

4. **Add Environment Variables**
   Go to Variables tab and add:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://karyampudimadhav_db_user:9CTmkrwisAZ3W2tu@yuganthaai.j3hqian.mongodb.net/YuganthaAI?appName=YuganthaAI
   JWT_SECRET=your_jwt_secret_key_change_this_in_production_make_it_very_long_and_random
   EMAIL_USER=yoshithanunna77@gmail.com
   EMAIL_PASSWORD=lpbhjakmoatblbaa
   EMAIL_FROM=YuganthaAI <yoshithanunna77@gmail.com>
   ```
5. **Deploy**
   - Railway will automatically deploy
   - Wait for deployment to complete
   - Copy your Railway app URL (e.g., `https://your-app.up.railway.app`)

6. **Test Backend**
   ```bash
   curl https://your-app.up.railway.app/api/courses
   ```
---

## 🌐 Part 2: Frontend Deployment on Vercel

### Step 1: Update Frontend Environment Variables

1. **Create production environment file**
   
   The frontend needs to know your Railway backend URL.

2. **Update API URL references** (Already handled with environment variable approach)

### Step 2: Deploy to Vercel

1. **Go to [Vercel.com](https://vercel.com)** and sign in with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import `KaryampudiMadhav/YuganthaAI`
   - Vercel will detect it's a monorepo

3. **Configure Project Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   In "Environment Variables" section:
   ```
   VITE_API_URL=https://your-railway-app.up.railway.app
   ```
   ⚠️ Replace `your-railway-app.up.railway.app` with your actual Railway URL

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - Vercel will provide you a URL (e.g., `https://yuganthaai.vercel.app`)

### Step 3: Configure Custom Domain (Optional)

1. **In Vercel Dashboard**
   - Go to Project Settings → Domains
   - Add your custom domain: `yuganthaai.com`
   - Follow Vercel's DNS configuration instructions

2. **Update CORS in Backend**
   Add your Vercel domain to allowed origins in `backend/server.js`

---

## 🔧 Part 3: Post-Deployment Configuration

### Update Backend CORS

1. **Edit `backend/server.js`** - Add your Vercel URL to CORS:
   ```javascript
   const cors = require('cors');
   app.use(cors({
     origin: [
       'http://localhost:5173',
       'https://yuganthaai.vercel.app',
       'https://yuganthaai.com'
     ],
     credentials: true
   }));
   ```

2. **Redeploy Backend on Railway**
   - Push changes to GitHub
   - Railway auto-deploys

### Update Frontend API URL

If you need to update the backend URL later:

1. **In Vercel Dashboard**
   - Go to Project Settings → Environment Variables
   - Update `VITE_API_URL` value
   - Redeploy from Deployments tab

---

## ✅ Part 4: Verification Checklist

### Backend Health Check
- [ ] `/api/courses` returns course data
- [ ] `/api/blogs` returns blog data
- [ ] User registration works
- [ ] Login works
- [ ] JWT tokens are generated

### Frontend Health Check
- [ ] Homepage loads correctly
- [ ] Free courses section displays 3 courses
- [ ] Roadmap PDFs open correctly
- [ ] Login/Signup forms work
- [ ] Google OAuth shows "Coming Soon" badge
- [ ] Navigation works properly

### SEO Check
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`
- [ ] All pages have proper meta tags

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: `Cannot connect to MongoDB`
- **Solution**: Check MongoDB Atlas IP whitelist, add `0.0.0.0/0` for Railway

**Problem**: `Internal Server Error`
- **Solution**: Check Railway logs, ensure all environment variables are set

### Frontend Issues

**Problem**: `API calls failing`
- **Solution**: Verify `VITE_API_URL` is set correctly in Vercel

**Problem**: `404 on page refresh`
- **Solution**: Ensure `vercel.json` has proper rewrites configuration

### CORS Issues

**Problem**: `CORS policy blocking requests`
- **Solution**: Add your Vercel URL to backend CORS configuration

---

## 🔐 Security Best Practices

1. **Change JWT_SECRET** to a strong random string (64+ characters)
2. **Enable MongoDB IP Whitelist** in production
3. **Use HTTPS only** for production
4. **Rotate email passwords** regularly
5. **Enable Vercel security headers** (already configured)

---

## 📊 Monitoring

### Railway Monitoring
- Check logs in Railway dashboard
- Set up alerts for crashes
- Monitor memory/CPU usage

### Vercel Analytics
- Enable Vercel Analytics in project settings
- Monitor page load times
- Track Core Web Vitals

---

## 🔄 Continuous Deployment

Both Railway and Vercel support automatic deployments:

- **Push to `main` branch** → Auto-deploys to production
- **Push to `dev` branch** → Create separate Railway/Vercel projects for staging

---

## 📝 Environment Variables Summary

### Backend (Railway)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_here
EMAIL_USER=yoshithanunna77@gmail.com
EMAIL_PASSWORD=lpbhjakmoatblbaa
EMAIL_FROM=YuganthaAI <yoshithanunna77@gmail.com>
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend.up.railway.app
```

---

## 🎉 You're Done!

Your YuganthaAI platform is now live! 

- **Frontend**: `https://yuganthaai.vercel.app`
- **Backend**: `https://your-app.up.railway.app`

---

## 📞 Support

If you encounter any issues:
1. Check Railway logs
2. Check Vercel deployment logs
3. Verify all environment variables
4. Test API endpoints individually

**Happy Deploying! 🚀**
