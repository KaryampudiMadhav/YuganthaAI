# Testing Guide - Instructor Course Management

## Prerequisites
- Backend server running on `http://localhost:5000`
- Frontend server running on `http://localhost:5173` or `http://localhost:5174`
- Instructor account created and password set

## Step-by-Step Testing

### 1. Login as Instructor
1. Navigate to `http://localhost:5173/instructor` (or 5174)
2. Click "Login"
3. Enter instructor email and password
4. Click "Login" button
5. **Expected Result**: Redirected to InstructorDashboard with instructor info displayed

### 2. View Dashboard
1. On InstructorDashboard, observe:
   - Header shows instructor email with avatar
   - Stats cards show: Total Courses, Total Modules, Total Videos
   - Course management table (may be empty if no courses yet)
2. **Expected Result**: Stats should reflect only this instructor's courses

### 3. Add a New Course
1. Click "Add Course" button
2. Verify the following:
   - **Instructor field** should be pre-filled with instructor's name and DISABLED (grayed out)
   - Other fields should be editable
3. Fill in course details:
   - Title: "Python Basics"
   - Description: "Learn Python fundamentals"
   - Duration: "4 weeks"
   - Level: "Beginner"
   - Price: "Free"
   - Category: "Programming"
4. Click "Add Module"
5. Add a module:
   - Title: "Introduction"
   - Description: "Getting started with Python"
   - Click "Add Module"
6. Add a video to the module:
   - Click "+ Video" button in module
   - Title: "Hello Python"
   - Description: "Your first Python program"
   - Upload or link a video
   - Click "Add Video"
7. Click "Create Course" button
8. **Expected Result**:
   - Modal closes
   - Course appears in the courses table
   - Stats update (courses count increases)

### 4. Verify Course Details in Table
1. Look for the created course in the table
2. Verify columns:
   - Course name and category visible with thumbnail
   - Instructor name matches logged-in instructor
   - Level shows correctly (Beginner)
   - Modules count shows "1 modules"
   - Price shows "Free"
   - Edit and Delete buttons visible

### 5. Edit a Course
1. Click Edit button (pencil icon) on the course
2. Modal opens with form pre-filled
3. Change course title to "Python Basics - Advanced"
4. Click "Update Course"
5. **Expected Result**:
   - Course name updated in table
   - Modal closes

### 6. Add Another Module to Course
1. Click Edit button on course
2. Click "Add Module" button
3. Add a new module:
   - Title: "Functions & Classes"
   - Description: "Understanding OOP concepts"
   - Click "Add Module"
4. Click "Update Course"
5. **Expected Result**:
   - Modules count increases to 2
   - New module visible in course details

### 7. Delete a Course
1. Click Delete button (trash icon) on a course
2. Confirm deletion in the dialog
3. **Expected Result**:
   - Course removed from table
   - Stats update (courses count decreases)

### 8. View on Main Courses Page
1. Navigate to `http://localhost:5173/courses` (or 5174)
2. Look for the created course in the courses list
3. **Expected Result**:
   - Created course appears with:
     - Correct title, description, category
     - Instructor name matches
     - Thumbnail/image displays
     - Level shows correctly

### 9. Test Authorization
1. Open browser developer console (F12)
2. Go to Application/Storage → Local Storage
3. Copy the instructorToken value
4. Open a new tab/incognito window
5. In browser console, paste:
   ```javascript
   localStorage.setItem('instructor', JSON.stringify({
       _id: "different_instructor_id",
       name: "Other Instructor",
       email: "other@example.com"
   }));
   localStorage.setItem('instructorToken', 'YOUR_TOKEN_HERE');
   ```
6. Try to delete/edit the original instructor's course via API
7. **Expected Result**: Authorization error (403 Forbidden)

### 10. Test Multiple Instructors (Optional)
1. Create another instructor account
2. Login as the second instructor
3. Add a course for this instructor
4. Verify:
   - Second instructor sees only their course
   - First instructor's courses not visible
   - Both sets of courses visible on main courses page

## Expected Results Summary

| Action | Expected Behavior |
|--------|-------------------|
| Login | Dashboard loads, shows only own courses |
| Add Course | Course created linked to instructor, appears in table and courses page |
| Edit Course | Course updated, changes reflected immediately |
| Delete Course | Course removed from table and courses page |
| Instructor field | Auto-filled, disabled/read-only in form |
| Statistics | Accurate count of own courses/modules/videos |
| Authorization | Cannot access/modify other instructors' courses |
| Courses Page | All instructor courses visible across all instructors |

## Troubleshooting

### Issue: "Not authorized" error when adding course
- **Solution**: Check if instructorToken is valid in localStorage
- Run: `console.log(localStorage.getItem('instructorToken'))`

### Issue: Courses not appearing on dashboard
- **Solution**: 
  - Check browser console for errors
  - Verify instructor._id is set in localStorage
  - Check network tab for API response

### Issue: Instructor field not pre-filled
- **Solution**:
  - Ensure instructor.name is set in localStorage
  - Check InstructorContext is providing instructor data

### Issue: Edit/Delete buttons not working
- **Solution**:
  - Verify instructorToken is still valid
  - Check if course instructorId matches logged-in instructor._id
  - Look at network tab for error responses

## Database Queries (MongoDB)

To manually check data:

```javascript
// View all courses
db.courses.find({})

// View courses for specific instructor
db.courses.find({ instructorId: ObjectId("instructor_id") })

// View instructor with their courses
db.instructors.findOne({ email: "instructor@example.com" }).populate('courses')
```
