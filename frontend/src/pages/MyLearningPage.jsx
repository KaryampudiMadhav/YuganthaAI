import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MyLearningPage() {
	const [enrolledCourses, setEnrolledCourses] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
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

	const featuredCourse = enrolledCourses[0];
	
	// Calculate total hours and courses for each learning path
	const calculateCourseStats = (course) => {
		const totalVideos = course.modules?.reduce(
			(sum, m) => sum + (m.videos?.length || 0),
			0
		) || 0;
		const totalHours = course.duration || "30 Hours";
		return { totalVideos, totalHours };
	};

	// Calculate progress for a course (mock - can be enhanced)
	const calculateProgress = (course) => {
		// Mock progress calculation - can be enhanced with actual progress tracking
		return Math.floor(Math.random() * 100);
	};

	// Filter courses based on search and selected tab
	const getFilteredCourses = () => {
		let filtered = enrolledCourses.filter(course => 
			course.title.toLowerCase().includes(searchQuery.toLowerCase())
		);

		if (selectedTab === "all") return filtered;

		return filtered.filter((course) => {
			const progress = calculateProgress(course);
			if (selectedTab === "completed") return progress === 100;
			if (selectedTab === "in-progress") return progress > 0 && progress < 100;
			if (selectedTab === "yet-to-start") return progress === 0;
			return true;
		});
	};

	const filteredCourses = getFilteredCourses();

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
				<div className='flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12 gap-4'>
					<h1 className='text-2xl md:text-3xl font-bold'>Enrolled Programs</h1>
					<div className='flex items-center space-x-4 w-full md:w-auto'>
						<div className='relative flex-1 md:flex-none'>
							<input
								type='text'
								placeholder='Search Courses'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className='bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 w-full md:w-64'
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
						<div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-lg font-bold'>
							{user?.fullName?.charAt(0)?.toUpperCase() || "P"}
						</div>
					</div>
				</div>

				{/* Featured Course - Enrolled Programs Section */}
				{featuredCourse && (
					<section className='mb-16'>
						<div className='bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl'>
							<div className='flex flex-col lg:flex-row'>
								<div className='lg:w-1/2 relative h-64 lg:h-auto'>
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
									<div className='absolute top-4 left-4'>
										<span className='inline-block bg-yellow-400 text-black px-3 py-1 rounded text-sm font-bold'>
											Newly Launched
										</span>
									</div>
								</div>
								<div className='lg:w-1/2 p-8 md:p-10 flex flex-col justify-center'>
									<h3 className='text-3xl md:text-4xl font-bold mb-4'>
										{featuredCourse.title}
									</h3>
									<p className='text-gray-400 mb-8'>
										Mentorship sessions completed · {calculateCourseStats(featuredCourse).totalVideos}
									</p>
									<div className='flex flex-col sm:flex-row gap-4'>
										<Link
											to={`/courses/${featuredCourse._id}`}
											className='px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition text-center'>
											Resume Learning
										</Link>
										<Link
											to='/my-learning'
											className='px-8 py-3 text-white font-semibold hover:underline flex items-center justify-center'>
											My Mentorships
										</Link>
									</div>
								</div>
							</div>
						</div>
					</section>
				)}

				{/* Learning Path Section - All Registered Courses */}
				<section className='mb-16'>
					<h2 className='text-3xl font-bold mb-8'>Learning Path</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{enrolledCourses.map((course) => {
							const stats = calculateCourseStats(course);
							return (
								<Link
									key={course._id}
									to={`/courses/${course._id}`}
									className='bg-[#1a1a1a] rounded-xl overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-800 hover:border-purple-500'>
									<div className='relative h-48 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900'>
										{course.thumbnail ? (
											<img
												src={course.thumbnail}
												alt={course.title}
												className='w-full h-full object-cover'
											/>
										) : (
											<div className='absolute inset-0 flex items-center justify-center'>
												<svg
													className='w-24 h-24 text-white/20'
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
										<div className='text-sm text-gray-400 mb-3'>
											{stats.totalHours} • {course.modules?.length || 0} Courses
										</div>
										<h3 className='text-xl font-bold mb-2 line-clamp-2'>
											{course.title}
										</h3>
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
					<div className='flex items-center justify-between mb-6'>
						<h2 className='text-2xl md:text-3xl font-bold'>Start Learning</h2>
						<button className='px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition'>
							Book Mentorship
						</button>
					</div>

					{enrolledCourses.slice(0, 1).map((course) => {
						const progress = calculateProgress(course);
						return (
							<div
								key={course._id}
								className='bg-[#0a0a0a] border-t border-gray-800 pt-8 mb-8'>
								<h3 className='text-2xl md:text-3xl font-semibold mb-4'>
									{course.title}
								</h3>
								<div className='mb-6'>
									<div className='flex items-center justify-between mb-2'>
										<span className='text-sm text-gray-400'>
											{progress}% completed
										</span>
									</div>
									<div className='w-full bg-gray-900 rounded-full h-2'>
										<div
											className='h-2 rounded-full bg-gradient-to-r from-red-500 via-purple-500 to-blue-500'
											style={{ width: `${progress}%` }}></div>
									</div>
								</div>
								<Link
									to={`/courses/${course._id}`}
									className='inline-block px-8 py-3 bg-[#1a1a1a] border border-gray-700 text-white rounded-lg font-semibold hover:bg-gray-800 transition'>
									Continue
								</Link>
							</div>
						);
					})}
				</section>

				{/* Course Tabs Section */}
				{featuredCourse && (
					<section className='mb-12'>
						<h2 className='text-2xl font-bold mb-6'>{featuredCourse.title}</h2>
						
						{/* Tabs */}
						<div className='flex flex-wrap gap-3 mb-8'>
							<button
								onClick={() => setSelectedTab("all")}
								className={`px-6 py-2.5 rounded-lg font-semibold transition ${
									selectedTab === "all"
										? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
										: "bg-[#1a1a1a] text-gray-300 hover:bg-gray-800"
								}`}>
								All Courses
							</button>
							<button
								onClick={() => setSelectedTab("completed")}
								className={`px-6 py-2.5 rounded-lg font-semibold transition ${
									selectedTab === "completed"
										? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
										: "bg-[#1a1a1a] text-gray-300 hover:bg-gray-800"
								}`}>
								Completed
							</button>
							<button
								onClick={() => setSelectedTab("in-progress")}
								className={`px-6 py-2.5 rounded-lg font-semibold transition ${
									selectedTab === "in-progress"
										? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
										: "bg-[#1a1a1a] text-gray-300 hover:bg-gray-800"
								}`}>
								In progress
							</button>
							<button
								onClick={() => setSelectedTab("yet-to-start")}
								className={`px-6 py-2.5 rounded-lg font-semibold transition ${
									selectedTab === "yet-to-start"
										? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
										: "bg-[#1a1a1a] text-gray-300 hover:bg-gray-800"
								}`}>
								Yet to start
							</button>
						</div>
					</section>
				)}

				{/* Your Roadmap Section */}
				<section>
					<h2 className='text-2xl md:text-3xl font-bold mb-8'>Your Roadmap</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{filteredCourses.map((course) => {
							const progress = calculateProgress(course);
							const stats = calculateCourseStats(course);
							return (
								<div
									key={course._id}
									className='bg-[#1a1a1a] rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-800 hover:border-purple-500'>
									<div className='relative h-48'>
										{course.thumbnail ? (
											<img
												src={course.thumbnail}
												alt={course.title}
												className='w-full h-full object-cover'
											/>
										) : (
											<div className='w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center'>
												<div className='text-6xl'>📚</div>
											</div>
										)}
										<div className='absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold'>
											{course.level}
										</div>
									</div>
									<div className='p-6'>
										<h3 className='text-xl font-bold mb-2 line-clamp-2'>
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
													className='h-1.5 rounded-full bg-gradient-to-r from-red-500 via-purple-500 to-blue-500'
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
												<span>{stats.totalHours}</span>
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
														d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
													/>
												</svg>
												<span>
													{course.modules?.length || 0} modules
												</span>
											</div>
										</div>
										<Link
											to={`/courses/${course._id}`}
											className='block w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg text-center font-semibold transition'>
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
