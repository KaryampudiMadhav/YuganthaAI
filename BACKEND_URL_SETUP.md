# Backend URL Configuration Guide

## Overview
All backend URLs in the frontend have been centralized using environment variables. This makes deployment much easier as you only need to update one place - the `.env` file.

## Configuration Files

### 1. Environment Files
- **Location**: `frontend/.env`
- **Example**: `frontend/.env.example`

### 2. Configuration
The backend API URL is configured in `frontend/src/config/api.js`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

## Setup Instructions

### For Local Development
1. Ensure `frontend/.env` has:
```env
VITE_API_URL=http://localhost:5000
```

### For Production Deployment
1. Update `frontend/.env` with your deployed backend URL:
```env
VITE_API_URL=https://your-backend.vercel.app
```

Or set the environment variable directly in your hosting platform (Vercel, Netlify, etc.):
- Variable Name: `VITE_API_URL`
- Value: Your backend URL (e.g., `https://your-backend.vercel.app`)

## Files Updated

### Pages (22 files)
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

1. **Vite Environment Variables**: Vite requires environment variables to be prefixed with `VITE_` to be exposed to the client-side code.

2. **Restart Development Server**: After changing `.env` file, restart your development server:
   ```bash
   npm run dev
   ```

3. **Build Time**: Environment variables are embedded at build time, so remember to rebuild after changing them:
   ```bash
   npm run build
   ```

4. **Security**: Never commit sensitive data to `.env` file. Use `.env.example` for documentation.

## Deployment Checklist

- [ ] Update `VITE_API_URL` in production environment
- [ ] Ensure backend CORS allows frontend domain
- [ ] Test all API endpoints after deployment
- [ ] Verify environment variables are set correctly in hosting platform

## Troubleshooting

### Issue: API calls failing after deployment
**Solution**: Check that `VITE_API_URL` is set correctly and the backend is accessible from the frontend domain.

### Issue: Getting CORS errors
**Solution**: Ensure your backend CORS configuration includes your frontend domain.

### Issue: Changes to .env not reflecting
**Solution**: Restart the development server or rebuild the application.
