# 🚀 YuganthaAI - Quick Deploy Reference

## Railway Backend Deployment

### Environment Variables (Copy & Paste):
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://karyampudimadhav_db_user:9CTmkrwisAZ3W2tu@yuganthaai.j3hqian.mongodb.net/YuganthaAI?appName=YuganthaAI
JWT_SECRET=your_jwt_secret_key_change_this_in_production_make_it_very_long_and_random
EMAIL_USER=yoshithanunna77@gmail.com
EMAIL_PASSWORD=lpbhjakmoatblbaa
EMAIL_FROM=YuganthaAI <yoshithanunna77@gmail.com>
```

### Settings:
- **Root Directory**: `backend`
- **Start Command**: `node server.js`

---

## Vercel Frontend Deployment

### Settings:
- **Framework**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Environment Variable:
```
VITE_API_URL=<YOUR_RAILWAY_URL_HERE>
```
⚠️ Get Railway URL from Railway dashboard after backend deployment

---

## Post-Deployment

### 1. MongoDB Atlas
- Add IP: `0.0.0.0/0` to Network Access

### 2. Test Backend
```bash
curl https://your-railway-app.up.railway.app/api/courses
```

### 3. Test Frontend
Visit: `https://yuganthaai.vercel.app`

### 4. Submit Sitemap to Google
- Go to: https://search.google.com/search-console
- Submit: `https://yuganthaai.com/sitemap.xml`

---

## 📞 Quick Links

- **Railway**: https://railway.app
- **Vercel**: https://vercel.com
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Google Search Console**: https://search.google.com/search-console

---

**That's it! You're ready to go live! 🎉**
