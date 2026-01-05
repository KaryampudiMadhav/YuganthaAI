# System Architecture & Flow Diagrams

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        MeroSphere Platform                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐         ┌──────────────────┐               │
│  │   Admin Portal   │         │   Student Portal │               │
│  │                  │         │                  │               │
│  │ • Admin Login    │         │ • Student Login  │               │
│  │ • Assign         │         │ • View Mentor    │               │
│  │   Instructor     │         │ • Book Sessions  │               │
│  │ • View Stats     │         │ • My Mentorships │               │
│  └────────┬─────────┘         └────────┬─────────┘               │
│           │                            │                        │
│           │  Admin Token               │  User Token            │
│           └─────────────────┬──────────┘                        │
│                             │                                   │
│                      ┌──────▼─────────┐                        │
│                      │   API Gateway  │                        │
│                      │   JWT Auth     │                        │
│                      └──────┬─────────┘                        │
│                             │                                   │
│        ┌────────────────────┼────────────────────┐             │
│        │                    │                    │             │
│    ┌───▼────┐         ┌────▼────┐        ┌─────▼────┐        │
│    │ Admin  │         │ User    │        │ Course   │        │
│    │ Routes │         │ Routes  │        │ Routes   │        │
│    └───┬────┘         └────┬────┘        └─────┬────┘        │
│        │                   │                    │             │
│        └───────────────────┼────────────────────┘             │
│                            │                                  │
│                     ┌──────▼──────────┐                      │
│                     │   MongoDB       │                      │
│                     │   Database      │                      │
│                     │                 │                      │
│                     │ Collections:    │                      │
│                     │ • Users         │                      │
│                     │ • Instructors   │                      │
│                     │ • Courses       │                      │
│                     │ • Sessions      │                      │
│                     └─────────────────┘                      │
│                                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Instructor Assignment Flow

```
ADMIN WORKFLOW
==============

    Admin Portal
    (AdminAssignInstructors.jsx)
            │
            ├─► [Search Users]
            │   └─► GET /api/admin/users
            │       └─► Display all users with current assignments
            │
            ├─► [Search Instructors]
            │   └─► GET /api/admin/instructors
            │       └─► Display active & approved instructors
            │
            ├─► [Select User + Select Instructor]
            │   └─► State: selectedUser, selectedInstructor
            │
            └─► [Assign Now Button]
                └─► POST /api/admin/assign-instructor
                    ├─► Body: { userId, instructorId }
                    │
                    └─► Backend Processing
                        ├─► Verify Instructor exists
                        ├─► Verify Instructor active
                        ├─► Update User.assignedInstructor
                        └─► Return updated User with populated Instructor
                        
                            Database
                            --------
                            User
                            ├─ _id
                            ├─ fullName
                            ├─ email
                            └─ assignedInstructor → Instructor._id
                                                    └─ Instructor
                                                       ├─ _id
                                                       ├─ name
                                                       ├─ expertise
                                                       ├─ email
                                                       ├─ avatar
                                                       └─ bio

                    ✅ Success Message appears
                    └─► Refresh data
                        └─► Stats update
```

---

## 👤 User Booking Flow

