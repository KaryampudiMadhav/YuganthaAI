import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function MentorshipBookingPage() {
  const navigate = useNavigate();
  const today = new Date();
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [assignedInstructor, setAssignedInstructor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeSlots, setTimeSlots] = useState([
    "3:00pm",
    "3:30pm",
    "4:00pm",
    "6:00pm",
    "6:30pm",
    "7:00pm",
    "7:30pm",
    "8:00pm",
    "8:30pm",
    "9:00pm",
    "9:30pm",
  ]);
  const [topics, setTopics] = useState([
    "First Mentorship",
    "Applied Machine Learning",
    "Fundamentals of Deep Learning",
    "Getting started with NLP",
    "NLP using Deep Learning",
    "Getting Started with LLMs",
    "Building LLM Apps using Prompt Engineering",
    "Career Assistance",
    "Building End-to-End Generative AI Applications",
    "Getting started with Stable Diffusion",
    "Mastering Methods and Tools of Stable Diffusion",
    "Advanced Stable Diffusion Techniques",
  ]);

  const [program, setProgram] = useState({
    title: "Gen AI Pinnacle Plus Program Mentorship ROW",
    subtitle: "Gen AI Plus 1:1 Mentorship",
    duration: "30 min",
    location: "https://zoom.us/j/99716979451",
    note: "Note: Please do not change your prefilled Email ID",
    timezone: "India, Sri Lanka Time (UTC+5:30)",
  });

  useEffect(() => {
    fetchAssignedInstructor();
    fetchUserEmail();
  }, []);

  const fetchAssignedInstructor = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to book a mentorship session");
        return;
      }

      const response = await fetch("http://localhost:5000/api/users/assigned-instructor", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const instructor = await response.json();
        setAssignedInstructor(instructor);
        setProgram((prev) => ({
          ...prev,
          title: `1:1 Mentorship with ${instructor.name}`,
          subtitle: `Mentorship Session - ${instructor.expertise}`,
        }));
      } else if (response.status === 404) {
        setError("No instructor has been assigned to your account yet. Please contact the admin.");
      } else {
        setError("Failed to load instructor information");
      }
    } catch (error) {
      console.error("Error fetching instructor:", error);
      setError("Error loading instructor information");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserEmail = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const user = await response.json();
        setEmail(user.email);
      }
    } catch (error) {
      console.error("Error fetching user email:", error);
    }
  };

  const currentMonth = useMemo(() => {
    const base = new Date(today);
    base.setMonth(base.getMonth() + monthOffset);
    return base;
  }, [today, monthOffset]);

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < startWeekday; i += 1) {
      cells.push({ key: `blank-${i}`, label: "", isSelectable: false });
    }
    for (let d = 1; d <= daysInMonth; d += 1) {
      cells.push({ key: `day-${d}`, label: d, isSelectable: true });
    }
    return cells;
  }, [currentMonth]);

  const displayMonth = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const handleSelectDate = (dayLabel) => {
    if (!dayLabel) return;
    const chosen = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayLabel);
    setSelectedDate(chosen.toISOString());
    setSelectedSlot(null);
    setShowDetails(false);
  };

  const handleSelectSlot = (slot) => {
    if (!selectedDate) return;
    setSelectedSlot(slot);
    setShowDetails(true);
  };

  const handleConfirmBooking = () => {
    if (!email || !topic || !selectedDate || !selectedSlot) return;
    
    const booking = {
      id: `booking-${Date.now()}`,
      title: topic,
      mentor: assignedInstructor?.name || "Industry Mentor",
      mentorId: assignedInstructor?._id,
      mentorExpertise: assignedInstructor?.expertise,
      status: "upcoming",
      date: new Date(selectedDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: selectedSlot,
      email,
      notes: `Booked on ${new Date().toLocaleDateString()}`,
      zoom: program.location,
    };

    const existingBookings = JSON.parse(localStorage.getItem("mentorshipBookings") || "[]");
    localStorage.setItem("mentorshipBookings", JSON.stringify([...existingBookings, booking]));
    
    toast.success("Booking confirmed! You will see it in your mentorships shortly.");
    setTimeout(() => {
      window.location.href = "/mentorships";
    }, 1500);
  };

  const isSelectedDay = (label) => {
    if (!selectedDate || !label) return false;
    const stored = new Date(selectedDate);
    return (
      stored.getDate() === Number(label) &&
      stored.getMonth() === currentMonth.getMonth() &&
      stored.getFullYear() === currentMonth.getFullYear()
    );
  };

  const bookingSummary = selectedDate && selectedSlot;
  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white pt-20 pb-16 flex items-center justify-center">
        <p className="text-gray-400">Loading mentor information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="bg-red-500/20 border border-red-500/40 rounded-2xl p-8 text-center">
            <p className="text-red-300 text-lg">{error}</p>
            <button
              onClick={() => navigate("/mentorships")}
              className="mt-4 px-6 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {!showDetails ? (
          <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-white/5 space-y-6">
              <div className="space-y-3">
                <div className="text-sm text-gray-400">{program.subtitle}</div>
                <h1 className="text-3xl font-bold leading-tight">{program.title}</h1>
                {assignedInstructor ? (
                  <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-blue-500/60 rounded-lg p-4 mt-4 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <p className="text-xs text-blue-300 uppercase tracking-widest font-bold">Mentoring with</p>
                    </div>
                    <p className="text-2xl font-bold text-white">{assignedInstructor.name}</p>
                    <p className="text-sm text-blue-200 font-semibold mt-1">{assignedInstructor.expertise}</p>
                    {assignedInstructor.email && (
                      <p className="text-xs text-blue-300 mt-2">📧 {assignedInstructor.email}</p>
                    )}
                  </div>
                ) : (
                  <div className="bg-yellow-600/20 border border-yellow-500/40 rounded-lg p-4 mt-4">
                    <p className="text-xs text-yellow-300 uppercase tracking-widest font-bold">⚠️ No Mentor Assigned</p>
                    <p className="text-sm text-yellow-200 mt-2">You'll be assigned a mentor soon. Contact admin for more info.</p>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm text-gray-300 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-400" />
                    <span>{program.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🔗</span>
                    <a className="text-blue-300 hover:text-blue-200" href={program.location} target="_blank" rel="noreferrer">
                      {program.location}
                    </a>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{program.note}</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-400">Cookie settings</p>
                <p className="text-sm text-gray-400">Time zone: {program.timezone}</p>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6 bg-[#0a0a0a]">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Select a Date & Time</h2>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <button
                    onClick={() => setMonthOffset((v) => v - 1)}
                    className="px-2 py-1 rounded hover:bg-white/10"
                    aria-label="Previous month">
                    ‹
                  </button>
                  <div className="font-semibold text-white">{displayMonth}</div>
                  <button
                    onClick={() => setMonthOffset((v) => v + 1)}
                    className="px-2 py-1 rounded hover:bg-white/10"
                    aria-label="Next month">
                    ›
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-sm text-gray-400">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="py-1 uppercase tracking-wide text-xs">{day}</div>
                ))}
                {calendarDays.map((cell) => {
                  const active = isSelectedDay(cell.label);
                  return (
                    <button
                      key={cell.key}
                      disabled={!cell.isSelectable}
                      onClick={() => handleSelectDate(cell.label)}
                      className={`aspect-square rounded-full flex items-center justify-center text-sm transition border border-transparent ${
                        !cell.isSelectable
                          ? "opacity-40 cursor-default"
                          : active
                          ? "bg-white text-black font-semibold"
                          : "hover:bg-white/10"
                      }`}>
                      {cell.label}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3">
                <div className="text-sm text-gray-400">
                  {selectedDate
                    ? new Date(selectedDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })
                    : "Choose a date"}
                </div>
                <div className="max-h-64 overflow-y-auto rounded-xl border border-white/10 divide-y divide-white/5">
                  {timeSlots.map((slot) => {
                    const active = selectedSlot === slot;
                    const disabled = !selectedDate;
                    return (
                      <button
                        key={slot}
                        disabled={disabled}
                        onClick={() => handleSelectSlot(slot)}
                        className={`w-full flex items-center justify-between px-5 py-4 text-left transition focus:outline-none text-base font-semibold ${
                          disabled
                            ? "text-gray-500 cursor-not-allowed"
                            : active
                            ? "bg-white/10 text-white"
                            : "hover:bg-white/5 text-gray-200"
                        }`}>
                        <span>{slot}</span>
                        <span
                          className={`text-sm inline-flex items-center gap-2 px-3 py-1 rounded-md border ${
                            disabled
                              ? "border-white/10 text-gray-500"
                              : active
                              ? "border-white text-white"
                              : "border-white/20 text-gray-200"
                          }`}>
                          Next
                          <span aria-hidden="true">›</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[#0f0f0f] border border-white/5 rounded-xl p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-400">Time zone</p>
                  <p className="font-semibold">{program.timezone}</p>
                </div>
                <button
                  disabled={!bookingSummary}
                  className={`px-5 py-3 rounded-lg font-semibold transition ${
                    bookingSummary
                      ? "bg-white text-black hover:bg-gray-200"
                      : "bg-white/10 text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={() => bookingSummary && setShowDetails(true)}>
                  Confirm Session
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-white/5 space-y-6">
              <div className="space-y-3">
                <div className="text-sm text-gray-400">{program.subtitle}</div>
                <h1 className="text-3xl font-bold leading-tight">{program.title}</h1>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-400" />
                    <span>{program.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🔗</span>
                    <a className="text-blue-300 hover:text-blue-200" href={program.location} target="_blank" rel="noreferrer">
                      {program.location}
                    </a>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{program.note}</p>
              </div>

              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <span>⏰</span>
                  <span>
                    {selectedSlot} on {formattedDate}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>{program.timezone}</span>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-300">
                <p>Note: Please do not change your prefilled Email ID</p>
                <p>Get access to Industry Mentors by booking your 30 mins 1:1 mentorship session.</p>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6 bg-[#0a0a0a]">
              <div className="space-y-2">
                <label className="text-sm text-gray-400" htmlFor="email">Email *</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Your question is related to which of the following topic?</span>
                  <span className="text-red-300">*</span>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {topics.map((t) => (
                    <label
                      key={t}
                      className="flex items-center gap-3 bg-[#0f0f0f] border border-white/10 rounded-lg px-4 py-3 hover:border-white/30 cursor-pointer">
                      <input
                        type="radio"
                        name="topic"
                        value={t}
                        checked={topic === t}
                        onChange={() => setTopic(t)}
                        className="accent-white w-4 h-4"
                      />
                      <span className="text-sm text-gray-200">{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-5 py-3 rounded-lg border border-white/20 text-gray-200 hover:bg-white/5 transition">
                  Back
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={!email || !topic}
                  className={`px-5 py-3 rounded-lg font-semibold transition ${
                    email && topic
                      ? "bg-white text-black hover:bg-gray-200"
                      : "bg-white/10 text-gray-500 cursor-not-allowed"
                  }`}>
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
