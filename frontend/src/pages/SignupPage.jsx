import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const { signup } = useAuth();
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match!");
			return;
		}

		setLoading(true);
		const result = await signup(
			formData.fullName,
			formData.email,
			formData.password
		);

		if (result.success) {
			navigate("/profile");
		} else {
			setError(result.error);
		}

		setLoading(false);
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-[#0a1628] via-[#1a2f4f] to-[#2a4570] flex items-center justify-center px-6 py-20'>
			<div className='max-w-md w-full'>
				{/* Logo */}
				<div className='text-center mb-8'>
					<Link
						to='/'
						className='inline-flex items-center space-x-2 mb-6'>
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
						<div className='text-2xl font-bold text-white'>
							<span>Mero</span>
							<span className='text-blue-400'>sphere</span>
						</div>
					</Link>
					<h1 className='text-3xl font-bold text-white mb-2'>
						Create Account
					</h1>
					<p className='text-gray-400'>
						Join thousands of learners worldwide
					</p>
				</div>

				{/* Signup Form */}
				<div className='bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20'>
					{error && (
						<div className='bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6'>
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className='space-y-5'>
						{/* Full Name */}
						<div>
							<label className='block text-white text-sm font-medium mb-2'>
								Full Name
							</label>
							<input
								type='text'
								name='fullName'
								value={formData.fullName}
								onChange={handleChange}
								className='w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition'
								placeholder='Enter your full name'
								required
							/>
						</div>

						{/* Email */}
						<div>
							<label className='block text-white text-sm font-medium mb-2'>
								Email Address
							</label>
							<input
								type='email'
								name='email'
								value={formData.email}
								onChange={handleChange}
								className='w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition'
								placeholder='Enter your email'
								required
							/>
						</div>

						{/* Password */}
						<div>
							<label className='block text-white text-sm font-medium mb-2'>
								Password
							</label>
							<div className='relative'>
								<input
									type={showPassword ? "text" : "password"}
									name='password'
									value={formData.password}
									onChange={handleChange}
									className='w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition'
									placeholder='Create a password'
									required
									minLength={6}
								/>
								<button
									type='button'
									onClick={() =>
										setShowPassword(!showPassword)
									}
									className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition'>
									{showPassword ? (
										<svg
											className='w-5 h-5'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
											/>
										</svg>
									) : (
										<svg
											className='w-5 h-5'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
											/>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
											/>
										</svg>
									)}
								</button>
							</div>
							<p className='text-xs text-gray-400 mt-1'>
								Must be at least 6 characters
							</p>
						</div>

						{/* Confirm Password */}
						<div>
							<label className='block text-white text-sm font-medium mb-2'>
								Confirm Password
							</label>
							<div className='relative'>
								<input
									type={
										showConfirmPassword
											? "text"
											: "password"
									}
									name='confirmPassword'
									value={formData.confirmPassword}
									onChange={handleChange}
									className='w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition'
									placeholder='Confirm your password'
									required
								/>
								<button
									type='button'
									onClick={() =>
										setShowConfirmPassword(
											!showConfirmPassword
										)
									}
									className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition'>
									{showConfirmPassword ? (
										<svg
											className='w-5 h-5'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
											/>
										</svg>
									) : (
										<svg
											className='w-5 h-5'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
											/>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
											/>
										</svg>
									)}
								</button>
							</div>
						</div>

						{/* Terms & Conditions */}
						<div className='flex items-start'>
							<input
								type='checkbox'
								id='terms'
								className='mt-1 mr-2 rounded'
								required
							/>
							<label
								htmlFor='terms'
								className='text-sm text-gray-300'>
								I agree to the{" "}
								<a
									href='#'
									className='text-blue-400 hover:text-blue-300'>
									Terms of Service
								</a>{" "}
								and{" "}
								<a
									href='#'
									className='text-blue-400 hover:text-blue-300'>
									Privacy Policy
								</a>
							</label>
						</div>

						{/* Sign Up Button */}
						<button
							type='submit'
							disabled={loading}
							className='w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed'>
							{loading ? "Creating Account..." : "Create Account"}
						</button>

						{/* Divider */}
						<div className='relative my-6'>
							<div className='absolute inset-0 flex items-center'>
								<div className='w-full border-t border-white/20'></div>
							</div>
							<div className='relative flex justify-center text-sm'>
								<span className='px-4 bg-transparent text-gray-400'>
									Or sign up with
								</span>
							</div>
						</div>

						{/* Social Signup */}
						<div className='grid grid-cols-2 gap-4'>
							<button
								type='button'
								className='flex items-center justify-center px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white hover:bg-white/10 transition'>
								<svg
									className='w-5 h-5 mr-2'
									viewBox='0 0 24 24'
									fill='currentColor'>
									<path
										d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
										fill='#4285F4'
									/>
									<path
										d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
										fill='#34A853'
									/>
									<path
										d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
										fill='#FBBC05'
									/>
									<path
										d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
										fill='#EA4335'
									/>
								</svg>
								Google
							</button>
							<button
								type='button'
								className='flex items-center justify-center px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white hover:bg-white/10 transition'>
								<svg
									className='w-5 h-5 mr-2'
									fill='currentColor'
									viewBox='0 0 24 24'>
									<path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
								</svg>
								GitHub
							</button>
						</div>
					</form>

					{/* Login Link */}
					<p className='mt-6 text-center text-gray-400'>
						Already have an account?{" "}
						<Link
							to='/login'
							className='text-blue-400 hover:text-blue-300 font-semibold transition'>
							Login
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
