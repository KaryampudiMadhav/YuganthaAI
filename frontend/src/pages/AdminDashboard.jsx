import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);
  const [form, setForm] = useState({ name: "", expertise: "", email: "", bio: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authed = localStorage.getItem("adminAuthed") === "true";
    const token = localStorage.getItem("adminToken");
    if (!authed || !token) {
      navigate("/admin/login", { replace: true });
    } else {
      fetchInstructors();
    }
  }, [navigate]);

  const fetchInstructors = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:5000/api/admin/instructors", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        throw new Error("Failed to fetch instructors");
      }

      const data = await response.json();
      setInstructors(data);
    } catch (error) {
      console.error("Fetch instructors error:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const active = instructors.filter((i) => i.active).length;
    const approved = instructors.filter((i) => i.approved).length;
    const total = instructors.length;
    return { active, approved, total };
  }, [instructors]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.expertise || !form.email) return;
    
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:5000/api/admin/instructors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        throw new Error("Failed to add instructor");
      }

      const data = await response.json();
      setInstructors((prev) => [data.instructor, ...prev]);
      setForm({ name: "", expertise: "", email: "", bio: "" });
      toast.success(`Instructor ${data.instructor.name} created successfully! They can now setup their password using the forgot password link.`);
    } catch (error) {
      console.error("Add instructor error:", error);
      toast.error("Failed to add instructor");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this instructor?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `http://localhost:5000/api/admin/instructors/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        throw new Error("Failed to delete instructor");
      }

      setInstructors((prev) => prev.filter((i) => i._id !== id));
      toast.success("Instructor deleted successfully");
    } catch (error) {
      console.error("Delete instructor error:", error);
      toast.error("Failed to delete instructor");
    }
  };

  const handleToggleActive = async (id, currentActive) => {
    try {
      const token = localStorage.getItem("adminToken");
      const endpoint = currentActive ? "deactivate" : "activate";
      const response = await fetch(
        `http://localhost:5000/api/admin/instructors/${id}/${endpoint}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        throw new Error("Failed to update instructor");
      }

      const updated = await response.json();
      setInstructors((prev) => prev.map((i) => (i._id === id ? updated.instructor : i)));
      toast.success(`Instructor ${currentActive ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      console.error("Update instructor error:", error);
      toast.error("Failed to update instructor status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthed");
    localStorage.removeItem("adminToken");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0614] via-[#160B2E] to-[#1a0f3a] text-white pt-24 md:pt-28 pb-16">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-10">
        {/* Header */}
        <div className="space-y-2">
          <p className="text-sm text-[#9A93B5] font-semibold uppercase tracking-wider">Management</p>
          <h1 className="text-4xl md:text-5xl font-bold">Instructor Management</h1>
          <p className="text-[#C7C3D6] mt-2">Manage and organize instructors for your platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-[rgba(139,92,246,0.15)] to-[rgba(139,92,246,0.05)] border border-[rgba(139,92,246,0.25)] rounded-2xl p-6 hover:shadow-[0_8px_32px_rgba(139,92,246,0.2)] hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-[#C7C3D6] font-semibold">Total Instructors</p>
              <svg className='w-6 h-6 text-[#A855F7] opacity-50' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v2h8v-2zM16 15v2h2v-2zM4 15v2H2v-2z' />
              </svg>
            </div>
            <div className='text-4xl font-bold text-transparent bg-gradient-to-r from-[#A855F7] to-[#EC4899] bg-clip-text'>{stats.total}</div>
          </div>
          <div className="bg-gradient-to-br from-[rgba(168,85,247,0.15)] to-[rgba(168,85,247,0.05)] border border-[rgba(168,85,247,0.25)] rounded-2xl p-6 hover:shadow-[0_8px_32px_rgba(168,85,247,0.2)] hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-[#C7C3D6] font-semibold">Active</p>
              <svg className='w-6 h-6 text-[#A855F7] opacity-50' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 3.062v6.648a3.066 3.066 0 01-3.062 3.062H9.231A9.065 9.065 0 007.000 16.89a9.065 9.065 0 00-2.231.274H4.267a3.066 3.066 0 01-3.062-3.062V6.517a3.066 3.066 0 012.812-3.062zM9 12a1 1 0 11-2 0 1 1 0 012 0z' clipRule='evenodd' />
              </svg>
            </div>
            <div className='text-4xl font-bold text-transparent bg-gradient-to-r from-[#A855F7] to-[#D946EF] bg-clip-text'>{stats.active}</div>
          </div>
          <div className="bg-gradient-to-br from-[rgba(236,72,153,0.15)] to-[rgba(236,72,153,0.05)] border border-[rgba(236,72,153,0.25)] rounded-2xl p-6 hover:shadow-[0_8px_32px_rgba(236,72,153,0.2)] hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-[#C7C3D6] font-semibold">Approved</p>
              <svg className='w-6 h-6 text-[#EC4899] opacity-50' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
              </svg>
            </div>
            <div className='text-4xl font-bold text-transparent bg-gradient-to-r from-[#EC4899] to-[#D946EF] bg-clip-text'>{stats.approved}</div>
          </div>
          <div className="bg-gradient-to-br from-[rgba(157,139,248,0.15)] to-[rgba(157,139,248,0.05)] border border-[rgba(157,139,248,0.25)] rounded-2xl p-6 hover:shadow-[0_8px_32px_rgba(157,139,248,0.2)] hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-[#C7C3D6] font-semibold">Inactive</p>
              <svg className='w-6 h-6 text-[#9A93B5] opacity-50' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M13.477 14.89A6 6 0 015.11 2.527a6 6 0 008.367 8.368z' clipRule='evenodd' />
              </svg>
            </div>
            <div className='text-4xl font-bold text-transparent bg-gradient-to-r from-[#9A93B5] to-[#A855F7] bg-clip-text'>{stats.total - stats.active}</div>
          </div>
        </div>

        {/* Add Instructor Form */}
        <div className="bg-gradient-to-br from-[#12091F] to-[#0B0614] border border-[rgba(139,92,246,0.2)] rounded-2xl p-8 shadow-[0_8px_32px_rgba(139,92,246,0.1)]">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">Add New Instructor</h2>
            <p className="text-[#C7C3D6] text-sm">Create a new instructor account for your team</p>
          </div>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="bg-[#0B0614] border border-[#2A1F4D] rounded-lg px-4 py-3.5 text-white placeholder-[#9A93B5] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6] transition duration-300"
              placeholder="Full Name"
              required
            />
            <input
              value={form.expertise}
              onChange={(e) => setForm((f) => ({ ...f, expertise: e.target.value }))}
              className="bg-[#0B0614] border border-[#2A1F4D] rounded-lg px-4 py-3.5 text-white placeholder-[#9A93B5] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6] transition duration-300"
              placeholder="Expertise"
              required
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="bg-[#0B0614] border border-[#2A1F4D] rounded-lg px-4 py-3.5 text-white placeholder-[#9A93B5] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6] transition duration-300"
              placeholder="Email Address"
              required
            />
            <input
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              className="bg-[#0B0614] border border-[#2A1F4D] rounded-lg px-4 py-3.5 text-white placeholder-[#9A93B5] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6] transition duration-300"
              placeholder="Bio (optional)"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#A855F7] hover:to-[#D946EF] text-white rounded-lg font-bold px-6 py-3.5 transition-all duration-300 shadow-[0_4px_16px_rgba(139,92,246,0.3)] hover:shadow-[0_6px_24px_rgba(139,92,246,0.5)] hover:scale-105 active:scale-100 whitespace-nowrap group flex items-center justify-center gap-2">
              <svg className='w-5 h-5 group-hover:rotate-90 transition-transform duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M12 4v16m8-8H4' />
              </svg>
              Add
            </button>
          </form>
        </div>

        {/* Instructors List */}
        <div className="bg-gradient-to-br from-[#12091F] to-[#0B0614] border border-[rgba(139,92,246,0.2)] rounded-2xl p-8 shadow-[0_8px_32px_rgba(139,92,246,0.1)]">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">Instructors</h2>
            <p className="text-[#C7C3D6] text-sm">{instructors.length} instructor{instructors.length !== 1 ? 's' : ''} on platform</p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin">
                <svg className='w-8 h-8 text-[#A855F7]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                </svg>
              </div>
              <p className="text-[#C7C3D6] mt-3">Loading instructors...</p>
            </div>
          ) : (
            <div className="space-y-0 divide-y divide-[rgba(139,92,246,0.1)]">
              {instructors.length === 0 ? (
                <p className="text-center py-12 text-[#9A93B5]">No instructors yet. Add one above to get started.</p>
              ) : (
                instructors.map((instructor) => (
                  <div key={instructor._id} className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[rgba(139,92,246,0.05)] px-4 rounded-lg transition duration-300">
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-semibold text-white truncate">{instructor.name}</p>
                      <p className="text-sm text-[#A855F7] font-medium">{instructor.expertise}</p>
                      <p className="text-sm text-[#C7C3D6]">{instructor.email}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                        instructor.active 
                          ? "bg-[rgba(34,197,94,0.2)] text-[#22c55e] border border-[rgba(34,197,94,0.3)]" 
                          : "bg-[rgba(156,163,175,0.2)] text-[#d1d5db] border border-[rgba(156,163,175,0.3)]"
                      }`}>
                        {instructor.active ? "✓ Active" : "○ Inactive"}
                      </span>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                        instructor.approved 
                          ? "bg-[rgba(139,92,246,0.2)] text-[#A855F7] border border-[rgba(139,92,246,0.3)]" 
                          : "bg-[rgba(251,146,60,0.2)] text-[#fb923c] border border-[rgba(251,146,60,0.3)]"
                      }`}>
                        {instructor.approved ? "✓ Approved" : "◐ Pending"}
                      </span>
                      <button
                        onClick={() => handleToggleActive(instructor._id, instructor.active)}
                        className="px-4 py-2 rounded-lg bg-transparent border border-[#8B5CF6] text-[#A855F7] hover:bg-[rgba(139,92,246,0.1)] font-semibold transition-all duration-300 text-sm hover:shadow-[0_0_12px_rgba(139,92,246,0.3)]">
                        {instructor.active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDelete(instructor._id)}
                        className="px-4 py-2 rounded-lg bg-transparent border border-[#EC4899] text-[#EC4899] hover:bg-[rgba(236,72,153,0.1)] font-semibold transition-all duration-300 text-sm hover:shadow-[0_0_12px_rgba(236,72,153,0.3)]">
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
