export default function LearningPaths() {
	return (
		<section className='py-20 px-6 bg-gradient-to-r from-gray-400 to-gray-500 text-gray-900 relative overflow-hidden'>
			<div className='absolute inset-0 opacity-10'>
				<div className='absolute top-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl'></div>
				<div className='absolute bottom-20 left-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl'></div>
			</div>

			<div className='max-w-6xl mx-auto relative z-10'>
				<div className='flex flex-col md:flex-row items-center gap-12'>
					{/* Content */}
					<div className='w-full md:w-1/2'>
						<h2 className='text-5xl font-bold mb-6 text-white'>
							Comprehensive Learning Paths from Industry Experts
						</h2>
						<p className='text-xl mb-8 text-gray-100'>
							Check out our FREE and Comprehensive learning paths
							to start your machine learning and deep learning
							journey today. These paths have been created after
							taking inputs from industry mentors.
						</p>
						<button className='bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition duration-200 shadow-lg'>
							Get Started for FREE
						</button>
					</div>

					{/* Image */}
					<div className='w-full md:w-1/2'>
						<div className='bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 shadow-2xl'>
							<div className='text-center text-white'>
								<div className='text-8xl mb-6'>📚</div>
								<p className='text-2xl font-semibold'>
									Expert-Curated Learning Paths
								</p>
								<p className='text-lg mt-4 text-blue-200'>
									Industry-validated curriculum
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
