import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import { InstructorProvider } from "./context/InstructorContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProgramSection from "./components/ProgramSection";
import FreeCourses from "./components/FreeCourses";
import LearningPaths from "./components/LearningPaths";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import MyLearningPage from "./pages/MyLearningPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import InstructorLoginPage from "./pages/InstructorLoginPage";
import InstructorDashboard from "./pages/InstructorDashboard";
import BlogsPage from "./pages/BlogsPage";
import BlogDetailPage from "./pages/BlogDetailPage";

function HomePage() {
	return (
		<>
			<Hero />
			<ProgramSection />
			<FreeCourses />
			<LearningPaths />
		</>
	);
}

function MainLayout({ children }) {
	return (
		<>
			<Navbar />
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
					<div className='min-h-screen'>
						<Routes>
							<Route
								path='/'
								element={
									<MainLayout>
										<HomePage />
									</MainLayout>
								}
							/>
							<Route
								path='/courses'
								element={
									<MainLayout>
										<CoursesPage />
									</MainLayout>
								}
							/>
							<Route
								path='/courses/:id'
								element={
									<MainLayout>
										<CourseDetailPage />
									</MainLayout>
								}
							/>
							<Route
								path='/my-learning'
								element={
									<MainLayout>
										<MyLearningPage />
									</MainLayout>
								}
							/>
							<Route
								path='/profile'
								element={
									<MainLayout>
										<ProfilePage />
									</MainLayout>
								}
							/>
							<Route
								path='/blogs'
								element={<BlogsPage />}
							/>
							<Route
								path='/blogs/:slug'
								element={<BlogDetailPage />}
							/>
							<Route path='/login' element={<LoginPage />} />
							<Route path='/signup' element={<SignupPage />} />

							{/* Instructor Routes */}
							<Route
								path='/instructor'
								element={<InstructorLoginPage />}
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
