import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useInstructor } from "../context/InstructorContext";
import VideoUpload from "../components/VideoUpload";

export default function InstructorDashboard() {
	const [courses, setCourses] = useState([]);
	const [showAddModal, setShowAddModal] = useState(false);
	const [editingCourse, setEditingCourse] = useState(null);
	const [showModuleModal, setShowModuleModal] = useState(false);
	const [currentCourseForModule, setCurrentCourseForModule] = useState(null);
	const [mentorshipSessions, setMentorshipSessions] = useState([]);
	const [editingMeetingLink, setEditingMeetingLink] = useState(null);
	const [meetingLinkInput, setMeetingLinkInput] = useState("");
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		instructor: "",
		duration: "",
		level: "Beginner",
		price: "Free",
		thumbnail: "",
		category: "AI & ML",
		videoUrl: "",
		videoPublicId: "",
		modules: [],
	});
	const [moduleData, setModuleData] = useState({
		title: "",
		description: "",
		order: 1,
		videos: [],
	});
	const [videoData, setVideoData] = useState({
		title: "",
		url: "",
		publicId: "",
		duration: "",
		description: "",
		order: 1,
	});
	const [showAddVideoToModule, setShowAddVideoToModule] = useState(false);

	const { instructor, logout, isAuthenticated } = useInstructor();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/instructor", { replace: true });
		}
	}, [isAuthenticated, navigate]);

	useEffect(() => {
		fetchCourses();
		fetchMentorshipSessions();
	}, [instructor]);

	const fetchCourses = async () => {
		try {
			const token = localStorage.getItem("instructorToken");
			if (!token || !instructor) return;

			// Fetch only the logged-in instructor's courses
			const response = await fetch(
				`http://localhost:5000/api/courses/instructor/${instructor._id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const data = await response.json();
			setCourses(data);
		} catch (error) {
			console.error("Error fetching courses:", error);
		}
	};

	const fetchMentorshipSessions = async () => {
		try {
			const token = localStorage.getItem("instructorToken");
			if (!token || !instructor) return;

			const response = await fetch(
				"http://localhost:5000/api/mentorship-sessions/instructor",
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const data = await response.json();
			setMentorshipSessions(data);
		} catch (error) {
			console.error("Error fetching mentorship sessions:", error);
		}
	};

	const handleUpdateMeetingLink = async (sessionId) => {
		try {
			const token = localStorage.getItem("instructorToken");
			const response = await fetch(
				`http://localhost:5000/api/mentorship-sessions/${sessionId}/meeting-link`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ meetingLink: meetingLinkInput }),
				}
			);

			if (response.ok) {
				setEditingMeetingLink(null);
				setMeetingLinkInput("");
				fetchMentorshipSessions(); // Refresh the list
				alert("Meeting link updated successfully!");
			}
		} catch (error) {
			console.error("Error updating meeting link:", error);
			alert("Failed to update meeting link");
		}
	};

	const handleInputChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleModuleInputChange = (e) => {
		setModuleData({
			...moduleData,
			[e.target.name]: e.target.value,
		});
	};

	const handleVideoInputChange = (e) => {
		setVideoData({
			...videoData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const url = editingCourse
				? `http://localhost:5000/api/courses/instructor/${editingCourse._id}`
				: "http://localhost:5000/api/courses/instructor/create";

			const token = localStorage.getItem("instructorToken");

			const response = await fetch(url, {
				method: editingCourse ? "PUT" : "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				setShowAddModal(false);
				setEditingCourse(null);
				resetFormData();
				fetchCourses();
			}
		} catch (error) {
			console.error("Error saving course:", error);
		}
	};

	const resetFormData = () => {
		setFormData({
			title: "",
			description: "",
			instructor: "",
			duration: "",
			level: "Beginner",
			price: "Free",
			thumbnail: "",
			category: "AI & ML",
			videoUrl: "",
			videoPublicId: "",
			modules: [],
		});
	};

	const handleEdit = (course) => {
		setEditingCourse(course);
		setFormData({
			title: course.title,
			description: course.description,
			instructor: course.instructor,
			duration: course.duration,
			level: course.level,
			price: course.price,
			thumbnail: course.thumbnail,
			category: course.category,
			videoUrl: course.videoUrl || "",
			videoPublicId: course.videoPublicId || "",
			modules: course.modules || [],
		});
		setShowAddModal(true);
	};

	const handleDelete = async (courseId) => {
		if (!window.confirm("Are you sure you want to delete this course?")) {
			return;
		}

		try {
			const token = localStorage.getItem("instructorToken");
			const response = await fetch(
				`http://localhost:5000/api/courses/instructor/${courseId}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.ok) {
				fetchCourses();
			}
		} catch (error) {
			console.error("Error deleting course:", error);
		}
	};

	const handleAddModule = () => {
		const newModule = {
			...moduleData,
			order: (formData.modules?.length || 0) + 1,
		};
		setFormData({
			...formData,
			modules: [...(formData.modules || []), newModule],
		});
		setModuleData({
			title: "",
			description: "",
			order: 1,
			videos: [],
		});
		setShowModuleModal(false);
	};

	const handleAddVideoToModule = () => {
		const updatedModules = [...formData.modules];
		const moduleIndex = updatedModules.findIndex(
			(m) => m.order === currentCourseForModule
		);
		if (moduleIndex !== -1) {
			const newVideo = {
				...videoData,
				order: (updatedModules[moduleIndex].videos?.length || 0) + 1,
			};
			updatedModules[moduleIndex].videos = [
				...(updatedModules[moduleIndex].videos || []),
				newVideo,
			];
			setFormData({
				...formData,
				modules: updatedModules,
			});
			setVideoData({
				title: "",
				url: "",
				publicId: "",
				duration: "",
				description: "",
				order: 1,
			});
			setShowAddVideoToModule(false);
			setCurrentCourseForModule(null);
		}
	};

	const handleRemoveModule = (moduleOrder) => {
		setFormData({
			...formData,
			modules: formData.modules.filter((m) => m.order !== moduleOrder),
		});
	};

	const handleRemoveVideoFromModule = (moduleOrder, videoOrder) => {
		const updatedModules = formData.modules.map((module) => {
			if (module.order === moduleOrder) {
				return {
					...module,
					videos: module.videos.filter((v) => v.order !== videoOrder),
				};
			}
			return module;
		});
		setFormData({
			...formData,
			modules: updatedModules,
		});
	};

	const handleLogout = () => {
		logout();
		navigate("/instructor");
	};

	if (!instructor) {
		return null;
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-[#0B0614] via-[#160B2E] to-[#1a0f3a]'>
			{/* Header */}
			<header className='bg-[rgba(22,11,46,0.8)] backdrop-blur-xl border-b border-[rgba(139,92,246,0.2)] text-white px-6 py-5 sticky top-0 z-50 shadow-[0_8px_32px_rgba(139,92,246,0.2)]'>
				<div className='max-w-7xl mx-auto flex items-center justify-between'>
					<div className='flex items-center space-x-6'>
						<Link to='/' className='flex items-center space-x-3 hover:opacity-80 transition duration-300 group'>
							<div className='w-10 h-10 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] rounded-lg flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] transition duration-300'>
								<span className='text-white font-bold text-lg'>Y</span>
							</div>
							<div className='text-xl font-bold tracking-tight'>
								<span className='text-white'>Yugantha</span>
								<span className='bg-gradient-to-r from-[#A855F7] to-[#EC4899] bg-clip-text text-transparent'>AI</span>
							</div>
						</Link>
						<div className='w-px h-6 bg-[rgba(139,92,246,0.2)]'></div>
						<span className='text-sm text-[#C7C3D6] font-medium'>
							Instructor Dashboard
						</span>
					</div>

					<div className='flex items-center space-x-6'>
						<div className='flex items-center space-x-3 px-4 py-2 bg-[rgba(139,92,246,0.1)] rounded-lg border border-[rgba(139,92,246,0.2)] hover:bg-[rgba(139,92,246,0.15)] transition duration-300'>
							<div className='w-9 h-9 bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] rounded-full flex items-center justify-center text-sm font-bold text-white shadow-[0_4px_12px_rgba(139,92,246,0.4)]'>
								{instructor.email.charAt(0).toUpperCase()}
							</div>
							<div className='text-sm font-medium text-[#C7C3D6]'>{instructor.email}</div>
						</div>
						<button
							onClick={handleLogout}
							className='px-5 py-2.5 bg-transparent border border-[#EC4899] text-[#EC4899] hover:bg-[rgba(236,72,153,0.1)] rounded-lg transition duration-300 text-sm font-semibold hover:shadow-[0_0_16px_rgba(236,72,153,0.3)]'>
							Logout
						</button>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<div className='max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12'>
				{/* Stats */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-10'>
					<div className='bg-gradient-to-br from-[rgba(139,92,246,0.15)] to-[rgba(139,92,246,0.05)] border border-[rgba(139,92,246,0.25)] rounded-2xl p-6 text-white hover:shadow-[0_8px_32px_rgba(139,92,246,0.2)] hover:-translate-y-1 transition-all duration-300'>
						<div className='flex items-center justify-between mb-2'>
							<div className='text-3xl font-bold text-transparent bg-gradient-to-r from-[#A855F7] to-[#EC4899] bg-clip-text'>
								{courses.length}
							</div>
							<svg className='w-8 h-8 text-[#A855F7] opacity-50' fill='currentColor' viewBox='0 0 20 20'>
								<path d='M9 2a1 1 0 000 2h2a1 1 0 100-2H9z'/><path fillRule='evenodd' d='M4 5a2 2 0 012-2 1 1 0 010 2H4a1 1 0 010-2zm10 0a1 1 0 010 2h-2a1 1 0 010-2h2zm-8 4a2 2 0 012-2 1 1 0 010 2H6a1 1 0 010-2zm10 0a1 1 0 010 2h-2a1 1 0 010-2h2zm-8 4a2 2 0 012-2 1 1 0 010 2h-2a1 1 0 010-2zm10 0a1 1 0 010 2h-2a1 1 0 010-2h2z' clipRule='evenodd'/>
							</svg>
						</div>
						<div className='text-[#C7C3D6] font-medium'>Total Courses</div>
					</div>
					<div className='bg-gradient-to-br from-[rgba(168,85,247,0.15)] to-[rgba(168,85,247,0.05)] border border-[rgba(168,85,247,0.25)] rounded-2xl p-6 text-white hover:shadow-[0_8px_32px_rgba(168,85,247,0.2)] hover:-translate-y-1 transition-all duration-300'>
						<div className='flex items-center justify-between mb-2'>
							<div className='text-3xl font-bold text-transparent bg-gradient-to-r from-[#A855F7] to-[#D946EF] bg-clip-text'>
								{courses.reduce(
									(sum, course) => sum + (course.modules?.length || 0),
									0
								)}
							</div>
							<svg className='w-8 h-8 text-[#A855F7] opacity-50' fill='currentColor' viewBox='0 0 20 20'>
								<path d='M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM15 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM5 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5z'/>
							</svg>
						</div>
						<div className='text-[#C7C3D6] font-medium'>Total Modules</div>
					</div>
					<div className='bg-gradient-to-br from-[rgba(236,72,153,0.15)] to-[rgba(236,72,153,0.05)] border border-[rgba(236,72,153,0.25)] rounded-2xl p-6 text-white hover:shadow-[0_8px_32px_rgba(236,72,153,0.2)] hover:-translate-y-1 transition-all duration-300'>
						<div className='flex items-center justify-between mb-2'>
							<div className='text-3xl font-bold text-transparent bg-gradient-to-r from-[#EC4899] to-[#D946EF] bg-clip-text'>
								{courses.reduce(
									(sum, course) =>
										sum +
										(course.modules?.reduce(
											(s, m) => s + (m.videos?.length || 0),
											0
										) || 0),
									0
								)}
							</div>
							<svg className='w-8 h-8 text-[#EC4899] opacity-50' fill='currentColor' viewBox='0 0 20 20'>
								<path d='M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm4 2v4h8V8H6z'/>
							</svg>
						</div>
						<div className='text-[#C7C3D6] font-medium'>Total Videos</div>
					</div>
				</div>

				{/* Course Management */}
				<div className='bg-gradient-to-br from-[#12091F] to-[#0B0614] border border-[rgba(139,92,246,0.2)] rounded-2xl p-8 shadow-[0_8px_32px_rgba(139,92,246,0.1)]'>
					<div className='flex items-center justify-between mb-8'>
						<div>
							<h2 className='text-2xl font-bold text-white mb-1'>
								Manage Courses
							</h2>
							<p className='text-[#C7C3D6] text-sm'>Create, edit, and manage your course content</p>
						</div>
						<button
							onClick={() => {
								resetFormData();
								setFormData({
									title: "",
									description: "",
									instructor: instructor?.name || "",
									duration: "",
									level: "Beginner",
									price: "Free",
									thumbnail: "",
									category: "AI & ML",
									videoUrl: "",
									videoPublicId: "",
									modules: [],
								});
								setShowAddModal(true);
							}}
							className='px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#A855F7] hover:to-[#D946EF] text-white rounded-lg transition-all duration-300 font-semibold shadow-[0_4px_16px_rgba(139,92,246,0.3)] hover:shadow-[0_6px_24px_rgba(139,92,246,0.5)] hover:scale-105 active:scale-100 flex items-center space-x-2 group'>
							<svg
								className='w-5 h-5 group-hover:rotate-90 transition-transform duration-300'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2.5}
									d='M12 4v16m8-8H4'
								/>
							</svg>
							<span>Add Course</span>
						</button>
					</div>

					{/* Courses Table */}
					<div className='overflow-x-auto'>
						<table className='w-full text-left text-[#C7C3D6]'>
							<thead className='border-b border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.05)]'>
								<tr>
									<th className='pb-4 px-6 text-white font-semibold text-sm uppercase tracking-wide'>Course</th>
									<th className='pb-4 px-6 text-white font-semibold text-sm uppercase tracking-wide'>Instructor</th>
									<th className='pb-4 px-6 text-white font-semibold text-sm uppercase tracking-wide'>Level</th>
									<th className='pb-4 px-6 text-white font-semibold text-sm uppercase tracking-wide'>Modules</th>
									<th className='pb-4 px-6 text-white font-semibold text-sm uppercase tracking-wide'>Price</th>
									<th className='pb-4 px-6 text-white font-semibold text-sm uppercase tracking-wide'>Actions</th>
								</tr>
							</thead>
							<tbody>
								{courses.map((course) => (
									<tr
										key={course._id}
										className='border-b border-[rgba(139,92,246,0.1)] hover:bg-[rgba(139,92,246,0.05)] transition-colors duration-200'>
										<td className='py-5 px-6'>
											<div className='flex items-center space-x-4'>
												<img
													src={
														course.thumbnail ||
														"https://via.placeholder.com/60"
													}
													alt={course.title}
													className='w-14 h-14 rounded-lg object-cover border border-[rgba(139,92,246,0.2)] shadow-[0_4px_12px_rgba(0,0,0,0.3)]'
												/>
												<div>
													<div className='font-semibold text-white'>
														{course.title}
													</div>
													<div className='text-xs text-[#9A93B5] mt-1'>
														{course.category}
													</div>
												</div>
											</div>
										</td>
										<td className='py-5 px-6 text-[#C7C3D6]'>
											{course.instructor}
										</td>
										<td className='py-4 px-4'>
											<span
												className={`px-2 py-1 rounded-full text-xs ${
													course.level === "Beginner"
														? "bg-green-500/20 text-green-300"
														: course.level ===
														  "Intermediate"
														? "bg-blue-500/20 text-blue-300"
														: "bg-purple-500/20 text-purple-300"
												}`}>
												{course.level}
											</span>
										</td>
										<td className='py-4 px-4 text-gray-300'>
											{course.modules?.length || 0} modules
										</td>
										<td className='py-4 px-4 text-gray-300'>
											{course.price === "Free"
												? "Free"
												: `$${course.price}`}
										</td>
										<td className='py-4 px-4'>
											<div className='flex space-x-2'>
												<button
													onClick={() =>
														handleEdit(course)
													}
													className='p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-200'>
													<svg
														className='w-4 h-4'
														fill='none'
														stroke='currentColor'
														viewBox='0 0 24 24'>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={2}
															d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
														/>
													</svg>
												</button>
												<button
													onClick={() =>
														handleDelete(course._id)
													}
													className='p-2 bg-red-600 hover:bg-red-700 rounded-lg transition duration-200'>
													<svg
														className='w-4 h-4'
														fill='none'
														stroke='currentColor'
														viewBox='0 0 24 24'>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={2}
															d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
														/>
													</svg>
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* Mentorship Sessions Section */}
				<div className='bg-gradient-to-br from-[#12091F] to-[#0B0614] border border-[rgba(139,92,246,0.2)] rounded-2xl p-8 shadow-[0_8px_32px_rgba(139,92,246,0.1)] mt-10'>
					<div className='flex items-center justify-between mb-8'>
						<div>
							<h2 className='text-2xl font-bold text-white mb-1'>
								My Mentorship Sessions
							</h2>
							<p className='text-[#C7C3D6] text-sm'>View and manage your upcoming mentorship sessions</p>
						</div>
					</div>

					{mentorshipSessions.length === 0 ? (
						<div className='text-center py-12'>
							<svg className='w-16 h-16 mx-auto text-[#A855F7] opacity-50 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'/>
							</svg>
							<p className='text-[#C7C3D6] text-lg'>No mentorship sessions yet</p>
							<p className='text-[#9183A8] text-sm mt-2'>Students will book sessions with you from the mentorship page</p>
						</div>
					) : (
						<div className='space-y-4'>
							{mentorshipSessions.map((session) => (
								<div
									key={session._id}
									className='bg-gradient-to-r from-[rgba(139,92,246,0.1)] to-[rgba(168,85,247,0.05)] border border-[rgba(139,92,246,0.2)] rounded-xl p-6 hover:shadow-[0_8px_24px_rgba(139,92,246,0.15)] transition-all duration-300'>
									<div className='grid md:grid-cols-2 gap-6'>
										{/* Session Info */}
										<div>
											<h3 className='text-xl font-bold text-white mb-4'>{session.title}</h3>
											<div className='space-y-3'>
												<div className='flex items-center text-[#C7C3D6]'>
													<svg className='w-5 h-5 mr-3 text-[#A855F7]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
														<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'/>
													</svg>
													<span className='font-medium'>Student: </span>
													<span className='ml-2'>{session.userId?.fullName || 'Unknown'}</span>
												</div>
												<div className='flex items-center text-[#C7C3D6]'>
													<svg className='w-5 h-5 mr-3 text-[#A855F7]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
														<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'/>
													</svg>
													<span className='font-medium'>Date: </span>
													<span className='ml-2'>{session.date}</span>
												</div>
												<div className='flex items-center text-[#C7C3D6]'>
													<svg className='w-5 h-5 mr-3 text-[#A855F7]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
														<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'/>
													</svg>
													<span className='font-medium'>Time: </span>
													<span className='ml-2'>{session.time}</span>
												</div>
												{session.notes && (
													<div className='flex items-start text-[#C7C3D6]'>
														<svg className='w-5 h-5 mr-3 mt-0.5 text-[#A855F7]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
															<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'/>
														</svg>
														<div>
															<span className='font-medium block'>Notes: </span>
															<span className='text-sm'>{session.notes}</span>
														</div>
													</div>
												)}
											</div>
										</div>

										{/* Meeting Link Section */}
										<div className='bg-[rgba(11,6,20,0.6)] rounded-lg p-5 border border-[rgba(139,92,246,0.15)]'>
											<div className='flex items-center justify-between mb-4'>
												<h4 className='text-lg font-semibold text-white flex items-center'>
													<svg className='w-5 h-5 mr-2 text-[#EC4899]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
														<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'/>
													</svg>
													Meeting Link
												</h4>
											</div>

											{editingMeetingLink === session._id ? (
												<div className='space-y-3'>
													<input
														type='url'
														value={meetingLinkInput}
														onChange={(e) => setMeetingLinkInput(e.target.value)}
														placeholder='https://meet.google.com/xxx-xxxx-xxx'
														className='w-full px-4 py-3 bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.3)] rounded-lg text-white placeholder-[#9183A8] focus:outline-none focus:ring-2 focus:ring-[#A855F7] focus:border-transparent transition-all'
													/>
													<div className='flex space-x-2'>
														<button
															onClick={() => handleUpdateMeetingLink(session._id)}
															className='flex-1 px-4 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#A855F7] hover:to-[#D946EF] text-white rounded-lg transition-all duration-300 font-semibold shadow-[0_4px_12px_rgba(139,92,246,0.3)] hover:shadow-[0_6px_16px_rgba(139,92,246,0.4)]'>
															Save
														</button>
														<button
															onClick={() => {
																setEditingMeetingLink(null);
																setMeetingLinkInput("");
															}}
															className='flex-1 px-4 py-2.5 bg-transparent border border-[#EC4899] text-[#EC4899] hover:bg-[rgba(236,72,153,0.1)] rounded-lg transition duration-300 font-semibold'>
															Cancel
														</button>
													</div>
												</div>
											) : (
												<div>
													{session.meetingLink ? (
														<div className='space-y-3'>
															<div className='flex items-center space-x-2 text-[#C7C3D6] bg-[rgba(139,92,246,0.05)] px-4 py-3 rounded-lg border border-[rgba(139,92,246,0.1)]'>
																<svg className='w-4 h-4 text-green-400 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
																	<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'/>
																</svg>
																<span className='text-sm flex-1 truncate font-mono'>{session.meetingLink}</span>
																<a
																	href={session.meetingLink}
																	target='_blank'
																	rel='noopener noreferrer'
																	className='flex-shrink-0 p-1.5 bg-[rgba(139,92,246,0.2)] hover:bg-[rgba(139,92,246,0.3)] rounded transition'>
																	<svg className='w-4 h-4 text-[#A855F7]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
																		<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'/>
																	</svg>
																</a>
															</div>
															<button
																onClick={() => {
																	setEditingMeetingLink(session._id);
																	setMeetingLinkInput(session.meetingLink);
																}}
																className='w-full px-4 py-2 bg-[rgba(139,92,246,0.15)] hover:bg-[rgba(139,92,246,0.25)] text-[#A855F7] rounded-lg transition duration-300 text-sm font-semibold border border-[rgba(139,92,246,0.2)]'>
																Update Link
															</button>
														</div>
													) : (
														<div className='space-y-3'>
															<div className='flex items-center justify-center py-4 text-[#9183A8] border border-dashed border-[rgba(139,92,246,0.2)] rounded-lg'>
																<svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
																	<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'/>
																</svg>
																<span className='text-sm'>No meeting link added yet</span>
															</div>
															<button
																onClick={() => {
																	setEditingMeetingLink(session._id);
																	setMeetingLinkInput("");
																}}
																className='w-full px-4 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:from-[#A855F7] hover:to-[#EC4899] text-white rounded-lg transition-all duration-300 font-semibold shadow-[0_4px_12px_rgba(139,92,246,0.3)] hover:shadow-[0_6px_16px_rgba(139,92,246,0.4)] flex items-center justify-center group'>
																<svg className='w-5 h-5 mr-2 group-hover:scale-110 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
																	<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4'/>
																</svg>
																Add Meeting Link
															</button>
														</div>
													)}
												</div>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Add/Edit Course Modal */}
			{showAddModal && (
				<div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto'>
					<div className='bg-[#1a1a1a] rounded-2xl p-8 max-w-4xl w-full my-8'>
						<div className='flex items-center justify-between mb-6'>
							<h3 className='text-2xl font-bold text-white'>
								{editingCourse
									? "Edit Course"
									: "Add New Course"}
							</h3>
							<button
								onClick={() => {
									setShowAddModal(false);
									setEditingCourse(null);
									resetFormData();
								}}
								className='text-gray-400 hover:text-white'>
								<svg
									className='w-6 h-6'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M6 18L18 6M6 6l12 12'
									/>
								</svg>
							</button>
						</div>

						<form onSubmit={handleSubmit} className='space-y-4'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div>
									<label className='block text-white mb-2 text-sm'>
										Course Title
									</label>
									<input
										type='text'
										name='title'
										value={formData.title}
										onChange={handleInputChange}
										className='w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
										required
									/>
								</div>

								<div>
									<label className='block text-white mb-2 text-sm'>
										Instructor
									</label>
									<input
										type='text'
										name='instructor'
										value={formData.instructor}
										onChange={handleInputChange}
										disabled
										className='w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed focus:outline-none'
										required
									/>
								</div>
							</div>

							<div>
								<label className='block text-white mb-2 text-sm'>
									Description
								</label>
								<textarea
									name='description'
									value={formData.description}
									onChange={handleInputChange}
									className='w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
									rows='3'
									required></textarea>
							</div>

							<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
								<div>
									<label className='block text-white mb-2 text-sm'>
										Duration
									</label>
									<input
										type='text'
										name='duration'
										value={formData.duration}
										onChange={handleInputChange}
										placeholder='e.g., 4 weeks'
										className='w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
										required
									/>
								</div>

								<div>
									<label className='block text-white mb-2 text-sm'>
										Level
									</label>
									<select
										name='level'
										value={formData.level}
										onChange={handleInputChange}
										className='w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500'>
										<option>Beginner</option>
										<option>Intermediate</option>
										<option>Advanced</option>
									</select>
								</div>

								<div>
									<label className='block text-white mb-2 text-sm'>
										Price
									</label>
									<input
										type='text'
										name='price'
										value={formData.price}
										onChange={handleInputChange}
										placeholder='Free or amount'
										className='w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
										required
									/>
								</div>
							</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div>
									<label className='block text-white mb-2 text-sm'>
										Category
									</label>
									<input
										type='text'
										name='category'
										value={formData.category}
										onChange={handleInputChange}
										className='w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
										required
									/>
								</div>

								<div>
									<label className='block text-white mb-2 text-sm'>
										Thumbnail URL
									</label>
									<input
										type='url'
										name='thumbnail'
										value={formData.thumbnail}
										onChange={handleInputChange}
										placeholder='https://example.com/image.jpg'
										className='w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
									/>
								</div>
							</div>

							{/* Modules Section */}
							<div className='border-t border-gray-700 pt-4 mt-6'>
								<div className='flex items-center justify-between mb-4'>
									<h4 className='text-xl font-bold text-white'>
										Course Modules
									</h4>
									<button
										type='button'
										onClick={() => setShowModuleModal(true)}
										className='px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-200 text-sm'>
										+ Add Module
									</button>
								</div>

								{formData.modules && formData.modules.length > 0 ? (
									<div className='space-y-3'>
										{formData.modules.map((module, idx) => (
											<div
												key={idx}
												className='bg-gray-900 rounded-lg p-4'>
												<div className='flex items-start justify-between'>
													<div className='flex-1'>
														<h5 className='text-white font-semibold mb-1'>
															Module {module.order}:{" "}
															{module.title}
														</h5>
														<p className='text-gray-400 text-sm mb-2'>
															{module.description}
														</p>
														<div className='text-blue-400 text-sm'>
															{module.videos?.length || 0}{" "}
															video(s)
														</div>
														{module.videos &&
															module.videos.length > 0 && (
																<div className='mt-2 ml-4 space-y-1'>
																	{module.videos.map(
																		(video, vIdx) => (
																			<div
																				key={vIdx}
																				className='flex items-center justify-between text-sm bg-gray-800 p-2 rounded'>
																				<span className='text-gray-300'>
																					{video.order}.{" "}
																					{video.title}
																				</span>
																				<button
																					type='button'
																					onClick={() =>
																						handleRemoveVideoFromModule(
																							module.order,
																							video.order
																						)
																					}
																					className='text-red-400 hover:text-red-300'>
																					Remove
																				</button>
																			</div>
																		)
																	)}
																</div>
															)}
													</div>
													<div className='flex space-x-2 ml-4'>
														<button
															type='button'
															onClick={() => {
																setCurrentCourseForModule(
																	module.order
																);
																setShowAddVideoToModule(true);
															}}
															className='px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs'>
															+ Video
														</button>
														<button
															type='button'
															onClick={() =>
																handleRemoveModule(
																	module.order
																)
															}
															className='px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs'>
															Remove
														</button>
													</div>
												</div>
											</div>
										))}
									</div>
								) : (
									<div className='text-center py-8 text-gray-400'>
										No modules added yet. Click "Add Module" to
										create one.
									</div>
								)}
							</div>

							<div className='flex space-x-4 pt-4'>
								<button
									type='submit'
									className='flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition duration-200 font-semibold'>
									{editingCourse
										? "Update Course"
										: "Create Course"}
								</button>
								<button
									type='button'
									onClick={() => {
										setShowAddModal(false);
										setEditingCourse(null);
										resetFormData();
									}}
									className='px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition duration-200'>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Add Module Modal */}
			{showModuleModal && (
				<div className='fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4 overflow-y-auto'>
					<div className='bg-[#1a1a1a] rounded-2xl p-8 max-w-2xl w-full my-8'>
						<h3 className='text-2xl font-bold text-white mb-6'>
							Add Module
						</h3>
						<div className='space-y-5'>
							<div>
								<label className='block text-white mb-2 text-sm font-medium'>
									Module Title <span className='text-red-500'>*</span>
								</label>
								<input
									type='text'
									name='title'
									value={moduleData.title}
									onChange={handleModuleInputChange}
									placeholder='e.g., Introduction to Basics'
									className='w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
									required
								/>
							</div>
							<div>
								<label className='block text-white mb-2 text-sm font-medium'>
									Description <span className='text-gray-500'>(Optional)</span>
								</label>
								<textarea
									name='description'
									value={moduleData.description}
									onChange={handleModuleInputChange}
									placeholder='Describe what students will learn in this module...'
									className='w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
									rows='4'></textarea>
								<p className='text-xs text-gray-400 mt-1'>
									Provide a clear description of the module content
								</p>
							</div>

							{/* Optional Video Section */}
							<div className='border-t border-gray-700 pt-6'>
								<h4 className='text-white font-semibold mb-4 text-sm'>
									Add First Video <span className='text-gray-500'>(Optional)</span>
								</h4>
								<div className='space-y-4 bg-gray-800/30 p-4 rounded-lg border border-gray-700'>
									<div>
										<label className='block text-white mb-2 text-sm'>
											Video Title
										</label>
										<input
											type='text'
											placeholder='e.g., Getting Started'
											className='w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
										/>
									</div>
									<div>
										<label className='block text-white mb-2 text-sm'>
											Video Description
										</label>
										<textarea
											placeholder='Describe the video content...'
											className='w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
											rows='2'></textarea>
									</div>
									<p className='text-xs text-gray-400'>
										Note: You can add videos after creating the module as well
									</p>
								</div>
							</div>

							<div className='flex space-x-3 pt-6'>
								<button
									onClick={handleAddModule}
									className='flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition duration-200 font-semibold shadow-lg'>
									Create Module
								</button>
								<button
									onClick={() => {
										setShowModuleModal(false);
										setModuleData({
											title: "",
											description: "",
											order: 1,
											videos: [],
										});
									}}
									className='px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition duration-200 font-semibold'>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Add Video to Module Modal */}
			{showAddVideoToModule && (
				<div className='fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4'>
					<div className='bg-[#1a1a1a] rounded-2xl p-8 max-w-md w-full'>
						<h3 className='text-2xl font-bold text-white mb-6'>
							Add Video to Module
						</h3>
						<div className='space-y-4'>
							<div>
								<label className='block text-white mb-2 text-sm'>
									Video Title
								</label>
								<input
									type='text'
									name='title'
									value={videoData.title}
									onChange={handleVideoInputChange}
									className='w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
									required
								/>
							</div>
							<div>
								<label className='block text-white mb-2 text-sm'>
									Description
								</label>
								<textarea
									name='description'
									value={videoData.description}
									onChange={handleVideoInputChange}
									className='w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
									rows='2'></textarea>
							</div>

							{/* Video Upload */}
							<VideoUpload
								existingVideo={videoData.url}
								onUploadSuccess={(uploadedVideoData) => {
									setVideoData({
										...videoData,
										url: uploadedVideoData.url,
										publicId: uploadedVideoData.publicId,
										duration: uploadedVideoData.duration || "",
									});
								}}
							/>

							<div className='flex space-x-4'>
								<button
									onClick={handleAddVideoToModule}
									disabled={!videoData.url}
									className='flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed'>
									Add Video
								</button>
								<button
									onClick={() => {
										setShowAddVideoToModule(false);
										setCurrentCourseForModule(null);
										setVideoData({
											title: "",
											url: "",
											publicId: "",
											duration: "",
											description: "",
											order: 1,
										});
									}}
									className='px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition duration-200'>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
