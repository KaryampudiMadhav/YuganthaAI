import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MyLearningPage() {
	const [enrolledCourses, setEnrolledCourses] = useState([]);
	const [selectedTab, setSelectedTab] = useState("all");
	const [loading, setLoading] = useState(true);
	const { user } = useAuth();

	useEffect(() => {
		fetchEnrolledCourses();
	}, []);

	const fetchEnrolledCourses = async () => {
		try {
			// For now, fetching all courses - later can be filtered by user enrollment
			const response = await fetch("http://localhost:5000/api/courses");
			const data = await response.json();
			setEnrolledCourses(data);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching courses:", error);
			setLoading(false);
		}
	};

	const calculateProgress = (course) => {
		// Mock progress calculation - can be enhanced with actual progress tracking
		return Math.floor(Math.random() * 100);
	};

	const getFilteredCourses = () => {
		if (selectedTab === "all") return enrolledCourses;
		
		return enrolledCourses.filter((course) => {
			const progress = calculateProgress(course);
			if (selectedTab === "completed") return progress === 100;
			if (selectedTab === "in-progress") return progress > 0 && progress < 100;
			if (selectedTab === "yet-to-start") return progress === 0;
			return true;
		});
	};

	const filteredCourses = getFilteredCourses();
	const featuredCourse = enrolledCourses[0];

	if (loading) {
		return (
			<div className='min-h-screen bg-[#0a0a0a] flex items-center justify-center'>
				<div className='text-white text-xl'>Loading your courses...</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-[#0a0a0a] text-white pt-20'>
		<div className='max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8'>
				{/* Header with Search */}
				<div className='flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4'>
					<h1 className='text-2xl md:text-3xl font-bold'>My Learning</h1>
					<div className='flex items-center space-x-4 w-full md:w-auto'>
						<div className='relative flex-1 md:flex-none'>
							<input
								type='text'
								placeholder='Search Courses'
								className='bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 w-full md:w-64'
							/>
							<svg
								className='absolute left-3 top-2.5 w-5 h-5 text-gray-500'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
								/>
							</svg>
						</div>
						<div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-lg font-bold'>
							{user?.name?.charAt(0) || "U"}
						</div>
					</div>
				</div>

				{/* Featured/Continue Learning Section */}
				{featuredCourse && (
					<section className='mb-12'>
						<h2 className='text-xl md:text-2xl font-bold mb-6'>
							Enrolled Programs
						</h2>
						<div className='bg-gradient-to-r from-[#1a1a2e] to-[#16213e] rounded-2xl overflow-hidden'>
							<div className='flex flex-col lg:flex-row'>
								<div className='lg:w-1/2'>
									{featuredCourse.thumbnail ? (
										<img
											src={featuredCourse.thumbnail}
											alt={featuredCourse.title}
											className='w-full h-full object-cover'
										/>
									) : (
										<div className='w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center'>
											<div className='text-8xl'>🎓</div>
										</div>
									)}
								</div>
								<div className='lg:w-1/2 p-6 md:p-8 flex flex-col justify-center'>
									<div className='inline-block bg-yellow-500 text-black px-3 py-1 rounded text-sm font-semibold mb-4 w-fit'>
										Newly Launched
									</div>
									<h3 className='text-2xl md:text-3xl font-bold mb-4'>
										{featuredCourse.title}
									</h3>
									<p className='text-gray-300 mb-6'>
										Mentorship sessions completed ·{" "}
										{featuredCourse.modules?.reduce(
											(sum, m) => sum + (m.videos?.length || 0),
											0
										) || 0}
									</p>
										<div className='flex flex-col sm:flex-row gap-3 sm:space-x-4'>
											<Link
												to={`/courses/${featuredCourse._id}`}
												className='px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition'>
												Resume Learning
											</Link>
											<Link
												to='/mentorships'
												className='px-6 py-3 border border-gray-400 rounded-lg font-semibold hover:bg-white/10 transition'>
												My Mentorships
											</Link>
										</div>
								</div>
							</div>
						</div>
					</section>
				)}

				{/* Learning Path Section */}
				<section className='mb-12'>
					<h2 className='text-2xl font-bold mb-6'>Learning Path</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{enrolledCourses.slice(0, 3).map((course) => {
							const totalVideos = course.modules?.reduce(
								(sum, m) => sum + (m.videos?.length || 0),
								0
							) || 0;
							return (
								<Link
									key={course._id}
									to={`/courses/${course._id}`}
									className='bg-[#1a1a1a] rounded-xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300'>
									<div className='relative h-40 bg-gradient-to-br from-blue-900 to-purple-900'>
										{course.thumbnail ? (
											<img
												src={course.thumbnail}
												alt={course.title}
												className='w-full h-full object-cover'
											/>
										) : (
											<div className='absolute inset-0 flex items-center justify-center'>
												<svg
													className='w-20 h-20 text-white/30'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={1}
														d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
													/>
												</svg>
											</div>
										)}
									</div>
									<div className='p-6'>
										<div className='text-sm text-gray-400 mb-2'>
											{course.duration} · {course.modules?.length || 0}{" "}
											Courses
										</div>
										<h3 className='text-xl font-bold mb-2'>
											{course.title}
										</h3>
										<p className='text-sm text-gray-400'>
											{totalVideos} videos
										</p>
									</div>
								</Link>
							);
						})}
					</div>
				</section>

				{/* Breadcrumb */}
				<div className='flex items-center space-x-2 text-sm text-gray-400 mb-6'>
					<Link to='/my-learning' className='hover:text-white'>
						Enrolled Programs
					</Link>
					<span>&gt;</span>
					<span className='text-white'>Course Listing</span>
				</div>

				{/* Start Learning Section */}
				<section className='mb-12'>
					<h2 className='text-2xl font-bold mb-6'>Start Learning</h2>
					{enrolledCourses.slice(0, 1).map((course) => {
						const progress = calculateProgress(course);
						return (
							<div
								key={course._id}
								className='bg-[#1a1a1a] rounded-xl p-8 mb-8'>
								<h3 className='text-2xl font-bold mb-4'>
									{course.title}
								</h3>
								<div className='mb-4'>
									<div className='flex items-center justify-between mb-2'>
										<span className='text-sm text-gray-400'>
											{progress}% completed
										</span>
									</div>
									<div className='w-full bg-gray-800 rounded-full h-2'>
										<div
											className='h-2 rounded-full bg-gradient-to-r from-red-500 via-purple-500 to-blue-500'
											style={{ width: `${progress}%` }}></div>
									</div>
								</div>
								<Link
									to={`/courses/${course._id}`}
									className='inline-block px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition'>
									Continue
								</Link>
							</div>
						);
					})}
				</section>

				{/* Course Tabs and Filters */}
				<section className='mb-8'>
					<div className='flex items-center justify-between mb-6'>
						<h2 className='text-2xl font-bold'>
							{featuredCourse?.title || "Your Courses"}
						</h2>
						<Link
							to='/mentorships/book'
							className='px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition'>
							Book Mentorship
						</Link>
					</div>

					{/* Tabs */}
					<div className='flex overflow-x-auto space-x-4 mb-8 border-b border-gray-800 scrollbar-hide'>
						<button
							onClick={() => setSelectedTab("all")}
							className={`pb-3 px-4 font-medium transition ${
								selectedTab === "all"
									? "text-white border-b-2 border-white"
									: "text-gray-400 hover:text-gray-300"
							}`}>
							All Courses
						</button>
						<button
							onClick={() => setSelectedTab("completed")}
							className={`pb-3 px-4 font-medium transition ${
								selectedTab === "completed"
									? "text-white border-b-2 border-white"
									: "text-gray-400 hover:text-gray-300"
							}`}>
							Completed
						</button>
						<button
							onClick={() => setSelectedTab("in-progress")}
							className={`pb-3 px-4 font-medium transition ${
								selectedTab === "in-progress"
									? "text-white border-b-2 border-white"
									: "text-gray-400 hover:text-gray-300"
							}`}>
							In progress
						</button>
						<button
							onClick={() => setSelectedTab("yet-to-start")}
							className={`pb-3 px-4 font-medium transition ${
								selectedTab === "yet-to-start"
									? "text-white border-b-2 border-white"
									: "text-gray-400 hover:text-gray-300"
							}`}>
							Yet to start
						</button>
					</div>
				</section>

				{/* Your Roadmap */}
				<section>
					<h2 className='text-2xl font-bold mb-6'>Your Roadmap</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{filteredCourses.map((course) => {
							const progress = calculateProgress(course);
							return (
								<div
									key={course._id}
									className='bg-[#1a1a1a] rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300'>
									<div className='relative h-48'>
										{course.thumbnail ? (
											<img
												src={course.thumbnail}
												alt={course.title}
												className='w-full h-full object-cover'
											/>
										) : (
											<div className='w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center'>
												<div className='text-6xl'>📚</div>
											</div>
										)}
										<div className='absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold'>
											{course.level}
										</div>
									</div>
									<div className='p-6'>
										<h3 className='text-xl font-bold mb-2'>
											{course.title}
										</h3>
										<p className='text-sm text-gray-400 mb-4'>
											by {course.instructor}
										</p>
										<div className='mb-4'>
											<div className='flex items-center justify-between mb-2'>
												<span className='text-xs text-gray-500'>
													Progress
												</span>
												<span className='text-xs text-gray-400'>
													{progress}%
												</span>
											</div>
											<div className='w-full bg-gray-800 rounded-full h-1.5'>
												<div
													className='h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500'
													style={{
														width: `${progress}%`,
													}}></div>
											</div>
										</div>
										<div className='flex items-center justify-between text-sm text-gray-400 mb-4'>
											<div className='flex items-center space-x-1'>
												<svg
													className='w-4 h-4'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
													/>
												</svg>
												<span>{course.duration}</span>
											</div>
											<div className='flex items-center space-x-1'>
												<svg
													className='w-4 h-4'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
													/>
												</svg>
												<span>
													{course.modules?.length || 0} modules
												</span>
											</div>
										</div>
										<Link
											to={`/courses/${course._id}`}
											className='block w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-center font-semibold transition'>
											{progress === 0
												? "Start Course"
												: progress === 100
												? "Review"
												: "Continue"}
										</Link>
									</div>
								</div>
							);
						})}
					</div>
				</section>
			</div>
		</div>
	);
}
