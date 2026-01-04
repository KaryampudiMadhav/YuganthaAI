import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function CourseDetailPage() {
	const { id } = useParams();
	const [course, setCourse] = useState(null);
	const [loading, setLoading] = useState(true);
	const [selectedVideo, setSelectedVideo] = useState(null);
	const [activeModule, setActiveModule] = useState(null);

	useEffect(() => {
		fetchCourse();
	}, [id]);

	const fetchCourse = async () => {
		try {
			const response = await fetch(`http://localhost:5000/api/courses/${id}`);
			const data = await response.json();
			setCourse(data);
			setLoading(false);

			// Set first video as default if modules exist
			if (data.modules && data.modules.length > 0) {
				const firstModule = data.modules[0];
				setActiveModule(0);
				if (firstModule.videos && firstModule.videos.length > 0) {
					setSelectedVideo(firstModule.videos[0]);
				}
			}
		} catch (error) {
			console.error("Error fetching course:", error);
			setLoading(false);
		}
	};

	const handleVideoSelect = (video, moduleIndex) => {
		setSelectedVideo(video);
		setActiveModule(moduleIndex);
	};

	if (loading) {
		return (
			<div className='min-h-screen bg-[#0a0a0a] flex items-center justify-center'>
				<div className='text-white text-xl'>Loading course...</div>
			</div>
		);
	}

	if (!course) {
		return (
			<div className='min-h-screen bg-[#0a0a0a] flex items-center justify-center'>
				<div className='text-white text-xl'>Course not found</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-[#0a0a0a] text-white pt-20'>
			{/* Navigation Breadcrumb */}
			<div className='max-w-7xl mx-auto px-6 py-4'>
				<div className='flex items-center space-x-2 text-sm text-gray-400'>
					<Link to='/' className='hover:text-white'>
						Home
					</Link>
					<span>/</span>
					<Link to='/courses' className='hover:text-white'>
						Courses
					</Link>
					<span>/</span>
					<span className='text-white'>{course.title}</span>
				</div>
			</div>

			{/* Course Header */}
			<div className='bg-gradient-to-r from-blue-900 to-purple-900 py-12'>
				<div className='max-w-7xl mx-auto px-6'>
					<div className='flex items-start justify-between'>
						<div className='flex-1'>
							<div className='mb-4'>
								<span
									className={`px-3 py-1 rounded-full text-sm ${
										course.level === "Beginner"
											? "bg-green-500/20 text-green-300"
											: course.level === "Intermediate"
											? "bg-blue-500/20 text-blue-300"
											: "bg-purple-500/20 text-purple-300"
									}`}>
									{course.level}
								</span>
								<span className='ml-3 px-3 py-1 rounded-full text-sm bg-gray-800'>
									{course.category}
								</span>
							</div>
							<h1 className='text-4xl font-bold mb-4'>{course.title}</h1>
							<p className='text-xl text-gray-200 mb-6'>
								{course.description}
							</p>
							<div className='flex items-center space-x-6 text-sm'>
								<div className='flex items-center space-x-2'>
									<svg
										className='w-5 h-5'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
										/>
									</svg>
									<span>{course.instructor}</span>
								</div>
								<div className='flex items-center space-x-2'>
									<svg
										className='w-5 h-5'
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
								<div className='flex items-center space-x-2'>
									<svg
										className='w-5 h-5'
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
									<span>{course.modules?.length || 0} modules</span>
								</div>
							</div>
						</div>
						<div className='ml-8'>
							{course.thumbnail && (
								<img
									src={course.thumbnail}
									alt={course.title}
									className='w-64 h-40 object-cover rounded-lg shadow-2xl'
								/>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Course Content */}
			<div className='max-w-7xl mx-auto px-6 py-8'>
				{course.modules && course.modules.length > 0 ? (
					<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
						{/* Video Player */}
						<div className='lg:col-span-2'>
							<div className='bg-[#1a1a1a] rounded-xl overflow-hidden'>
								{selectedVideo ? (
									<div>
										<div className='relative bg-black aspect-video'>
											<video
												key={selectedVideo.url}
												controls
												className='w-full h-full'
												src={selectedVideo.url}>
												Your browser does not support the video tag.
											</video>
										</div>
										<div className='p-6'>
											<h2 className='text-2xl font-bold mb-2'>
												{selectedVideo.title}
											</h2>
											{selectedVideo.description && (
												<p className='text-gray-400 mb-4'>
													{selectedVideo.description}
												</p>
											)}
											{selectedVideo.duration && (
												<div className='text-sm text-gray-500'>
													Duration: {selectedVideo.duration}
												</div>
											)}
										</div>
									</div>
								) : (
									<div className='aspect-video bg-gray-900 flex items-center justify-center'>
										<div className='text-center'>
											<svg
												className='w-20 h-20 mx-auto mb-4 text-gray-600'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z'
												/>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
												/>
											</svg>
											<p className='text-gray-500'>
												Select a video from the modules to start
												learning
											</p>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Modules Sidebar */}
						<div className='lg:col-span-1'>
							<div className='bg-[#1a1a1a] rounded-xl p-6'>
								<h3 className='text-xl font-bold mb-4'>
									Course Content
								</h3>
								<div className='space-y-4'>
									{course.modules
										.sort((a, b) => a.order - b.order)
										.map((module, moduleIndex) => (
											<div
												key={moduleIndex}
												className='border border-gray-700 rounded-lg overflow-hidden'>
												<button
													onClick={() =>
														setActiveModule(
															activeModule === moduleIndex
																? null
																: moduleIndex
														)
													}
													className='w-full px-4 py-3 bg-gray-800 hover:bg-gray-750 flex items-center justify-between transition'>
													<div className='text-left'>
														<div className='font-semibold'>
															Module {module.order}:{" "}
															{module.title}
														</div>
														<div className='text-xs text-gray-400 mt-1'>
															{module.videos?.length || 0}{" "}
															video(s)
														</div>
													</div>
													<svg
														className={`w-5 h-5 transition-transform ${
															activeModule === moduleIndex
																? "rotate-180"
																: ""
														}`}
														fill='none'
														stroke='currentColor'
														viewBox='0 0 24 24'>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={2}
															d='M19 9l-7 7-7-7'
														/>
													</svg>
												</button>
												{activeModule === moduleIndex &&
													module.videos &&
													module.videos.length > 0 && (
														<div className='bg-gray-900'>
															{module.videos
																.sort(
																	(a, b) =>
																		a.order - b.order
																)
																.map((video, videoIndex) => (
																	<button
																		key={videoIndex}
																		onClick={() =>
																			handleVideoSelect(
																				video,
																				moduleIndex
																			)
																		}
																		className={`w-full px-4 py-3 text-left hover:bg-gray-800 transition border-l-4 ${
																			selectedVideo?.url ===
																			video.url
																				? "border-blue-500 bg-gray-800"
																				: "border-transparent"
																		}`}>
																		<div className='flex items-start space-x-3'>
																			<svg
																				className='w-5 h-5 mt-0.5 flex-shrink-0 text-blue-400'
																				fill='none'
																				stroke='currentColor'
																				viewBox='0 0 24 24'>
																				<path
																					strokeLinecap='round'
																					strokeLinejoin='round'
																					strokeWidth={
																						2
																					}
																					d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z'
																				/>
																				<path
																					strokeLinecap='round'
																					strokeLinejoin='round'
																					strokeWidth={
																						2
																					}
																					d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
																				/>
																			</svg>
																			<div className='flex-1'>
																				<div className='text-sm font-medium'>
																					{
																						video.title
																					}
																				</div>
																				{video.duration && (
																					<div className='text-xs text-gray-400 mt-1'>
																						{
																							video.duration
																						}
																					</div>
																				)}
																			</div>
																		</div>
																	</button>
																))}
														</div>
													)}
											</div>
										))}
								</div>
							</div>
						</div>
					</div>
				) : (
					<div className='bg-[#1a1a1a] rounded-xl p-12 text-center'>
						<svg
							className='w-20 h-20 mx-auto mb-4 text-gray-600'
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
						<h3 className='text-xl font-bold mb-2'>No Content Yet</h3>
						<p className='text-gray-400'>
							This course doesn't have any modules or videos yet. Check
							back later!
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
