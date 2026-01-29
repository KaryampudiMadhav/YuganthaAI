import express from "express";
import MentorshipSession from "../models/MentorshipSession.js";
import { protect } from "../middleware/auth.js";
import { protectInstructor } from "../middleware/instructorAuth.js";

const router = express.Router();

// @route   POST /api/mentorship-sessions
// @desc    Create a new mentorship session (booking)
// @access  Private (User)
router.post("/", protect, async (req, res) => {
	try {
		const { instructorId, title, date, time, notes } = req.body;

		// Check if this specific date/time slot is already booked by ANY user
		const existingBooking = await MentorshipSession.findOne({
			date,
			time,
			status: "upcoming"
		});

		if (existingBooking) {
			return res.status(400).json({ 
				message: "This time slot is already booked. Please choose a different time." 
			});
		}

		// Check how many upcoming sessions the user has this week
		const now = new Date();
		const startOfWeek = new Date(now);
		startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
		startOfWeek.setHours(0, 0, 0, 0);
		
		const endOfWeek = new Date(startOfWeek);
		endOfWeek.setDate(startOfWeek.getDate() + 7);

		const userWeeklyBookings = await MentorshipSession.countDocuments({
			userId: req.user._id,
			status: "upcoming",
			bookedDate: {
				$gte: startOfWeek,
				$lt: endOfWeek
			}
		});

		if (userWeeklyBookings >= 3) {
			return res.status(400).json({ 
				message: "You can only book up to 3 sessions per week. Please try again next week or cancel an existing booking." 
			});
		}

		const session = await MentorshipSession.create({
			userId: req.user._id,
			instructorId,
			title,
			date,
			time,
			notes,
			status: "upcoming",
		});

		res.status(201).json(session);
	} catch (error) {
		console.error("Error creating session:", error);
		res.status(500).json({ message: "Error creating session" });
	}
});

// @route   GET /api/mentorship-sessions/user
// @desc    Get all sessions for logged-in user
// @access  Private (User)
router.get("/user", protect, async (req, res) => {
	try {
		const sessions = await MentorshipSession.find({ userId: req.user._id })
			.populate("instructorId", "name email expertise")
			.sort({ bookedDate: -1 });

		res.json(sessions);
	} catch (error) {
		console.error("Error fetching user sessions:", error);
		res.status(500).json({ message: "Error fetching sessions" });
	}
});

// @route   GET /api/mentorship-sessions/booked-slots
// @desc    Get all booked time slots (globally)
// @access  Private (User)
router.get("/booked-slots", protect, async (req, res) => {
	try {
		const bookedSessions = await MentorshipSession.find({
			status: "upcoming"
		}).select("date time");

		// Create a simple array of booked slots
		const bookedSlots = bookedSessions.map(session => ({
			date: session.date,
			time: session.time
		}));

		res.json(bookedSlots);
	} catch (error) {
		console.error("Error fetching booked slots:", error);
		res.status(500).json({ message: "Error fetching booked slots" });
	}
});

// @route   GET /api/mentorship-sessions/instructor
// @desc    Get all sessions for logged-in instructor
// @access  Private (Instructor)
router.get("/instructor", protectInstructor, async (req, res) => {
	try {
		const sessions = await MentorshipSession.find({ instructorId: req.instructor._id })
			.populate("userId", "fullName email")
			.sort({ bookedDate: -1 });

		res.json(sessions);
	} catch (error) {
		console.error("Error fetching instructor sessions:", error);
		res.status(500).json({ message: "Error fetching sessions" });
	}
});

// @route   PUT /api/mentorship-sessions/:id/meeting-link
// @desc    Update meeting link for a session (instructor only)
// @access  Private (Instructor)
router.put("/:id/meeting-link", protectInstructor, async (req, res) => {
	try {
		const { meetingLink } = req.body;
		const session = await MentorshipSession.findById(req.params.id);

		if (!session) {
			return res.status(404).json({ message: "Session not found" });
		}

		// Verify session belongs to this instructor
		if (session.instructorId.toString() !== req.instructor._id.toString()) {
			return res.status(403).json({ message: "Not authorized" });
		}

		session.meetingLink = meetingLink;
		await session.save();

		res.json(session);
	} catch (error) {
		console.error("Error updating meeting link:", error);
		res.status(500).json({ message: "Error updating meeting link" });
	}
});

// @route   PUT /api/mentorship-sessions/:id/status
// @desc    Update session status
// @access  Private (Instructor)
router.put("/:id/status", protectInstructor, async (req, res) => {
	try {
		const { status } = req.body;
		const session = await MentorshipSession.findById(req.params.id);

		if (!session) {
			return res.status(404).json({ message: "Session not found" });
		}

		// Verify session belongs to this instructor
		if (session.instructorId.toString() !== req.instructor._id.toString()) {
			return res.status(403).json({ message: "Not authorized" });
		}

		session.status = status;
		await session.save();

		res.json(session);
	} catch (error) {
		console.error("Error updating status:", error);
		res.status(500).json({ message: "Error updating status" });
	}
});

// @route   PUT /api/mentorship-sessions/:id/reject
// @desc    Reject a session (instructor only)
// @access  Private (Instructor)
router.put("/:id/reject", protectInstructor, async (req, res) => {
	try {
		const { reason } = req.body;
		const session = await MentorshipSession.findById(req.params.id);

		if (!session) {
			return res.status(404).json({ message: "Session not found" });
		}

		// Verify session belongs to this instructor
		if (session.instructorId.toString() !== req.instructor._id.toString()) {
			return res.status(403).json({ message: "Not authorized" });
		}

		session.status = "rejected";
		session.rejectionReason = reason || "Instructor unavailable";
		await session.save();

		res.json(session);
	} catch (error) {
		console.error("Error rejecting session:", error);
		res.status(500).json({ message: "Error rejecting session" });
	}
});

// @route   PUT /api/mentorship-sessions/:id/reschedule
// @desc    Reschedule a session (instructor only)
// @access  Private (Instructor)
router.put("/:id/reschedule", protectInstructor, async (req, res) => {
	try {
		const { newDate, newTime, reason } = req.body;
		const session = await MentorshipSession.findById(req.params.id);

		if (!session) {
			return res.status(404).json({ message: "Session not found" });
		}

		// Verify session belongs to this instructor
		if (session.instructorId.toString() !== req.instructor._id.toString()) {
			return res.status(403).json({ message: "Not authorized" });
		}

		// Check if the new slot is available
		const existingBooking = await MentorshipSession.findOne({
			date: newDate,
			time: newTime,
			status: "upcoming",
			_id: { $ne: session._id } // Exclude current session
		});

		if (existingBooking) {
			return res.status(400).json({ 
				message: "The new time slot is already booked. Please choose a different time." 
			});
		}

		// Save old date/time for reference
		session.originalDate = session.date;
		session.originalTime = session.time;
		session.date = newDate;
		session.time = newTime;
		session.status = "rescheduled";
		session.rescheduleReason = reason || "Instructor requested reschedule";
		await session.save();

		res.json(session);
	} catch (error) {
		console.error("Error rescheduling session:", error);
		res.status(500).json({ message: "Error rescheduling session" });
	}
});

export default router;
