import { Link } from "react-router-dom";

export default function Footer() {
	return (
		<footer className='bg-black text-white py-12 md:py-16 border-t border-gray-800'>
			<div className='max-w-7xl mx-auto px-4 md:px-6'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12'>
					{/* Logo and Description */}
					<div className='col-span-1 md:col-span-2'>
						<Link to='/' className='flex items-center space-x-3 mb-6'>
							<svg
								className='w-10 h-10'
								viewBox='0 0 50 50'
								fill='none'>
								<defs>
									<linearGradient
										id='footerLogoGradient'
										x1='0%'
										y1='0%'
										x2='100%'
										y2='100%'>
										<stop offset='0%' stopColor='#3b82f6' />
										<stop offset='50%' stopColor='#8b5cf6' />
										<stop offset='100%' stopColor='#ec4899' />
									</linearGradient>
								</defs>
								<path
									d='M10 40 L25 10 L40 40 M15 35 L35 35'
									stroke='url(#footerLogoGradient)'
									strokeWidth='3'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
							<div className='text-2xl font-bold'>
								<span className='text-white'>Yugantha</span>
								<span className='bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'>
								AI
								</span>
							</div>
						</Link>
						<p className='text-gray-400 mb-6 max-w-md leading-relaxed'>
							Empowering learners worldwide with cutting-edge AI and
							technology courses. Master skills, build projects, and
							advance your career with expert-led content.
						</p>
						<div className='flex space-x-4'>
							<a
								href='#'
								className='w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition duration-300'>
								<svg
									className='w-5 h-5'
									fill='currentColor'
									viewBox='0 0 24 24'>
									<path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' />
								</svg>
							</a>
							<a
								href='#'
								className='w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition duration-300'>
								<svg
									className='w-5 h-5'
									fill='currentColor'
									viewBox='0 0 24 24'>
									<path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
								</svg>
							</a>
							<a
								href='#'
								className='w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition duration-300'>
								<svg
									className='w-5 h-5'
									fill='currentColor'
									viewBox='0 0 24 24'>
									<path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' />
								</svg>
							</a>
							<a
								href='#'
								className='w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition duration-300'>
								<svg
									className='w-5 h-5'
									fill='currentColor'
									viewBox='0 0 24 24'>
									<path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
								</svg>
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className='text-lg font-semibold mb-4'>Quick Links</h3>
						<ul className='space-y-3'>
							<li>
								<Link
									to='/courses'
									className='text-gray-400 hover:text-white transition'>
									All Courses
								</Link>
							</li>
							<li>
								<Link
									to='/my-learning'
									className='text-gray-400 hover:text-white transition'>
									My Learning
								</Link>
							</li>
							<li>
								<Link
									to='/instructor'
									className='text-gray-400 hover:text-white transition'>
									Become Instructor
								</Link>
							</li>
							<li>
								<a
									href='#'
									className='text-gray-400 hover:text-white transition'>
									About Us
								</a>
							</li>
							<li>
								<a
									href='#'
									className='text-gray-400 hover:text-white transition'>
									Contact
								</a>
							</li>
						</ul>
					</div>

					{/* Categories */}
					<div>
						<h3 className='text-lg font-semibold mb-4'>Categories</h3>
						<ul className='space-y-3'>
							<li>
								<a
									href='#'
									className='text-gray-400 hover:text-white transition'>
									sphere & Machine Learning
								</a>
							</li>
							<li>
								<a
									href='#'
									className='text-gray-400 hover:text-white transition'>
									Deep Learning
								</a>
							</li>
							<li>
								<a
									href='#'
									className='text-gray-400 hover:text-white transition'>
									Data Science
								</a>
							</li>
							<li>
								<a
									href='#'
									className='text-gray-400 hover:text-white transition'>
									Web Development
								</a>
							</li>
							<li>
								<a
									href='#'
									className='text-gray-400 hover:text-white transition'>
									Cloud Computing
								</a>
							</li>
						</ul>
					</div>
				</div>

				{/* Newsletter */}
				<div className='border-t border-gray-800 pt-8 mb-8'>
					<div className='max-w-md'>
						<h3 className='text-lg font-semibold mb-4'>
							Stay Updated
						</h3>
						<p className='text-gray-400 text-sm mb-4'>
							Subscribe to our newsletter for the latest courses and
							updates.
						</p>
						<div className='flex'>
							<input
								type='email'
								placeholder='Enter your email'
								className='flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500'
							/>
							<button className='px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-r-lg font-semibold transition'>
								Subscribe
							</button>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className='border-t border-gray-800 pt-8'>
					<div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
						<p className='text-gray-400 text-sm'>
							© {new Date().getFullYear()} YuganthaAI. All rights
							reserved. Built with ❤️ for learners worldwide.
						</p>
						<div className='flex space-x-6 text-sm'>
							<a
								href='#'
								className='text-gray-400 hover:text-white transition'>
								Privacy Policy
							</a>
							<a
								href='#'
								className='text-gray-400 hover:text-white transition'>
								Terms of Service
							</a>
							<a
								href='#'
								className='text-gray-400 hover:text-white transition'>
								Cookie Policy
							</a>
							<a
								href='#'
								className='text-gray-400 hover:text-white transition'>
								Sitemap
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
