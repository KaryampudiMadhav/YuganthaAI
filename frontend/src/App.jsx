import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { InstructorProvider } from "./context/InstructorContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProgramSection from "./components/ProgramSection";
import FreeCourses from "./components/FreeCourses";
import LearningPaths from "./components/LearningPaths";
import Footer from "./components/Footer";
import CoursesPage from "./pages/CoursesPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import InstructorLoginPage from "./pages/InstructorLoginPage";
import InstructorDashboard from "./pages/InstructorDashboard";

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
								path='/profile'
								element={
									<MainLayout>
										<ProfilePage />
									</MainLayout>
								}
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
