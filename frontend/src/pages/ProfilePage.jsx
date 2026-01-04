import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function ProfilePage() {
	const { user, logout, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/", { replace: true });
		}
	}, [isAuthenticated, navigate]);

	const handleLogout = () => {
		logout();
		navigate("/", { replace: true });
	};

	if (!user) {
		return (
			<div className='min-h-screen bg-[#1a1a1a] text-white pt-20 flex items-center justify-center'>
				Loading...
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-[#1a1a1a] text-white pt-20'>
			<div className='max-w-7xl mx-auto px-6 py-12'>
				{/* Profile Header */}
				<div className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center space-x-6'>
							<div className='w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-blue-600'>
								{user.fullName.charAt(0).toUpperCase()}
							</div>
							<div>
								<h1 className='text-3xl font-bold mb-2'>
									{user.fullName}
								</h1>
								<p className='text-blue-100'>{user.email}</p>
							</div>
						</div>
						<button
							onClick={handleLogout}
							className='bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg transition duration-200'>
							Logout
						</button>
					</div>
				</div>

				{/* Stats */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
					<div className='bg-gray-900 rounded-xl p-6'>
						<div className='text-3xl font-bold mb-2'>
							{user.enrolledCourses?.length || 0}
						</div>
						<div className='text-gray-400'>Enrolled Courses</div>
					</div>
					<div className='bg-gray-900 rounded-xl p-6'>
						<div className='text-3xl font-bold mb-2'>
							{user.enrolledCourses?.filter((c) => c.completed)
								.length || 0}
						</div>
						<div className='text-gray-400'>Completed Courses</div>
					</div>
					<div className='bg-gray-900 rounded-xl p-6'>
						<div className='text-3xl font-bold mb-2'>
							{Math.round(
								user.enrolledCourses?.reduce(
									(acc, c) => acc + c.progress,
									0
								) / (user.enrolledCourses?.length || 1) || 0
							)}
							%
						</div>
						<div className='text-gray-400'>Average Progress</div>
					</div>
				</div>

				{/* Enrolled Courses */}
				<div>
					<h2 className='text-2xl font-bold mb-6'>My Learning</h2>

					{user.enrolledCourses && user.enrolledCourses.length > 0 ? (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
							{user.enrolledCourses.map((enrollment) => (
								<div
									key={enrollment._id}
									className='bg-gray-900 rounded-xl overflow-hidden hover:shadow-2xl transition cursor-pointer'>
									<div className='h-40 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center'>
										<div className='text-5xl'>📚</div>
									</div>
									<div className='p-6'>
										<h3 className='font-bold text-lg mb-2'>
											Course {enrollment.courseId}
										</h3>
										<div className='mb-4'>
											<div className='flex justify-between text-sm mb-2'>
												<span>Progress</span>
												<span>
													{enrollment.progress}%
												</span>
											</div>
											<div className='w-full bg-gray-700 rounded-full h-2'>
												<div
													className='bg-blue-500 h-2 rounded-full transition-all duration-300'
													style={{
														width: `${enrollment.progress}%`,
													}}></div>
											</div>
										</div>
										{enrollment.completed && (
											<div className='bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm inline-block'>
												✓ Completed
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					) : (
						<div className='bg-gray-900 rounded-xl p-12 text-center'>
							<div className='text-6xl mb-4'>📚</div>
							<h3 className='text-xl font-bold mb-2'>
								No courses enrolled yet
							</h3>
							<p className='text-gray-400 mb-6'>
								Start learning by enrolling in a course
							</p>
							<Link
								to='/courses'
								className='inline-block bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg transition duration-200'>
								Browse Courses
							</Link>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
