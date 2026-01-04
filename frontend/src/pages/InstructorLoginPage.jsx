import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useInstructor } from "../context/InstructorContext";

export default function InstructorLoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [showHint, setShowHint] = useState(false);
	const { login, isAuthenticated } = useInstructor();
	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/instructor/dashboard", { replace: true });
		}
	}, [isAuthenticated, navigate]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		const result = login(email, password);
		if (result.success) {
			navigate("/instructor/dashboard");
		} else {
			setError(result.error);
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-[#0a1628] via-[#1a2f4f] to-[#2a4570] flex items-center justify-center px-4'>
			<div className='max-w-md w-full'>
				{/* Back to Home */}
				<Link
					to='/'
					className='inline-flex items-center text-blue-300 hover:text-blue-200 mb-6 transition duration-200'>
					<svg
						className='w-5 h-5 mr-2'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M10 19l-7-7m0 0l7-7m-7 7h18'
						/>
					</svg>
					Back to Home
				</Link>

				{/* Login Card */}
				<div className='bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20'>
					<div className='text-center mb-8'>
						<div className='flex items-center justify-center space-x-2 mb-4'>
							<svg
								className='w-12 h-12'
								viewBox='0 0 50 50'
								fill='none'>
								<path
									d='M10 40 L25 10 L40 40 M15 35 L35 35'
									stroke='white'
									strokeWidth='3'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
							<div className='text-2xl font-bold'>
								<span className='text-white'>Mero</span>
								<span className='text-blue-400'>sphere</span>
							</div>
						</div>
						<h2 className='text-3xl font-bold text-white mb-2'>
							Instructor Portal
						</h2>
						<p className='text-gray-300'>
							Sign in to manage courses and students
						</p>
					</div>

					{error && (
						<div className='mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm'>
							{error}
						</div>
					)}

					{/* Dev Hint */}
					<div className='mb-4 p-3 bg-blue-500/20 border border-blue-400/50 rounded-lg'>
						<button
							onClick={() => setShowHint(!showHint)}
							className='text-blue-200 text-sm flex items-center justify-between w-full'>
							<span>🔐 Development Credentials</span>
							<svg
								className={`w-4 h-4 transition-transform ${
									showHint ? "rotate-180" : ""
								}`}
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M19 9l-7 7-7-7'
								/>
							</svg>
						</button>
						{showHint && (
							<div className='mt-2 text-xs text-blue-100 space-y-1'>
								<div>
									Email:{" "}
									<code className='bg-white/10 px-2 py-1 rounded'>
										instructor@merosphere.com
									</code>
								</div>
								<div>
									Password:{" "}
									<code className='bg-white/10 px-2 py-1 rounded'>
										instructor123
									</code>
								</div>
							</div>
						)}
					</div>

					<form onSubmit={handleSubmit} className='space-y-6'>
						<div>
							<label className='block text-white mb-2 text-sm font-medium'>
								Email Address
							</label>
							<input
								type='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
								placeholder='instructor@merosphere.com'
								required
							/>
						</div>

						<div>
							<label className='block text-white mb-2 text-sm font-medium'>
								Password
							</label>
							<input
								type='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
								placeholder='Enter your password'
								required
							/>
						</div>

						<button
							type='submit'
							className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition duration-200 shadow-lg hover:shadow-xl'>
							Sign In
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
