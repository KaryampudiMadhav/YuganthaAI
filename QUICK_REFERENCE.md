# Quick Reference - Instructor Course Management

## 🚀 Quick Start for Instructors

### Login
```
URL: http://localhost:3000/instructor
Action: Enter email & password → Click Login
Result: Redirected to InstructorDashboard
```

### Dashboard Overview
```
┌─────────────────────────────────────────┐
│        INSTRUCTOR DASHBOARD             │
├─────────────────────────────────────────┤
│                                          │
│  📊 Stats Cards                         │
│  • Total Courses: 5                      │
│  • Total Modules: 12                     │
│  • Total Videos: 45                      │
│                                          │
│  📚 Course Management Table              │
│  • Course Name | Instructor | Level     │
│  • Modules | Price | Actions            │
│                                          │
│  ➕ Add Course Button                    │
│                                          │
└─────────────────────────────────────────┘
```

## 📝 Course Lifecycle

```
1. ADD COURSE
   Click "Add Course" → Fill Form → Add Modules → Add Videos → Submit
   ↓
2. COURSE CREATED
   Course appears in table → Visible on public courses page
   ↓
3. MANAGE COURSE
   Edit (pencil icon) → Update Details → Submit
   Delete (trash icon) → Confirm → Course removed
   ↓
4. COURSE VISIBILITY
   Public courses page shows course with instructor name
   Students can view and enroll
```

## 🎯 Common Tasks

### Add a New Course
```
1. Click [Add Course]
2. Fill in:
   - Title: Course name
   - Description: Course overview
   - Duration: e.g., "4 weeks"
   - Level: Beginner/Intermediate/Advanced
   - Price: Free or amount
   - Category: Subject area
   - Thumbnail: Course image URL
3. Click [Add Module]
4. Fill module details and click [Add Module]
5. Click [+Video] to add videos to module
6. Upload video and click [Add Video]
7. Click [Create Course]
✅ Done!
```

### Edit a Course
```
1. Find course in table
2. Click [✏️ Edit]
3. Modify any fields (except instructor name)
4. Click [+Add Module] for new modules
5. Click [+Video] to add videos
6. Click [Update Course]
✅ Done!
```

### Delete a Course
```
1. Find course in table
2. Click [🗑️ Delete]
3. Confirm "Yes, delete this course"
✅ Course removed immediately
```

## 🔑 Key Fields Explanation

### Course Form Fields
```
Title           → Name of the course
Description     → What students will learn
Instructor      → Your name (AUTO-FILLED, LOCKED)
Duration        → How long the course takes (e.g., "4 weeks")
Level           → Difficulty level
Price           → Free or paid amount
Category        → Course subject
Thumbnail       → Course cover image URL
```

### Module Fields
```
Title           → Module name (e.g., "Introduction", "Advanced Topics")
Description     → What this module covers
Videos          → Individual lessons within module
Order           → Module sequence (auto-assigned)
```

### Video Fields
```
Title           → Video/lesson name
Description     → Video content overview
URL/Upload      → Video file or URL
Duration        → Video length
Order           → Video sequence in module
```

## 📊 Dashboard Statistics

### Cards Shown
```
┌──────────────┬──────────────┬──────────────┐
│   Courses    │   Modules    │    Videos    │
│     (5)      │     (12)     │     (45)     │
│              │              │              │
│ Shows total  │ Sum of all   │ Sum of all   │
│ courses you  │ modules in   │ videos in    │
│ created      │ your courses │ your modules │
└──────────────┴──────────────┴──────────────┘
```

## 🔄 API Requests Made

### When Dashboard Loads
```
GET /api/courses/instructor/{your_instructor_id}
↓
Returns: All your courses with all details
```

### When You Create a Course
```
POST /api/courses/instructor/create
Body: Course data (title, description, etc.)
Header: Authorization: Bearer {your_token}
↓
Returns: Created course with ID and instructorId
```

### When You Edit a Course
```
PUT /api/courses/instructor/{course_id}
Body: Updated course data
Header: Authorization: Bearer {your_token}
↓
Returns: Updated course object
```

