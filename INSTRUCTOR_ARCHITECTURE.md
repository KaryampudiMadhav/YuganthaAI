# Instructor Course Management - Architecture & Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐  ┌──────────────────────────────────┐ │
│  │ InstructorContext    │  │   InstructorDashboard            │ │
│  │ ─────────────────────│  │ ──────────────────────────────────│ │
│  │ • instructor._id     │  │ • Fetch instructor's courses     │ │
│  │ • instructor.name    │  │ • Add/Edit/Delete courses       │ │
│  │ • instructorToken    │  │ • Manage modules & videos       │ │
│  │ • login()            │  │ • Display statistics            │ │
│  │ • logout()           │  │ • Form with instructor prefill  │ │
│  └──────────────────────┘  └──────────────────────────────────┘ │
│                                         │                         │
│                                         │ (HTTP Requests)         │
│                                         ▼                         │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │              API Calls with JWT Token                        ││
│  │  • GET /api/courses/instructor/:instructorId                 ││
│  │  • POST /api/courses/instructor/create                       ││
│  │  • PUT /api/courses/instructor/:id                           ││
│  │  • DELETE /api/courses/instructor/:id                        ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                   │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              │ Network
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                      BACKEND (Node.js/Express)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │               Course Routes & Controllers                    ││
│  │  ┌────────────────────────────────────────────────────────┐ ││
│  │  │ Public Routes:                                         │ ││
│  │  │ • GET /api/courses                 (all courses)       │ ││
│  │  │ • GET /api/courses/:id             (course by ID)      │ ││
│  │  │ • GET /api/courses/instructor/:id  (by instructor)     │ ││
│  │  └────────────────────────────────────────────────────────┘ ││
│  │  ┌────────────────────────────────────────────────────────┐ ││
│  │  │ Protected Routes (protectInstructor middleware):       │ ││
│  │  │ • POST /api/courses/instructor/create                  │ ││
│  │  │ • PUT /api/courses/instructor/:id                      │ ││
│  │  │ • DELETE /api/courses/instructor/:id                   │ ││
│  │  │ • GET /api/courses/my-courses/list                     │ ││
│  │  └────────────────────────────────────────────────────────┘ ││
│  └──────────────────────────────────────────────────────────────┘│
│                         │                                         │
│                         ▼                                         │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │           Middleware & Authentication                       ││
│  │  ┌────────────────────────────────────────────────────────┐ ││
│  │  │ protectInstructor:                                     │ ││
│  │  │ 1. Extract JWT from Authorization header              │ ││
│  │  │ 2. Verify token signature                             │ ││
│  │  │ 3. Fetch Instructor from database                     │ ││
│  │  │ 4. Attach instructor to req.instructor               │ ││
│  │  │ 5. Allow handler execution or return 401/403         │ ││
│  │  └────────────────────────────────────────────────────────┘ ││
│  └──────────────────────────────────────────────────────────────┘│
│                         │                                         │
│                         ▼                                         │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │              Database Models & Queries                      ││
│  │  ┌────────────────────────────────────────────────────────┐ ││
│  │  │ Instructor Model:                                      │ ││
│  │  │ {                                                      │ ││
│  │  │   _id: ObjectId                                        │ ││
│  │  │   name: String                                         │ ││
│  │  │   email: String (unique)                              │ ││
│  │  │   password: String (hashed)                           │ ││
│  │  │   expertise: String                                    │ ││
│  │  │   courses: [ObjectId]  ◄─── References Course._id    │ ││
│  │  │   ...                                                  │ ││
│  │  │ }                                                      │ ││
│  │  └────────────────────────────────────────────────────────┘ ││
│  │  ┌────────────────────────────────────────────────────────┐ ││
│  │  │ Course Model (UPDATED):                                │ ││
│  │  │ {                                                      │ ││
│  │  │   _id: ObjectId                                        │ ││
│  │  │   title: String                                        │ ││
│  │  │   description: String                                  │ ││
│  │  │   instructorId: ObjectId  ◄─── NEW FIELD             │ ││
│  │  │   instructor: String  (name)                          │ ││
│  │  │   category: String                                     │ ││
│  │  │   level: String (Beginner/Intermediate/Advanced)      │ ││
│  │  │   price: String                                        │ ││
│  │  │   modules: [ModuleSchema]                             │ ││
│  │  │   ...                                                  │ ││
│  │  │ }                                                      │ ││
│  │  └────────────────────────────────────────────────────────┘ ││
│  └──────────────────────────────────────────────────────────────┘│
│                         │                                         │
│                         ▼                                         │
│              ┌──────────────────────────┐                        │
│              │    MongoDB Database      │                        │
│              │  • instructors collection │                        │
│              │  • courses collection    │                        │
│              │  • users collection      │                        │
│              └──────────────────────────┘                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Request Flow Diagrams

