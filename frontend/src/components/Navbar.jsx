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
					<img 
						src='/yugantha-logo.png' 
						alt='YuganthaAI' 
						className='w-10 h-10'
					/>
					<div className='text-lg md:text-xl font-bold'>
						<span className='text-white'>Yugantha</span>
						<span className='text-blue-400'>AI</span>
					</div>
				</Link>

				{/* Desktop Navigation */}
				<div className='hidden md:flex items-center flex-1 justify-between ml-8'>
					{/* Navigation Links */}
					<div className='flex items-center gap-6'>
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

					{/* Right Section: Explore + Profile */}
					<div className='flex items-center gap-4 ml-8'>
						{/* Explore Dropdown */}
						<div className='relative'>
							<button
								onClick={() => setShowExplore(!showExplore)}
								className='flex items-center space-x-2 px-4 py-2 border border-gray-600 rounded-lg hover:border-gray-400 transition duration-200 text-sm'>
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
								<div className='absolute top-full mt-2 bg-gray-800 rounded-lg shadow-xl py-2 w-48 right-0'>
									<Link
										to='/courses'
										className='block px-4 py-2 hover:bg-gray-700'>
										Courses
									</Link>
									<Link
										to='/my-learning'
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
									className='w-[50px] h-[50px] bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-lg hover:shadow-xl transition duration-200'>
									{user?.fullName?.charAt(0).toUpperCase()}
								</button>

							{showProfileMenu && (
								<div className='absolute top-full right-0 mt-2 bg-gray-800 rounded-lg shadow-xl py-2 w-48'>
									<Link
										to='/my-learning'
										onClick={() =>
											setShowProfileMenu(false)
										}
										className='block px-4 py-2 hover:bg-gray-700'>
										Registered Courses
									</Link>
									<Link
										to='/profile'
										onClick={() =>
											setShowProfileMenu(false)
										}
										className='block px-4 py-2 hover:bg-gray-700'>
										Edit Profile
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
								className='px-6 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition duration-200 text-sm'>
								Login
							</Link>
						)}
					</div>
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

						<Link
							to='/courses'
							className='px-4 py-2 hover:bg-gray-800 rounded-lg'>
							Courses
						</Link>
						<Link
							to='/my-learning'
							className='px-4 py-2 hover:bg-gray-800 rounded-lg'>
							Learning Paths
						</Link>
						<Link
							to='/courses'
							className='px-4 py-2 hover:bg-gray-800 rounded-lg'>
							Programs
						</Link>
						
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
