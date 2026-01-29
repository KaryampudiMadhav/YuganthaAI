import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function CoursesPage() {
	const [selectedTab, setSelectedTab] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [courses, setCourses] = useState([]);
	const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
	const [loading, setLoading] = useState(true);
	const [enrolling, setEnrolling] = useState({});
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		fetchCourses();
		if (isAuthenticated) {
			fetchEnrolledCourses();
		}
	}, [isAuthenticated]);

	const fetchCourses = async () => {
		try {
			const response = await fetch("http://localhost:5000/api/courses");
			const data = await response.json();
			setCourses(data);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching courses:", error);
			setLoading(false);
		}
	};

	const fetchEnrolledCourses = async () => {
		try {
			const token = localStorage.getItem("token");
			if (!token) return;

			const response = await fetch("http://localhost:5000/api/users/enrolled", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.status === 401) {
				return; // Token expired, user needs to login
			}

			if (response.ok) {
				const data = await response.json();
				// Extract course IDs from enrolled courses
				const enrolledIds = data.map((enrollment) => enrollment.courseId?._id || enrollment._id);
				setEnrolledCourseIds(enrolledIds);
			}
		} catch (error) {
			console.error("Error fetching enrolled courses:", error);
		}
	};

	const handleEnroll = async (courseId) => {
		if (!isAuthenticated) {
			toast.error("Please login to enroll in courses");
			navigate("/login");
			return;
		}

		const token = localStorage.getItem("token");
		if (!token) {
			toast.error("Please login to enroll in courses");
			navigate("/login");
			return;
		}

		setEnrolling({ ...enrolling, [courseId]: true });

		try {
			const response = await fetch(
				`http://localhost:5000/api/users/enroll/${courseId}`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);

			const data = await response.json();

			if (response.ok) {
				toast.success("Successfully enrolled in course!");
				// Update enrolled courses list
				setEnrolledCourseIds([...enrolledCourseIds, courseId]);
				setTimeout(() => navigate("/my-learning"), 1000);
			} else {
				if (response.status === 401 || data.message === "Please login") {
					toast.error("Session expired. Please login again");
					localStorage.removeItem("token");
					localStorage.removeItem("user");
					setTimeout(() => navigate("/login"), 1500);
				} else {
					toast.error(data.message || "Enrollment failed");
				}
			}
		} catch (error) {
			console.error("Error enrolling:", error);
			toast.error("Error enrolling in course");
		} finally {
			setEnrolling({ ...enrolling, [courseId]: false });
		}
	};

	// Filter courses based on search query
	const filteredCourses = courses.filter((course) =>
		course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
		course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
		course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Animated images for the slider
	const sliderImages = [
		"https://images.unsplash.com/photo-1551434678-e076c223a692?w=400",
		"https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400",
		"https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400",
		"https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400",
		"https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400",
	];

	return (
		<div className='min-h-screen bg-gradient-to-br from-[#0B0614] via-[#160B2E] to-[#1a0f3a] text-white pt-20'>
			{/* Hero Section */}
		<section className='px-4 md:px-6 py-12 md:py-16 relative overflow-hidden'>
			<div className='max-w-7xl mx-auto'>
				<div className='flex flex-col lg:flex-row items-center justify-between gap-12'>
					{/* Left Content */}
					<div className='flex-1'>
						<h1 className='text-4xl md:text-6xl font-bold mb-6'>
								<span className='text-[#EC4899]'>Free </span>
								<span className='bg-gradient-to-r from-[#A855F7] via-[#EC4899] to-[#D946EF] bg-clip-text text-transparent'>
									Courses
								</span>
							</h1>

							<p className='text-gray-300 text-lg mb-12 max-w-xl'>
								Kickstart your AI career with free foundational
								tracks and skill-specific short courses, all
								taught by leading experts in the field.
							</p>

							{/* Statistics */}
						<div className='flex flex-wrap gap-6 md:gap-12 mb-12'>
							<div>
								<div className='text-3xl md:text-4xl font-bold mb-2'>
										1.3M+
									</div>
									<div className='text-gray-400'>
										Enrollments
									</div>
								</div>
								<div>
									<div className='text-4xl font-bold mb-2'>
										4.5+
									</div>
									<div className='text-gray-400'>
										Average Rating
									</div>
								</div>
								<div>
									<div className='text-4xl font-bold mb-2'>
										120+
									</div>
									<div className='text-gray-400'>Courses</div>
								</div>
							</div>
						</div>

						{/* Right Side - Animated Image Grid */}
					<div className='flex-1 relative h-[300px] md:h-[500px] w-full max-w-lg'>
							<ImageSlider images={sliderImages} />
						</div>
					</div>
				</div>
			</section>

			{/* Search and Filters Section */}
		<section className='px-4 md:px-6 py-8 border-t border-gray-800'>
				<div className='max-w-7xl mx-auto'>
					{/* Search Bar */}
					<div className='mb-6'>
						<div className='relative max-w-md'>
							<input
								type='text'
								placeholder='Search Course'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className='w-full bg-[#0B0614] border border-[rgba(139,92,246,0.3)] rounded-lg px-4 py-3 pl-10 text-white placeholder-[#9A93B5] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6] transition duration-300'
							/>
							<svg
								className='absolute left-3 top-3.5 w-5 h-5 text-gray-500'
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
					</div>

					{/* Tabs */}
				<div className='flex flex-wrap space-x-4 md:space-x-8 mb-8 border-b border-[rgba(139,92,246,0.2)]'>
						<button
							onClick={() => setSelectedTab("all")}
							className={`pb-3 px-2 font-medium transition ${
								selectedTab === "all"
									? "text-white border-b-2 border-[#8B5CF6]"
									: "text-[#C7C3D6] hover:text-white"
							}`}>
							All
						</button>
						<button
							onClick={() => setSelectedTab("courses")}
							className={`pb-3 px-2 font-medium transition ${
								selectedTab === "courses"
									? "text-white border-b-2 border-[#8B5CF6]"
									: "text-[#C7C3D6] hover:text-white"
							}`}>
							Courses
						</button>
						<button
							onClick={() => setSelectedTab("learning-path")}
							className={`pb-3 px-2 font-medium transition ${
								selectedTab === "learning-path"
									? "text-white border-b-2 border-[#8B5CF6]"
									: "text-[#C7C3D6] hover:text-white"
							}`}>
							Learning Path
						</button>
					</div>

					{/* Courses Grid with Sidebar */}
				<div className='flex flex-col lg:flex-row gap-8'>
					{/* Sidebar Filters */}
					<aside className='lg:w-64 flex-shrink-0'>
						<div className='bg-[rgba(18,9,31,0.6)] backdrop-blur-xl border border-[rgba(139,92,246,0.2)] rounded-lg p-4 md:p-6'>
								<div className='flex justify-between items-center mb-6'>
									<h3 className='font-semibold text-lg'>
										All Filters
									</h3>
									<button className='text-[#A855F7] text-sm hover:text-[#EC4899] transition duration-300'>
										Clear All
									</button>
								</div>

								<div className='mb-6'>
									<h4 className='font-medium mb-3'>
										Sort By
									</h4>
									<div className='space-y-2'>
										<label className='flex items-center'>
											<input
												type='radio'
												name='sort'
												className='mr-2'
												defaultChecked
											/>
											<span className='text-sm'>All</span>
										</label>
										<label className='flex items-center'>
											<input
												type='radio'
												name='sort'
												className='mr-2'
											/>
											<span className='text-sm'>
												Most Popular
											</span>
										</label>
										<label className='flex items-center'>
											<input
												type='radio'
												name='sort'
												className='mr-2'
											/>
											<span className='text-sm'>
												Highest Rated
											</span>
										</label>
									</div>
								</div>
							</div>
						</aside>

						{/* Courses Grid */}
						<div className='flex-1'>
							{loading ? (
								<div className='text-center py-12'>
									<div className='text-white text-lg'>Loading courses...</div>
								</div>
							) : filteredCourses.length === 0 ? (
								<div className='text-center py-12'>
									<div className='text-white text-lg'>No courses found</div>
								</div>
							) : (
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
									{filteredCourses.map((course) => (
										<div
											key={course._id}
											className='bg-gradient-to-br from-[rgba(18,9,31,0.8)] to-[rgba(11,6,20,0.8)] border border-[rgba(139,92,246,0.2)] rounded-lg overflow-hidden hover:shadow-[0_8px_32px_rgba(139,92,246,0.3)] hover:border-[rgba(139,92,246,0.4)] transition-all duration-300 group'>
											{/* Video/Thumbnail Section */}
											<div className='relative h-48 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900'>
												{course.videoUrl ? (
													<video
														className='w-full h-full object-cover'
														muted
														loop
														playsInline
														onMouseEnter={(e) => e.target.play()}
														onMouseLeave={(e) => {
															e.target.pause();
															e.target.currentTime = 0;
														}}>
														<source src={course.videoUrl} type='video/mp4' />
													</video>
												) : course.thumbnail ? (
													<img
														src={course.thumbnail}
														alt={course.title}
														className='w-full h-full object-cover'
													/>
												) : (
													<div className='w-full h-full flex items-center justify-center text-6xl'>
														📚
													</div>
												)}
												{/* Duration Badge */}
												<div className='absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs'>
													{course.duration || "Self-paced"}
												</div>
											</div>

											{/* Course Info */}
											<div className='p-5'>
												{/* Duration and Lessons */}
												<div className='flex items-center gap-4 text-gray-400 text-sm mb-3'>
													<span>{course.duration || "Self-paced"}</span>
													<span>•</span>
													<span>{course.modules?.length || course.lessons || 0} Lessons</span>
												</div>

												{/* Title */}
												<h3 className='font-bold text-lg mb-3 text-white line-clamp-2 min-h-[3.5rem]'>
													{course.title}
												</h3>

												{/* Rating and Students */}
												<div className='flex items-center justify-between mb-4'>
													<div className='flex items-center gap-2 text-sm'>
														<span className='text-gray-400'>👤</span>
														<span className='text-gray-300'>{course.students || 0}</span>
													</div>
													<div className='flex items-center gap-1'>
														<span className='text-yellow-400'>★</span>
														<span className='text-gray-300 text-sm'>
															{course.rating ? course.rating.toFixed(1) : '0.0'}
														</span>
													</div>
												</div>

												{/* Enroll Button */}
												<button
												onClick={() => !enrolledCourseIds.includes(course._id) && handleEnroll(course._id)}
												disabled={enrolling[course._id] || enrolledCourseIds.includes(course._id)}
										className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${
											enrolledCourseIds.includes(course._id)
												? 'bg-green-600 cursor-default'
												: 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#A855F7] hover:to-[#D946EF] disabled:opacity-50'
										} text-white shadow-[0_4px_16px_rgba(139,92,246,0.3)] hover:shadow-[0_6px_24px_rgba(139,92,246,0.5)]`}>
												{enrolledCourseIds.includes(course._id) 
													? "✓ Enrolled" 
													: enrolling[course._id] 
														? "Enrolling..." 
														: course.price === "Free" 
															? "Enroll for Free" 
															: `Enroll for $${course.price}`}
												</button>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

// Image Slider Component with Animation
function ImageSlider({ images }) {
	const [positions, setPositions] = useState(() =>
		images.map((_, index) => ({
			x: Math.random() * 60,
			y: Math.random() * 60,
			rotation: Math.random() * 20 - 10,
			scale: 0.8 + Math.random() * 0.4,
			delay: index * 0.2,
		}))
	);

	useEffect(() => {
		// Animate positions
		const interval = setInterval(() => {
			setPositions((prev) =>
				prev.map((pos) => ({
					...pos,
					x: Math.random() * 60,
					y: Math.random() * 60,
					rotation: Math.random() * 20 - 10,
				}))
			);
		}, 3000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className='relative w-full h-full'>
			{images.map((img, index) => (
				<div
					key={index}
					className='absolute w-48 h-32 rounded-lg overflow-hidden shadow-2xl transition-all duration-1000 ease-in-out'
					style={{
						left: `${positions[index]?.x || 0}%`,
						top: `${positions[index]?.y || 0}%`,
						transform: `rotate(${
							positions[index]?.rotation || 0
						}deg) scale(${positions[index]?.scale || 1})`,
						transitionDelay: `${positions[index]?.delay || 0}s`,
						zIndex: index,
					}}>
					<img
						src={img}
						alt={`Course ${index + 1}`}
						className='w-full h-full object-cover'
					/>
				</div>
			))}
		</div>
	);
}