### 1. Create Course Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ Frontend - InstructorDashboard                                   │
│ • User fills course form (instructor field disabled)            │
│ • Clicks "Add Course"                                            │
│ • handleSubmit() triggered                                       │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│ HTTP POST /api/courses/instructor/create                         │
│ Headers: Authorization: Bearer {instructorToken}                │
│ Body: {                                                          │
│   title, description, category, level, duration,               │
│   price, thumbnail, modules                                     │
│ }                                                                │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Backend - Route Handler                                          │
│ POST /api/courses/instructor/create                              │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Middleware - protectInstructor                                   │
│ ✓ Verify JWT token                                               │
│ ✓ Extract instructor from token                                  │
│ ✓ Attach req.instructor                                          │
│ ✓ Proceed to handler                                             │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Handler Logic                                                     │
│ 1. Extract courseData from request body                          │
│ 2. Set instructor.name from req.instructor.name                 │
│ 3. Set instructorId = req.instructor._id (KEY!)                │
│ 4. Initialize: students=0, rating=0, isFree=true               │
│ 5. Create course in database                                     │
│ 6. Add courseId to Instructor.courses array                      │
│ 7. Return created course                                         │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Database - MongoDB                                               │
│ • Insert new document in courses collection                      │
│ • Update instructor document: push courseId to courses[]         │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Response (201 Created)                                            │
│ Body: Created course object with _id, instructorId, etc.        │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Frontend - handleSubmit()                                         │
│ • response.ok === true                                           │
│ • setShowAddModal(false)                                         │
│ • resetFormData()                                                │
│ • fetchCourses() - reload instructor's courses                   │
│ • Course appears in table                                        │
└──────────────────────────────────────────────────────────────────┘
```

### 2. Fetch Instructor's Courses Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ Frontend - useEffect on component mount                          │
│ • Check if instructor is authenticated                           │
│ • Call fetchCourses()                                             │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│ HTTP GET /api/courses/instructor/{instructor._id}               │
│ Headers: Authorization: Bearer {instructorToken}                │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Backend Route - GET /api/courses/instructor/:instructorId        │
│ PUBLIC ENDPOINT (no auth required)                               │
│ • Query: Course.find({ instructorId: req.params.instructorId }) │
│ • Sort by createdAt descending                                   │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Database Query                                                    │
│ db.courses.find({                                                │
│   instructorId: ObjectId("625d...")                             │
│ }).sort({ createdAt: -1 })                                      │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Response (200 OK)                                                │
│ Body: Array of courses where instructorId matches                │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Frontend - Receive Data                                          │
│ • setCourses(data)                                               │
│ • Render courses in table                                        │
│ • Calculate stats from courses array                             │
└──────────────────────────────────────────────────────────────────┘
```

