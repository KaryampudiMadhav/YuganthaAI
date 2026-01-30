# Railway Deployment Troubleshooting Guide

## 🔍 Common Issues & Solutions

### 1. Backend Service Won't Deploy

#### Issue: Build fails with "Cannot find module"
**Solution:**
1. Check `backend/package.json` has all dependencies
2. Add missing packages:
```bash
cd backend
npm install [package-name]
git add package.json package-lock.json
git commit -m "Add missing dependencies"
git push origin main
```
3. Trigger redeploy in Railway

#### Issue: "Port is already in use"
**Solution:**
1. Go to Backend Service → Variables
2. Change PORT to a different number (3000, 8000, etc.)
3. Ensure `server.js` reads from `process.env.PORT`
4. Redeploy

#### Issue: Build succeeds but service crashes
**Solution:**
1. Check Railway logs for error message
2. Common causes:
   - Missing MONGODB_URI variable
   - Database connection timeout
   - Missing environment variables
3. Add missing variables and redeploy

---

### 2. Frontend Build Fails

#### Issue: "npm ERR! 404 Not Found"
**Solution:**
1. Check `frontend/package.json` for typos in package names
2. Verify all packages exist on npm registry
3. Try building locally:
```bash
cd frontend
npm install
npm run build
```
4. If local build works, issue is with Railway
5. Clear Railway cache:
   - Go to Service → Settings
   - Find "Clear Build Cache"
   - Click and redeploy

#### Issue: "vite: command not found"
**Solution:**
1. Ensure `frontend/package.json` has:
```json
{
  "devDependencies": {
    "vite": "^7.2.4"
  }
}
```
2. Ensure build command is: `npm run build`
3. Redeploy

