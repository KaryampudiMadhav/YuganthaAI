import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function MainNavbar() {
	const [showProfileMenu, setShowProfileMenu] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [showServicesDropdown, setShowServicesDropdown] = useState(false);
	const servicesDropdownRef = useRef(null);
	const { user, isAuthenticated, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const { theme, toggleTheme } = useTheme();

	const navItems = [
		{ label: "Home", to: "/" },
		{ label: "About", to: "/about" },
		{ label: "Contact", to: "/contact" },
		{ label: "Blogs", to: "/blogs" },
	];

	const serviceItems = [
		{ label: "Court Booker", to: "/projects/court-booker" },
		{ label: "AI Agent Avatar", to: "/projects/ai-agent-avatar" },
		{ label: "HVAC Agent", to: "/projects/hvac-agent" },
		{ label: "AI Learning Platform", to: "/projects/ai-learning-platform" },
	];

	const handleNavClick = () => {
		setMobileMenuOpen(false);
	};

	useEffect(() => {
		setShowProfileMenu(false);
		setMobileMenuOpen(false);
		setShowServicesDropdown(false);
	}, [location]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target)) {
				setShowServicesDropdown(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleLogout = () => {
		setShowProfileMenu(false);
		logout();
		navigate("/", { replace: true });
	};

	return (
		<nav className='bg-nav-bg backdrop-blur-lg text-[var(--text-color)] px-4 md:px-6 py-4 fixed w-full top-0 z-50 shadow-[0_8px_32px_rgba(139,92,246,0.15)] border-b border-[rgba(139,92,246,0.1)] transition-colors duration-300'>
			<div className='max-w-7xl mx-auto flex items-center justify-between'>
				{/* Logo */}
				<Link to='/' className='flex items-center space-x-2 group'>
					<img
						src='/yuganta-logo.png'
						alt='yugantaAI'
						className='w-10 h-10 transition-transform group-hover:scale-110'
					/>
					<div className='text-lg md:text-xl font-bold'>
						<span className='text-[var(--text-color)]'>Yuganta</span>
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

						{/* Services Dropdown */}
						<div
							ref={servicesDropdownRef}
							className='relative group'
						>
							<button
								onClick={() => setShowServicesDropdown(!showServicesDropdown)}
								className='text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] hover:text-[#A855F7] transition-all duration-200 whitespace-nowrap flex items-center gap-1'
							>
								Services
								<svg className={`w-4 h-4 transition-transform ${showServicesDropdown ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
								</svg>
							</button>

							{showServicesDropdown && (
								<div className='absolute top-full left-0 mt-2 w-56 bg-[var(--dropdown-bg)] border border-[rgba(139,92,246,0.2)] rounded-lg shadow-xl py-2 z-50 transition-colors duration-300'>
									{serviceItems.map((service) => (
										<Link
											key={service.label}
											to={service.to}
											onClick={() => {
												handleNavClick();
												setShowServicesDropdown(false);
											}}
											className='block px-4 py-3 text-sm text-dropdown-text hover:text-[#A855F7] hover:bg-[rgba(139,92,246,0.1)] transition-all'>
											{service.label}
										</Link>
									))}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Right Section */}
				<div className='hidden md:flex items-center gap-4'>
					<button
						onClick={toggleTheme}
						className='px-3 py-2 border border-[#8B5CF6] rounded-xl hover:bg-[rgba(139,92,246,0.1)] transition-all duration-200 text-sm'
						aria-label='Toggle Theme'
						title={theme === "dark-theme" ? "Dark Mode" : "Light Mode"}
					>
						<span className="w-5 h-5 flex items-center justify-center">
							{theme === "dark-theme" ? (
								// Sun (White in Dark Mode)
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									className="w-5 h-5 text-white"
									strokeWidth={2}
								>
									<circle cx="12" cy="12" r="5" fill="white" />
									<line x1="12" y1="1" x2="12" y2="4" stroke="white" />
									<line x1="12" y1="20" x2="12" y2="23" stroke="white" />
									<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="white" />
									<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="white" />
									<line x1="1" y1="12" x2="4" y2="12" stroke="white" />
									<line x1="20" y1="12" x2="23" y2="12" stroke="white" />
									<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="white" />
									<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="white" />
								</svg>
							) : (
								// Moon (Black in Light Mode)
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="black"
									className="w-5 h-5"
								>
									<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
								</svg>
							)}
						</span>
					</button>
				</div>

				{/* Mobile actions */}
				<div className='md:hidden flex items-center gap-2'>
					<button
						onClick={toggleTheme}
						className='p-2 rounded-lg border border-[#8B5CF6] hover:bg-[rgba(139,92,246,0.1)] transition-colors'
						aria-label='Toggle Theme'
						title={theme === "dark-theme" ? "Dark Mode" : "Light Mode"}
					>
						<span className="w-5 h-5 flex items-center justify-center">
							{theme === "dark-theme" ? (
								// Sun (White in Dark Mode)
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									className="w-5 h-5 text-white"
									strokeWidth={2}
								>
									<circle cx="12" cy="12" r="5" fill="white" />
									<line x1="12" y1="1" x2="12" y2="4" stroke="white" />
									<line x1="12" y1="20" x2="12" y2="23" stroke="white" />
									<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="white" />
									<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="white" />
									<line x1="1" y1="12" x2="4" y2="12" stroke="white" />
									<line x1="20" y1="12" x2="23" y2="12" stroke="white" />
									<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="white" />
									<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="white" />
								</svg>
							) : (
								// Moon (Black in Light Mode)
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="black"
									className="w-5 h-5"
								>
									<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
								</svg>
							)}
						</span>
					</button>
					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className='p-2 rounded-lg hover:bg-[rgba(139,92,246,0.1)] transition-colors'>
						<svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
							{mobileMenuOpen ? (
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
							) : (
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
							)}
						</svg>
					</button>
				</div>
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

						{/* Mobile Services Dropdown */}
						<div className='border-t border-[rgba(139,92,246,0.2)] pt-2 mt-2'>
							<div className='px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#A855F7]'>
								Services
							</div>
							{serviceItems.map((service) => (
								<Link
									key={service.label}
									to={service.to}
									onClick={handleNavClick}
									className='px-4 py-2 pl-8 text-sm text-dropdown-text hover:text-[#A855F7] hover:bg-[rgba(139,92,246,0.1)] rounded-lg transition-all block'>
									{service.label}
								</Link>
							))}
						</div>
					</div>
				</div>
			)}
		</nav>
	);
}