### 3. Authorization Check Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ Instructor A attempts to DELETE Instructor B's course            │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│ HTTP DELETE /api/courses/instructor/{courseId}                   │
│ Headers: Authorization: Bearer {instructorA_token}              │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Middleware - protectInstructor                                   │
│ • Verify token                                                    │
│ • Extract Instructor A from token                                │
│ • Proceed to handler                                             │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Handler - DELETE /api/courses/instructor/:id                     │
│ 1. Fetch course from database                                    │
│ 2. Check: course.instructorId == req.instructor._id?           │
│    ✓ YES: Proceed with deletion                                  │
│    ✗ NO:  Return 403 Forbidden + error message                  │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼ (Authorization Failed)
┌──────────────────────────────────────────────────────────────────┐
│ Response (403 Forbidden)                                          │
│ Body: { message: "Not authorized to delete this course" }        │
└──────────────────────────────────────────────────────────────────┘
```

## Data Relationships

### Before (Without instructorId)
```
Course {
  _id: 1,
  title: "Python 101",
  instructor: "John Doe"  ← String name only
  ...
}

Problem: Cannot query courses by instructor ID
         No direct link between Course and Instructor
```

### After (With instructorId)
```
Instructor {
  _id: "625d1234...",
  name: "John Doe",
  email: "john@example.com",
  courses: [1, 2, 3]  ← References to course IDs
  ...
}

Course {
  _id: 1,
  title: "Python 101",
  instructorId: "625d1234...",  ← Links to Instructor
  instructor: "John Doe"         ← Denormalized name
  ...
}

Benefits: 
✓ Easy to query courses by instructor ID
✓ Maintain referential integrity
✓ Efficient filtering and sorting
✓ Populate instructor details if needed
```

## State Management

### InstructorContext State
```javascript
{
  instructor: {
    _id: "625d...",        // Instructor MongoDB ID
    name: "John Doe",      // Display name
    email: "john@...",     // Email
    expertise: "Python",   // Area of expertise
    approved: true,        // Admin approval status
    role: "instructor"     // User role
  },
  isAuthenticated: true,
  loading: false,
  // Functions
  login(),
  logout()
}
```

### InstructorDashboard State
```javascript
{
  courses: [],             // Array of instructor's courses
  formData: {             // Current form data
    title: "...",
    description: "...",
    instructor: "...",    // Auto-filled from context
    category: "...",
    level: "...",
    price: "...",
    modules: [],
    // ... other fields
  },
  showAddModal: false,     // Add/Edit modal visibility
  editingCourse: null,     // Currently editing course
  // ... other modal states
}
```

## Error Handling

```
┌─────────────────────────────────────────────────────────────────┐
│ Possible Errors & Responses                                      │
├─────────────────────────────────────────────────────────────────┤
│ 400 Bad Request                                                  │
│ • Missing required fields (title, description, category)        │
│ • Invalid field values                                           │
│                                                                  │
│ 401 Unauthorized                                                │
│ • No token provided                                              │
│ • Invalid or expired token                                       │
│ • Token verification failed                                      │
│                                                                  │
│ 403 Forbidden                                                    │
│ • Instructor trying to modify another instructor's course       │
│ • Insufficient permissions                                       │
│                                                                  │
│ 404 Not Found                                                    │
│ • Course not found                                               │
│ • Instructor not found                                           │
│                                                                  │
│ 500 Server Error                                                 │
│ • Database error                                                 │
│ • Unexpected server error                                        │
└─────────────────────────────────────────────────────────────────┘
```

## Key Implementation Details

### 1. Auto-fill Instructor Name
```javascript
// Frontend - When Add Course is clicked
const instructor = useInstructor().instructor;

setFormData({
  ...
  instructor: instructor?.name || "",
  ...
});
```

### 2. Pre-fill on Edit
```javascript
// Courses are loaded with both name and ID
const handleEdit = (course) => {
  setFormData({
    ...course,
    instructor: course.instructor,  // Already has name
  });
};
```

### 3. Authorization Check
```javascript
// Backend - Before updating/deleting
if (course.instructorId.toString() !== req.instructor._id.toString()) {
  return res.status(403).json({ message: "Not authorized" });
}
```

### 4. Linking Courses to Instructor
```javascript
// When creating course
const course = await Course.create({
  ...courseData,
  instructorId: req.instructor._id,  // Link to instructor
  instructor: req.instructor.name,   // Store name too
});

// Also update instructor's courses array
await Instructor.findByIdAndUpdate(
  req.instructor._id,
  { $push: { courses: course._id } }
);
```
