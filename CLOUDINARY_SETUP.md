# Cloudinary Video Upload Setup Guide

## 🎥 Overview
This application uses **Cloudinary** for video hosting and delivery. It provides:
- Free tier with 25 monthly credits
- Automatic video transcoding
- CDN delivery worldwide
- Built-in video player
- Up to 100MB per video file

---

## 📋 Setup Instructions

### Step 1: Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Click "Sign Up" (free account)
3. Verify your email
4. Login to your dashboard

### Step 2: Get Your Cloud Name
1. After login, you'll see your dashboard
2. Look for **"Product Environment Credentials"** section
3. Copy your **Cloud Name** (e.g., `dxxxxxxxxx`)
4. Keep this safe - you'll need it in Step 4

### Step 3: Create Upload Preset
1. In Cloudinary dashboard, go to **Settings** (gear icon in top right)
2. Click on **Upload** tab
3. Scroll down to **Upload presets** section
4. Click **"Add upload preset"**
5. Configure the preset:
   - **Preset name**: `course_videos` (or any name you prefer)
   - **Signing Mode**: Select **"Unsigned"** (important!)
   - **Folder**: `courses` (optional, helps organize)
   - **Resource type**: `Video`
   - **Access mode**: `Public`
   - **Use filename**: Enable if you want original filenames
6. Click **Save**
7. Copy the **Preset Name** (e.g., `course_videos`)

### Step 4: Configure Your Application

Open the file: `frontend/src/components/VideoUpload.jsx`

Replace these two constants (around line 7-8):

```javascript
const CLOUDINARY_CLOUD_NAME = "your_cloud_name"; // Replace with your Cloud Name
const CLOUDINARY_UPLOAD_PRESET = "course_videos"; // Replace with your Preset Name
```

**Example:**
```javascript
const CLOUDINARY_CLOUD_NAME = "dxy5g8abc"; // Your actual cloud name
const CLOUDINARY_UPLOAD_PRESET = "course_videos"; // Your preset name
```

### Step 5: Test Upload
1. Start your backend: `cd backend && npm run dev`
2. Start your frontend: `cd frontend && npm run dev`
3. Login to instructor panel: `/instructor`
   - Email: `instructor@merosphere.com`
   - Password: `instructor123`
4. Click "Add New Course"
5. Fill in course details
6. Upload a test video (max 100MB)
7. Wait for upload progress to complete
8. Save the course

---

## 🎬 Features Implemented

### Video Upload Component
- ✅ Drag & drop or click to upload
- ✅ File type validation (only videos)
- ✅ File size validation (max 100MB)
- ✅ Upload progress bar
- ✅ Preview uploaded video
- ✅ Replace video option

### Course Model Updates
- `videoUrl` - Full Cloudinary URL for video
- `videoPublicId` - Cloudinary public ID for management
- `videos[]` - Array for multiple video lessons (future feature)

### Instructor Dashboard
- Add/edit courses with video upload
- View uploaded videos in course table
- Delete courses (with confirmation)

---

## 📊 Cloudinary Free Tier Limits

| Resource | Free Tier Limit |
|----------|----------------|
| Credits/month | 25 credits |
| Storage | 25 GB |
| Bandwidth | 25 GB/month |
| Transformations | 25 credits |
| Video length | Unlimited |
| File size | 100 MB (configurable) |

**Note:** Each video upload uses credits based on duration and transformations.

---

## 🔧 Troubleshooting

### Upload Failed Error
- **Check Cloud Name**: Ensure it matches your dashboard
- **Check Upload Preset**: Must be "unsigned" mode
- **Check File Size**: Must be under 100MB
- **Check Internet**: Stable connection required

### Video Not Playing
- **Wait for Processing**: Cloudinary needs time to transcode
- **Check URL**: Must be a valid `https://res.cloudinary.com/...` URL
- **Check Browser**: Try different browser if issues persist

### Exceeded Credits
- **Monitor Usage**: Dashboard shows credit usage
- **Upgrade Plan**: If needed, upgrade to paid plan
- **Optimize Videos**: Compress videos before upload

---

## 🚀 Advanced Features (Optional)

### Video Transformations
Add automatic transformations in upload preset:
- Auto quality adjustment
- Format conversion (MP4, WebM)
- Thumbnail generation
- Adaptive bitrate streaming

### Multiple Videos per Course
The schema supports `videos[]` array for adding multiple lessons:
```javascript
videos: [
  { title: "Lesson 1", url: "...", order: 1 },
  { title: "Lesson 2", url: "...", order: 2 }
]
```

### Secure Uploads (Production)
For production, use **signed** uploads:
1. Change preset to "Signed" mode
2. Implement backend endpoint to generate signature
3. Send signature with upload request

---

## 📝 Alternative Video Hosting Options

If Cloudinary doesn't fit your needs:

1. **AWS S3 + CloudFront**
   - More control, complex setup
   - Pay per GB stored/transferred

2. **Vimeo API**
   - Good video player
   - Limited free tier

3. **Bunny.net**
   - Cost-effective CDN
   - Great for high traffic

4. **YouTube (Unlisted)**
   - Free unlimited hosting
   - Less control over content

---

## 💡 Best Practices

1. **Compress Videos**: Use tools like HandBrake before upload
2. **Consistent Format**: Use MP4 (H.264) for best compatibility
3. **Optimize Quality**: Balance quality vs file size (720p recommended)
4. **Add Thumbnails**: Generate custom thumbnails for better UX
5. **Monitor Usage**: Check Cloudinary dashboard monthly

---

## 📞 Support

- **Cloudinary Docs**: [cloudinary.com/documentation](https://cloudinary.com/documentation)
- **Community Forum**: [community.cloudinary.com](https://community.cloudinary.com)
- **Status Page**: [status.cloudinary.com](https://status.cloudinary.com)

---

**✅ Setup Complete!** You can now upload videos to your courses.
