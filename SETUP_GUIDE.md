# MeroSphere - Complete Setup Guide

## 🚀 Project Setup with Cloudinary Integration

This guide will help you set up the MeroSphere platform with full Cloudinary video upload functionality.

## ✅ What's Been Implemented

### Backend Features
- ✅ Course model with modules and videos support
- ✅ Full CRUD operations for courses (Create, Read, Update, Delete)
- ✅ Modules: Each course can have multiple modules
- ✅ Videos: Each module can have multiple videos with Cloudinary URLs

### Frontend Features
- ✅ **Instructor Dashboard** - Complete course management
  - Create and edit courses
  - Add/remove modules
  - Upload videos to modules via Cloudinary
  - View all courses with module and video counts
  
- ✅ **User Courses Page** - View all available courses
  - Real-time data from database
  - Search functionality
  - Responsive grid layout
  
- ✅ **Course Detail Page** - Interactive learning experience
  - Video player with module navigation
  - Collapsible module structure
  - Video selection and playback

## 📋 Setup Instructions

### Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Step 2: Configure MongoDB

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Create `/workspaces/MeroSphere/backend/.env`:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key_here
```

### Step 3: Configure Cloudinary

#### 3.1 Create Cloudinary Account
1. Go to https://cloudinary.com
2. Sign up for a free account
3. Verify your email
4. Login to your dashboard

#### 3.2 Get Your Credentials
After logging in, you'll see your **Product Environment Credentials**:
- **Cloud Name** (e.g., `dxxxxxxxxx`)
- Copy this value

#### 3.3 Create Upload Preset
1. Click **Settings** (gear icon in top right)
2. Go to **Upload** tab
3. Scroll to **Upload presets** section
4. Click **"Add upload preset"**
5. Configure:
   - **Preset name**: `course_videos` (or any name you prefer)
   - **Signing Mode**: Select **"Unsigned"** ⚠️ Important!
   - **Folder**: `courses` (optional)
   - **Resource type**: `Video`
   - **Access mode**: `Public`
6. Click **Save**

#### 3.4 Configure Frontend Environment
1. Copy the example environment file:
```bash
cd /workspaces/MeroSphere/frontend
cp .env.example .env
```

2. Edit `/workspaces/MeroSphere/frontend/.env`:
```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=course_videos
```

Replace `your_cloud_name_here` with your actual Cloud Name from step 3.2

### Step 4: Start the Application

```bash
# Terminal 1 - Start Backend
cd /workspaces/MeroSphere/backend
npm start

# Terminal 2 - Start Frontend
cd /workspaces/MeroSphere/frontend
npm run dev
```

## 🎓 How to Use

### For Instructors

1. **Login as Instructor**
   - Go to `/instructor`
   - Login with your instructor credentials

2. **Create a Course**
   - Click "Add New Course"
   - Fill in course details (title, description, instructor, etc.)
   - Click "Add Module" to create course modules
   - For each module, click "+ Video" to add videos
   - Upload videos directly through Cloudinary integration
   - Click "Create Course"

3. **Manage Courses**
   - View all courses in the dashboard
   - Edit existing courses
   - Add/remove modules and videos
   - Delete courses

### For Students/Users

1. **Browse Courses**
   - Go to `/courses`
   - Browse all available courses
   - Search for specific courses
   - Click on any course to view details

2. **View Course Content**
   - On the course detail page, you'll see:
     - Course information (instructor, duration, level)
     - All modules organized by order
     - Video player on the left
     - Module navigation on the right
   - Click on any video in a module to watch it
   - Videos are streamed directly from Cloudinary

## 🏗️ Project Structure

```
MeroSphere/
├── backend/
│   ├── models/
│   │   └── Course.js          # Enhanced with modules structure
│   ├── routes/
│   │   └── courses.js         # Full CRUD routes
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── VideoUpload.jsx    # Cloudinary upload component
│   │   ├── pages/
│   │   │   ├── InstructorDashboard.jsx  # Course management
│   │   │   ├── CoursesPage.jsx          # Course listing
│   │   │   └── CourseDetailPage.jsx     # Course viewing
│   │   └── App.jsx
│   └── .env                   # Cloudinary configuration
└── SETUP_GUIDE.md            # This file
```

## 🔐 Security Notes

- **Upload Preset**: Using "unsigned" mode for simplicity. For production, consider using signed uploads
- **JWT Secret**: Use a strong, unique secret in production
- **Environment Variables**: Never commit `.env` files to version control

## 🎥 Video Upload Limits (Cloudinary Free Tier)

- 25 credits per month
- Max 100MB per video
- Automatic transcoding to multiple formats
- CDN delivery worldwide

## 🐛 Troubleshooting

### Videos not uploading?
1. Check that VITE_CLOUDINARY_CLOUD_NAME is set correctly in `.env`
2. Verify your upload preset is set to "unsigned"
3. Check browser console for errors

### Courses not showing?
1. Verify MongoDB connection is working
2. Check that backend server is running on port 5000
3. Check browser console for API errors

### Module videos not playing?
1. Ensure video was uploaded successfully to Cloudinary
2. Check that the video URL is saved in the database
3. Verify video format is supported (MP4, MOV, AVI)

## 📞 Support

For issues or questions, check:
- Cloudinary Setup: `CLOUDINARY_SETUP.md`
- MongoDB Setup: `MONGODB_ATLAS_SETUP.md`

## ✨ Features Summary

✅ Complete course management system
✅ Multi-module support with video content
✅ Cloudinary video hosting and streaming
✅ Real-time course updates
✅ Responsive design
✅ Instructor and student interfaces
✅ Video player with module navigation
✅ Search and filter functionality

---

**Ready to Start!** 🎉

Once you've completed the setup, instructors can start creating courses with modules and uploading videos, and students can immediately see and watch the content!
