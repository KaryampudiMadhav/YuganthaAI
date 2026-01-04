# Merosphere - Learning Management System

A full-stack MERN application for online learning with authentication, course management, and user profiles.

## Features

- ✅ User Authentication (Login/Signup with JWT)
- ✅ User Profile with enrolled courses
- ✅ Course browsing and enrollment
- ✅ Progress tracking
- ✅ Responsive design with Tailwind CSS
- ✅ Protected routes

## Tech Stack

**Frontend:**
- React 19
- React Router DOM
- Tailwind CSS
- Vite

**Backend:**
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- bcryptjs for password hashing

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (free tier available)
- npm or yarn

### MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. Create a new cluster:
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select your preferred cloud provider and region
   - Click "Create"

3. Create a database user:
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Enter username and password (save these!)
   - Set user privileges to "Read and write to any database"
   - Click "Add User"

4. Whitelist your IP:
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. Get your connection string:
   - Go to "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Update `.env` file with your MongoDB Atlas connection string:
```env
PORT=5000
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/merosphere?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development
```

**Important:** Replace:
- `your-username` with your MongoDB Atlas username
- `your-password` with your MongoDB Atlas password
- `cluster0.xxxxx.mongodb.net` with your actual cluster URL

4. Start the backend server:
```bash
npm run dev
```

Backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on http://localhost:5175

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### User
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)
- `POST /api/users/enroll/:courseId` - Enroll in course (Protected)
- `GET /api/users/enrolled` - Get enrolled courses (Protected)

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (Protected)

## Usage

1. Set up MongoDB Atlas (see instructions above)
2. Update backend `.env` file with your Atlas connection string
3. Start backend server (`npm run dev` in backend folder)
4. Start frontend server (`npm run dev` in frontend folder)
5. Open http://localhost:5175 in your browser
6. Sign up for a new account
7. Login and explore courses
8. Enroll in courses and track your progress

## Project Structure

```
studywebsite/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Course.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── user.js
│   │   └── courses.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Hero.jsx
    │   │   ├── Footer.jsx
    │   │   └── ...
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── CoursesPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── SignupPage.jsx
    │   │   └── ProfilePage.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## Features in Detail

### Authentication
- Secure JWT-based authentication
- Password hashing with bcryptjs
- Protected routes for authenticated users
- Persistent login with localStorage

### User Profile
- View enrolled courses
- Track course progress
- See completion statistics
- Update profile information

### Course Management
- Browse all available courses
- Search and filter courses
- Enroll in courses
- Track learning progress

## License

MIT
