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
		<nav className='bg-[rgba(22,11,46,0.7)] backdrop-blur-lg text-white px-4 md:px-6 py-4 fixed w-full top-0 z-50 shadow-[0_8px_32px_rgba(139,92,246,0.15)] border-b border-[rgba(139,92,246,0.1)]'>
			<div className='max-w-7xl mx-auto flex items-center justify-between'>
				{/* Logo */}
				<Link to='/' className='flex items-center space-x-2 group'>
					<img
						src='/yuganta-logo.png'
						alt='yugantaAI'
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

						{/* Services Dropdown */}
						<div
							ref={servicesDropdownRef}
							className='relative group'
						>
							<button
								onClick={() => setShowServicesDropdown(!showServicesDropdown)}
								className='text-xs font-semibold uppercase tracking-wide text-[#C7C3D6] hover:text-[#A855F7] transition-all duration-200 whitespace-nowrap flex items-center gap-1'
							>
								Services
								<svg className={`w-4 h-4 transition-transform ${showServicesDropdown ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
								</svg>
							</button>

							{showServicesDropdown && (
								<div className='absolute top-full left-0 mt-2 w-56 bg-[#1a0f3a] border border-[rgba(139,92,246,0.2)] rounded-lg shadow-xl py-2 z-50'>
									{serviceItems.map((service) => (
										<Link
											key={service.label}
											to={service.to}
											onClick={() => {
												handleNavClick();
												setShowServicesDropdown(false);
											}}
											className='block px-4 py-3 text-sm text-[#C7C3D6] hover:text-[#A855F7] hover:bg-[rgba(139,92,246,0.1)] transition-all'>
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
						title={theme === "dark" ? "Dark Mode" : "Light Mode"}
					>
						<span className='text-lg text-[var(--icon-color)]'>{theme === "dark" ? "🌙" : "☀️"}</span>
					</button>
				</div>

				{/* Mobile actions */}
				<div className='md:hidden flex items-center gap-2'>
					<button
						onClick={toggleTheme}
						className='p-2 rounded-lg border border-[#8B5CF6] hover:bg-[rgba(139,92,246,0.1)] transition-colors'
						aria-label='Toggle Theme'
						title={theme === "dark" ? "Dark Mode" : "Light Mode"}
					>
						<span className='text-lg text-[var(--icon-color)]'>{theme === "dark" ? "🌙" : "☀️"}</span>
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
									className='px-4 py-2 pl-8 text-sm text-[#C7C3D6] hover:text-[#A855F7] hover:bg-[rgba(139,92,246,0.1)] rounded-lg transition-all block'>
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