#### Issue: Frontend builds but shows blank page
**Solution:**
1. Check `frontend/vite.config.js`:
```javascript
export default {
  base: '/',  // Important for Railway
  server: {
    port: 3000
  }
}
```
2. Check `package.json` scripts:
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview --host 0.0.0.0"
  }
}
```
3. Check for browser console errors (F12)
4. Verify VITE_API_URL is correct

---

### 3. Frontend Can't Connect to Backend

#### Issue: 404 errors when fetching from API
**Solution:**
1. Verify VITE_API_URL in frontend variables:
```
VITE_API_URL=https://your-backend-url.up.railway.app
```
2. Check it has no trailing slash
3. Check backend URL is correct (no typos)
4. Clear browser cache (Ctrl+Shift+Delete)
5. Test backend URL directly in browser

#### Issue: CORS errors in console
**Solution:**
1. Go to Backend Service → Variables
2. Verify FRONTEND_URL matches your frontend URL exactly
3. Check `backend/server.js` CORS configuration:
```javascript
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-frontend-url.up.railway.app']
        : ['http://localhost:5173'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```
4. If using `process.env.FRONTEND_URL`, add it to variables
5. Redeploy backend

#### Issue: 503 Service Unavailable
**Solution:**
1. Wait 1-2 minutes (service might be restarting)
2. Check service logs for errors:
   - Go to Service → Logs
   - Look for "ERROR" messages
3. Check if PORT matches (default 5000)
4. Verify all required environment variables are set

---

### 4. Database Connection Issues

#### Issue: "MongoError: connect ECONNREFUSED"
**Solution:**
1. Verify MONGODB_URI format:
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?retryWrites=true&w=majority
```
2. Check MongoDB Atlas:
   - Is cluster running? (check Dashboard)
   - Username and password correct?
   - Database name correct?
3. Add Railway IP to MongoDB whitelist:
   - MongoDB Atlas → Network Access
   - Add Railway's IP ranges
   - Or use: `0.0.0.0/0` (less secure but works)

#### Issue: "MongoError: authentication failed"
**Solution:**
1. Verify username and password in MONGODB_URI
2. Special characters in password must be URL-encoded:
   - `@` → `%40`
   - `#` → `%23`
   - `:` → `%3A`
3. Test connection string locally:
```bash
node -e "const mongoose = require('mongoose'); mongoose.connect('YOUR_URI').then(() => console.log('Connected!')).catch(e => console.log(e))"
```
4. Update MONGODB_URI in Railway and redeploy

#### Issue: Connection times out
**Solution:**
1. Check MongoDB Atlas status (is it up?)
2. Check your internet connection
3. Wait 2-3 minutes and retry
4. Try pinging database from terminal:
```bash
ping YOUR_CLUSTER_URL
```
5. If all else fails, create new MongoDB user:
   - MongoDB Atlas → Database Access
   - Create new user
   - Use new credentials in MONGODB_URI

---

### 5. Email/SMTP Issues

#### Issue: Email sending fails
**Solution:**
1. Verify EMAIL_USER and EMAIL_PASSWORD:
   ```
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password_16_chars
   ```
2. For Gmail:
   - Verify 2-step authentication is enabled
   - Regenerate app password
   - Use new password in Railway
3. Check email configuration in `backend/config/mailer.js`:
```javascript
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});
```
4. Test email locally before deploying

#### Issue: "Less secure app access blocked"
**Solution:**
1. Using Gmail? Go to: myaccount.google.com/security
2. Allow access to "Less secure apps" OR
3. Use "App passwords" (recommended):
   - Enable 2-factor authentication
   - Generate app password for Mail + Windows
   - Use generated password

---

### 6. Service Status Issues

#### Issue: Service shows as "Offline"
**Solution:**
1. Check deployment logs:
   - Go to Service → Logs
   - Look for error messages
2. Check if deployment is still in progress:
   - Look for "Building" or "Deploying" status
   - Wait 5-10 minutes
3. If stuck, manually redeploy:
   - Go to Service → Deployments
   - Click "Redeploy"

#### Issue: Service keeps crashing and restarting
**Solution:**
1. Check logs for recurring error pattern
2. Common causes:
   - Missing environment variables
   - Database not accessible
   - Port conflicts
3. Look for specific error messages
4. Search this guide for that error

#### Issue: High CPU/Memory usage
**Solution:**
1. Check Service → Metrics for resource usage
2. Possible causes:
   - Memory leak in application
   - Too many concurrent requests
   - Inefficient database queries
3. Increase allocated resources:
   - Go to Service → Settings
   - Increase CPU/Memory limits
   - Redeploy
4. Optimize application code

---

### 7. Deployment/Build Issues

#### Issue: Deployment stuck on "Building"
**Solution:**
1. Wait up to 10 minutes (first builds take longer)
2. If still stuck after 15 minutes:
   - Go to Service → Settings
   - Click "Clear Build Cache"
   - Trigger manual redeploy
3. Check if build log shows errors:
   - Go to Deployments tab
   - Click on deployment
   - View build logs

#### Issue: "Exceeded memory limit during build"
**Solution:**
1. Service is out of memory during build
2. Options:
   - Remove unused dependencies from package.json
   - Optimize build process
   - Increase build memory in Settings
3. Remove node_modules locally and reinstall:
```bash
rm -r node_modules
npm install
git add package-lock.json
git commit -m "Reinstall dependencies"
git push origin main
```

#### Issue: Git branch not found
**Solution:**
1. Ensure pushing to correct branch:
```bash
git branch -a  # See all branches
git push origin main  # Push to main
```
2. Check Railway is watching correct branch:
   - Go to Project Settings → GitHub
   - Verify branch name
3. Manual redeploy forces git sync

---

### 8. Environment Variable Issues

#### Issue: Variable not being read in code
**Solution:**
1. For Node.js: Variables should be accessed as:
```javascript
process.env.VARIABLE_NAME
```
2. For React/Frontend: Variables must start with `VITE_`:
```javascript
// In .env or Railway Variables:
VITE_API_URL=value

// In code:
import.meta.env.VITE_API_URL
```
3. Restart/redeploy after adding variables
4. Clear browser cache (frontend changes)

#### Issue: Sensitive data visible in logs
**Solution:**
1. Check Railway doesn't log sensitive variables:
   - Go to Service → Settings
   - Disable public logs if sensitive
2. Don't log environment variables:
```javascript
// BAD:
console.log('API URL:', process.env.VITE_API_URL);

// GOOD:
console.log('API configured');
```

#### Issue: Variables not updating after change
**Solution:**
1. Update variable in Railway dashboard
2. Service must redeploy for changes to take effect
3. Manual redeploy:
   - Go to Service → Deployments
   - Click "Redeploy"
4. Wait 2-5 minutes for new deployment
5. Hard refresh browser (Ctrl+Shift+Delete)

---

### 9. Custom Domain Issues

#### Issue: Custom domain shows 404
**Solution:**
1. Check domain DNS settings are correct:
   - Railway provides CNAME value
   - Add CNAME record to domain DNS
   - Wait 15-30 minutes for DNS propagation
2. Verify custom domain in Railway:
   - Service → Settings → Custom Domain
   - Check domain name is correct
3. Test with Railway URL first (not custom domain)

#### Issue: SSL certificate not working
**Solution:**
1. Railway auto-generates SSL certificates
2. Certificate takes 2-5 minutes to generate
3. Try accessing with `https://` (not `http://`)
4. Wait and retry if certificate not ready
5. Clear browser cache

---

### 10. Performance Issues

#### Issue: Slow response times
**Solution:**
1. Check backend service logs for slow queries
2. Optimize database queries:
   - Add indexes to frequently queried fields
   - Limit data returned
   - Use pagination
3. Check memory usage:
   - Go to Service → Metrics
   - If memory nearing limit, increase allocation
4. Monitor CPU usage:
   - High CPU = optimize code
   - Low CPU = network latency

#### Issue: Frontend loads slowly
**Solution:**
1. Check frontend bundle size:
```bash
cd frontend
npm run build
# Check dist/ folder size
```
2. Optimize:
   - Remove unused dependencies
   - Enable code splitting
   - Compress images
3. Check network:
   - Open DevTools → Network tab
   - Identify slow loading resources
   - Check API response times

---

## 📊 Debugging Workflow

1. **Identify the issue**
   - Frontend? Backend? Database?
   - When did it start?

2. **Check logs**
   - Go to Railway Dashboard
   - Open affected service
   - Go to "Logs" tab
   - Look for error messages
   - Search timestamp

3. **Check variables**
   - Are all required variables set?
   - Are values correct (no typos)?
   - Do values have trailing spaces?

4. **Test connectivity**
   - Can frontend reach backend?
   - Can backend reach database?
   - Use Network tab in browser

5. **Restart service**
   - Go to Service → Deployments
   - Click "Redeploy"
   - Wait 2-5 minutes
   - Test again

6. **Check recent changes**
   - What was deployed last?
   - Revert if needed or
   - Fix the issue

---

## 🛠️ Useful Commands

### Test Backend from Terminal
```bash
curl https://your-backend-url/api/courses
curl -X POST https://your-backend-url/api/auth/login
```

### View Railway Logs (via CLI)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# View logs
railway logs
```

### Check Frontend Build Locally
```bash
cd frontend
npm run build
npm run preview  # Test production build
```

### Check Backend Locally
```bash
cd backend
npm install
node server.js  # Or: npm run dev
```

---

## 📞 Need More Help?

1. **Check Railway Docs**: https://docs.railway.app
2. **Railroad Discord**: https://discord.gg/railway
3. **GitHub Issues**: Check MeroSphere repository issues
4. **Stack Overflow**: Tag questions with [railway.app]

---

## ✅ Verification Checklist

Before claiming deployment is complete:

- [ ] Backend service online (Logs show no errors)
- [ ] Frontend service online (Logs show no errors)
- [ ] Backend API responding (curl works)
- [ ] Frontend loads in browser
- [ ] API calls succeed (Network tab shows 200)
- [ ] Can login/signup
- [ ] Can fetch courses/blogs
- [ ] Email works (if applicable)
- [ ] No 404 errors
- [ ] No CORS errors in console
- [ ] Metrics show stable CPU/Memory

If all ✅, deployment is successful!