```
STUDENT WORKFLOW
================

    Student Portal
    [Login]
         │
         └─► /mentorships/book
             └─► MentorshipBookingPage.jsx loads
                 │
                 ├─► useEffect Hook
                 │   ├─► GET /api/users/assigned-instructor
                 │   │   └─► Response: Instructor object
                 │   │       ├─ name: "Dr. Sarah"
                 │   │       ├─ expertise: "AI & ML"
                 │   │       ├─ email: "sarah@..."
                 │   │       ├─ avatar: "url"
                 │   │       └─ bio: "..."
                 │   │
                 │   └─► GET /api/users/profile
                 │       └─► Response: User with email
                 │           └─ email pre-fills
                 │
                 ├─► Display Instructor Card (emerald highlight)
                 │   ├─ "Your Assigned Mentor"
                 │   ├─ Dr. Sarah
                 │   └─ AI & ML Expert
                 │
                 ├─► User selects:
                 │   ├─ Date (calendar)
                 │   ├─ Time (slot)
                 │   ├─ Topic (dropdown)
                 │   └─ Email (pre-filled)
                 │
                 └─► Click "Confirm Booking"
                     │
                     ├─► Create booking object:
                     │   {
                     │     id: "booking-xxx",
                     │     title: "Topic selected",
                     │     mentor: "Dr. Sarah",
                     │     mentorId: "instructor_id",
                     │     mentorExpertise: "AI & ML",
                     │     status: "upcoming",
                     │     date: "Jan 15, 2026",
                     │     time: "3:00 PM",
                     │     email: "student@...",
                     │     zoom: "zoom_link",
                     │     notes: "Booked on..."
                     │   }
                     │
                     ├─► localStorage.setItem()
                     │   └─► "mentorshipBookings": [...]
                     │
                     └─► Redirect to /mentorships
                         ✅ "Booking confirmed!"
```

---

## 📋 View Mentorship Sessions Flow

```
STUDENT MENTORSHIP VIEW
=======================

    /mentorships
    [My Mentorships Page]
         │
         ├─► useEffect Hook
         │   ├─► GET /api/users/assigned-instructor
         │   │   └─► Response: Instructor object
         │   │
         │   └─► Get bookings from localStorage
         │       └─► "mentorshipBookings": [...]
         │
         ├─► Display Instructor Card (Top)
         │   ├─ [Avatar if available]
         │   ├─ "Your Assigned Mentor"
         │   ├─ Name: "Dr. Sarah"
         │   ├─ Expertise: "AI & ML"
         │   └─ Bio: "Expert in..."
         │
         ├─► Navigation Tabs
         │   ├─ My Mentorships (active)
         │   ├─ Upcoming Sessions
         │   ├─ Completed Sessions
         │   └─ Cancelled / Rescheduled
         │
         └─► Display Session Cards
             ├─ Status: "upcoming"
             ├─ Title: "Applied LLMs"
             ├─ Mentor: "Dr. Sarah" ◄── From booking data
             ├─ Date: "Jan 15, 2026"
             ├─ Time: "3:00 PM"
             ├─ Notes: "..."
             └─ Actions: [Join/Details] [Reschedule]
```

---

## 🔌 API Endpoints

```
┌─────────────────────────────────────────────────────────┐
│            API Endpoints Used in Flow                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│ ADMIN ENDPOINTS                                          │
│ ───────────────                                          │
│                                                           │
│ POST /api/admin/assign-instructor                       │
│   Auth: Admin Token                                      │
│   Body: { userId, instructorId }                        │
│   Response: { message, user }                           │
│   Purpose: Assign instructor to user                    │
│                                                           │
│ GET /api/admin/instructors                              │
│   Auth: Admin Token                                      │
│   Response: [Instructor[], ...]                         │
│   Purpose: Get all active/approved instructors          │
│                                                           │
│ GET /api/admin/users                                    │
│   Auth: Admin Token                                      │
│   Response: [User[], ...]                               │
│   Purpose: Get all users                                │
│                                                           │
├─────────────────────────────────────────────────────────┤
│                                                           │
│ USER ENDPOINTS                                           │
│ ──────────────                                           │
│                                                           │
│ GET /api/users/assigned-instructor                      │
│   Auth: User Token                                       │
│   Response: Instructor object                           │
│   Purpose: Get user's assigned instructor               │
│                                                           │
│ GET /api/users/profile                                  │
│   Auth: User Token                                       │
│   Response: User object (with assignedInstructor)      │
│   Purpose: Get user profile and assigned instructor     │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Data Models

```
USER
════════════════════════
_id: ObjectId
fullName: String
email: String
password: String (hashed)
enrolledCourses: Array
  ├─ courseId: ObjectId (ref: Course)
  ├─ enrolledAt: Date
  ├─ progress: Number
  └─ completed: Boolean
