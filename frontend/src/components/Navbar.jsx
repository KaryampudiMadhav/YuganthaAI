import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
	const [showExplore, setShowExplore] = useState(false);
	const [showProfileMenu, setShowProfileMenu] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const { user, isAuthenticated, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const navItems = [
		{
			label: "GenAI Pinnacle Plus Program",
			to: "/#genai-pinnacle-plus-program",
		},
		{
			label: "Agentic AI Pioneer Program",
			to: "/#agentic-ai-pioneer-program",
		},
		{
			label: "Program Dashboard",
			to: isAuthenticated ? "/my-learning" : "/login",
		},
		{ label: "Free Courses", to: "/courses" },
		{ label: "Blogs", to: "/blogs" },
	];

	const handleNavClick = () => {
		setShowExplore(false);
		setMobileMenuOpen(false);
	};

	// Close dropdowns when route changes
	useEffect(() => {
		setShowExplore(false);
		setShowProfileMenu(false);
		setMobileMenuOpen(false);
	}, [location]);

	const handleLogout = () => {
		setShowProfileMenu(false);
		logout();
		// Use replace to avoid adding to history stack
		navigate("/", { replace: true });
	};

	return (
		<nav className='bg-[#1a1a1a] text-white px-4 md:px-6 py-4 fixed w-full top-0 z-50 shadow-lg'>
			<div className='max-w-7xl mx-auto flex items-center justify-between'>
				{/* Logo */}
				<Link to='/' className='flex items-center space-x-2'>
					<svg
						className='w-8 h-8 md:w-10 md:h-10'
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
					<div className='text-lg md:text-xl font-bold'>
						<span className='text-white'>Mero</span>
						<span className='text-blue-400'>sphere</span>
					</div>
				</Link>

				{/* Desktop Navigation */}
				<div className='hidden md:flex items-center space-x-6'>
					<div className='flex items-center space-x-4'>
						{navItems.map((item) => (
							<Link
								key={item.label}
								to={item.to}
								onClick={handleNavClick}
								className='text-xs font-semibold uppercase tracking-wide text-gray-300 hover:text-white transition whitespace-nowrap'>
								{item.label}
							</Link>
						))}
					</div>

					{/* Explore Dropdown */}
					<div className='relative'>
						<button
							onClick={() => setShowExplore(!showExplore)}
							className='flex items-center space-x-2 px-4 py-2 border border-gray-600 rounded-lg hover:border-gray-400 transition duration-200'>
							<span>Explore</span>
							<svg
								className='w-4 h-4'
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

						{showExplore && (
							<div className='absolute top-full mt-2 bg-gray-800 rounded-lg shadow-xl py-2 w-48'>
								<Link
									to='/courses'
									className='block px-4 py-2 hover:bg-gray-700'>
									Courses
								</Link>
								<Link
									to='/courses'
									className='block px-4 py-2 hover:bg-gray-700'>
									Learning Paths
								</Link>
								<Link
									to='/courses'
									className='block px-4 py-2 hover:bg-gray-700'>
									Programs
								</Link>
							</div>
						)}
					</div>

					{/* User Menu */}
					{isAuthenticated ? (
						<div className='relative'>
							<button
								onClick={() =>
									setShowProfileMenu(!showProfileMenu)
								}
								className='flex items-center space-x-3 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition duration-200'>
								<div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold'>
									{user?.fullName?.charAt(0).toUpperCase()}
								</div>
								<span className='hidden lg:inline'>{user?.fullName}</span>
								<svg
									className='w-4 h-4'
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

							{showProfileMenu && (
								<div className='absolute top-full right-0 mt-2 bg-gray-800 rounded-lg shadow-xl py-2 w-48'>
									<Link
										to='/profile'
										onClick={() =>
											setShowProfileMenu(false)
										}
										className='block px-4 py-2 hover:bg-gray-700'>
										My Profile
									</Link>
									<Link
										to='/my-learning'
										onClick={() =>
											setShowProfileMenu(false)
										}
										className='block px-4 py-2 hover:bg-gray-700'>
										My Learning
									</Link>
									<Link
										to='/courses'
										onClick={() =>
											setShowProfileMenu(false)
										}
										className='block px-4 py-2 hover:bg-gray-700'>
										Browse Courses
									</Link>
									<div className='border-t border-gray-700 my-2'></div>
									<button
										onClick={handleLogout}
										className='w-full text-left px-4 py-2 hover:bg-gray-700 text-red-400'>
										Logout
									</button>
								</div>
							)}
						</div>
					) : (
						<Link
							to='/login'
							className='px-6 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition duration-200'>
							Login
						</Link>
					)}
				</div>

				{/* Mobile Menu Button */}
				<button
					onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					className='md:hidden p-2 hover:bg-gray-800 rounded-lg'>
					<svg
						className='w-6 h-6'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'>
						{mobileMenuOpen ? (
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M6 18L18 6M6 6l12 12'
							/>
						) : (
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M4 6h16M4 12h16M4 18h16'
							/>
						)}
					</svg>
				</button>
			</div>

			{/* Mobile Menu */}
			{mobileMenuOpen && (
				<div className='md:hidden mt-4 pb-4 border-t border-gray-700'>
					<div className='flex flex-col space-y-2 mt-4'>
						{navItems.map((item) => (
							<Link
								key={item.label}
								to={item.to}
								onClick={handleNavClick}
								className='px-4 py-2 hover:bg-gray-800 rounded-lg text-sm font-semibold uppercase tracking-wide text-gray-200'>
								{item.label}
							</Link>
						))}

						{isAuthenticated ? (
							<>
								<div className='border-t border-gray-700 my-2'></div>
								<div className='px-4 py-2 flex items-center space-x-3'>
									<div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold'>
										{user?.fullName?.charAt(0).toUpperCase()}
									</div>
									<span className='font-semibold'>{user?.fullName}</span>
								</div>
								<Link
									to='/profile'
									className='px-4 py-2 hover:bg-gray-800 rounded-lg'>
									My Profile
								</Link>
								<Link
									to='/my-learning'
									className='px-4 py-2 hover:bg-gray-800 rounded-lg'>
									My Learning
								</Link>
								<button
									onClick={handleLogout}
									className='text-left px-4 py-2 hover:bg-gray-800 rounded-lg text-red-400'>
									Logout
								</button>
							</>
						) : (
							<Link
								to='/login'
								className='mx-4 px-6 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 text-center'>
								Login
							</Link>
						)}
					</div>
				</div>
			)}
		</nav>
	);
}
