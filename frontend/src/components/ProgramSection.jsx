export default function ProgramSection() {
	const programs = [
		{
			title: "GenAI Pinnacle Plus Program",
			features: [
				"300+ Hours of Immersive Learning",
				"50+ Industry-Aligned Projects",
				"1:1 Expert Mentorship",
			],
			badge: "Newly Launched",
			gradient: "from-blue-600 to-purple-700",
		},
		{
			title: "Agentic AI Pioneer Program",
			features: [
				"1:1 Mentorship with Leading AI Experts",
				"150+ Hours of Comprehensive learning",
				"12+ Hands-on Projects on Skill-Building",
			],
			gradient: "from-orange-500 to-amber-700",
		},
	];

	return (
		<section className='py-12 md:py-20 px-4 md:px-6 bg-white'>
			<div className='max-w-7xl mx-auto'>
				{programs.map((program, index) => (
					<div
						key={index}
						className={`mb-12 md:mb-16 flex flex-col ${
							index % 2 === 0
								? "md:flex-row"
								: "md:flex-row-reverse"
						} items-center gap-8 md:gap-12`}>
						{/* Image Card */}
						<div className='w-full md:w-1/2 relative'>
							{program.badge && (
								<div className='absolute top-4 left-4 bg-yellow-400 text-black px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-semibold z-10'>
									{program.badge}
								</div>
							)}
							<div
								className={`rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br ${program.gradient} h-64 md:h-80 flex items-center justify-center`}>
								<div className='text-white text-center p-8'>
									<div className='text-4xl md:text-6xl mb-4'>🤖</div>
									<p className='text-lg md:text-xl font-semibold'>
										AI Learning Experience
									</p>
								</div>
							</div>
						</div>

						{/* Content */}
						<div className='w-full md:w-1/2'>
							<h2 className='text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-gray-900'>
								{program.title}
							</h2>
							<ul className='space-y-3 md:space-y-4 mb-6 md:mb-8'>
								{program.features.map((feature, idx) => (
									<li
										key={idx}
										className='flex items-start text-base md:text-lg text-gray-700'>
										<span className='text-green-600 mr-2 md:mr-3 text-lg md:text-xl'>
											•
										</span>
										{feature}
									</li>
								))}
							</ul>
							<button className='bg-red-600 hover:bg-red-700 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold transition duration-200 text-sm md:text-base'>
								Explore AI Agents
							</button>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
