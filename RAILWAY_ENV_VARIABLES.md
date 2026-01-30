# Railway Environment Variables Template

This file documents all environment variables needed for Railway deployment.
DO NOT commit actual values - use this as a reference template.

## 📋 Backend Environment Variables (.env template)

Copy-paste into Railway Variables tab (one by one):

```
NODE_ENV=production
PORT=5000

# MongoDB Connection (Required)
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER_NAME.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority

# JWT Secret (Required - Generate random string)
JWT_SECRET=your_very_long_random_secret_key_minimum_32_characters_recommended_make_it_random

# Email Configuration (Required for email features)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password_16_chars
EMAIL_FROM=MeroSphere <your_email@gmail.com>

# Frontend URL (Update after frontend deployment)
FRONTEND_URL=https://your-frontend-url.up.railway.app

# Optional - Add more as needed
CORS_ORIGIN=https://your-frontend-url.up.railway.app
```

## 🎨 Frontend Environment Variables

Copy-paste into Railway Variables tab (one by one):

```
VITE_API_URL=https://your-backend-url.up.railway.app
NODE_ENV=production
```

## 🔑 How to Get Each Value

### MONGODB_URI
1. Go to MongoDB Atlas (https://cloud.mongodb.com)
2. Select your cluster
3. Click "Connect" button
4. Choose "Connect your application"
5. Copy the connection string
6. Replace `<username>`, `<password>`, and database name

Example format:
```
mongodb+srv://USER:PASS@cluster0.abc123.mongodb.net/mydb?retryWrites=true&w=majority
```

### JWT_SECRET
Generate a random string (copy one of these or generate your own):

```
Example 1: x7K9mL2nQ5pR8sT1uV4wX7yZ0aB3cD6eF9gH2iJ5kL8mN1oP4qR7sT0uV3wX6yZ

Example 2: A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8S9t0U1v2W3x4Y5z6A7b8C9d0E

Example 3: !@#$%^&*()_+-=[]{}|;:'",.<>?/~` (avoid special chars, use alphanumeric)
```

Better: Use a random string generator
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### EMAIL_USER & EMAIL_PASSWORD

#### For Gmail:
1. Go to myaccount.google.com
2. Click "Security" in left menu
3. Enable "2-Step Verification"
4. Go back to Security
5. Find "App passwords"
6. Choose "Mail" and "Windows"
7. Google generates 16-character password
8. Copy that password to EMAIL_PASSWORD

EMAIL_USER = your_gmail@gmail.com
EMAIL_PASSWORD = xyzw abcd efgh ijkl (16 characters)

#### For Other Email Providers:
Use your email provider's app-specific password feature, or:
- Create a dedicated email account with strong password
- Use that in EMAIL_PASSWORD

### EMAIL_FROM
Format: `"Service Name <email@domain.com>"`

Examples:
```
MeroSphere <support@merosphere.com>
MeroSphere Team <noreply@merosphere.com>
```

## 🔗 Railway URLs

After deployment, Railway provides URLs:

### Backend URL
Format: `https://merosphere-backend-xxxx.up.railway.app`
- Provided by Railway after deployment
- Use this for VITE_API_URL in frontend
- Use this for FRONTEND_CORS_ORIGIN if needed

### Frontend URL  
Format: `https://merosphere-frontend-xxxx.up.railway.app`
- Provided by Railway after frontend deployment
- Use this for CORS in backend (FRONTEND_URL)
- Share this with users to access the app

## ⚠️ Security Best Practices

1. **Never commit .env files**
   ```bash
   # .gitignore should have:
   .env
   .env.local
   .env.*.local
   ```

2. **Use strong JWT_SECRET**
   - At least 32 characters
   - Mix of uppercase, lowercase, numbers
   - Don't use dictionary words

3. **Keep EMAIL_PASSWORD safe**
   - Use app-specific passwords
   - Change periodically
   - Don't share with team members

4. **Rotate secrets periodically**
   - Change JWT_SECRET every 6 months
   - Update email passwords when rotating
   - Update in Railway immediately

5. **MongoDB Security**
   - Use strong database password
   - Enable IP whitelist in MongoDB Atlas
   - Add Railway IP ranges to whitelist

## 🔄 Variable Update Process

When you need to update a variable:

1. Go to Railway Dashboard
2. Select your service
3. Click "Variables" tab
4. Find the variable
5. Click to edit
6. Update value
7. Click "Save"
8. Service will auto-redeploy

## ✅ Verification Checklist

After setting all variables:

- [ ] NODE_ENV is "production"
- [ ] PORT is "5000"
- [ ] MONGODB_URI is valid and accessible
- [ ] JWT_SECRET is at least 32 characters
- [ ] EMAIL_USER is a valid email
- [ ] EMAIL_PASSWORD is app-specific password
- [ ] EMAIL_FROM is properly formatted
- [ ] FRONTEND_URL is set after frontend deployment
- [ ] VITE_API_URL points to backend URL
- [ ] All special characters are properly escaped

## 🧪 Testing Variables

To verify variables are working:

1. Backend test:
```bash
curl https://your-backend-url/api/courses
```
Should return JSON (not error)

2. Frontend test:
Open browser console and check Network tab:
- Requests should go to VITE_API_URL
- Responses should be 200 status

3. Email test (if available):
- Test password reset feature
- Check if email is received

## 📞 Support

If variables aren't working:

1. Check Railway logs for error messages
2. Verify exact spelling of variable names
3. Ensure MongoDB credentials are correct
4. Test MongoDB connection separately
5. Check CORS settings match URLs

Common mistakes:
- Typo in MONGODB_URI
- Using regular password instead of app password
- URL formatting (http vs https)
- Trailing spaces in values
