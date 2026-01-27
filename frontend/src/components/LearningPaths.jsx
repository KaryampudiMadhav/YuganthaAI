import { useNavigate } from "react-router-dom";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

export default function LearningPaths() {
	const navigate = useNavigate();
	const [contentRef, contentVisible] = useScrollAnimation();
	const [imageRef, imageVisible] = useScrollAnimation();

	return (
		<section className='py-12 md:py-24 px-4 md:px-6 bg-gradient-to-b from-[#0B0614] to-[#160B2E] relative overflow-hidden'>
			<div className='absolute inset-0 opacity-20'>
				<div className='absolute top-32 right-10 w-72 h-72 bg-[#8B5CF6] rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]'></div>
				<div className='absolute bottom-10 left-20 w-80 h-80 bg-[#EC4899] rounded-full blur-3xl animate-[float_7s_ease-in-out_infinite_2s]'></div>
			</div>

			{/* Additional animated elements with different colors */}
			<div className='absolute top-1/4 left-1/3 w-40 h-40 bg-gradient-to-br from-[#06B6D4] to-[#0891B2] opacity-8 rounded-full blur-3xl animate-[pulse_5s_ease-in-out_infinite]'></div>
			<div className='absolute bottom-1/4 right-1/3 w-32 h-32 bg-gradient-to-br from-[#F59E0B] to-[#D97706] opacity-10 rounded-full blur-2xl animate-[float_9s_ease-in-out_infinite_1s]'></div>
			<div className='absolute top-1/3 right-1/4 w-28 h-28 bg-gradient-to-br from-[#10B981] to-[#059669] opacity-10 rounded-full blur-2xl animate-[pulse_6s_ease-in-out_infinite_2s]'></div>

			<div className='max-w-6xl mx-auto relative z-10'>
				<div className='flex flex-col md:flex-row items-center gap-8 md:gap-12'>
					{/* Content */}
					<div ref={contentRef} className={`w-full md:w-1/2 ${contentVisible ? 'animate-slideInLeft' : 'opacity-0'}`}>
						<div className='flex items-center gap-3 mb-4'>
							<div className='w-1 h-8 bg-gradient-to-b from-[#8B5CF6] to-[#EC4899] rounded-full animate-pulse'></div>
							<p className='text-sm font-semibold text-[#A855F7] uppercase tracking-wider'>Learning Paths</p>
						</div>
						<h2 className='text-4xl md:text-5xl font-bold mb-4 md:mb-5 bg-gradient-to-r from-white via-[#C7C3D6] to-[#9A93B5] bg-clip-text text-transparent'>
							Comprehensive Learning Paths from Industry Experts
						</h2>
						<p className='text-base md:text-lg mb-6 md:mb-7 text-[#C7C3D6] leading-relaxed'>
							Explore our comprehensive, FREE learning paths designed by industry mentors. Master AI, machine learning, and deep learning through structured curricula that combines theory with hands-on projects.
						</p>
						<button 
						onClick={() => navigate('/courses')}
						className='bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#A855F7] hover:to-[#D946EF] text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-[0_4px_24px_rgba(139,92,246,0.4)] hover:shadow-[0_8px_40px_rgba(139,92,246,0.6)] hover:-translate-y-1'>
							Get Started for FREE
						</button>
					</div>

					{/* Image */}
				<div ref={imageRef} className={`w-full md:w-1/2 ${imageVisible ? 'animate-slideInRight' : 'opacity-0'}`}>
						<div className='bg-[rgba(22,11,46,0.4)] backdrop-blur-xl border border-[rgba(139,92,246,0.3)] rounded-3xl p-8 md:p-10 shadow-[0_8px_32px_rgba(139,92,246,0.2)] hover:shadow-[0_16px_48px_rgba(139,92,246,0.3)] transition-all duration-300 animate-float'>
							<div className='text-center'>
								<div className='text-7xl md:text-8xl mb-6'>📚</div>
								<p className='text-2xl md:text-3xl font-bold text-white mb-3'>
									Expert-Curated Paths
								</p>
								<p className='text-[#9A93B5] text-base md:text-lg'>
									Industry-validated curriculum designed for modern learners
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
