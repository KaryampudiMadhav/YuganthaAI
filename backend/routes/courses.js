import express from "express";
import Course from "../models/Course.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get("/", async (req, res) => {
	try {
		const courses = await Course.find({}).sort({ createdAt: -1 });
		res.json(courses);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

// @route   GET /api/courses/:id
// @desc    Get course by ID
// @access  Public
router.get("/:id", async (req, res) => {
	try {
		const course = await Course.findById(req.params.id);

		if (!course) {
			return res.status(404).json({ message: "Course not found" });
		}

		res.json(course);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

// @route   POST /api/courses
// @desc    Create a course (Admin only - simplified for now)
// @access  Private
router.post("/", protect, async (req, res) => {
	try {
		const course = await Course.create(req.body);
		
		// Update students count on creation to 0
		course.students = 0;
		course.rating = 0;
		await course.save();
		
		res.status(201).json(course);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

// @route   PUT /api/courses/:id
// @desc    Update a course
// @access  Private
router.put("/:id", protect, async (req, res) => {
	try {
		const course = await Course.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true }
		);

		if (!course) {
			return res.status(404).json({ message: "Course not found" });
		}

		res.json(course);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

// @route   DELETE /api/courses/:id
// @desc    Delete a course
// @access  Private
router.delete("/:id", protect, async (req, res) => {
	try {
		const course = await Course.findByIdAndDelete(req.params.id);

		if (!course) {
			return res.status(404).json({ message: "Course not found" });
		}

		res.json({ message: "Course deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

export default router;
