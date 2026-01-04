import express from "express";
import { protect } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", protect, async (req, res) => {
	try {
		const user = await User.findById(req.user._id)
			.select("-password")
			.populate("enrolledCourses.courseId");

		res.json(user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", protect, async (req, res) => {
	try {
		const user = await User.findById(req.user._id);

		if (user) {
			user.fullName = req.body.fullName || user.fullName;
			user.email = req.body.email || user.email;

			if (req.body.password) {
				user.password = req.body.password;
			}

			const updatedUser = await user.save();

			res.json({
				_id: updatedUser._id,
				fullName: updatedUser.fullName,
				email: updatedUser.email,
				enrolledCourses: updatedUser.enrolledCourses,
			});
		} else {
			res.status(404).json({ message: "User not found" });
		}
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

// @route   POST /api/users/enroll/:courseId
// @desc    Enroll in a course
// @access  Private
router.post("/enroll/:courseId", protect, async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		const courseId = req.params.courseId;

		// Check if already enrolled
		const alreadyEnrolled = user.enrolledCourses.find(
			(course) => course.courseId.toString() === courseId
		);

		if (alreadyEnrolled) {
			return res
				.status(400)
				.json({ message: "Already enrolled in this course" });
		}

		user.enrolledCourses.push({
			courseId,
			enrolledAt: Date.now(),
			progress: 0,
			completed: false,
		});

		await user.save();

		res.json({
			message: "Successfully enrolled",
			enrolledCourses: user.enrolledCourses,
		});
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

// @route   GET /api/users/enrolled
// @desc    Get enrolled courses
// @access  Private
router.get("/enrolled", protect, async (req, res) => {
	try {
		const user = await User.findById(req.user._id).populate(
			"enrolledCourses.courseId"
		);
		res.json(user.enrolledCourses);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

export default router;
