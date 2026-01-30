import { Link } from "react-router-dom";
import { ArrowLeft, Thermometer, Gauge, TrendingUp, Activity } from "lucide-react";

export default function HVACAgentPage() {
	const features = [
		{
			title: "Smart Climate Control",
			description: "AI-powered temperature optimization and energy management",
			icon: Thermometer
		},
		{
			title: "Predictive Maintenance",
			description: "Prevent failures before they happen with ML algorithms",
			icon: Gauge
		},
		{
			title: "Energy Optimization",
			description: "Reduce costs with intelligent power consumption analysis",
			icon: TrendingUp
		},
		{
			title: "Real-Time Monitoring",
			description: "24/7 system health tracking and performance metrics",
			icon: Activity
		}
	];

	const techStack = ["IoT Sensors", "Machine Learning", "Python", "MQTT", "Time Series DB", "React Dashboard"];

	const benefits = [
		"30% average energy cost reduction",
		"50% decrease in maintenance costs",
		"95% system uptime guarantee",
		"Real-time anomaly detection",
		"Automated fault diagnosis",
		"Compliance reporting automation"
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
								HVAC Agent
							</h1>
							<p className="text-xl text-gray-300 mb-8">
								Intelligent HVAC management system powered by AI. Optimize comfort, 
								reduce energy costs, and predict maintenance needs before issues arise.
							</p>
							<div className="flex flex-wrap gap-4">
								<a 
									href="#" 
									className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
								>
									Schedule Demo
								</a>
								<a 
									href="#" 
									className="px-6 py-3 border border-purple-600 hover:bg-purple-600/10 rounded-lg font-semibold transition-colors"
								>
									Case Studies
								</a>
							</div>
						</div>
						
						<div className="relative">
							<div className="aspect-video bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl border border-purple-500/20 flex items-center justify-center">
								<div className="text-purple-400 text-6xl">🌡️</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className="max-w-7xl mx-auto px-4 md:px-6 py-20">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">Intelligent Features</h2>
					<p className="text-gray-400 text-lg">AI-driven HVAC optimization for maximum efficiency</p>
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

			{/* Benefits Section */}
			<div className="max-w-7xl mx-auto px-4 md:px-6 py-20 border-t border-purple-500/10">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">Measurable Benefits</h2>
					<p className="text-gray-400 text-lg">Real results from real deployments</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{benefits.map((benefit, index) => (
						<div 
							key={index}
							className="p-6 bg-gradient-to-br from-purple-900/10 to-transparent border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition-all"
						>
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center flex-shrink-0">
									<svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
									</svg>
								</div>
								<p className="text-lg font-medium text-gray-200">{benefit}</p>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Tech Stack Section */}
			<div className="max-w-7xl mx-auto px-4 md:px-6 py-20 border-t border-purple-500/10">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">Technology Stack</h2>
					<p className="text-gray-400 text-lg">Industrial-grade IoT and AI integration</p>
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
						Optimize Your HVAC Systems Today
					</h2>
					<p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
						Let's discuss how our AI-powered HVAC solution can reduce your energy costs and improve system reliability.
					</p>
					<Link 
						to="/contact" 
						className="inline-block px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
					>
						Request Consultation
					</Link>
				</div>
			</div>
		</div>
	);
}
