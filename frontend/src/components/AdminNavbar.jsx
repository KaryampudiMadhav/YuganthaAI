import { useNavigate, useLocation } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { label: "Instructor Management", path: "/admin/dashboard" },
    { label: "Assign Instructors", path: "/admin/assign-instructors" },
    { label: "Mentor Assignments", path: "/admin/mentor-assignments" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminAuthed");
    localStorage.removeItem("adminToken");
    navigate("/admin/login", { replace: true });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[rgba(22,11,46,0.8)] backdrop-blur-xl border-b border-[rgba(139,92,246,0.2)] z-50 shadow-[0_8px_32px_rgba(139,92,246,0.1)]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4 md:gap-8">
            <div className='flex items-center space-x-3'>
              <img
                src='/yugantha-logo.png'
                alt='YuganthaAI'
                className='w-10 h-10 transition-transform hover:scale-110'
              />
              <h1 className="text-xl font-bold text-white hidden sm:block">
                <span>Yugantha</span>
                <span className='bg-gradient-to-r from-[#A855F7] to-[#EC4899] bg-clip-text text-transparent'>AI</span>
              </h1>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`px-4 py-2.5 rounded-none font-semibold transition-all duration-300 text-sm border-b-2 ${location.pathname === link.path
                      ? "border-b-[#8B5CF6] text-white"
                      : "border-b-transparent text-[#C7C3D6] hover:text-white"
                    }`}>
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-lg border border-[#EC4899] text-[#EC4899] hover:bg-[rgba(236,72,153,0.1)] font-semibold transition-all duration-300 text-sm hover:shadow-[0_0_16px_rgba(236,72,153,0.3)]">
            Logout
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex gap-2 mt-3 overflow-x-auto">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`px-3 py-2 rounded-none font-semibold transition-all duration-300 text-xs whitespace-nowrap border-b-2 ${location.pathname === link.path
                  ? "border-b-[#8B5CF6] text-white"
                  : "border-b-transparent text-[#C7C3D6] hover:text-white"
                }`}>
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
