# 🚀 Railway Deployment - Quick Start Checklist

## Step-by-Step Instructions

### ✅ Step 1: Prepare Your Repository (5 minutes)

1. **Ensure Git is ready**
   ```bash
   cd c:\Users\yoshi\OneDrive\Desktop\Merosphere\MeroSphere
   git status
   git add .
   git commit -m "Setup for Railway deployment"
   git push origin main
   ```

2. **Verify folder structure**
   - ✅ `/backend` folder exists with `package.json` and `server.js`
   - ✅ `/frontend` folder exists with `package.json`
   - ✅ New config files created:
     - `railway.json` (root)
     - `backend/Dockerfile`
     - `frontend/Dockerfile`
     - `.railway/nixpacks.toml`

---

### ✅ Step 2: Create Railway Account (5 minutes)

1. Go to [railway.app](https://railway.app)
2. Click **"Sign Up"** → Choose **"GitHub"**
3. Authorize Railway with your GitHub account
4. You'll be directed to Railway dashboard

---

### ✅ Step 3: Create New Project (2 minutes)

1. Click **"Create New Project"** (big button on dashboard)
2. Select **"Deploy from GitHub repo"**
3. Click **"Configure GitHub App"** (if not already done)
4. Select **your MeroSphere repository**
5. Select **"main"** branch
6. Click **"Deploy"**

---

### ✅ Step 4: Configure Backend Service (10 minutes)

#### A. Set Root Directory
1. Go to your project dashboard
2. Click on the service that was created
3. Go to **Settings** tab
4. Find **"Root Directory"** field
5. Change to: `backend`
6. Save and wait for re-detection

#### B. Add Environment Variables
1. Go to **Variables** tab
2. Click **"New Variable"** and add each one:

```
NODE_ENV = production
PORT = 5000
MONGODB_URI = mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/YOUR_DATABASE?retryWrites=true&w=majority
JWT_SECRET = your_very_long_random_string_at_least_32_characters_make_it_random
EMAIL_USER = your_email@gmail.com
EMAIL_PASSWORD = your_app_specific_password
EMAIL_FROM = MeroSphere <your_email@gmail.com>
```

3. Click **Deploy** to apply changes

#### C. Wait for Deployment
- Watch the logs for any errors
- Deployment should take 2-5 minutes
- Look for message: "Server running on port 5000"

#### D. Get Backend URL
1. In the service details, find the **URL** section
2. Copy your URL (format: `https://merosphere-backend-xxx.up.railway.app`)
3. Test it: `https://your-url/api/courses`
4. **Save this URL - you'll need it for frontend**

---

### ✅ Step 5: Create Frontend Service (10 minutes)

#### A. Add New Service
1. In Railway project dashboard, click **"New"**
2. Select **"Service"**
3. Click **"Deploy from GitHub repo"**
4. Select your **MeroSphere** repository
5. Wait for it to create

#### B. Configure Frontend
1. In the new service, go to **Settings**
2. Set **"Root Directory"** to: `frontend`
3. Go to **Deployment** tab
4. Set **"Build Command"**: `npm run build`
5. Set **"Start Command"**: `npm run preview`
6. Save

#### C. Add Frontend Environment Variables
1. Go to **Variables** tab
2. Add these variables:

```
VITE_API_URL = https://your-backend-url-from-step-4d.up.railway.app
NODE_ENV = production
```

3. Click **Deploy**

#### D. Wait for Build
- Build takes longer (3-7 minutes)
- Watch logs for build progress
- Look for: "Listening on" message
- Get your Frontend URL when ready
- **Save this URL**

---

### ✅ Step 6: Link Services Together (5 minutes)

#### A. Update Backend CORS
1. Go to **Backend Service** → **Variables**
2. Add new variable:
```
FRONTEND_URL = https://your-frontend-url.up.railway.app
```
3. Click Deploy

#### B. Update CORS in server.js (if needed)
The CORS is already configured for production. Verify it matches your frontend URL:

```javascript
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? [
            'https://your-frontend-url.up.railway.app'
        ]
        : ['http://localhost:5173'],
    credentials: true,
    optionsSuccessStatus: 200
};
```

---

### ✅ Step 7: Test Your Deployment (5 minutes)

#### A. Test Backend
Open in browser:
```
https://your-backend-url.up.railway.app/api/courses
```
Should return JSON data about courses.

#### B. Test Frontend
1. Visit: `https://your-frontend-url.up.railway.app`
2. Frontend should load
3. Try logging in
4. Open browser console (F12)
5. Check for any error messages

#### C. Check API Calls
1. Open browser **Network** tab
2. Go to a page that makes API calls
3. Check if requests go to your backend URL
4. Look for successful responses (200 status)

#### D. View Logs
If something fails:
- Go to Railway dashboard
- Click each service
- Go to **Logs** tab
- Look for error messages
- Search for the error in troubleshooting section

---

## 🔧 Environment Variables Reference

### MongoDB Connection String Format
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER_NAME.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
```

How to get it:
1. Go to MongoDB Atlas
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace USERNAME, PASSWORD, DATABASE_NAME

### JWT Secret
Generate a random secret (copy-paste one of these):
```
aB1cD2eF3gH4iJ5kL6mN7oP8qR9sTu0vW1xY2zAb3Cd4Ef5Gh6Ij7Kl8Mn9Op0Qr
```

### Email Credentials (Gmail)
1. Use your Gmail address for `EMAIL_USER`
2. For `EMAIL_PASSWORD`, use an **App Password** (not your regular password):
   - Go to Google Account → Security
   - Enable 2-Factor Authentication
   - Create "App passwords"
   - Choose "Mail" and "Windows"
   - Copy the generated 16-character password

---

## 📊 Architecture After Deployment

```
Your Domain (if configured)
    ↓
Frontend (React/Vite)
    Railway: your-frontend.up.railway.app
    ↓
Backend API (Express)
    Railway: your-backend.up.railway.app
    ↓
MongoDB Atlas Database
```

---

## ✅ Deployment Checklist

Print and check off as you complete:

- [ ] Repository pushed to GitHub
- [ ] Railway account created
- [ ] New project created in Railway
- [ ] Backend service created with root directory set to `backend`
- [ ] Backend environment variables added (8 variables)
- [ ] Backend deployed successfully
- [ ] Backend URL tested and working
- [ ] Frontend service created with root directory set to `frontend`
- [ ] Frontend environment variables added
- [ ] Frontend deployed successfully
- [ ] Frontend loads in browser
- [ ] API calls work (check Network tab)
- [ ] Login/Signup tested
- [ ] Monitoring set up

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend service won't start | Check port is 5000, verify MONGODB_URI |
| Frontend API calls fail | Check VITE_API_URL variable, clear browser cache |
| Blank frontend page | Check browser console for errors, verify build succeeded |
| Database connection error | Verify MongoDB URI, check IP whitelist in Atlas |
| 502/503 errors | Wait 1-2 minutes, check service logs |
| Can't connect frontend to backend | Verify CORS origins, check VITE_API_URL matches backend URL |

---

## 📝 Important Notes

1. **Keep URLs safe** - Don't share Railway URLs publicly if they contain sensitive data
2. **Monitor usage** - Railway free tier has limits (~$5 credit/month)
3. **SSL Certificates** - Railway provides free SSL, no additional setup needed
4. **Auto-deploy** - Every GitHub push to main automatically redeploys
5. **Environment variables** - Never commit .env files, only use Railway dashboard

---

## 🎉 Success!

Once all checkboxes are done, your app is live!

- **Frontend**: `https://your-frontend.up.railway.app`
- **Backend**: `https://your-backend.up.railway.app`
- **Database**: MongoDB Atlas cloud

You can now:
- Share your frontend URL with others
- Monitor performance in Railway dashboard
- Set up automatic alerts
- Configure custom domains
- Scale resources as needed

---

## 📚 Next Steps (Optional)

1. **Custom Domain**: Add your own domain name
2. **Email Alerts**: Set up notifications for deployment failures
3. **Database Backups**: Schedule MongoDB backups
4. **Performance Monitoring**: Add monitoring tools
5. **CI/CD Pipeline**: Enhance with automated testing

Good luck! 🚀
