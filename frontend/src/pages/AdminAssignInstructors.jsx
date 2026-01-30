import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Users, BookOpen, Check, ChevronDown, Sparkles, AlertCircle } from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";
import API_URL from "../config/api";

export default function AdminAssignInstructors() {
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchUserQuery, setSearchUserQuery] = useState("");
  const [searchInstructorQuery, setSearchInstructorQuery] = useState("");

  useEffect(() => {
    const authed = localStorage.getItem("adminAuthed") === "true";
    const token = localStorage.getItem("adminToken");
    if (!authed || !token) {
      navigate("/admin/login", { replace: true });
    } else {
      fetchData();
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      
      // Fetch instructors from registered instructors
      const instructorsRes = await fetch(`${API_URL}/api/admin/instructors`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (instructorsRes.status === 401) {
        handleLogout();
        return;
      }

      if (!instructorsRes.ok) throw new Error("Failed to fetch instructors");
      const instructorsData = await instructorsRes.json();
      setInstructors(instructorsData.filter((i) => i.active && i.approved));

      // Fetch users
      const usersRes = await fetch(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Fetch data error:", error);
    } finally {
      setLoading(false);
    }
  };

  const assignInstructor = async () => {
    if (!selectedUser || !selectedInstructor) {
      toast.error("Please select both a user and an instructor");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${API_URL}/api/admin/assign-instructor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: selectedUser._id,
            instructorId: selectedInstructor._id,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        throw new Error("Failed to assign instructor");
      }

      setSuccessMessage(`✅ ${selectedInstructor.name} assigned to ${selectedUser.fullName}`);
      setSelectedUser(null);
      setSelectedInstructor(null);
      setTimeout(() => setSuccessMessage(""), 5000);
      fetchData();
      toast.success(`${selectedInstructor.name} assigned to ${selectedUser.fullName}`);
    } catch (error) {
      console.error("Assign instructor error:", error);
      toast.error("Failed to assign instructor");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthed");
    localStorage.removeItem("adminToken");
    navigate("/admin/login", { replace: true });
  };

  // Filter users
  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchUserQuery.toLowerCase())
  );

  // Filter instructors
  const filteredInstructors = instructors.filter(instructor =>
    instructor.name.toLowerCase().includes(searchInstructorQuery.toLowerCase()) ||
    instructor.expertise.toLowerCase().includes(searchInstructorQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#12091F] via-[#0B0614] to-[#160B2E] text-white pt-28 pb-16">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-8 bg-gradient-to-b from-[#8B5CF6] to-[#EC4899] rounded-full"></div>
            <p className="text-sm font-semibold text-[#A855F7]">Admin Panel</p>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-[#C7C3D6] to-[#9A93B5] bg-clip-text text-transparent">
            Assign Instructors to Users
          </h1>
          <p className="text-[#9A93B5] text-lg">Select a user and assign an instructor to enable personalized 1:1 mentoring sessions</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/40 rounded-2xl p-5 text-green-300 shadow-[0_0_24px_rgba(34,197,94,0.15)] animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/30 flex items-center justify-center">
                <Check className="w-5 h-5" />
              </div>
              <span className="font-semibold">{successMessage}</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 border-4 border-[#8B5CF6]/20 border-t-[#8B5CF6] rounded-full animate-spin"></div>
            <p className="text-sm text-[#9A93B5] font-medium">Loading assignments...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Users List */}
              <div className="lg:col-span-1">
                <div className="bg-[rgba(22,11,46,0.4)] backdrop-blur-xl border border-[rgba(139,92,246,0.2)] rounded-2xl overflow-hidden flex flex-col h-[600px] shadow-[0_8px_32px_rgba(139,92,246,0.1)]">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-[#8B5CF6]/10 to-[#EC4899]/10 p-5 border-b border-[rgba(139,92,246,0.2)]">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-[#A855F7]" />
                      <h2 className="text-lg font-bold text-white">Users <span className="text-[#A855F7]">({filteredUsers.length})</span></h2>
                    </div>
                  </div>
                  
                  {/* Search */}
                  <div className="p-4 border-b border-[rgba(139,92,246,0.15)]">
                    <input
                      type="text"
                      placeholder="Search user..."
                      value={searchUserQuery}
                      onChange={(e) => setSearchUserQuery(e.target.value)}
                      className="w-full bg-[rgba(11,6,20,0.5)] border border-[rgba(139,92,246,0.3)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#9A93B5] focus:outline-none focus:border-[#8B5CF6] focus:shadow-[0_0_12px_rgba(139,92,246,0.3)] transition-all"
                    />
                  </div>

                  {/* List */}
                  <div className="flex-1 overflow-y-auto">
                    {filteredUsers.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-400">No users found</div>
                    ) : (
                      <div className="divide-y divide-[rgba(139,92,246,0.1)]">
                        {filteredUsers.map((user) => (
                          <div
                            key={user._id}
                            onClick={() => setSelectedUser(user)}
                            className={`p-4 cursor-pointer transition-all duration-300 border-l-4 ${
                              selectedUser?._id === user._id
                                ? "bg-gradient-to-r from-[#8B5CF6]/20 to-transparent border-[#8B5CF6] shadow-[0_0_16px_rgba(139,92,246,0.2)]"
                                : "border-transparent hover:bg-[rgba(139,92,246,0.05)] hover:border-[rgba(139,92,246,0.3)]"
                            }`}>
                            <p className="font-semibold text-sm text-white">{user.fullName}</p>
                            <p className="text-xs text-[#9A93B5] mt-1">{user.email}</p>
                            {user.assignedInstructor && (
                              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-[#8B5CF6]/20 to-[#EC4899]/20 border border-[#8B5CF6]/30 rounded-lg text-xs text-[#A855F7] font-medium">
                                <Check className="w-3 h-3" />
                                {user.assignedInstructor.name}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Instructors List */}
              <div className="lg:col-span-1">
                <div className="bg-[rgba(22,11,46,0.4)] backdrop-blur-xl border border-[rgba(139,92,246,0.2)] rounded-2xl overflow-hidden flex flex-col h-[600px] shadow-[0_8px_32px_rgba(139,92,246,0.1)]">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-[#8B5CF6]/10 to-[#EC4899]/10 p-5 border-b border-[rgba(139,92,246,0.2)]">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-[#EC4899]" />
                      <h2 className="text-lg font-bold text-white">Instructors <span className="text-[#EC4899]">({filteredInstructors.length})</span></h2>
                    </div>
                  </div>
                  
                  {/* Search */}
                  <div className="p-4 border-b border-[rgba(139,92,246,0.15)]">
                    <input
                      type="text"
                      placeholder="Search instructor..."
                      value={searchInstructorQuery}
                      onChange={(e) => setSearchInstructorQuery(e.target.value)}
                      className="w-full bg-[rgba(11,6,20,0.5)] border border-[rgba(139,92,246,0.3)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#9A93B5] focus:outline-none focus:border-[#8B5CF6] focus:shadow-[0_0_12px_rgba(139,92,246,0.3)] transition-all"
                    />
                  </div>

                  {/* List */}
                  <div className="flex-1 overflow-y-auto">
                    {filteredInstructors.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-400">
                        {instructors.length === 0
                          ? "No active instructors available"
                          : "No instructors match search"}
                      </div>
                    ) : (
                      <div className="divide-y divide-[rgba(139,92,246,0.1)]">
                        {filteredInstructors.map((instructor) => (
                          <div
                            key={instructor._id}
                            onClick={() => setSelectedInstructor(instructor)}
                            className={`p-4 cursor-pointer transition-all duration-300 border-l-4 ${
                              selectedInstructor?._id === instructor._id
                                ? "bg-gradient-to-r from-[#EC4899]/20 to-transparent border-[#EC4899] shadow-[0_0_16px_rgba(236,72,153,0.2)]"
                                : "border-transparent hover:bg-[rgba(139,92,246,0.05)] hover:border-[rgba(236,72,153,0.3)]"
                            }`}>
                            <p className="font-semibold text-sm text-white">{instructor.name}</p>
                            <p className="text-xs text-[#A855F7] mt-1 font-medium">{instructor.expertise}</p>
                            <p className="text-xs text-[#9A93B5] mt-1">{instructor.email}</p>
                            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg text-xs text-green-300 font-medium">
                              <Check className="w-3 h-3" />
                              Approved
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Assignment Panel */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-[#8B5CF6]/10 via-[#EC4899]/10 to-[#8B5CF6]/5 border border-[rgba(139,92,246,0.3)] rounded-2xl p-6 h-[600px] flex flex-col justify-between shadow-[0_8px_32px_rgba(139,92,246,0.2)]">
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs text-[#A855F7] uppercase tracking-wider mb-3 font-bold flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        From User
                      </p>
                      {selectedUser ? (
                        <div className="bg-[rgba(11,6,20,0.6)] rounded-xl p-4 border border-[rgba(139,92,246,0.3)] shadow-[0_4px_16px_rgba(139,92,246,0.15)]">
                          <p className="font-bold text-white">{selectedUser.fullName}</p>
                          <p className="text-sm text-[#9A93B5] mt-1">{selectedUser.email}</p>
                          {selectedUser.assignedInstructor && (
                            <p className="text-xs text-yellow-300 mt-2 flex items-center gap-1.5">
                              <AlertCircle className="w-3 h-3" />
                              Currently: {selectedUser.assignedInstructor.name}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="bg-[rgba(11,6,20,0.3)] rounded-xl p-4 border border-dashed border-[rgba(139,92,246,0.3)] text-[#9A93B5] text-sm">
                          Select a user from the list
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] flex items-center justify-center shadow-[0_0_24px_rgba(139,92,246,0.4)]">
                        <ChevronDown className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-[#EC4899] uppercase tracking-wider mb-3 font-bold flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        To Instructor
                      </p>
                      {selectedInstructor ? (
                        <div className="bg-[rgba(11,6,20,0.6)] rounded-xl p-4 border border-[rgba(236,72,153,0.3)] shadow-[0_4px_16px_rgba(236,72,153,0.15)]">
                          <p className="font-bold text-white">{selectedInstructor.name}</p>
                          <p className="text-sm text-[#A855F7] mt-1 font-medium">{selectedInstructor.expertise}</p>
                          <p className="text-xs text-[#9A93B5] mt-2">{selectedInstructor.email}</p>
                        </div>
                      ) : (
                        <div className="bg-[rgba(11,6,20,0.3)] rounded-xl p-4 border border-dashed border-[rgba(236,72,153,0.3)] text-[#9A93B5] text-sm">
                          Select an instructor from the list
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={assignInstructor}
                    disabled={!selectedUser || !selectedInstructor}
                    className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 text-base ${
                      selectedUser && selectedInstructor
                        ? "bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#EC4899] hover:shadow-[0_0_32px_rgba(139,92,246,0.4)] text-white"
                        : "bg-[rgba(139,92,246,0.2)] text-[#9A93B5] cursor-not-allowed border border-[rgba(139,92,246,0.3)]"
                    }`}>
                    {selectedUser && selectedInstructor ? "✨ Assign Now" : "Select Both to Continue"}
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-[#8B5CF6]/10 to-[#8B5CF6]/5 border border-[rgba(139,92,246,0.2)] rounded-2xl p-6 shadow-[0_4px_16px_rgba(139,92,246,0.1)] hover:shadow-[0_8px_24px_rgba(139,92,246,0.2)] transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#A855F7] flex items-center justify-center shadow-[0_0_16px_rgba(139,92,246,0.4)]">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs text-[#A855F7] uppercase tracking-wider font-bold">Total Users</p>
                </div>
                <p className="text-4xl font-bold text-white">{users.length}</p>
              </div>
              <div className="bg-gradient-to-br from-[#EC4899]/10 to-[#EC4899]/5 border border-[rgba(236,72,153,0.2)] rounded-2xl p-6 shadow-[0_4px_16px_rgba(236,72,153,0.1)] hover:shadow-[0_8px_24px_rgba(236,72,153,0.2)] transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#EC4899] to-[#D946EF] flex items-center justify-center shadow-[0_0_16px_rgba(236,72,153,0.4)]">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs text-[#EC4899] uppercase tracking-wider font-bold">Total Instructors</p>
                </div>
                <p className="text-4xl font-bold text-white">{instructors.length}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-2xl p-6 shadow-[0_4px_16px_rgba(34,197,94,0.1)] hover:shadow-[0_8px_24px_rgba(34,197,94,0.2)] transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-[0_0_16px_rgba(34,197,94,0.4)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs text-green-400 uppercase tracking-wider font-bold">Assignments Done</p>
                </div>
                <p className="text-4xl font-bold text-white">{users.filter(u => u.assignedInstructor).length}</p>
              </div>
            </div>
          </div>
        )}
 
        {/* Selection Summary and Assign Button */}
        {!loading && (
          <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-semibold">Assignment Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0a0a0a] rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Selected User</p>
                {selectedUser ? (
                  <div>
                    <p className="font-semibold">{selectedUser.fullName}</p>
                    <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No user selected</p>
                )}
              </div>
              <div className="bg-[#0a0a0a] rounded-lg p-4 flex items-center justify-center">
                <p className="text-2xl">→</p>
              </div>
              <div className="bg-[#0a0a0a] rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Selected Instructor</p>
                {selectedInstructor ? (
                  <div>
                    <p className="font-semibold">{selectedInstructor.name}</p>
                    <p className="text-sm text-gray-500">{selectedInstructor.expertise}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No instructor selected</p>
                )}
              </div>
            </div>
            <button
              onClick={assignInstructor}
              disabled={!selectedUser || !selectedInstructor}
              className={`w-full py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl active:scale-95 ${
                selectedUser && selectedInstructor
                  ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                  : "bg-gray-500 text-gray-300 cursor-not-allowed"
              }`}>
              Assign Instructor
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
