import { Link } from "react-router-dom";
import { ArrowLeft, GraduationCap, BookOpen, Target, Sparkles, Play } from "lucide-react";
import { useState } from "react";

export default function AILearningPlatformPage() {
	const [showVideo, setShowVideo] = useState(false);

	const features = [
		{
			title: "Personalized Learning Paths",
			description: "AI-curated courses tailored to your skill level and goals",
			icon: Target
		},
		{
			title: "Interactive Content",
			description: "Engaging video lectures, quizzes, and hands-on projects",
			icon: BookOpen
		},
		{
			title: "Expert Mentorship",
			description: "1-on-1 guidance from industry professionals",
			icon: GraduationCap
		},
		{
			title: "AI-Powered Insights",
			description: "Smart recommendations and progress tracking",
			icon: Sparkles
		}
	];

	const techStack = ["React", "Node.js", "Python", "TensorFlow", "MongoDB", "WebRTC", "OpenAI API"];

	const courses = [
		"Applied Machine Learning",
		"Fundamentals of Deep Learning",
		"Natural Language Processing",
		"Generative AI Applications",
		"Computer Vision",
		"MLOps & Deployment"
	];

	return (
		<div className="min-h-screen bg-[#0a0a0a] text-white">
			{/* Hero Section */}
			<div className="relative bg-gradient-to-br from-[#0B0614] via-[#160B2E] to-[#1a0f3a] py-20">
				<div className="max-w-7xl mx-auto px-4 md:px-6">
					
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div>
							<div className="text-sm text-purple-400 font-semibold mb-4">OUR PROJECTS</div>
							<h1 className="text-4xl md:text-5xl font-bold mb-6">
								AI-Powered Learning Platform
							</h1>
							<p className="text-xl text-gray-300 mb-4">
								Master AI and Machine Learning with personalized courses, expert mentorship, 
								and hands-on projects.
							</p>
							<div className="inline-block px-4 py-2 bg-yellow-600/20 border border-yellow-600/30 rounded-lg text-yellow-400 font-medium mb-8">
								🚀 Coming Soon
							</div>
							<div className="flex flex-wrap gap-4">
								<button 
									onClick={() => setShowVideo(true)}
									className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors flex items-center gap-2"
								>
									<Play size={20} />
									Watch Preview
								</button>
								<Link 
									to="/contact"
									className="px-6 py-3 border border-purple-600 hover:bg-purple-600/10 rounded-lg font-semibold transition-colors"
								>
									Get Early Access
								</Link>
							</div>
						</div>
						
						<div className="relative">
							<div className="aspect-video bg-black rounded-2xl border border-purple-500/20 overflow-hidden">
								<video
									className="w-full h-full object-cover"
									src="/AILEarningVideo.mp4"
									controls
									title="AI Learning Platform Preview"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className="max-w-7xl mx-auto px-4 md:px-6 py-20">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">Platform Features</h2>
					<p className="text-gray-400 text-lg">Everything you need to master AI and ML</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
					{features.map((feature, index) => (
						<div 
							key={index}
							className="p-6 bg-gradient-to-br from-purple-900/10 to-transparent border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition-all"
						>
							<div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
								<feature.icon className="text-purple-400" size={24} />
							</div>
							<h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
							<p className="text-gray-400">{feature.description}</p>
						</div>
					))}
				</div>
			</div>

			{/* Courses Section */}
			<div className="max-w-7xl mx-auto px-4 md:px-6 py-20 border-t border-purple-500/10">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Courses</h2>
					<p className="text-gray-400 text-lg">Comprehensive curriculum designed by industry experts</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{courses.map((course, index) => (
						<div 
							key={index}
							className="p-6 bg-gradient-to-br from-purple-900/10 to-transparent border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition-all group"
						>
							<div className="flex items-start gap-3">
								<div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600/30 transition-all">
									<BookOpen className="text-purple-400" size={16} />
								</div>
								<div>
									<h3 className="text-lg font-semibold text-gray-200 mb-1">{course}</h3>
									<p className="text-sm text-gray-400">Coming Soon</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Tech Stack Section */}
			<div className="max-w-7xl mx-auto px-4 md:px-6 py-20 border-t border-purple-500/10">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">Technology Stack</h2>
					<p className="text-gray-400 text-lg">Built with cutting-edge technologies</p>
				</div>

				<div className="flex flex-wrap justify-center gap-4">
					{techStack.map((tech, index) => (
						<div 
							key={index}
							className="px-6 py-3 bg-purple-600/10 border border-purple-500/20 rounded-full text-purple-300 font-medium"
						>
							{tech}
						</div>
					))}
				</div>
			</div>

			{/* Early Access CTA */}
			<div className="max-w-7xl mx-auto px-4 md:px-6 py-20">
				<div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl border border-purple-500/20 p-12 text-center">
					<div className="inline-block px-4 py-2 bg-yellow-600/20 border border-yellow-600/30 rounded-lg text-yellow-400 font-medium mb-6">
						Limited Early Access Available
					</div>
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
						Be Among the First to Experience It
					</h2>
					<p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
						Join our waitlist to get exclusive early access when we launch. Limited spots available!
					</p>
					<Link 
						to="/contact" 
						className="inline-block px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
					>
						Join Waitlist
					</Link>
				</div>
			</div>

			{/* Video Modal */}
			{showVideo && (
				<div 
					className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
					onClick={() => setShowVideo(false)}
				>
					<div className="max-w-4xl w-full aspect-video bg-black rounded-xl overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
						<button 
							onClick={() => setShowVideo(false)}
							className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
						>
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
						<video
							className="w-full h-full"
							src="/AILEarningVideo.mp4"
							controls
							autoPlay
							title="AI Learning Platform Preview"
						/>
					</div>
				</div>
			)}
		</div>
	);
}