assignedInstructor: ObjectId (ref: Instructor)  ◄── KEY FIELD
avatar: String
createdAt: Date


INSTRUCTOR
════════════════════════
_id: ObjectId
name: String
email: String
password: String (hashed)
expertise: String
bio: String
avatar: String
active: Boolean
approved: Boolean
resetToken: String
resetTokenExpiry: Date
courses: Array (ObjectId ref: Course)


BOOKING (localStorage)
════════════════════════
id: String (generated)
title: String (topic)
mentor: String (name)
mentorId: ObjectId  ◄── LINKS TO INSTRUCTOR
mentorExpertise: String
status: String (upcoming/completed/cancelled)
date: String
time: String
email: String
zoom: String
notes: String
```

---

## 🔐 Authentication Flow

```
┌──────────────────────────────────────────────┐
│         AUTHENTICATION FLOW                   │
├──────────────────────────────────────────────┤
│                                              │
│ ADMIN LOGIN                                  │
│ ──────────                                   │
│ Email: admin@yuganthaai.com                 │
│ Password: Admin123!                         │
│     │                                        │
│     └─► POST /api/admin/login               │
│         ├─► Verify credentials              │
│         ├─► Generate JWT token              │
│         └─► Return { token, admin }         │
│                                              │
│ Token stored in: localStorage                │
│   ├─ adminToken (for requests)              │
│   └─ adminAuthed: "true"                    │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│ USER LOGIN                                   │
│ ──────────                                   │
│ Email: student@example.com                  │
│ Password: ****                               │
│     │                                        │
│     └─► POST /api/auth/login                │
│         ├─► Verify credentials              │
│         ├─► Generate JWT token              │
│         └─► Return { token, user }          │
│                                              │
│ Token stored in: localStorage                │
│   └─ userToken (for requests)               │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│ PROTECTED REQUESTS                          │
│ ──────────────────                          │
│ Authorization: Bearer {token}               │
│     │                                        │
│     └─► Middleware: verifyAdmin / protect   │
│         ├─► Verify token validity           │
│         ├─► Check role (if applicable)      │
│         └─► Continue to endpoint            │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 🎯 Error Handling Flows

```
ASSIGNMENT ERRORS
═════════════════

Admin clicks "Assign Now" without selecting both
    ↓
alert("Please select both a user and an instructor")
    ↓
User continues on same page


API Error (500)
    ↓
alert("Failed to assign instructor")
    ↓
console.error() logged
    ↓
Page state unchanged


────────────────────────────────────────────

BOOKING ERRORS
══════════════

No instructor assigned
    ↓
GET /api/users/assigned-instructor returns 404
    ↓
Display error page:
├─ "No instructor has been assigned yet"
├─ "Please contact the admin"
└─ [Go Back button]
    ↓
User cannot proceed with booking


Not logged in
    ↓
No userToken in localStorage
    ↓
Error message:
"Please login to book a mentorship session"
    ↓
Redirect to login page


────────────────────────────────────────────

MENTORSHIP VIEW ERRORS
══════════════════════

API fails to fetch instructor
    ↓
console.error() logged
    ↓
Component still loads
    ↓
Page displays without instructor card
    ↓
User can still see booked sessions
```

---

## 📱 UI Component Hierarchy

