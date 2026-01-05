import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";

const navItems = [
  { key: "my-mentorships", label: "My Mentorships" },
  { key: "upcoming", label: "Upcoming Sessions" },
  { key: "completed", label: "Completed Sessions" },
  { key: "cancelled", label: "Cancelled / Rescheduled Sessions" },
];

export default function MentorshipPage() {
  const [activeTab, setActiveTab] = useState("my-mentorships");
  const [sessionData, setSessionData] = useState([]);
  const [assignedInstructor, setAssignedInstructor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignedInstructor();
    fetchSessionData();
  }, []);

  const fetchAssignedInstructor = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:5000/api/users/assigned-instructor", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const instructor = await response.json();
        setAssignedInstructor(instructor);
      }
    } catch (error) {
      console.error("Error fetching instructor:", error);
    }
  };

  const fetchSessionData = () => {
    const bookedSessions = JSON.parse(localStorage.getItem("mentorshipBookings") || "[]");
    setSessionData(bookedSessions);
    setLoading(false);
  };

  const stats = useMemo(() => {
    const upcoming = sessionData.filter((s) => s.status === "upcoming").length;
    const completed = sessionData.filter((s) => s.status === "completed").length;
    const cancelled = sessionData.filter((s) => s.status === "cancelled").length;
    return { upcoming, completed, cancelled };
  }, [sessionData]);

  const filteredSessions = useMemo(() => {
    if (activeTab === "my-mentorships") return sessionData;
    return sessionData.filter((s) => s.status === activeTab);
  }, [activeTab, sessionData]);

  const renderEmptyState = () => (
    <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-3xl">😐</div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">No sessions scheduled today</h3>
        <p className="text-gray-400 max-w-md">
          You will see your upcoming, completed, and rescheduled sessions here once they are booked.
        </p>
      </div>
      <Link
        to="/mentorships/book"
        className="px-5 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition">
        Book Session
      </Link>
    </div>
  );

  const renderSessionCard = (session) => (
    <div
      key={session.id}
      className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{session.status}</p>
          <h3 className="text-xl font-semibold">{session.title}</h3>
          <p className="text-sm text-gray-400">with {session.mentor}</p>
        </div>
        <div className="text-right text-sm text-gray-300">
          <div>{session.date}</div>
          <div>{session.time}</div>
        </div>
      </div>
      <p className="text-sm text-gray-400">{session.notes}</p>
      <div className="flex flex-wrap gap-3">
        <button className="px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition">
          Join / Details
        </button>
        <button className="px-4 py-2 border border-white/10 rounded-lg text-sm text-gray-200 hover:bg-white/5 transition">
          Reschedule
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row gap-8">
        <aside className="md:w-64 w-full bg-[#0f0f0f] border border-white/5 rounded-2xl p-4 h-fit">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition border border-transparent flex items-center gap-3 ${
                    isActive
                      ? "bg-white text-black"
                      : "text-gray-200 hover:bg-white/5 border-white/5"
                  }`}>
                  <span className="text-lg">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 space-y-8">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Link to="/my-learning" className="hover:text-white">Enrolled Programs</Link>
                <span>›</span>
                <span className="hover:text-white">Course Listing</span>
                <span>›</span>
                <span className="text-white">My Mentorships</span>
              </div>
              <h1 className="text-3xl font-bold">My Mentorship Progress</h1>
            </div>
            <Link
              to="/mentorships/book"
              className="px-5 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition shrink-0">
              Book Session
            </Link>
          </div>

          {/* Assigned Mentor Card */}
          {assignedInstructor ? (
            <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border border-blue-500/40 rounded-2xl p-8 shadow-lg">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <p className="text-xs text-blue-300 uppercase tracking-widest font-bold">Assigned Mentor</p>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">{assignedInstructor.name}</h2>
                  <p className="text-blue-200 font-semibold text-lg mb-3">{assignedInstructor.expertise}</p>
                  {assignedInstructor.bio && (
                    <p className="text-gray-300 text-sm leading-relaxed">{assignedInstructor.bio}</p>
                  )}
                  <div className="mt-4">
                    <p className="text-xs text-blue-300 uppercase tracking-wider font-semibold mb-2">Contact</p>
                    <a href={`mailto:${assignedInstructor.email}`} className="text-blue-300 hover:text-blue-200 transition text-sm">
                      {assignedInstructor.email}
                    </a>
                  </div>
                </div>
                {assignedInstructor.avatar && (
                  <div className="flex-shrink-0">
                    <img
                      src={assignedInstructor.avatar}
                      alt={assignedInstructor.name}
                      className="w-24 h-24 rounded-xl object-cover border-2 border-blue-500/50"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-yellow-600/10 border border-yellow-500/40 rounded-2xl p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-yellow-300 uppercase tracking-widest font-bold mb-2">Mentor Assignment Status</p>
                  <h3 className="text-2xl font-bold text-yellow-200 mb-2">No Mentor Assigned Yet</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    An admin will assign you a mentor soon. You'll receive a notification once your mentor is assigned.
                  </p>
                  <p className="text-xs text-yellow-300 uppercase tracking-wider font-semibold">
                    ⏱️ Pending Assignment
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 space-y-2">
              <p className="text-gray-400 text-sm">Upcoming Sessions</p>
              <div className="flex items-center gap-2 text-4xl font-bold">{stats.upcoming}</div>
            </div>
            <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 space-y-2">
              <p className="text-gray-400 text-sm">Completed Sessions</p>
              <div className="flex items-center gap-2 text-4xl font-bold">{stats.completed}</div>
            </div>
            <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 space-y-2">
              <p className="text-gray-400 text-sm">Cancelled / Rescheduled</p>
              <div className="flex items-center gap-2 text-4xl font-bold">{stats.cancelled}</div>
            </div>
          </div>

          {filteredSessions.length === 0 ? (
            renderEmptyState()
          ) : (
            <div className="space-y-4">
              {filteredSessions.map((session) => renderSessionCard(session))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