### When You Delete a Course
```
DELETE /api/courses/instructor/{course_id}
Header: Authorization: Bearer {your_token}
↓
Returns: Success message
```

## ⚠️ Common Issues & Fixes

### Issue: "Not authorized" error
```
❌ Problem: Invalid or missing token
✅ Solution: Log out and log back in
```

### Issue: Instructor field is empty in form
```
❌ Problem: Instructor name not loaded
✅ Solution: Refresh page and try again
```

### Issue: Course doesn't appear after creating
```
❌ Problem: Response error
✅ Solution: Check browser console (F12) for error message
✅ Solution: Verify all required fields are filled
```

### Issue: Can't edit other instructors' courses
```
✅ Expected behavior: Each instructor can only edit their own
🔒 Security feature: Protects other instructors' courses
```

### Issue: Modules/videos not saving
```
❌ Problem: Not added to modules[] array before submit
✅ Solution: Always click [Add Module] or [Add Video] before submit
```

## 📱 Button Reference

### Dashboard
```
[Add Course]        → Opens create course modal
[Logout]            → Exit and return to login page
```

### Course Table Actions
```
[✏️ Edit]           → Open edit modal for course
[🗑️ Delete]         → Delete course (with confirmation)
```

### Modal Dialogs
```
[Add Module]        → Add new module to course
[+Video]            → Add video to selected module
[Remove]            → Remove module or video
[Create/Update]     → Save changes
[Cancel]            → Close modal without saving
```

## 💾 Data Persistence

### Stored Locally (Browser)
```
localStorage.instructor = {
  _id: "625d...",
  name: "Your Name",
  email: "your@email.com",
  expertise: "Python",
  approved: true
}

localStorage.instructorToken = "eyJhbGc..."
```

### Stored in Database (MongoDB)
```
Instructor Document:
- All your profile info
- Array of course IDs you created

Course Documents:
- Full course details
- instructorId linking to you
- All modules and videos
```

## 🌐 URLs You'll Use

```
Instructor Login:     http://localhost:3000/instructor
Dashboard:           http://localhost:3000/instructor/dashboard
Courses Page:        http://localhost:3000/courses
Course Details:      http://localhost:3000/courses/{id}
```

## 🎓 Course Structure Example

```
My Python Course
├── Module 1: Fundamentals
│   ├── Video: What is Python?
│   ├── Video: Setup Environment
│   └── Video: First Program
├── Module 2: Data Types
│   ├── Video: Strings
│   ├── Video: Lists
│   └── Video: Dictionaries
└── Module 3: Functions
    ├── Video: Function Basics
    ├── Video: Parameters & Return
    └── Video: Best Practices
```

## ✅ Before You Submit a Course

- [ ] Course title is clear and descriptive
- [ ] Description explains what students will learn
- [ ] Duration is realistic (e.g., "4 weeks")
- [ ] Category matches course content
- [ ] Level is appropriate for content
- [ ] At least one module is added
- [ ] At least one video per module
- [ ] Thumbnail/image URL is valid
- [ ] Price is set correctly (Free or amount)
- [ ] Module order makes sense
- [ ] Video order is logical

## 🔒 Important Security Notes

```
🔐 Your Token:
   - Stored securely in localStorage
   - Sent with every instructor API request
   - Never share this token with anyone
   - Logout when done to clear token

🔐 Your Courses:
   - Only you can edit/delete them
   - Others see them but can't modify
   - Protected by instructorId check
   - Authorization errors if unauthorized

🔐 Your Password:
   - Used only for login
   - Never stored in localStorage
   - Use strong, unique password
   - Reset via "Forgot Password" if needed
```

## 📞 Troubleshooting Quick Links

```
For detailed help, see:

TESTING_GUIDE.md       → Step-by-step testing
ARCHITECTURE.md        → How it all works
IMPLEMENTATION.md      → What was changed
```

---

**Version**: 1.0
**Last Updated**: 2025-01-27
**Status**: ✅ Ready to Use