```
AdminAssignInstructors
├─ AdminNavbar
├─ Header
├─ SuccessMessage (conditional)
├─ LoadingState (conditional)
├─ MainGrid
│  ├─ UsersList Panel
│  │  ├─ Header
│  │  ├─ SearchInput
│  │  └─ UserItems (scrollable list)
│  │
│  ├─ InstructorsList Panel
│  │  ├─ Header
│  │  ├─ SearchInput
│  │  └─ InstructorItems (scrollable list)
│  │
│  └─ AssignmentPanel
│     ├─ UserDisplay
│     ├─ Arrow
│     ├─ InstructorDisplay
│     └─ AssignButton
│
└─ StatisticsGrid
   ├─ TotalUsers
   ├─ TotalInstructors
   └─ CompletedAssignments


MentorshipBookingPage
├─ LoadingState (conditional)
├─ ErrorState (conditional)
├─ BookingForm
│  ├─ LeftPanel
│  │  ├─ ProgramInfo
│  │  └─ InstructorCard
│  │
│  └─ RightPanel
│     ├─ DatePicker
│     ├─ TimeSlotsSelector
│     └─ ConfirmButton
│
└─ BookingDetails (conditional)
   ├─ LeftPanel (same as above)
   └─ RightPanel
      ├─ EmailInput
      ├─ TopicSelector
      └─ ConfirmBookingButton


MentorshipPage
├─ Sidebar
│  └─ NavTabs
│
├─ MainContent
│  ├─ Header
│  ├─ InstructorCard (NEW)
│  ├─ Statistics
│  └─ SessionsList
│     └─ SessionCard
│        ├─ StatusBadge
│        ├─ SessionInfo
│        └─ ActionButtons
```

---

## 🔄 State Management

```
AdminAssignInstructors (Local State)
═════════════════════════════════════
├─ instructors: Instructor[]
├─ users: User[]
├─ loading: Boolean
├─ selectedUser: User | null
├─ selectedInstructor: Instructor | null
├─ successMessage: String
├─ searchUserQuery: String
└─ searchInstructorQuery: String


MentorshipBookingPage (Local State)
════════════════════════════════════
├─ monthOffset: Number
├─ selectedDate: String | null
├─ selectedSlot: String | null
├─ showDetails: Boolean
├─ email: String
├─ topic: String
├─ assignedInstructor: Instructor | null
├─ loading: Boolean
├─ error: String
└─ program: Object


MentorshipPage (Local State)
═════════════════════════════
├─ activeTab: String
├─ sessionData: Session[]
├─ assignedInstructor: Instructor | null
└─ loading: Boolean


localStorage
═════════════
adminAuthed: "true" | undefined
adminToken: String
userToken: String
mentorshipBookings: Booking[]
```

---

## 📈 Data Flow Timeline

```
T₀: Page Load
   └─► useEffect triggered
       ├─► if (AdminPage): fetchData()
       │   ├─► GET /api/admin/instructors
       │   └─► GET /api/admin/users
       │
       └─► if (BookingPage): fetchAssignedInstructor()
           ├─► GET /api/users/assigned-instructor
           └─► GET /api/users/profile

T₁: User Selection
   └─► setState({ selectedUser, selectedInstructor })
       └─► UI updates (re-render with selection highlight)

T₂: Admin Clicks Assign
   └─► POST /api/admin/assign-instructor
       ├─► Database: User.assignedInstructor = Instructor._id
       └─► Response: updated User
           └─► setState({ successMessage })
               └─► setTimeout: clear message after 5s

T₃: User Books Session
   └─► Create booking object
       ├─► instructor data from state
       ├─► user email from profile
       └─► localStorage.setItem("mentorshipBookings")
           └─► Redirect to /mentorships

T₄: User Views Sessions
   └─► Fetch from localStorage
       └─► Display with instructor name from booking
```

---

## ✅ Complete System Status

```
┌────────────────────────────────────┐
│ Component Status Matrix             │
├────────────────────────────────────┤
│ ✅ Admin Assignment UI              │
│ ✅ User Routes API                  │
│ ✅ Booking Page Instructor Display   │
│ ✅ Mentorship Page Instructor Card   │
│ ✅ Search & Filter                  │
│ ✅ Error Handling                   │
│ ✅ Loading States                   │
│ ✅ Success Messages                 │
│ ✅ Responsive Design                │
│ ✅ SMTP Integration                 │
│ ✅ JWT Authentication               │
│ ✅ Database Integration             │
└────────────────────────────────────┘
```

---

Created: January 5, 2026
Version: 1.0 FINAL
Status: ✅ PRODUCTION READY
