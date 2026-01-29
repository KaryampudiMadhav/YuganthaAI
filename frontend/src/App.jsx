import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { InstructorProvider } from "./context/InstructorContext";
import { ScrollToTop } from "./components/ScrollToTop";
import MainNavbar from "./components/MainNavbar";
import CoursesNavbar from "./components/CoursesNavbar";
import Hero from "./components/Hero";
import FreeCourses from "./components/FreeCourses";
import LearningPaths from "./components/LearningPaths";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import LandingPage from "./pages/LandingPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import MyLearningPage from "./pages/MyLearningPage";
import MentorshipPage from "./pages/MentorshipPage";
import MentorshipBookingPage from "./pages/MentorshipBookingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import InstructorLoginPage from "./pages/InstructorLoginPage";
import InstructorDashboard from "./pages/InstructorDashboard";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAssignInstructors from "./pages/AdminAssignInstructors";
import AdminMentorAssignments from "./pages/AdminMentorAssignments";
import InstructorForgotPasswordPage from "./pages/InstructorForgotPasswordPage";
import BlogsPage from "./pages/BlogsPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

function CoursesHomePage() {
	return (
		<>
			<Hero />
			<FreeCourses />
			<LearningPaths />
		</>
	);
}

function MainLayout({ children }) {
	return (
		<>
			<MainNavbar />
			{children}
			<Footer />
		</>
	);
}

function CoursesLayout({ children }) {
	return (
		<>
			<CoursesNavbar />
			{children}
			<Footer />
		</>
	);
}

export default function App() {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Simulate initial loading
		const timer = setTimeout(() => {
			setLoading(false);
		}, 2000);

		return () => clearTimeout(timer);
	}, []);

	if (loading) {
		return <LoadingSpinner />;
	}

	return (
		<AuthProvider>
			<InstructorProvider>
				<Router>
					<ScrollToTop />
					<Toaster
						position="top-right"
						toastOptions={{
							duration: 3000,
							style: {
								background: '#1a1a1a',
								color: '#fff',
								border: '1px solid rgba(139, 92, 246, 0.3)',
							},
							success: {
								iconTheme: {
									primary: '#8b5cf6',
									secondary: '#fff',
								},
							},
							error: {
								iconTheme: {
									primary: '#ef4444',
									secondary: '#fff',
								},
							},
						}}
					/>
					<div className='min-h-screen'>
						<Routes>
							<Route
								path='/'
								element={
									<MainLayout>
										<LandingPage />
									</MainLayout>
								}
							/>
							<Route
								path='/courses'
								element={
									<CoursesLayout>
										<CoursesHomePage />
									</CoursesLayout>
								}
							/>
							<Route
								path='/free-courses'
						element={
							<CoursesLayout>
								<FreeCourses />
							</CoursesLayout>
						}
					/>
					<Route
						path='/courses/:id'
								element={
									<CoursesLayout>
										<CourseDetailPage />
									</CoursesLayout>
								}
							/>
							<Route
								path='/my-learning'
								element={
									<CoursesLayout>
										<MyLearningPage />
									</CoursesLayout>
								}
							/>
							<Route
								path='/mentorships'
								element={
									<CoursesLayout>
										<MentorshipPage />
									</CoursesLayout>
								}
							/>
							<Route
								path='/mentorships/book'
								element={
									<CoursesLayout>
										<MentorshipBookingPage />
									</CoursesLayout>
								}
							/>
							<Route
								path='/profile'
								element={
									<CoursesLayout>
										<ProfilePage />
									</CoursesLayout>
								}
							/>
							<Route
								path='/blogs'
								element={
									<MainLayout>
										<BlogsPage />
									</MainLayout>
								}
							/>
							<Route
								path='/blogs/:slug'
								element={
									<MainLayout>
										<BlogDetailPage />
									</MainLayout>
								}
							/>
							<Route
								path='/about'
								element={
									<MainLayout>
										<AboutPage />
									</MainLayout>
								}
							/>
							<Route
								path='/contact'
								element={
									<MainLayout>
										<ContactPage />
									</MainLayout>
								}
							/>
							<Route
								path='/free-courses'
								element={
									<CoursesLayout>
										<CoursesPage />
									</CoursesLayout>
								}
							/>
							<Route path='/login' element={<LoginPage />} />
							<Route path='/signup' element={<SignupPage />} />
							<Route path='/admin/login' element={<AdminLoginPage />} />
							<Route path='/admin/dashboard' element={<AdminDashboard />} />
							<Route path='/admin/assign-instructors' element={<AdminAssignInstructors />} />
							<Route path='/admin/mentor-assignments' element={<AdminMentorAssignments />} />

							{/* Instructor Routes */}
							<Route
								path='/instructor'
								element={<InstructorLoginPage />}
							/>
							<Route
								path='/instructor/forgot-password'
								element={<InstructorForgotPasswordPage />}
							/>
							<Route
								path='/instructor/dashboard'
								element={<InstructorDashboard />}
							/>
						</Routes>
					</div>
				</Router>
			</InstructorProvider>
		</AuthProvider>
	);
}

