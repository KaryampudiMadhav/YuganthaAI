import { useNavigate } from "react-router-dom";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

export default function FreeCourses() {
	const [headerRef, headerVisible] = useScrollAnimation();
	const navigate = useNavigate();

	// Static course data
	const courses = [
		{
			id: 1,
			title: "AI Agents Masterclass",
			instructor: "Yuganta AI Team",
			duration: "55 Hours",
			rating: 4.4,
			students: 500,
			level: "Advanced",
			category: "AI & ML",
			thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
			brochure: "/AI_AGENTS.pdf",
			roadmap: "/AI_AGENTS.pdf"
		},
		{
			id: 2,
			title: "Generative AI Complete Course",
			instructor: "Yuganta AI Team",
			duration: "42 Hours",
			rating: 4.4,
			students: 500,
			level: "Intermediate",
			category: "AI & ML",
			thumbnail: "https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800&q=80",
			brochure: "/AI_COURSE.pdf",
			roadmap: "/AI_COURSE.pdf"
		},
		{
			id: 3,
			title: "MERN Stack Development",
			instructor: "Yuganta AI Team",
			duration: "40 Hours",
			rating: 4.4,
			students: 500,
			level: "Intermediate",
			category: "Web Development",
			thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80",
			brochure: "/MERN_Stack_brochure_fina.pdf",
			roadmap: "/MERN_Stack_brochure_fina.pdf"
		}
	];

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

	const handleViewRoadmap = (roadmap, e) => {
		e.stopPropagation();
		window.open(roadmap, '_blank');
	};

	return (
		<section
			id='free-courses'
			className='py-12 md:py-24 px-4 md:px-6 bg-gradient-to-b from-[#160B2E] via-[#0B0614] to-[#0B0614] relative overflow-hidden'>
			{/* Decorative background elements with animation */}
			<div className='absolute top-0 left-0 w-96 h-96 bg-[#8B5CF6] opacity-5 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 animate-[float_6s_ease-in-out_infinite]'></div>
			<div className='absolute bottom-0 right-0 w-96 h-96 bg-[#EC4899] opacity-5 blur-3xl rounded-full translate-x-1/2 translate-y-1/2 animate-[float_8s_ease-in-out_infinite_2s]'></div>

			{/* Animated moving objects */}
			<div className='absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-[#06B6D4] to-[#0891B2] opacity-10 rounded-full blur-2xl animate-[pulse_4s_ease-in-out_infinite]'></div>
			<div className='absolute top-1/3 right-20 w-28 h-28 bg-gradient-to-br from-[#F59E0B] to-[#D97706] opacity-8 rounded-full blur-3xl animate-[float_7s_ease-in-out_infinite]'></div>
			<div className='absolute bottom-1/3 left-1/4 w-24 h-24 bg-gradient-to-br from-[#10B981] to-[#059669] opacity-10 rounded-full blur-2xl animate-[pulse_5s_ease-in-out_infinite_1s]'></div>
			<div className='absolute bottom-20 right-1/4 w-32 h-32 bg-gradient-to-br from-[#EF4444] to-[#DC2626] opacity-8 rounded-full blur-3xl animate-[float_9s_ease-in-out_infinite_3s]'></div>
			<div className='absolute top-1/2 left-1/3 w-16 h-16 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] opacity-12 rounded-full blur-xl animate-[pulse_6s_ease-in-out_infinite_2s]'></div>

			<div className='max-w-7xl mx-auto relative z-10'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
					{courses.map((course, idx) => (
						<div
							key={course.id}
							className={`bg-[rgba(22,11,46,0.5)] backdrop-blur-xl border border-[rgba(139,92,246,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(139,92,246,0.15)] overflow-hidden hover:shadow-[0_16px_48px_rgba(139,92,246,0.3)] hover:-translate-y-2 transition-all duration-300 group ${idx === 0
									? 'animate-stagger-1'
									: idx === 1
										? 'animate-stagger-2'
										: 'animate-stagger-3'
								}`}>
							{/* Course Image/Icon */}
							<div className='bg-gradient-to-br from-[#8B5CF6]/20 to-[#EC4899]/20 h-40 md:h-48 flex items-center justify-center text-5xl md:text-6xl relative border-b border-[rgba(139,92,246,0.1)]'>
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
									<span className='text-xs md:text-sm text-[#9A93B5]'>
										{course.duration || "Self-paced"}
									</span>
								</div>

								<h3 className='text-lg md:text-xl font-bold mb-2 text-white min-h-[50px] md:min-h-[60px] group-hover:text-[#A855F7] transition-colors duration-300'>
									{course.title}
								</h3>

								<p className='text-sm text-[#C7C3D6] mb-3'>
									by {course.instructor}
								</p>

								<div className='flex items-center justify-between mb-4'>
									<div className='flex items-center text-[#C7C3D6]'>
										<div className='flex text-[#EC4899] mr-2'>
											{"★".repeat(Math.floor(course.rating || 0))}
											{"☆".repeat(5 - Math.floor(course.rating || 0))}
										</div>
										<span className='text-sm'>
											({course.students || 0})
										</span>
									</div>
									<span className='text-xs text-[#9A93B5]'>
										{course.level}
									</span>
								</div>

								{/* Roadmap Button */}
								<button
									onClick={(e) => handleViewRoadmap(course.roadmap, e)}
									className='w-full px-4 py-2 rounded-xl font-semibold transition-all duration-200 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#A855F7] hover:to-[#D946EF] text-white shadow-[0_4px_20px_rgba(139,92,246,0.4)] hover:shadow-[0_6px_28px_rgba(139,92,246,0.6)] hover:scale-105'>
									View Roadmap
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
