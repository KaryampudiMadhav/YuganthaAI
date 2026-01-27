import express from "express";
import Course from "../models/Course.js";
import Instructor from "../models/Instructor.js";
import { protect } from "../middleware/auth.js";
import { protectInstructor } from "../middleware/instructorAuth.js";

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

// @route   GET /api/courses/instructor/:instructorId
// @desc    Get all courses for a specific instructor
// @access  Public
router.get("/instructor/:instructorId", async (req, res) => {
	try {
		const courses = await Course.find({ instructorId: req.params.instructorId }).sort({ createdAt: -1 });
		res.json(courses);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

// @route   GET /api/courses/my-courses
// @desc    Get courses for logged-in instructor
// @access  Private (Instructor)
router.get("/my-courses/list", protectInstructor, async (req, res) => {
	try {
		const courses = await Course.find({ instructorId: req.instructor._id }).sort({ createdAt: -1 });
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
// @desc    Create a course (Instructor or Admin)
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

// @route   POST /api/courses/instructor/create
// @desc    Create a course as instructor
// @access  Private (Instructor)
router.post("/instructor/create", protectInstructor, async (req, res) => {
	try {
		const { title, description, category, level, duration, price, thumbnail, modules } = req.body;

		if (!title || !description || !category) {
			return res.status(400).json({ message: "Title, description, and category are required" });
		}

		const courseData = {
			title,
			description,
			category,
			level: level || "Beginner",
			duration: duration || "",
			price: price || "Free",
			thumbnail: thumbnail || "",
			instructor: req.instructor.name || req.instructor.email,
			instructorId: req.instructor._id,
			modules: modules || [],
			students: 0,
			rating: 0,
			isFree: price === "Free" || !price,
		};

		const course = await Course.create(courseData);

		// Update instructor's courses array
		await Instructor.findByIdAndUpdate(
			req.instructor._id,
			{ $push: { courses: course._id } },
			{ new: true }
		);

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

// @route   PUT /api/courses/instructor/:id
// @desc    Update a course as instructor
// @access  Private (Instructor)
router.put("/instructor/:id", protectInstructor, async (req, res) => {
	try {
		const course = await Course.findById(req.params.id);

		if (!course) {
			return res.status(404).json({ message: "Course not found" });
		}

		// Check if instructor owns this course
		if (course.instructorId.toString() !== req.instructor._id.toString()) {
			return res.status(403).json({ message: "Not authorized to update this course" });
		}

		const updatedCourse = await Course.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true }
		);

		res.json(updatedCourse);
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

// @route   DELETE /api/courses/instructor/:id
// @desc    Delete a course as instructor
// @access  Private (Instructor)
router.delete("/instructor/:id", protectInstructor, async (req, res) => {
	try {
		const course = await Course.findById(req.params.id);

		if (!course) {
			return res.status(404).json({ message: "Course not found" });
		}

		// Check if instructor owns this course
		if (course.instructorId.toString() !== req.instructor._id.toString()) {
			return res.status(403).json({ message: "Not authorized to delete this course" });
		}

		await Course.findByIdAndDelete(req.params.id);

		// Remove course from instructor's courses array
		await Instructor.findByIdAndUpdate(
			req.instructor._id,
			{ $pull: { courses: req.params.id } },
			{ new: true }
		);

		res.json({ message: "Course deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

export default router;
