# Vercel Deployment Instructions

Your backend is deployed at: https://yuganthaai-backend.onrender.com

## Deploy to Vercel:

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

4. **Environment Variables** - Add these:
   ```
   VITE_API_URL=https://yuganthaai-backend.onrender.com
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

5. Click **Deploy**

## After Deployment:

1. Copy your Vercel frontend URL (e.g., https://your-app.vercel.app)
2. Go to Render → Your backend service → Environment
3. Update `FRONTEND_URL` to your Vercel URL
4. Redeploy the backend on Render

Your app will then be fully connected and working.
