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
    <nav className="fixed top-0 left-0 right-0 bg-[#0a0a0a] border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            <div className="flex gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    location.pathname === link.path
                      ? "bg-white text-black"
                      : "text-gray-300 hover:text-white"
                  }`}>
                  {link.label}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg border border-white/20 text-gray-200 hover:bg-white/5 transition">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
