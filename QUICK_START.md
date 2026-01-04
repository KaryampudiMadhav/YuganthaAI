# 🎯 Quick Start - Cloudinary Setup

## ⚡ 5-Minute Setup

### 1️⃣ Get Cloudinary Cloud Name (2 min)

1. Go to: https://cloudinary.com
2. Click "Sign Up" → Complete registration
3. After login, you'll see your dashboard
4. Look for "Product Environment Credentials"
5. Copy your **Cloud Name** (looks like: `dxxxxxxxxx`)

### 2️⃣ Create Upload Preset (2 min)

1. Click **Settings** ⚙️ (top right)
2. Click **Upload** tab
3. Scroll down to **Upload presets**
4. Click **Add upload preset**
5. Fill in:
   - Preset name: `course_videos`
   - Signing Mode: **Unsigned** ⚠️ (Important!)
   - Folder: `courses` (optional)
6. Click **Save**

### 3️⃣ Configure MeroSphere (1 min)

Edit this file: `/workspaces/MeroSphere/frontend/.env`

```env
VITE_CLOUDINARY_CLOUD_NAME=dxxxxxxxxx    # ← Paste your Cloud Name here
VITE_CLOUDINARY_UPLOAD_PRESET=course_videos
```

### 4️⃣ Done! 🎉

Restart your frontend server if it's already running:
```bash
cd /workspaces/MeroSphere/frontend
npm run dev
```

## 📝 How to Use

### As Instructor:
1. Go to `/instructor` → Login
2. Click "Add New Course"
3. Fill course details
4. Click "Add Module"
5. In module, click "+ Video"
6. Upload your video file (max 100MB)
7. Wait for upload to complete
8. Click "Add Video" → Then "Create Course"

### As Student:
1. Go to `/courses`
2. Click on any course
3. Watch videos by clicking on them in the module list

## ❓ Troubleshooting

**Videos won't upload?**
- Check that Cloud Name is correct in `.env`
- Verify upload preset is set to "unsigned"
- Make sure file is under 100MB

**Can't see courses?**
- Make sure backend is running (`npm start` in backend folder)
- Check MongoDB is connected

**Videos won't play?**
- Wait for upload to complete (progress bar shows 100%)
- Check video format (MP4, MOV, AVI supported)

## 🎥 What You Get (Free Tier)

- 25 video credits/month
- Up to 100MB per video
- Global CDN delivery
- Automatic video optimization
- Unlimited video views

---

**Need detailed instructions?** See `SETUP_GUIDE.md`
