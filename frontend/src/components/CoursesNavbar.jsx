import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function CoursesNavbar() {
	const [showProfileMenu, setShowProfileMenu] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const { user, isAuthenticated, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const navItems = [
		{ label: "Free Courses", to: "/free-courses" },
		{
			label: "Program Dashboard",
			to: isAuthenticated ? "/my-learning" : "/login",
		},
	];

	const handleNavClick = () => {
		setMobileMenuOpen(false);
	};

	useEffect(() => {
		setShowProfileMenu(false);
		setMobileMenuOpen(false);
	}, [location]);

	const handleLogout = () => {
		setShowProfileMenu(false);
		logout();
		navigate("/", { replace: true });
	};

	return (
		<nav className='bg-[rgba(22,11,46,0.7)] backdrop-blur-lg text-white px-4 md:px-6 py-4 fixed w-full top-0 z-50 shadow-[0_8px_32px_rgba(139,92,246,0.15)] border-b border-[rgba(139,92,246,0.1)]'>
			<div className='max-w-7xl mx-auto flex items-center justify-between'>
				{/* Logo */}
				<Link to='/' className='flex items-center space-x-2 group'>
					<img 
					src='/yuganta-logo.png' 
					alt='YugantaAI' 
					className='w-10 h-10 transition-transform group-hover:scale-110'
				/>
				<div className='text-lg md:text-xl font-bold'>
					<span className='text-white'>Yuganta</span>
					<span className='text-[#A855F7]'>AI</span>
				</div>
			</Link>

			{/* Desktop Navigation */}
				<div className='hidden md:flex items-center flex-1 justify-center ml-8'>
					<div className='flex items-center gap-6'>
						{navItems.map((item) => (
							<Link
								key={item.label}
								to={item.to}
								onClick={handleNavClick}
								className='text-xs font-semibold uppercase tracking-wide text-[#C7C3D6] hover:text-[#A855F7] transition-all duration-200 whitespace-nowrap relative after:content-[""] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#A855F7] after:transition-all after:duration-300 hover:after:w-full'>
								{item.label}
							</Link>
						))}
					</div>
				</div>

				{/* Right Section */}
				<div className='hidden md:flex items-center gap-4'>
					{isAuthenticated ? (
						<div className='relative'>
							<button
								onClick={() => setShowProfileMenu(!showProfileMenu)}
								className='flex items-center space-x-3 px-4 py-2 border border-[#8B5CF6] rounded-xl hover:bg-[rgba(139,92,246,0.1)] transition-all duration-200'>
								<div className='w-8 h-8 bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] rounded-full flex items-center justify-center text-white font-semibold'>
									{user?.name?.charAt(0).toUpperCase() || 'U'}
								</div>
								<span className='text-sm font-medium'>{user?.name}</span>
								<svg
									className={`w-4 h-4 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
								</svg>
							</button>

							{showProfileMenu && (
								<div className='absolute right-0 mt-2 w-64 bg-[#1a0f2e] border border-[rgba(139,92,246,0.3)] rounded-xl shadow-xl py-2 z-50'>
									<Link
										to='/profile'
										className='block px-4 py-3 text-sm text-[#C7C3D6] hover:bg-[rgba(139,92,246,0.1)] hover:text-[#A855F7] transition-colors'>
										Profile
									</Link>
									<Link
										to='/my-learning'
										className='block px-4 py-3 text-sm text-[#C7C3D6] hover:bg-[rgba(139,92,246,0.1)] hover:text-[#A855F7] transition-colors'>
										My Learning
									</Link>
									<Link
										to='/mentorships'
										className='block px-4 py-3 text-sm text-[#C7C3D6] hover:bg-[rgba(139,92,246,0.1)] hover:text-[#A855F7] transition-colors'>
										My Mentorships
									</Link>
									<button
										onClick={handleLogout}
										className='w-full text-left px-4 py-3 text-sm text-[#C7C3D6] hover:bg-[rgba(139,92,246,0.1)] hover:text-[#A855F7] transition-colors'>
										Logout
									</button>
								</div>
							)}
						</div>
					) : (
						<>
							<Link
								to='/login'
								className='px-6 py-2 text-sm font-semibold text-[#C7C3D6] hover:text-[#A855F7] transition-colors'>
								Login
							</Link>
							<Link
								to='/signup'
								className='px-6 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] rounded-xl text-sm font-semibold hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all duration-200'>
								Sign Up
							</Link>
						</>
					)}
				</div>

				{/* Mobile menu button */}
				<button
					onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					className='md:hidden p-2 rounded-lg hover:bg-[rgba(139,92,246,0.1)] transition-colors'>
					<svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
						{mobileMenuOpen ? (
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
						) : (
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
						)}
					</svg>
				</button>
			</div>

			{/* Mobile Menu */}
			{mobileMenuOpen && (
				<div className='md:hidden mt-4 pb-4 border-t border-[rgba(139,92,246,0.2)]'>
					<div className='flex flex-col space-y-2 mt-4'>
						{navItems.map((item) => (
							<Link
								key={item.label}
								to={item.to}
								onClick={handleNavClick}
								className='px-4 py-2 text-sm text-[#C7C3D6] hover:text-[#A855F7] hover:bg-[rgba(139,92,246,0.1)] rounded-lg transition-all'>
								{item.label}
							</Link>
						))}
						{isAuthenticated ? (
							<>
								<Link
									to='/profile'
									onClick={handleNavClick}
									className='px-4 py-2 text-sm text-[#C7C3D6] hover:text-[#A855F7] hover:bg-[rgba(139,92,246,0.1)] rounded-lg transition-all'>
									Profile
								</Link>
								<Link
									to='/my-learning'
									onClick={handleNavClick}
									className='px-4 py-2 text-sm text-[#C7C3D6] hover:text-[#A855F7] hover:bg-[rgba(139,92,246,0.1)] rounded-lg transition-all'>
									My Learning
								</Link>
								<Link
									to='/mentorships'
									onClick={handleNavClick}
									className='px-4 py-2 text-sm text-[#C7C3D6] hover:text-[#A855F7] hover:bg-[rgba(139,92,246,0.1)] rounded-lg transition-all'>
									My Mentorships
								</Link>
								<button
									onClick={handleLogout}
									className='px-4 py-2 text-sm text-[#C7C3D6] hover:text-[#A855F7] hover:bg-[rgba(139,92,246,0.1)] rounded-lg transition-all text-left'>
									Logout
								</button>
							</>
						) : (
							<>
								<Link
									to='/login'
									onClick={handleNavClick}
									className='px-4 py-2 text-sm text-[#C7C3D6] hover:text-[#A855F7] hover:bg-[rgba(139,92,246,0.1)] rounded-lg transition-all'>
									Login
								</Link>
								<Link
									to='/signup'
									onClick={handleNavClick}
									className='mx-4 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] rounded-xl text-sm font-semibold text-center'>
									Sign Up
								</Link>
							</>
						)}
					</div>
				</div>
			)}
		</nav>
	);
}
