import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
      alert(`Instructor ${data.instructor.name} created successfully! They can now setup their password using the forgot password link.`);
    } catch (error) {
      console.error("Add instructor error:", error);
      alert("Failed to add instructor");
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
    } catch (error) {
      console.error("Delete instructor error:", error);
      alert("Failed to delete instructor");
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
    } catch (error) {
      console.error("Update instructor error:", error);
      alert("Failed to update instructor status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthed");
    localStorage.removeItem("adminToken");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-28 pb-16">
      <AdminNavbar />
      <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Admin Panel</p>
            <h1 className="text-3xl font-bold">Instructor Management</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 space-y-2">
            <p className="text-sm text-gray-400">Total Instructors</p>
            <div className="text-3xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 space-y-2">
            <p className="text-sm text-gray-400">Active</p>
            <div className="text-3xl font-bold">{stats.active}</div>
          </div>
          <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 space-y-2">
            <p className="text-sm text-gray-400">Approved</p>
            <div className="text-3xl font-bold">{stats.approved}</div>
          </div>
          <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 space-y-2">
            <p className="text-sm text-gray-400">Inactive</p>
            <div className="text-3xl font-bold">{stats.total - stats.active}</div>
          </div>
        </div>

        <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">Add New Instructor</h2>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
              placeholder="Name"
            />
            <input
              value={form.expertise}
              onChange={(e) => setForm((f) => ({ ...f, expertise: e.target.value }))}
              className="bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
              placeholder="Expertise"
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
              placeholder="Email"
            />
            <input
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              className="bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
              placeholder="Bio (optional)"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold px-4 py-3 transition shadow-lg hover:shadow-xl active:scale-95 whitespace-nowrap">
              Add Instructor
            </button>
          </form>
        </div>

        <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">Instructor List</h2>
          {loading ? (
            <p className="text-sm text-gray-400">Loading instructors...</p>
          ) : (
            <div className="divide-y divide-white/5">
              {instructors.length === 0 && (
                <p className="text-sm text-gray-400">No instructors yet. Add one above.</p>
              )}
              {instructors.map((instructor) => (
                <div key={instructor._id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-lg font-semibold">{instructor.name}</p>
                    <p className="text-sm text-gray-400">{instructor.expertise}</p>
                    <p className="text-sm text-gray-500">{instructor.email}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        instructor.active ? "bg-green-500/20 text-green-300" : "bg-gray-500/20 text-gray-300"
                      }`}>
                      {instructor.active ? "Active" : "Inactive"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        instructor.approved ? "bg-blue-500/20 text-blue-300" : "bg-yellow-500/20 text-yellow-300"
                      }`}>
                      {instructor.approved ? "Approved" : "Pending"}
                    </span>
                    <button
                      onClick={() => handleToggleActive(instructor._id, instructor.active)}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold transition shadow-md hover:shadow-lg active:scale-95 text-sm">
                      {instructor.active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleDelete(instructor._id)}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold transition shadow-md hover:shadow-lg active:scale-95 text-sm">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>


    </div>
  );
}
