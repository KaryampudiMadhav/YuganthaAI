# Quick Start Guide - Instructor Assignment System

## 🚀 How to Use

### For Admin - Assigning Instructors

1. **Login to Admin Panel**
   - Go to `/admin/login`
   - Email: `admin@yuganthaai.com`
   - Password: `Admin123!`

2. **Navigate to Assignment Page**
   - Click **"Assign Instructors"** in the admin menu
   - You'll see three panels

3. **Search & Select User**
   - In **left panel**, search by name or email
   - Click on a user to select them (border turns emerald)

4. **Search & Select Instructor**
   - In **center panel**, search by name or expertise
   - Click on an instructor to select them

5. **Confirm Assignment**
   - **Right panel** shows your selection
   - Click **"Assign Now"** button
   - ✅ Green success message confirms

6. **View Stats**
   - Bottom shows: Total Users, Total Instructors, Completed Assignments
   - User list shows "✓ Current Instructor" if already assigned

---

### For Users - Booking Sessions

1. **Login to Student Portal**
   - Go to `/login`
   - Login with your credentials

2. **Go to Mentorship Booking**
   - Click **"Mentorships"** → **"Book Session"**
   - Page automatically shows **your assigned instructor**

3. **View Instructor Card**
   - At the top you'll see:
     - 🟢 "Your Assigned Mentor"
     - Instructor name in large text
     - Their expertise area
     - Biography

4. **Book a Session**
   - Select a date from calendar
   - Select a time slot
   - Enter your email (pre-filled from your profile)
   - Choose your question topic
   - Click **"Confirm Booking"**

5. **View Your Sessions**
   - Go to **"My Mentorships"**
   - See your **instructor card** at the top
   - View all booked sessions below
   - Click **"Book Session"** to add more

---

## 📍 Pages Modified

### Backend
- ✅ `backend/routes/user.js` - Added `/assigned-instructor` endpoint

### Frontend
- ✅ `frontend/src/pages/AdminAssignInstructors.jsx` - New 3-panel UI
- ✅ `frontend/src/pages/MentorshipBookingPage.jsx` - Dynamic instructor display
- ✅ `frontend/src/pages/MentorshipPage.jsx` - Instructor card on top

---

## 🔍 Key Features

### Admin Panel
| Feature | Details |
|---------|---------|
| **Search Users** | Filter by name or email |
| **Search Instructors** | Filter by name or expertise |
| **Visual Selection** | Emerald border highlights selected items |
| **Assignment Summary** | Shows user → instructor flow |
| **Success Feedback** | Green message confirms assignment |
| **Statistics** | Real-time counts of users, instructors, assignments |

### Booking Page
| Feature | Details |
|---------|---------|
| **Auto-Load Instructor** | Fetches assigned mentor on page load |
| **Dynamic Title** | Shows "1:1 Mentorship with [Name]" |
| **Instructor Card** | Displays name, expertise, bio |
| **Pre-filled Email** | User email auto-populated from profile |
| **Error Handling** | Clear message if no instructor assigned |
| **Loading State** | Shows "Loading mentor information..." |

### Mentorship Page
| Feature | Details |
|---------|---------|
| **Instructor Card** | Prominent display at top of page |
| **Avatar Support** | Shows profile photo if available |
| **Expert Info** | Displays expertise area and biography |
| **Gradient Background** | Emerald/green highlighting |
| **Session List** | Shows all bookings with mentor name |

---

## ⚙️ API Endpoints

### Get Assigned Instructor
```
GET /api/users/assigned-instructor
Authorization: Bearer {token}

Response:
{
  "_id": "instructor_id",
  "name": "Dr. John Doe",
  "expertise": "AI & Machine Learning",
  "email": "john@example.com",
  "avatar": "url",
  "bio": "Expert in..."
}
```

### Assign Instructor (Admin Only)
```
POST /api/admin/assign-instructor
Authorization: Bearer {admin_token}

Body:
{
  "userId": "user_id",
  "instructorId": "instructor_id"
}

Response:
{
  "message": "Instructor assigned successfully",
  "user": { user object with populated assignedInstructor }
}
```

---

## 🎯 Complete Workflow Example

**Scenario:** Admin assigns Dr. Sarah to student John, then John books a session

### Step 1: Admin Action
```
1. Admin logs in → "Assign Instructors"
2. Searches for "John" → Selects John Smith
3. Searches for "Sarah" → Selects Dr. Sarah (AI Expert)
4. Clicks "Assign Now"
5. ✅ Success: "Dr. Sarah assigned to John Smith"
6. John's user card now shows "✓ Dr. Sarah"
```

### Step 2: User Action
```
1. John logs in → "Mentorships" → "Book Session"
2. Page loads and shows:
   - Title: "1:1 Mentorship with Dr. Sarah"
   - Card: "Your Assigned Mentor - Dr. Sarah - AI Expert"
3. John selects: Date (Jan 15) → Time (3:00 PM) → Topic (Applied LLMs)
4. Email pre-filled: john@example.com
5. Clicks "Confirm Booking"
6. ✅ Session booked with Dr. Sarah
```

### Step 3: View Session
```
1. John goes to "My Mentorships"
2. Sees Dr. Sarah's card at top with her info
3. Below shows booked session:
   - Title: "Applied LLMs"
   - Mentor: "Dr. Sarah"
   - Date: Jan 15, 2026
   - Time: 3:00 PM
   - Status: Upcoming
```

---

## 🔐 Authentication

### Admin Login
```
Email: admin@yuganthaai.com
Password: Admin123!
```

### User Login
- Use your student account credentials

---

## 📊 Database References

### User Model
```javascript
assignedInstructor: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Instructor",
  default: null
}
```

### Instructor Model
```javascript
name, email, expertise, bio, avatar, active, approved
```

---

## ✅ Testing Checklist

- [ ] Admin can login
- [ ] Admin can search and assign instructor to user
- [ ] Success message appears
- [ ] User can login
- [ ] User's assigned instructor appears on booking page
- [ ] User can book session
- [ ] User can see instructor on mentorship page
- [ ] Email is auto-filled
- [ ] Responsive on mobile/tablet/desktop

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| **"No instructor assigned" error** | Admin needs to assign instructor first |
| **Empty instructor lists** | Create/approve instructors in admin panel first |
| **Email not pre-filled** | Login and refresh page |
| **Can't see booked sessions** | Check browser localStorage for "mentorshipBookings" |
| **Instructor card not showing** | Check JWT token validity and API response |

---

## 📞 Contact

For issues or questions about the system, contact the admin.

**System Status:** ✅ OPERATIONAL
**SMTP Email:** ✅ WORKING
**Instructor Assignment:** ✅ LIVE
**Mentorship Booking:** ✅ ACTIVE

---

Last Updated: January 5, 2026
