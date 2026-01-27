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

export default router;
