import { useState } from "react";
import SEO from "../components/SEO";

export default function AboutPage() {
	const [email, setEmail] = useState("");

	const handleSubscribe = (e) => {
		e.preventDefault();
		// Handle newsletter subscription
		console.log("Subscribe email:", email);
		setEmail("");
	};

	return (
		<>
			<SEO 
				title="About Us - YuganthaAI | AI & Technology Learning Platform"
				description="Learn about YuganthaAI's vision, mission, and how we're accelerating digitalization through quality IT services and workforce solutions."
				keywords="about yuganthaai, company vision, technology company, IT services, workforce solutions"
				url="/about"
			/>
			<div className="min-h-screen bg-gradient-to-b from-[#0B0614] to-[#12091F]">
			{/* Hero Section */}
			<div className="relative bg-gradient-to-r from-[#1a0f3a] via-[#2D1B69] to-[#1a0f3a] py-20 md:py-32 overflow-hidden">
				<div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-20"></div>
				<div className="absolute inset-0 bg-gradient-to-r from-[#1a0f3a]/90 via-[#2D1B69]/90 to-[#1a0f3a]/90"></div>
				<div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
					<div className="mb-6">
						<div className="flex items-center gap-2 text-sm md:text-base">
							<a href="/" className="text-[#C7C3D6] hover:text-[#A855F7] transition-colors">
								Home
							</a>
							<span className="text-[#C7C3D6]">/</span>
							<span className="text-white">About Us</span>
						</div>
					</div>
					<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
						About Us
					</h1>
					<p className="text-lg md:text-xl text-[#C7C3D6] max-w-3xl">
						As an IT services company, we envision to be a name synonymous with quality in the field of IT Services and Workforce Solutions.
					</p>
				</div>
			</div>

			{/* Vision, Mission, What We Do Section */}
			<div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* Left Side - Image/Video */}
					<div className="relative">
						<div className="relative rounded-2xl overflow-hidden shadow-2xl">
							<img 
								src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop" 
								alt="Team collaboration" 
								className="w-full h-auto"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-[#0B0614]/80 to-transparent"></div>
							{/* Play Button Overlay (optional) */}
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 transition-transform">
									<svg className="w-8 h-8 text-[#2D1B69] ml-1" fill="currentColor" viewBox="0 0 24 24">
										<path d="M8 5v14l11-7z"/>
									</svg>
								</div>
							</div>
						</div>
						{/* Decorative hand image */}
						<div className="absolute -left-8 -top-8 w-32 h-32 hidden lg:block">
							<img 
								src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop" 
								alt="Hand with watch" 
								className="rounded-lg shadow-xl"
							/>
						</div>
					</div>

					{/* Right Side - Text Content */}
					<div className="space-y-10">
						{/* Vision */}
						<div>
							<p className="text-sm text-[#A855F7] font-semibold mb-2  tracking-wider">
								YuganthaAI
							</p>
							<h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
								Vision
							</h2>
							<p className="text-[#C7C3D6] text-lg leading-relaxed">
								A world where digitalization is simpler, faster and drives the business.
							</p>
						</div>

						{/* Mission */}
						<div>
							<h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
								Mission
							</h2>
							<p className="text-[#C7C3D6] text-lg leading-relaxed">
								We are on a mission to accelerate the speed of digitalization through a cost effective unified software development life cycle
							</p>
						</div>

						{/* What We Do */}
						<div>
							<h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
								What We Do ?
							</h2>
							<p className="text-[#C7C3D6] text-lg leading-relaxed">
								We bring decades of experience across industries to deliver critical projects with multiple dependencies. We have a highly organized modern software delivery process that has been perfected over the years.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Statistics Section */}
			<div className="bg-gradient-to-b from-[#12091F] to-[#1a0f3a] py-16 md:py-20">
				<div className="max-w-7xl mx-auto px-4 md:px-6">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
						{/* Projects */}
						<div className="text-center">
							<div className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3">
								16<span className="text-[#A855F7]">+</span>
							</div>
							<div className="text-lg md:text-xl text-[#C7C3D6] font-medium">
								Projects
							</div>
						</div>

						{/* Customers */}
						<div className="text-center">
							<div className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3">
								12<span className="text-[#A855F7]">+</span>
							</div>
							<div className="text-lg md:text-xl text-[#C7C3D6] font-medium">
								Customers
							</div>
						</div>

						{/* Ongoing Projects */}
						<div className="text-center">
							<div className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3">
								5<span className="text-[#A855F7]">+</span>
							</div>
							<div className="text-lg md:text-xl text-[#C7C3D6] font-medium">
								Ongoing Projects
							</div>
						</div>

						{/* Experts */}
						<div className="text-center">
							<div className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3">
								56<span className="text-[#A855F7]">+</span>
							</div>
							<div className="text-lg md:text-xl text-[#C7C3D6] font-medium">
								Experts
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Newsletter Section */}
			<div className="relative py-20 md:py-24 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-[#2D1B69] via-[#1E88E5] to-[#00ACC1]"></div>
				<div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
					<div className="flex flex-col lg:flex-row items-center justify-between gap-8">
						{/* Left - Newsletter Text */}
						<div className="text-center lg:text-left">
							<h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
								Subscribe
							</h2>
							<p className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
								To Our Newsletter
							</p>
						</div>

						{/* Right - Form */}
						<form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Your Email"
								required
								className="px-6 py-4 rounded-full bg-[rgba(255,255,255,0.2)] backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 w-full sm:w-80 text-lg"
							/>
							<button
								type="submit"
								className="px-8 py-4 bg-gradient-to-r from-[#00BCD4] to-[#4DD0E1] text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-200 text-lg whitespace-nowrap"
							>
								Subscribe Now
							</button>
						</form>
					</div>
				</div>
			</div>
			</div>
		</>
	);
}
