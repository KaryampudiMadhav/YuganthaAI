import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AdminNavbar from "../components/AdminNavbar";

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
      const instructorsRes = await fetch("http://localhost:5000/api/admin/instructors", {
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
      const usersRes = await fetch("http://localhost:5000/api/admin/users", {
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
        `http://localhost:5000/api/admin/assign-instructor`,
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
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-28 pb-16">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-8">
        {/* Header */}
        <div>
          <p className="text-sm text-gray-400">Admin Panel</p>
          <h1 className="text-4xl font-bold">Assign Instructors to Users</h1>
          <p className="text-gray-400 mt-2">Select a user and assign an instructor to enable 1:1 mentoring sessions</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-500/20 border border-green-500/40 rounded-2xl p-4 text-green-300">
            {successMessage}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <p className="text-sm text-gray-400">Loading...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Users List */}
              <div className="lg:col-span-1">
                <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden flex flex-col h-[600px]">
                  {/* Header */}
                  <div className="bg-[#0a0a0a] p-4 border-b border-white/5">
                    <h2 className="text-lg font-semibold">Users ({filteredUsers.length})</h2>
                  </div>
                  
                  {/* Search */}
                  <div className="p-4 border-b border-white/5">
                    <input
                      type="text"
                      placeholder="Search user..."
                      value={searchUserQuery}
                      onChange={(e) => setSearchUserQuery(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                    />
                  </div>

                  {/* List */}
                  <div className="flex-1 overflow-y-auto">
                    {filteredUsers.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-400">No users found</div>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {filteredUsers.map((user) => (
                          <div
                            key={user._id}
                            onClick={() => setSelectedUser(user)}
                            className={`p-4 cursor-pointer transition border-l-4 ${
                              selectedUser?._id === user._id
                                ? "bg-white/10 border-emerald-500"
                                : "border-transparent hover:bg-white/5 hover:border-white/20"
                            }`}>
                            <p className="font-semibold text-sm">{user.fullName}</p>
                            <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                            {user.assignedInstructor && (
                              <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 rounded text-xs text-blue-300">
                                ✓ {user.assignedInstructor.name}
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
                <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden flex flex-col h-[600px]">
                  {/* Header */}
                  <div className="bg-[#0a0a0a] p-4 border-b border-white/5">
                    <h2 className="text-lg font-semibold">Instructors ({filteredInstructors.length})</h2>
                  </div>
                  
                  {/* Search */}
                  <div className="p-4 border-b border-white/5">
                    <input
                      type="text"
                      placeholder="Search instructor..."
                      value={searchInstructorQuery}
                      onChange={(e) => setSearchInstructorQuery(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
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
                      <div className="divide-y divide-white/5">
                        {filteredInstructors.map((instructor) => (
                          <div
                            key={instructor._id}
                            onClick={() => setSelectedInstructor(instructor)}
                            className={`p-4 cursor-pointer transition border-l-4 ${
                              selectedInstructor?._id === instructor._id
                                ? "bg-white/10 border-emerald-500"
                                : "border-transparent hover:bg-white/5 hover:border-white/20"
                            }`}>
                            <p className="font-semibold text-sm">{instructor.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{instructor.expertise}</p>
                            <p className="text-xs text-gray-600 mt-1">{instructor.email}</p>
                            <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded text-xs text-green-300">
                              ✓ Approved
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
                <div className="bg-gradient-to-br from-emerald-900/20 to-green-900/20 border border-emerald-500/20 rounded-2xl p-6 h-[600px] flex flex-col justify-between">
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">From User</p>
                      {selectedUser ? (
                        <div className="bg-[#0f0f0f] rounded-lg p-4 border border-white/10">
                          <p className="font-semibold">{selectedUser.fullName}</p>
                          <p className="text-sm text-gray-400 mt-1">{selectedUser.email}</p>
                          {selectedUser.assignedInstructor && (
                            <p className="text-xs text-yellow-300 mt-2">Currently assigned to: {selectedUser.assignedInstructor.name}</p>
                          )}
                        </div>
                      ) : (
                        <div className="bg-[#0f0f0f] rounded-lg p-4 border border-white/10 text-gray-500 text-sm">
                          Select a user from the list
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center">
                      <div className="text-3xl opacity-50">↓</div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">To Instructor</p>
                      {selectedInstructor ? (
                        <div className="bg-[#0f0f0f] rounded-lg p-4 border border-white/10">
                          <p className="font-semibold">{selectedInstructor.name}</p>
                          <p className="text-sm text-gray-400 mt-1">{selectedInstructor.expertise}</p>
                          <p className="text-xs text-gray-500 mt-2">{selectedInstructor.email}</p>
                        </div>
                      ) : (
                        <div className="bg-[#0f0f0f] rounded-lg p-4 border border-white/10 text-gray-500 text-sm">
                          Select an instructor from the list
                        </div>
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
                    {selectedUser && selectedInstructor ? "Assign Now" : "Select Both"}
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0f0f0f] border border-white/5 rounded-lg p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Total Users</p>
                <p className="text-3xl font-bold mt-2">{users.length}</p>
              </div>
              <div className="bg-[#0f0f0f] border border-white/5 rounded-lg p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Total Instructors</p>
                <p className="text-3xl font-bold mt-2">{instructors.length}</p>
              </div>
              <div className="bg-[#0f0f0f] border border-white/5 rounded-lg p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Assignments Done</p>
                <p className="text-3xl font-bold mt-2">{users.filter(u => u.assignedInstructor).length}</p>
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
