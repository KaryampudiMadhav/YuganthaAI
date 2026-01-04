import { useState, useEffect } from "react";

export default function CoursesPage() {
	const [selectedTab, setSelectedTab] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");

	// Sample course data
	const courses = [
		{
			id: 1,
			title: "Introduction to Machine Learning",
			instructor: "John Doe",
			rating: 4.5,
			students: 15000,
			image: "https://via.placeholder.com/300x200/4A5568/ffffff?text=ML+Course",
		},
		{
			id: 2,
			title: "Deep Learning Fundamentals",
			instructor: "Jane Smith",
			rating: 4.7,
			students: 12000,
			image: "https://via.placeholder.com/300x200/4A5568/ffffff?text=DL+Course",
		},
		{
			id: 3,
			title: "Natural Language Processing",
			instructor: "Mike Johnson",
			rating: 4.6,
			students: 10000,
			image: "https://via.placeholder.com/300x200/4A5568/ffffff?text=NLP+Course",
		},
	];

	// Animated images for the slider
	const sliderImages = [
		"https://images.unsplash.com/photo-1551434678-e076c223a692?w=400",
		"https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400",
		"https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400",
		"https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400",
		"https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400",
	];

	return (
		<div className='min-h-screen bg-[#1a1a1a] text-white pt-20'>
			{/* Hero Section */}
			<section className='px-6 py-16 relative overflow-hidden'>
				<div className='max-w-7xl mx-auto'>
					<div className='flex flex-col lg:flex-row items-center justify-between gap-12'>
						{/* Left Content */}
						<div className='flex-1'>
							<h1 className='text-6xl font-bold mb-6'>
								<span className='text-red-500'>Free </span>
								<span className='bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent'>
									Courses
								</span>
							</h1>

							<p className='text-gray-300 text-lg mb-12 max-w-xl'>
								Kickstart your AI career with free foundational
								tracks and skill-specific short courses, all
								taught by leading experts in the field.
							</p>

							{/* Statistics */}
							<div className='flex flex-wrap gap-12 mb-12'>
								<div>
									<div className='text-4xl font-bold mb-2'>
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
						<div className='flex-1 relative h-[500px] w-full max-w-lg'>
							<ImageSlider images={sliderImages} />
						</div>
					</div>
				</div>
			</section>

			{/* Search and Filters Section */}
			<section className='px-6 py-8 border-t border-gray-800'>
				<div className='max-w-7xl mx-auto'>
					{/* Search Bar */}
					<div className='mb-6'>
						<div className='relative max-w-md'>
							<input
								type='text'
								placeholder='Search Course'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className='w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500'
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
					<div className='flex space-x-8 mb-8 border-b border-gray-800'>
						<button
							onClick={() => setSelectedTab("all")}
							className={`pb-3 px-2 font-medium transition ${
								selectedTab === "all"
									? "text-white border-b-2 border-white"
									: "text-gray-400 hover:text-gray-300"
							}`}>
							All
						</button>
						<button
							onClick={() => setSelectedTab("courses")}
							className={`pb-3 px-2 font-medium transition ${
								selectedTab === "courses"
									? "text-white border-b-2 border-white"
									: "text-gray-400 hover:text-gray-300"
							}`}>
							Courses
						</button>
						<button
							onClick={() => setSelectedTab("learning-path")}
							className={`pb-3 px-2 font-medium transition ${
								selectedTab === "learning-path"
									? "text-white border-b-2 border-white"
									: "text-gray-400 hover:text-gray-300"
							}`}>
							Learning Path
						</button>
					</div>

					{/* Courses Grid with Sidebar */}
					<div className='flex gap-8'>
						{/* Sidebar Filters */}
						<aside className='w-64 flex-shrink-0'>
							<div className='bg-gray-900 rounded-lg p-6'>
								<div className='flex justify-between items-center mb-6'>
									<h3 className='font-semibold text-lg'>
										All Filters
									</h3>
									<button className='text-blue-400 text-sm hover:text-blue-300'>
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
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
								{courses.map((course) => (
									<div
										key={course.id}
										className='bg-gray-900 rounded-lg overflow-hidden hover:shadow-2xl transition cursor-pointer group'>
										<div className='relative h-48 bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center overflow-hidden'>
											<div className='absolute top-4 right-4 bg-white text-gray-900 px-3 py-1 rounded-full text-xs font-semibold'>
												Merosphere
											</div>
											<div className='text-6xl group-hover:scale-110 transition-transform duration-300'>
												👨‍💼
											</div>
										</div>
										<div className='p-6'>
											<h3 className='font-bold text-lg mb-2 line-clamp-2'>
												{course.title}
											</h3>
											<p className='text-gray-400 text-sm mb-4'>
												by {course.instructor}
											</p>
											<div className='flex items-center justify-between'>
												<div className='flex items-center space-x-1'>
													<span className='text-yellow-400'>
														★
													</span>
													<span className='text-sm'>
														{course.rating}
													</span>
												</div>
												<div className='text-sm text-gray-400'>
													{course.students.toLocaleString()}{" "}
													students
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
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
