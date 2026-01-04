export default function FreeCourses() {
	const courses = [
		{
			title: "Real World Projects on RAG",
			lessons: "5 Courses",
			rating: 4.5,
			reviews: 88,
			tag: "Free",
			icon: "🎯",
		},
		{
			title: "Real World Projects on AI Agents",
			lessons: "5 Courses",
			rating: 4.7,
			reviews: 69,
			tag: "Free",
			icon: "🤖",
		},
		{
			title: "Building AI agents with Amazon Bedrock AgentCore",
			lessons: "4 Lessons",
			rating: 4.8,
			reviews: 25,
			tag: "Free",
			icon: "⚡",
		},
	];

	return (
		<section className='py-12 md:py-20 px-4 md:px-6 bg-gray-50'>
			<div className='max-w-7xl mx-auto'>
				<h2 className='text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-900'>
					Our Latest Free Courses
				</h2>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
					{courses.map((course, index) => (
						<div
							key={index}
							className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 cursor-pointer'>
							{/* Course Image/Icon */}
							<div className='bg-gradient-to-br from-blue-900 to-indigo-900 h-40 md:h-48 flex items-center justify-center text-5xl md:text-6xl'>
								{course.icon}
							</div>

							{/* Course Content */}
							<div className='p-4 md:p-6'>
								<div className='flex items-center justify-between mb-3'>
									<span className='text-xs md:text-sm text-gray-600'>
										{course.lessons}
									</span>
									<span className='bg-green-100 text-green-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold'>
										{course.tag}
									</span>
								</div>

								<h3 className='text-lg md:text-xl font-bold mb-3 md:mb-4 text-gray-900 min-h-[50px] md:min-h-[60px]'>
									{course.title}
								</h3>

								<div className='flex items-center text-gray-600'>
									<div className='flex text-yellow-400 mr-2'>
										{"★".repeat(Math.floor(course.rating))}
										{"☆".repeat(
											5 - Math.floor(course.rating)
										)}
									</div>
									<span className='text-sm'>
										({course.reviews})
									</span>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Free GenAI Courses Section */}
				<div className='mt-12 md:mt-20'>
					<h2 className='text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-900'>
						Start with our Free GenAI Courses
					</h2>

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
						{[
							{
								title: "Generative AI - A Way of Life",
								lessons: "34 Lessons",
								instructor: "Apoorv Vishnoi",
								role: "Head of Training",
							},
							{
								title: "Getting Started with Large Language Models",
								lessons: "19 Lessons",
								instructor: "Kunal Jain",
								role: "Founder & CEO",
							},
							{
								title: "Building LLM Applications using Prompt Engineering - Free Course",
								lessons: "17 Lessons",
								instructor: "Expert Team",
								role: "AI Specialists",
							},
						].map((course, index) => (
							<div
								key={index}
								className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 cursor-pointer'>
								<div className='bg-gradient-to-br from-gray-900 to-gray-700 h-64 flex items-center justify-center relative'>
									<div className='text-center text-white'>
										<div className='text-5xl mb-4'>👨‍🏫</div>
										<div className='bg-yellow-500 text-black px-4 py-2 rounded-lg inline-block'>
											<p className='font-bold'>
												{course.instructor}
											</p>
											<p className='text-sm'>
												{course.role}
											</p>
										</div>
									</div>
								</div>

								<div className='p-6'>
									<div className='flex items-center justify-between mb-3'>
										<span className='text-sm text-gray-600'>
											{course.lessons}
										</span>
										<span className='bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold'>
											Free
										</span>
									</div>

									<h3 className='text-xl font-bold mb-4 text-gray-900 min-h-[60px]'>
										{course.title}
									</h3>

									<div className='flex text-yellow-400'>
										{"★★★★★"}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
