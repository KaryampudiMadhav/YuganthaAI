export default function Hero() {
	return (
		<section className='relative bg-gradient-to-r from-[#0a1628] via-[#1a2f4f] to-[#2a4570] text-white py-32 px-6 mt-16'>
			<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFhMmY0ZiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>

			<div className='max-w-6xl mx-auto text-center relative z-10'>
				{/* Top Banner */}
				<div className='mb-8'>
					<div className='inline-block bg-gradient-to-r from-pink-600 to-purple-700 px-6 py-3 rounded-full text-sm'>
						Master GenAI and Agentic AI with our industry-leading
						flagship program
						<button className='ml-4 bg-white text-blue-900 px-4 py-1 rounded-full font-semibold hover:bg-gray-100 transition duration-200'>
							Explore Now
						</button>
					</div>
				</div>

				{/* Main Heading */}
				<h1 className='text-5xl md:text-6xl font-bold mb-6 leading-tight'>
					Master AI Agents, Build
					<br />
					The Future
				</h1>

				{/* Features List */}
				<div className='mb-8 space-y-2 text-lg'>
					<p>• 1:1 Mentorship with Leading AI Experts</p>
					<p>• 150+ Hours of Comprehensive learning</p>
					<p>• 12+ Hands-on Projects on Skill-Building</p>
				</div>

				{/* CTA Button */}
				<button className='bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-full text-lg font-semibold transition duration-200 shadow-lg hover:shadow-xl'>
					Become GenAI Expert
				</button>
			</div>
		</section>
	);
}
