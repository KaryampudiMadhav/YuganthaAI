# API URL Configuration Guide

## Overview
All API URLs have been centralized using environment variables in both frontend and backend. This makes deployment much easier as you only need to update the `.env` files.

## Frontend Configuration

### 1. Environment Files
- **Location**: `frontend/.env`
- **Example**: `frontend/.env.example`

### 2. Configuration
The backend API URL is configured in `frontend/src/config/api.js`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

### Setup Instructions

#### For Local Development
Ensure `frontend/.env` has:
```env
VITE_API_URL=http://localhost:5000
```

#### For Production Deployment
Update `frontend/.env` with your deployed backend URL:
```env
VITE_API_URL=https://your-backend.vercel.app
```

Or set the environment variable directly in your hosting platform (Vercel, Netlify, etc.):
- Variable Name: `VITE_API_URL`
- Value: Your backend URL (e.g., `https://your-backend.vercel.app`)

## Backend Configuration

### 1. Environment File
- **Location**: `backend/.env`

### 2. Configuration
The frontend URL is used for:
- CORS configuration (allowing frontend to make requests)
- Email links (password reset, registration links)

### Setup Instructions

#### For Local Development
Ensure `backend/.env` has:
```env
FRONTEND_URL=http://localhost:5173
```

For multiple development URLs (separated by comma):
```env
FRONTEND_URL=http://localhost:5173,http://localhost:5174,http://localhost:3000
```

#### For Production Deployment
Update `backend/.env` with your deployed frontend URL:
```env
FRONTEND_URL=https://yuganthaai.vercel.app
NODE_ENV=production
```

### Files Updated in Backend (4 files)
- ✅ server.js (CORS configuration)
- ✅ routes/instructorAuth.js (email links)
- ✅ routes/admin.js (email links)
- ✅ test-otp.js (email links)

## Files Updated in Frontend

### Pages (14 files)
- ✅ MyLearningPage.jsx
- ✅ MentorshipPage.jsx
- ✅ MentorshipBookingPage.jsx
- ✅ InstructorRegisterPage.jsx
- ✅ InstructorForgotPasswordPage.jsx
- ✅ InstructorDashboard.jsx
- ✅ CoursesPage.jsx
- ✅ CourseDetailPage.jsx
- ✅ BlogsPage.jsx
- ✅ BlogDetailPage.jsx
- ✅ AdminDashboard.jsx
- ✅ AdminAssignInstructors.jsx
- ✅ AdminLoginPage.jsx
- ✅ AdminMentorAssignments.jsx

### Context Files (2 files)
- ✅ AuthContext.jsx
- ✅ InstructorContext.jsx

### Config Files
- ✅ api.js (already had the configuration)

## Important Notes

1. **Vite Environment Variables**: Frontend variables must be prefixed with `VITE_` to be exposed to the client-side code.

2. **Restart Development Servers**: After changing `.env` files:
   ```bash
   # Frontend
   cd frontend
   npm run dev
   
   # Backend  
   cd backend
   npm run dev
   ```

3. **Build Time**: Environment variables are embedded at build time:
   ```bash
   npm run build
   ```

4. **Security**: Never commit sensitive data to `.env` files. Use `.env.example` for documentation.

## Deployment Checklist

### Frontend
- [ ] Update `VITE_API_URL` in production environment
- [ ] Rebuild: `npm run build`
- [ ] Verify environment variables in hosting platform

### Backend
- [ ] Update `FRONTEND_URL` in production environment
- [ ] Set `NODE_ENV=production`
- [ ] Ensure backend allows frontend domain in CORS
- [ ] Test email links point to correct frontend URL

### Both
- [ ] Test all API endpoints after deployment
- [ ] Verify CORS is working correctly
- [ ] Test authentication flows
- [ ] Verify email links work correctly

## Troubleshooting

### Issue: API calls failing after deployment
**Solution**: Check that `VITE_API_URL` is set correctly and the backend is accessible from the frontend domain.

### Issue: Getting CORS errors
**Solution**: Ensure your backend `FRONTEND_URL` includes your frontend domain and `NODE_ENV` is set correctly.

### Issue: Email links pointing to wrong URL
**Solution**: Check `FRONTEND_URL` in backend `.env` file.

### Issue: Changes to .env not reflecting
**Solution**: Restart the development server or rebuild the application.

## Environment Variables Summary

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000                    # Backend API URL
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name           # Cloudinary config
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset            # Cloudinary config
```

### Backend (.env)
```env
PORT=5000                                             # Server port
MONGODB_URI=mongodb+srv://...                        # Database connection
JWT_SECRET=your_secret_key                           # Authentication secret
NODE_ENV=development                                 # Environment (development/production)
FRONTEND_URL=http://localhost:5173                   # Frontend URL(s)
EMAIL_USER=your_email@gmail.com                      # SMTP email
EMAIL_PASSWORD=your_app_password                     # SMTP password
EMAIL_FROM=YuganthaAI <your_email@gmail.com>        # Email sender
```
