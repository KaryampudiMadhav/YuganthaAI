# 🚀 YuganthaAI - Deployment Guide to Vercel

## Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- GoDaddy domain (yuganthaai.com)

## Step 1: Push Code to GitHub

1. Initialize Git (if not already done):
```bash
cd d:\YuganthaAI
git init
git add .
git commit -m "Initial commit - YuganthaAI platform ready for deployment"
```

2. Create a new repository on GitHub named "YuganthaAI"

3. Push to GitHub:
```bash
git remote add origin https://github.com/KaryampudiMadhav/YuganthaAI.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Frontend to Vercel

### Option A: Using Vercel Website (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub

2. Click "Add New" → "Project"

3. Import your GitHub repository "YuganthaAI"

4. Configure Project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variables (if needed for backend):
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = `your-backend-url`

6. Click "Deploy"

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

## Step 3: Deploy Backend to Vercel (Optional - if you want backend on Vercel too)

1. Create `vercel.json` in backend folder:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

2. Deploy backend separately or use a different service (Railway, Render, Heroku)

## Step 4: Connect GoDaddy Domain to Vercel

### In Vercel Dashboard:

1. Go to your deployed project
2. Click "Settings" → "Domains"
3. Add your domain: `yuganthaai.com`
4. Vercel will show you DNS records to add

### In GoDaddy:

1. Log in to [GoDaddy Domain Manager](https://dcc.godaddy.com)
2. Find your domain `yuganthaai.com`
3. Click "DNS" or "Manage DNS"

4. Add the following DNS records:

**For Root Domain (yuganthaai.com):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 600 seconds
```

**For WWW subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 600 seconds
```

**Alternative (if using Vercel nameservers):**
Replace GoDaddy nameservers with Vercel nameservers:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

5. Save changes (DNS propagation takes 24-48 hours, but usually works in 1-2 hours)

## Step 5: Configure SSL (Automatic with Vercel)

Vercel automatically provisions SSL certificates for your domain. Once DNS is configured:
- SSL certificate will be issued automatically
- Your site will be available via HTTPS

## Step 6: Verify Deployment

1. Check your site: `https://yuganthaai.com`
2. Verify all pages work:
   - Home: `/`
   - About: `/about`
   - Contact: `/contact`
   - Courses: `/courses`
   - Blogs: `/blogs`

## Step 7: Submit to Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `yuganthaai.com`
3. Verify ownership (use DNS TXT record or HTML file)
4. Submit sitemap: `https://yuganthaai.com/sitemap.xml`
5. Request indexing for main pages

## Step 8: Optimize for Search Results (Sitelinks)

The structured data is already added to your site. To get those nice sitelinks like MeruSphere:

1. **Wait for Google to crawl** (1-2 weeks)
2. **Ensure pages are indexed** in Search Console
3. **Monitor** "Links" section in Search Console
4. Google automatically generates sitelinks based on:
   - Site structure
   - Internal linking
   - User engagement
   - Clear navigation

## Environment Variables for Frontend

Create `.env` file in frontend folder:
```env
VITE_API_URL=https://your-backend-url.com/api
```

## Post-Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed (separate service if needed)
- [ ] Domain connected to Vercel
- [ ] SSL certificate active (HTTPS working)
- [ ] All routes working correctly
- [ ] Sitemap submitted to Google
- [ ] robots.txt accessible
- [ ] Meta tags and structured data verified
- [ ] Mobile responsive design working
- [ ] Forms working correctly
- [ ] API connections working

## Continuous Deployment

Once connected to GitHub:
- Any push to `main` branch will auto-deploy to production
- Pull requests create preview deployments
- Use branches for development, merge to main for production

## Monitoring

- **Vercel Dashboard**: Monitor deployments, analytics, performance
- **Google Search Console**: Monitor search performance, indexing
- **Google Analytics**: (Optional) Add tracking code for detailed analytics

## Troubleshooting

**Domain not connecting:**
- Wait 24-48 hours for DNS propagation
- Clear browser cache
- Use [DNS Checker](https://dnschecker.org) to verify

**Build failing:**
- Check build logs in Vercel dashboard
- Ensure all dependencies in package.json
- Verify environment variables are set

**Pages not found:**
- Ensure vercel.json rewrites are configured
- Check that all routes are defined in App.jsx

## Need Help?

- Vercel Support: https://vercel.com/support
- GoDaddy Support: https://www.godaddy.com/help
- Google Search Console: https://support.google.com/webmasters

---

🎉 **Your YuganthaAI platform is now live!**
