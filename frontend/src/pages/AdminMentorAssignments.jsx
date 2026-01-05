import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminMentorAssignments() {
  const navigate = useNavigate();
  const [mentorAssignments, setMentorAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all"); // all, assigned, unassigned

  useEffect(() => {
    const authed = localStorage.getItem("adminAuthed") === "true";
    const token = localStorage.getItem("adminToken");
    if (!authed || !token) {
      navigate("/admin/login", { replace: true });
    } else {
      fetchMentorAssignments();
    }
  }, [navigate]);

  const fetchMentorAssignments = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      
      // Fetch all users (assignedInstructor is already populated by backend)
      const usersRes = await fetch("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (usersRes.status === 401) {
        handleLogout();
        return;
      }

      if (!usersRes.ok) throw new Error("Failed to fetch users");
      const users = await usersRes.json();

      // Map users to their assigned instructors
      // Note: assignedInstructor is already populated by the backend
      const assignments = users.map((user) => {
        const assignedInstructor = user.assignedInstructor;
        // Check if assignedInstructor exists and is an object (populated)
        const isAssigned = assignedInstructor && typeof assignedInstructor === 'object' && assignedInstructor._id;
        
        return {
          userId: user._id,
          userName: user.fullName,
          userEmail: user.email,
          mentorId: isAssigned ? assignedInstructor._id : null,
          mentorName: isAssigned ? assignedInstructor.name : "Not Assigned",
          mentorExpertise: isAssigned ? assignedInstructor.expertise : "-",
          mentorEmail: isAssigned ? assignedInstructor.email : "-",
          isAssigned: isAssigned,
        };
      });

      setMentorAssignments(assignments);
    } catch (error) {
      console.error("Fetch mentor assignments error:", error);
      alert("Failed to fetch mentor assignments");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthed");
    localStorage.removeItem("adminToken");
    navigate("/admin/login", { replace: true });
  };

  // Filter assignments
  const filteredAssignments = useMemo(() => {
    let filtered = mentorAssignments;

    // Apply filter
    if (filterBy === "assigned") {
      filtered = filtered.filter((a) => a.isAssigned);
    } else if (filterBy === "unassigned") {
      filtered = filtered.filter((a) => !a.isAssigned);
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.userName.toLowerCase().includes(query) ||
          a.userEmail.toLowerCase().includes(query) ||
          a.mentorName.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [mentorAssignments, filterBy, searchQuery]);

  // Group by mentor (only assigned students)
  const mentorGroups = useMemo(() => {
    const groups = {};
    mentorAssignments
      .filter((assignment) => assignment.isAssigned) // Only include assigned students
      .forEach((assignment) => {
        const mentorKey = assignment.mentorId;
        if (!groups[mentorKey]) {
          groups[mentorKey] = {
            mentorId: assignment.mentorId,
            mentorName: assignment.mentorName,
            mentorExpertise: assignment.mentorExpertise,
            mentorEmail: assignment.mentorEmail,
            students: [],
          };
        }
        groups[mentorKey].students.push(assignment);
      });
    return Object.values(groups);
  }, [mentorAssignments]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: mentorAssignments.length,
      assigned: mentorAssignments.filter((a) => a.isAssigned).length,
      unassigned: mentorAssignments.filter((a) => !a.isAssigned).length,
      activeMentors: mentorGroups.filter((g) => g.mentorId).length,
    };
  }, [mentorAssignments, mentorGroups]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-28 pb-16">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-8">
        {/* Header */}
        <div>
          <p className="text-sm text-gray-400">Admin Panel</p>
          <h1 className="text-4xl font-bold">Mentor Assignments</h1>
          <p className="text-gray-400 mt-2">
            View which mentors are assigned to students. One mentor can be assigned to multiple students.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 space-y-2">
            <p className="text-sm text-gray-400">Total Students</p>
            <div className="text-3xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 space-y-2">
            <p className="text-sm text-gray-400">Assigned</p>
            <div className="text-3xl font-bold text-green-400">{stats.assigned}</div>
          </div>
          <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 space-y-2">
            <p className="text-sm text-gray-400">Unassigned</p>
            <div className="text-3xl font-bold text-yellow-400">{stats.unassigned}</div>
          </div>
          <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 space-y-2">
            <p className="text-sm text-gray-400">Active Mentors</p>
            <div className="text-3xl font-bold text-blue-400">{stats.activeMentors}</div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <p className="text-sm text-gray-400">Loading mentor assignments...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Search and Filter */}
            <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Search by student name, email, or mentor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                />
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40">
                  <option value="all">All</option>
                  <option value="assigned">Assigned</option>
                  <option value="unassigned">Unassigned</option>
                </select>
              </div>
            </div>

            {/* View by Mentor - CLEAR MENTOR ASSIGNMENTS */}
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">👨‍🏫 Active Mentor Assignments</h2>
                <div className="text-sm text-gray-400">
                  {stats.activeMentors} mentors • {stats.assigned} students assigned
                </div>
              </div>

              {/* ASSIGNED STUDENTS - with mentors */}
              {mentorGroups.filter((g) => g.mentorId).length > 0 ? (
                <div className="space-y-4">
                  {mentorGroups
                    .filter((g) => g.mentorId)
                    .map((group, idx) => (
                      <div
                        key={group.mentorId}
                        className="rounded-2xl overflow-hidden border bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent border-blue-500/40 shadow-lg">
                        {/* Mentor Header */}
                        <div className="px-8 py-6 bg-gradient-to-r from-blue-600/40 to-purple-600/40 border-b border-white/10">
                          <div className="flex items-center justify-between gap-6 mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg text-2xl">
                                  {group.mentorName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-xs text-blue-200 uppercase tracking-widest font-bold mb-1">MENTOR</p>
                                  <h3 className="text-3xl font-bold text-white">{group.mentorName}</h3>
                                  <p className="text-sm font-semibold text-blue-300 mt-1">{group.mentorExpertise}</p>
                                  <p className="text-xs text-gray-400 mt-1">📧 {group.mentorEmail}</p>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-4xl font-bold text-green-400">{group.students.length}</div>
                              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
                                {group.students.length === 1 ? "Student" : "Students"}
                              </p>
                              <p className="text-xs text-green-300 mt-2">Assigned Below ↓</p>
                            </div>
                          </div>
                        </div>

                        {/* Students List Header */}
                        <div className="px-8 py-3 bg-blue-500/10 border-b border-white/5">
                          <p className="text-xs uppercase tracking-widest font-bold text-blue-300">
                            📚 Students Mentored by {group.mentorName}
                          </p>
                        </div>

                        {/* Students List */}
                        <div className="divide-y divide-white/5 bg-[#0a0a0a]/50">
                          {group.students.map((assignment, studentIdx) => (
                            <div
                              key={assignment.userId}
                              className="px-8 py-5 flex items-center justify-between hover:bg-white/5 transition group">
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="flex items-center gap-3">
                                  <div className="text-2xl font-bold text-blue-500/50 w-8 text-center">
                                    {studentIdx + 1}
                                  </div>
                                  <div className="w-1 h-10 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full opacity-30 group-hover:opacity-70 transition"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-white text-lg truncate">{assignment.userName}</p>
                                  <p className="text-sm text-gray-400 truncate">📧 {assignment.userEmail}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <p className="text-xs text-blue-300 uppercase tracking-wider">Assigned to</p>
                                  <p className="text-sm font-bold text-green-400">→ {group.mentorName}</p>
                                </div>
                                <span className="px-4 py-2 rounded-full text-xs font-bold bg-green-500/30 text-green-300 border-2 border-green-500/50 whitespace-nowrap">
                                  ✓ ASSIGNED
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-8 text-center">
                  <p className="text-gray-400">No mentors have been assigned students yet</p>
                </div>
              )}
            </div>

            {/* UNASSIGNED STUDENTS - SEPARATE SECTION */}
            {stats.unassigned > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold">⚠️ Students Awaiting Mentor Assignment</h2>
                  <div className="text-sm text-red-400">
                    {stats.unassigned} {stats.unassigned === 1 ? "student needs" : "students need"} a mentor
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden border bg-gradient-to-br from-yellow-500/5 to-red-500/5 border-yellow-500/40">
                  <div className="px-8 py-5 bg-gradient-to-r from-yellow-600/30 to-red-600/30 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-xl">
                        ⚠️
                      </div>
                      <div>
                        <p className="text-sm font-bold text-yellow-200 uppercase tracking-wider">Action Required</p>
                        <p className="text-xs text-gray-300">These students are waiting to be assigned a mentor</p>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-white/5">
                    {mentorAssignments
                      .filter((a) => !a.isAssigned)
                      .map((assignment, studentIdx) => (
                        <div
                          key={assignment.userId}
                          className="px-8 py-5 flex items-center justify-between hover:bg-white/5 transition">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="text-lg font-bold text-yellow-500 w-8 text-center">
                              {studentIdx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-white text-lg truncate">{assignment.userName}</p>
                              <p className="text-sm text-gray-400 truncate">📧 {assignment.userEmail}</p>
                            </div>
                          </div>
                          <div className="ml-4 flex items-center gap-4 flex-shrink-0">
                            <button
                              onClick={() => {
                                // Navigate to assign page
                                window.location.href = '/admin/assign-instructors';
                              }}
                              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold transition shadow-lg hover:shadow-xl text-sm whitespace-nowrap">
                              Assign Mentor Now
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Detailed List View */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Students & Their Mentors</h2>
              {filteredAssignments.length === 0 ? (
                <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-8 text-center">
                  <p className="text-gray-400">No results found</p>
                </div>
              ) : (
                <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden">
                  <div className="divide-y divide-white/5">
                    {filteredAssignments.map((assignment) => (
                      <div
                        key={assignment.userId}
                        className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{assignment.userName}</p>
                          <p className="text-sm text-gray-400">{assignment.userEmail}</p>
                        </div>
                        <div className="flex-1 text-right min-w-0 px-4">
                          {assignment.isAssigned ? (
                            <div>
                              <p className="text-xs text-blue-300 uppercase tracking-wider">Assigned to</p>
                              <p className="font-bold text-green-400 truncate">→ {assignment.mentorName}</p>
                              <p className="text-sm text-gray-400">{assignment.mentorExpertise}</p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-xs text-yellow-300 uppercase tracking-wider">Status</p>
                              <p className="text-sm text-yellow-400 font-bold">⚠ Needs Mentor</p>
                            </div>
                          )}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            assignment.isAssigned
                              ? "bg-green-500/20 text-green-300"
                              : "bg-yellow-500/20 text-yellow-300"
                          }`}>
                          {assignment.isAssigned ? "✓ Assigned" : "⚠ Unassigned"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
