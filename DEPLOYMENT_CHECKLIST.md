# 🚀 Quick Deployment Checklist

## ✅ Pre-Deployment Checklist

### Backend (Railway)
- [ ] MongoDB Atlas connection string is correct
- [ ] JWT_SECRET is strong and unique (64+ characters)
- [ ] Email credentials are working
- [ ] All environment variables are set in Railway
- [ ] CORS origins include your Vercel domain
- [ ] NODE_ENV is set to `production`

### Frontend (Vercel)
- [ ] VITE_API_URL points to Railway backend URL
- [ ] All PDFs are in the public folder
- [ ] Sitemap.xml and robots.txt are configured
- [ ] vercel.json is properly configured
- [ ] Build command is `npm run build`
- [ ] Output directory is `dist`

## 📋 Railway Deployment Steps

1. **Sign up at Railway.app**
2. **Create New Project** → Deploy from GitHub
3. **Select Repository**: `KaryampudiMadhav/YuganthaAI`
4. **Set Root Directory**: `backend`
5. **Add Environment Variables**:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://karyampudimadhav_db_user:9CTmkrwisAZ3W2tu@yuganthaai.j3hqian.mongodb.net/YuganthaAI?appName=YuganthaAI
   JWT_SECRET=your_jwt_secret_key_change_this_in_production_make_it_very_long_and_random
   EMAIL_USER=yoshithanunna77@gmail.com
   EMAIL_PASSWORD=lpbhjakmoatblbaa
   EMAIL_FROM=YuganthaAI <yoshithanunna77@gmail.com>
   ```
6. **Deploy** and copy the Railway URL

## 📋 Vercel Deployment Steps

1. **Sign up at Vercel.com**
2. **Import Project** from GitHub
3. **Select Repository**: `KaryampudiMadhav/YuganthaAI`
4. **Configure Settings**:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Add Environment Variable**:
   ```
   VITE_API_URL=https://your-railway-url.up.railway.app
   ```
6. **Deploy**

## 🔧 Post-Deployment

### Update Backend CORS (if needed)
Edit `backend/server.js` and add your Vercel URL to the production origins array.

### MongoDB Atlas IP Whitelist
Add `0.0.0.0/0` to allow connections from Railway

### Test Everything
- [ ] Visit your Vercel URL
- [ ] Check if courses load
- [ ] Test login/signup
- [ ] Test roadmap PDFs
- [ ] Check all navigation

## 🐛 Common Issues

### API calls failing?
→ Check VITE_API_URL in Vercel environment variables

### CORS errors?
→ Add Vercel domain to backend CORS configuration

### MongoDB connection failing?
→ Check IP whitelist in MongoDB Atlas

### 500 errors?
→ Check Railway logs for detailed error messages

## 📊 URLs After Deployment

- **Frontend**: https://yuganthaai.vercel.app
- **Backend**: https://your-app.up.railway.app
- **Admin**: https://yuganthaai.vercel.app/admin-login

## 🎉 You're Live!

Share your platform:
- Homepage: https://yuganthaai.vercel.app
- Courses: https://yuganthaai.vercel.app/courses
- Blogs: https://yuganthaai.vercel.app/blogs
- About: https://yuganthaai.vercel.app/about
- Contact: https://yuganthaai.vercel.app/contact
