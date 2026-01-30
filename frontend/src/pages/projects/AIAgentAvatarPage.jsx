import { Link } from "react-router-dom";
import { ArrowLeft, Brain, MessageSquare, Zap, Shield } from "lucide-react";

export default function AIAgentAvatarPage() {
	const features = [
		{
			title: "Natural Conversations",
			description: "Human-like interactions powered by advanced AI models",
			icon: MessageSquare
		},
		{
			title: "Context Awareness",
			description: "Understands and remembers conversation context",
			icon: Brain
		},
		{
			title: "Lightning Fast",
			description: "Real-time responses with minimal latency",
			icon: Zap
		},
		{
			title: "Secure & Private",
			description: "Enterprise-grade security and data privacy",
			icon: Shield
		}
	];

	const techStack = ["Python", "TensorFlow", "OpenAI API", "WebRTC", "React", "FastAPI"];

	const useCases = [
		"Customer Support Automation",
		"Virtual Personal Assistants",
		"Educational Tutoring",
		"Healthcare Consultation",
		"Sales & Marketing",
		"HR & Recruitment"
	];

	return (
		<div className="min-h-screen bg-[#0a0a0a] text-white">
			{/* Hero Section */}
			<div className="relative bg-gradient-to-br from-[#0B0614] via-[#160B2E] to-[#1a0f3a] py-20">
				<div className="max-w-7xl mx-auto px-4 md:px-6">
					<Link 
						to="/" 
						className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8 transition-colors"
					>
						<ArrowLeft size={20} />
						<span>Back to Home</span>
					</Link>
					
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div>
							<div className="text-sm text-purple-400 font-semibold mb-4">OUR PROJECTS</div>
							<h1 className="text-4xl md:text-5xl font-bold mb-6">
								AI Agent Avatar
							</h1>
							<p className="text-xl text-gray-300 mb-8">
								Next-generation conversational AI with lifelike avatars. Transform customer 
								interactions with intelligent, empathetic virtual agents.
							</p>
							<div className="flex flex-wrap gap-4">
								<a 
									href="#" 
									className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
								>
									Try Demo
								</a>
								<a 
									href="#" 
									className="px-6 py-3 border border-purple-600 hover:bg-purple-600/10 rounded-lg font-semibold transition-colors"
								>
									View Documentation
								</a>
							</div>
						</div>
						
						<div className="relative">
							<div className="aspect-video bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl border border-purple-500/20 flex items-center justify-center">
								<div className="text-purple-400 text-6xl">🤖</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className="max-w-7xl mx-auto px-4 md:px-6 py-20">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
					<p className="text-gray-400 text-lg">AI-powered capabilities that set us apart</p>
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

			{/* Use Cases Section */}
			<div className="max-w-7xl mx-auto px-4 md:px-6 py-20 border-t border-purple-500/10">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">Use Cases</h2>
					<p className="text-gray-400 text-lg">Versatile applications across industries</p>
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
					<p className="text-gray-400 text-lg">Cutting-edge AI and ML technologies</p>
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

			{/* CTA Section */}
			<div className="max-w-7xl mx-auto px-4 md:px-6 py-20">
				<div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl border border-purple-500/20 p-12 text-center">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
						Ready to Deploy AI Avatars?
					</h2>
					<p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
						Contact us to integrate intelligent conversational agents into your platform.
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
