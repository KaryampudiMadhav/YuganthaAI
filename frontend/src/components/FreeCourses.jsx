import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function FreeCourses() {
	const [freeCourses, setFreeCourses] = useState([]);
	const [enrolling, setEnrolling] = useState({});
	const [enrolledCourses, setEnrolledCourses] = useState([]);
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

	return (
		<section
			id='free-courses'
			className='py-12 md:py-20 px-4 md:px-6 bg-gray-50'>
			<div className='max-w-7xl mx-auto'>
				<h2 className='text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-900'>
					Our Latest Free Courses
				</h2>

				{freeCourses.length === 0 ? (
					<div className='text-center py-12'>
						<p className='text-gray-500 text-lg'>
							No free courses available yet. Check back soon!
						</p>
					</div>
				) : (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
						{freeCourses.map((course) => (
							<div
								key={course._id}
								className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300'>
								{/* Course Image/Icon */}
								<div className='bg-gradient-to-br from-blue-900 to-indigo-900 h-40 md:h-48 flex items-center justify-center text-5xl md:text-6xl relative'>
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
										<span className='text-xs md:text-sm text-gray-600'>
											{course.duration || "Self-paced"}
										</span>
										<span className='bg-green-100 text-green-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold'>
											Free
										</span>
									</div>

									<h3 className='text-lg md:text-xl font-bold mb-2 text-gray-900 min-h-[50px] md:min-h-[60px]'>
										{course.title}
									</h3>

									<p className='text-sm text-gray-600 mb-3'>
										by {course.instructor}
									</p>

									<div className='flex items-center justify-between mb-4'>
										<div className='flex items-center text-gray-600'>
											<div className='flex text-yellow-400 mr-2'>
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
										<span className='text-xs text-gray-500'>
											{course.level}
										</span>
									</div>

									<button
										onClick={() => handleEnroll(course._id)}
										disabled={enrolling[course._id] || isEnrolled(course._id)}
										className={`w-full px-4 py-2 rounded-lg font-semibold transition duration-200 ${
											isEnrolled(course._id)
												? 'bg-green-600 text-white cursor-default'
												: 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white'
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
