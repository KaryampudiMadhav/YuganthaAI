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
	}, []);

	const fetchCourses = async () => {
		try {
			const response = await fetch("http://localhost:5000/api/courses");
			const data = await response.json();
			setCourses(data);
		} catch (error) {
			console.error("Error fetching courses:", error);
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
				? `http://localhost:5000/api/courses/${editingCourse._id}`
				: "http://localhost:5000/api/courses";

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
				`http://localhost:5000/api/courses/${courseId}`,
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
							onClick={() => setShowAddModal(true)}
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
										className='w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
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
				<div className='fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4'>
					<div className='bg-[#1a1a1a] rounded-2xl p-8 max-w-md w-full'>
						<h3 className='text-2xl font-bold text-white mb-6'>
							Add Module
						</h3>
						<div className='space-y-4'>
							<div>
								<label className='block text-white mb-2 text-sm'>
									Module Title
								</label>
								<input
									type='text'
									name='title'
									value={moduleData.title}
									onChange={handleModuleInputChange}
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
									value={moduleData.description}
									onChange={handleModuleInputChange}
									className='w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
									rows='3'></textarea>
							</div>
							<div className='flex space-x-4'>
								<button
									onClick={handleAddModule}
									className='flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-200 font-semibold'>
									Add Module
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
									className='px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition duration-200'>
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
