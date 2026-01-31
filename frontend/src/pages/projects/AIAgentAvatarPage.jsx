import { Link } from "react-router-dom";
import { ArrowLeft, Brain, MessageSquare, Zap, Shield, BookOpen, Smile, Globe } from "lucide-react";

export default function AIAgentAvatarPage() {
	const features = [
		{
			title: "Adaptive Learning",
			description: "Adjusts to each student's pace and confidence level",
			icon: MessageSquare
		},
		{
			title: "Emotion-Aware Guidance",
			description: "Reads student emotions and responds with patient explanations",
			icon: Brain
		},
		{
			title: "Interactive Media",
			description: "Uses voice, visuals, and gestures for deeper understanding",
			icon: Zap
		},
		{
			title: "Multilingual Support",
			description: "Supports English and 13 Indian languages for inclusive learning",
			icon: Shield
		}
	];

	const techStack = ["Python", "TensorFlow", "OpenAI API", "WebRTC", "React", "FastAPI"];

	const useCases = [
		"Step-by-step concept guidance",
		"Textbook-aligned explanations",
		"Learning in native languages",
		"Confidence-building mentoring",
		"Emotion-aware tutoring",
		"Interactive, engaging lessons"
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
								AI Agent Avatar
							</h1>
							<p className="text-xl text-gray-300 mb-8">
								Our AI Learning Mentor adapts to each student’s pace and confidence, explains 
								concepts patiently, and teaches through interactive media, voice, and emotion-aware guidance.
							</p>
							<Link 
								to="/contact" 
								className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
							>
								Learn More
							</Link>
						</div>
						
						<div className="relative">
						<div className="aspect-video bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl border border-purple-500/20 overflow-hidden">
							<img 
								src="/chatbotagent.png" 
								alt="AI Agent Avatar" 
								className="w-full h-full object-contain bg-[#0a0a0a]"
							/>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className="max-w-7xl mx-auto px-4 md:px-6 py-20">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">What Makes Our AI Mentor Different</h2>
					<p className="text-gray-400 text-lg">Focused, personal, and inclusive learning for every student</p>
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

			{/* Why Choose Section */}
			<div className="max-w-7xl mx-auto px-4 md:px-6 py-20 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">Accurate, Document-Based Guidance</h2>
					<p className="text-gray-400 text-lg">Learning directly from textbooks and uploaded PDFs</p>
				</div>
				<div className="grid md:grid-cols-3 gap-8">
					<div className="p-8 bg-gradient-to-br from-blue-900/20 to-blue-900/5 border border-blue-500/30 rounded-2xl hover:border-blue-500/60 transition-all">
						<div className="flex items-center justify-center w-14 h-14 bg-blue-500/20 rounded-xl mb-6">
							<BookOpen className="text-blue-400" size={28} />
						</div>
						<h3 className="text-xl font-semibold mb-3 text-blue-300">Syllabus-Focused Learning</h3>
						<p className="text-gray-300 leading-relaxed">Explains concepts directly from textbooks, ensuring confusion-free learning aligned with your school curriculum. Every explanation references your actual study materials.</p>
					</div>
					<div className="p-8 bg-gradient-to-br from-green-900/20 to-green-900/5 border border-green-500/30 rounded-2xl hover:border-green-500/60 transition-all">
						<div className="flex items-center justify-center w-14 h-14 bg-green-500/20 rounded-xl mb-6">
							<Smile className="text-green-400" size={28} />
						</div>
						<h3 className="text-xl font-semibold mb-3 text-green-300">Emotion-Aware Intelligence</h3>
						<p className="text-gray-300 leading-relaxed">Understands student emotions using realistic facial expressions, lip-sync, and gestures. Adjusts explanations based on your comfort level for deeper engagement.</p>
					</div>
					<div className="p-8 bg-gradient-to-br from-cyan-900/20 to-cyan-900/5 border border-cyan-500/30 rounded-2xl hover:border-cyan-500/60 transition-all">
						<div className="flex items-center justify-center w-14 h-14 bg-cyan-500/20 rounded-xl mb-6">
							<Globe className="text-cyan-400" size={28} />
						</div>
						<h3 className="text-xl font-semibold mb-3 text-cyan-300">Multilingual Learning (14 Languages)</h3>
						<p className="text-gray-300 leading-relaxed">Supports English and 13 Indian languages including Hindi, Telugu, Tamil, Kannada, and more. Learn comfortably in your mother tongue without barriers.</p>
					</div>
				</div>
			</div>

			{/* Use Cases Section */}
			<div className="max-w-7xl mx-auto px-4 md:px-6 py-20 border-t border-purple-500/10">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">True Mentor Experience</h2>
					<p className="text-gray-400 text-lg">Guides students step by step with empathy and clarity</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{useCases.map((useCase, index) => (
						<div 
							key={index}
							className="p-6 bg-gradient-to-br from-purple-900/10 to-transparent border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition-all text-center"
						>
							<p className="text-lg font-medium text-purple-300">{useCase}</p>
						</div>
					))}
				</div>
			</div>

			{/* Tech Stack Section */}
			<div className="max-w-7xl mx-auto px-4 md:px-6 py-20 border-t border-purple-500/10">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">Technology Stack</h2>
					<p className="text-gray-400 text-lg">Built for real-time, multilingual, emotion-aware learning</p>
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

			<div className="max-w-7xl mx-auto px-4 md:px-6 py-20">
				<div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl border border-purple-500/20 p-12 text-center">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
						Ready to Transform Learning?
					</h2>
					<p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
						Give every student a personal AI mentor with emotion-aware, multilingual guidance.
					</p>
					<Link 
						to="/contact" 
						className="inline-block px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
					>
						Get Started
					</Link>
				</div>
			</div>
		</div>
	);
}
