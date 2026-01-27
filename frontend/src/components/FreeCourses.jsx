import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

export default function FreeCourses() {
	const [freeCourses, setFreeCourses] = useState([]);
	const [enrolling, setEnrolling] = useState({});
	const [enrolledCourses, setEnrolledCourses] = useState([]);
	const [headerRef, headerVisible] = useScrollAnimation();
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		fetchFreeCourses();
		if (isAuthenticated) {
			fetchEnrolledCourses();
		}
	}, [isAuthenticated]);

	const fetchFreeCourses = async () => {
		try {
			const response = await fetch("http://localhost:5000/api/courses");
			const data = await response.json();
			// Filter for free courses
			const free = data.filter(
				(course) =>
					course.price === "Free" ||
					course.isFree === true ||
					course.price === "0" ||
					course.price === 0
			);
			setFreeCourses(free);
		} catch (error) {
			console.error("Error fetching free courses:", error);
		}
	};

	const fetchEnrolledCourses = async () => {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch("http://localhost:5000/api/users/enrolled", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const data = await response.json();
			
			// Check if response is ok and data is an array
			if (!response.ok || !Array.isArray(data)) {
				console.error("Error fetching enrolled courses:", data);
				setEnrolledCourses([]);
				return;
			}
			
			// Filter out null courseIds and extract valid IDs
			const ids = data
				.filter((item) => item && item.courseId) // Filter out null/undefined items
				.map((item) => item.courseId._id || item.courseId);
			setEnrolledCourses(ids);
		} catch (error) {
			console.error("Error fetching enrolled courses:", error);
			setEnrolledCourses([]);
		}
	};

	const isEnrolled = (courseId) => enrolledCourses.includes(courseId);

	const handleEnroll = async (courseId) => {
		if (!isAuthenticated) {
			navigate("/login");
			return;
		}

		setEnrolling({ ...enrolling, [courseId]: true });

		try {
			const token = localStorage.getItem("token");
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
				setEnrolledCourses([...enrolledCourses, courseId]);
				toast.success("Successfully enrolled in course!");
			} else {
				if (data.message === "Please login") {
					toast.error("Please login to enroll in courses");
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

	const getCourseIcon = (category) => {
		const icons = {
			"AI & ML": "🤖",
			"Data Science": "📊",
			"Web Development": "💻",
			"Mobile Development": "📱",
			Design: "🎨",
			Business: "💼",
		};
		return icons[category] || "📚";
	};

	// Get only the 3 most recently added courses
	const recentCourses = freeCourses.slice(0, 3);

	return (
		<section
			id='free-courses'
			className='py-12 md:py-24 px-4 md:px-6 bg-gradient-to-b from-[#160B2E] via-[#0B0614] to-[#0B0614] relative overflow-hidden'>
			{/* Decorative background elements with animation */}
			<div className='absolute top-0 left-0 w-96 h-96 bg-[#8B5CF6] opacity-5 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 animate-[float_6s_ease-in-out_infinite]'></div>
			<div className='absolute bottom-0 right-0 w-96 h-96 bg-[#EC4899] opacity-5 blur-3xl rounded-full translate-x-1/2 translate-y-1/2 animate-[float_8s_ease-in-out_infinite_2s]'></div>
			
			{/* Animated moving objects */}
			<div className='absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-[#06B6D4] to-[#0891B2] opacity-10 rounded-full blur-2xl animate-[pulse_4s_ease-in-out_infinite]'></div>
			<div className='absolute top-1/3 right-20 w-28 h-28 bg-gradient-to-br from-[#F59E0B] to-[#D97706] opacity-8 rounded-full blur-3xl animate-[float_7s_ease-in-out_infinite]'></div>
			<div className='absolute bottom-1/3 left-1/4 w-24 h-24 bg-gradient-to-br from-[#10B981] to-[#059669] opacity-10 rounded-full blur-2xl animate-[pulse_5s_ease-in-out_infinite_1s]'></div>
			<div className='absolute bottom-20 right-1/4 w-32 h-32 bg-gradient-to-br from-[#EF4444] to-[#DC2626] opacity-8 rounded-full blur-3xl animate-[float_9s_ease-in-out_infinite_3s]'></div>
			<div className='absolute top-1/2 left-1/3 w-16 h-16 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] opacity-12 rounded-full blur-xl animate-[pulse_6s_ease-in-out_infinite_2s]'></div>

			<div className='max-w-7xl mx-auto relative z-10'>
			<div ref={headerRef} className={`mb-10 md:py-16 ${headerVisible ? 'animate-slideInLeft' : 'opacity-0'}`}>
					<div className='flex items-center gap-3 mb-4'>
						<div className='w-1.5 h-10 bg-gradient-to-b from-[#A855F7] to-[#EC4899] rounded-full animate-pulse shadow-[0_0_20px_rgba(139,92,246,0.6)]'></div>
						<p className='text-sm font-semibold text-[#A855F7] uppercase tracking-widest'>Recently Added</p>
					</div>
					<div className='flex flex-col md:flex-row items-start md:items-end justify-between gap-8 md:gap-0'>
						<div className='max-w-2xl'>
							<h2 className='text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white via-[#E0D5FF] to-[#C7C3D6] bg-clip-text text-transparent mb-6 leading-tight'>Start Learning Today</h2>
							<p className='text-lg md:text-xl text-[#B4A7D6] max-w-xl leading-relaxed'>Explore our curated collection of free, industry-leading courses covering AI, machine learning, and cutting-edge technologies from world-class instructors</p>
						</div>
						<button
							onClick={() => navigate('/courses')}
							className='group flex items-center gap-3 bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#EC4899] hover:from-[#A855F7] hover:via-[#B84FDE] hover:to-[#D946EF] text-white px-8 md:px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_8px_32px_rgba(139,92,246,0.4)] hover:shadow-[0_16px_48px_rgba(139,92,246,0.6)] hover:-translate-y-1 active:translate-y-0 whitespace-nowrap'>
							<span>Explore All Courses</span>
							<svg className='w-5 h-5 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M13 7l5 5m0 0l-5 5m5-5H6'/>
							</svg>
						</button>
					</div>
				</div>

				{recentCourses.length === 0 ? (
					<div className='text-center py-12'>
						<p className='text-[#9A93B5] text-lg'>
							No free courses available yet. Check back soon!
						</p>
					</div>
				) : (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
						{recentCourses.map((course, idx) => (
							<div
								key={course._id}
								onClick={() => navigate(`/courses/${course._id}`)}
								className={`bg-[rgba(22,11,46,0.5)] backdrop-blur-xl border border-[rgba(139,92,246,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(139,92,246,0.15)] overflow-hidden hover:shadow-[0_16px_48px_rgba(139,92,246,0.3)] hover:-translate-y-2 transition-all duration-300 cursor-pointer group ${
									idx === 0
										? 'animate-stagger-1'
										: idx === 1
										? 'animate-stagger-2'
										: 'animate-stagger-3'
								}`}>
								{/* Course Image/Icon */}
							<div className='bg-gradient-to-br from-[#8B5CF6]/20 to-[#EC4899]/20 h-40 md:h-48 flex items-center justify-center text-5xl md:text-6xl relative border-b border-[rgba(139,92,246,0.1)]'>
									{course.thumbnail ? (
										<img
											src={course.thumbnail}
											alt={course.title}
											className='w-full h-full object-cover'
										/>
									) : (
										<span>{getCourseIcon(course.category)}</span>
									)}
								</div>

								{/* Course Content */}
								<div className='p-4 md:p-6'>
									<div className='flex items-center justify-between mb-3'>
										<span className='text-xs md:text-sm text-[#9A93B5]'>
											{course.duration || "Self-paced"}
										</span>
										<span className='bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold shadow-[0_2px_12px_rgba(139,92,246,0.4)]'>
											Free
										</span>
									</div>

									<h3 className='text-lg md:text-xl font-bold mb-2 text-white min-h-[50px] md:min-h-[60px] group-hover:text-[#A855F7] transition-colors duration-300'>
										{course.title}
									</h3>

									<p className='text-sm text-[#C7C3D6] mb-3'>
										by {course.instructor}
									</p>

									<div className='flex items-center justify-between mb-4'>
										<div className='flex items-center text-[#C7C3D6]'>
											<div className='flex text-[#EC4899] mr-2'>
												{"★".repeat(
													Math.floor(course.rating || 0)
												)}
												{"☆".repeat(
													5 - Math.floor(course.rating || 0)
												)}
											</div>
											<span className='text-sm'>
												({course.students || 0})
											</span>
										</div>
										<span className='text-xs text-[#9A93B5]'>
											{course.level}
										</span>
									</div>

									<button
										onClick={() => handleEnroll(course._id)}
										disabled={enrolling[course._id] || isEnrolled(course._id)}
										className={`w-full px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
											isEnrolled(course._id)
												? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white cursor-default shadow-[0_4px_20px_rgba(139,92,246,0.4)]'
												: 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#A855F7] hover:to-[#D946EF] disabled:from-[#2A1F4D] disabled:to-[#2A1F4D] text-white shadow-[0_4px_20px_rgba(139,92,246,0.4)] hover:shadow-[0_6px_28px_rgba(139,92,246,0.6)] hover:scale-105'
										}`}> 
										{enrolling[course._id]
											? "Enrolling..."
											: isEnrolled(course._id)
											? "Enrolled ✓"
											: "Enroll Now"}
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
