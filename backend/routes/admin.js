import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Mentor from "../models/Mentor.js";
import User from "../models/User.js";
import Instructor from "../models/Instructor.js";
import transporter from "../config/mailer.js";

const router = express.Router();

// Email configuration - Gmail SMTP


// Function to send OTP email
const sendOTPEmail = async (email, otp, instructorName) => {
	try {
		const mailOptions = {
			from: process.env.EMAIL_FROM || "noreply@yuganthaai.com",
			to: email,
			subject: "YuganthaAI - Instructor Account Setup",
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<h2>Welcome to YuganthaAI, ${instructorName}!</h2>
					<p>Your instructor account has been created. Please set your password using the OTP below:</p>
					
					<div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
						<p style="margin: 0; color: #666; font-size: 14px;">Your OTP (valid for 10 minutes):</p>
						<p style="margin: 10px 0; font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #333;">${otp}</p>
					</div>
					
					<p>Please visit the forgot password page and enter your email and this OTP to set your password:</p>
					<p><a href="http://localhost:3000/instructor/forgot-password" style="color: #007bff; text-decoration: none;">Set Your Password</a></p>
					
					<p style="color: #666; font-size: 12px; margin-top: 30px;">
						If you didn't request this, please contact the administrator.
					</p>
				</div>
			`,
		};

		// Try to send email, but don't fail if email service is unavailable
		try {
			await transporter.sendMail(mailOptions);
			console.log(`✅ OTP email sent to ${email}`);
		} catch (emailError) {
			// Log to console instead of failing completely
			console.log(`📧 [MOCK EMAIL] OTP for ${email}: ${otp}`);
			console.log(`Note: Email service unavailable. In production, this would be sent to: ${email}`);
		}

		return true;
	} catch (error) {
		console.error("Error sending OTP email:", error);
		// Don't throw - gracefully handle email failures
		return true;
	}
};

// Static admin credentials
const ADMIN_EMAIL = "admin@yuganthaai.com";
const ADMIN_PASSWORD_HASH = bcrypt.hashSync("Admin123!", 10);

// Admin login
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (email !== ADMIN_EMAIL) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
		if (!isMatch) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const token = jwt.sign(
			{ email: ADMIN_EMAIL, role: "admin" },
			process.env.JWT_SECRET,
			{ expiresIn: "34h" }
		);

		res.json({
			token,
			admin: { email: ADMIN_EMAIL },
		});
	} catch (error) {
		console.error("Admin login error:", error);
		res.status(500).json({ message: "Server error" });
	}
});

// Middleware to verify admin token
const verifyAdmin = (req, res, next) => {
	const token = req.header("Authorization")?.replace("Bearer ", "");

	if (!token) {
		return res.status(401).json({ message: "No token, authorization denied" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (decoded.role !== "admin") {
			return res.status(403).json({ message: "Access denied" });
		}
		req.admin = decoded;
		next();
	} catch (error) {
		res.status(401).json({ message: "Token is not valid" });
	}
};

// Get all mentors
router.get("/mentors", verifyAdmin, async (req, res) => {
	try {
		const mentors = await Mentor.find().sort({ createdAt: -1 });
		res.json(mentors);
	} catch (error) {
		console.error("Get mentors error:", error);
		res.status(500).json({ message: "Server error" });
	}
});

// Add new mentor
router.post("/mentors", verifyAdmin, async (req, res) => {
	try {
		const { name, expertise, email } = req.body;

		if (!name || !expertise || !email) {
			return res.status(400).json({ message: "All fields are required" });
		}

		const existingMentor = await Mentor.findOne({ email });
		if (existingMentor) {
			return res.status(400).json({ message: "Mentor with this email already exists" });
		}

		const mentor = new Mentor({
			name,
			expertise,
			email,
			active: true,
		});

		await mentor.save();
		res.status(201).json(mentor);
	} catch (error) {
		console.error("Add mentor error:", error);
		res.status(500).json({ message: "Server error" });
	}
});

// Update mentor (toggle active or update details)
router.put("/mentors/:id", verifyAdmin, async (req, res) => {
	try {
		const { id } = req.params;
		const updates = req.body;

		const mentor = await Mentor.findByIdAndUpdate(
			id,
			updates,
			{ new: true, runValidators: true }
		);

		if (!mentor) {
			return res.status(404).json({ message: "Mentor not found" });
		}

		res.json(mentor);
	} catch (error) {
		console.error("Update mentor error:", error);
		res.status(500).json({ message: "Server error" });
	}
});

// Delete mentor
router.delete("/mentors/:id", verifyAdmin, async (req, res) => {
	try {
		const { id } = req.params;

		const mentor = await Mentor.findByIdAndDelete(id);

		if (!mentor) {
			return res.status(404).json({ message: "Mentor not found" });
		}

		res.json({ message: "Mentor deleted successfully" });
	} catch (error) {
		console.error("Delete mentor error:", error);
		res.status(500).json({ message: "Server error" });
	}
});

// Get all users
router.get("/users", verifyAdmin, async (req, res) => {
	try {
		const users = await User.find()
			.select("-password")
			.populate({
				path: "assignedInstructor",
				select: "name expertise email",
				options: { strictPopulate: false }
			})
			.sort({ createdAt: -1 });
		res.json(users);
	} catch (error) {
		console.error("Get users error:", error);
		res.status(500).json({ message: "Server error", details: error.message });
	}
});

// Assign instructor to user
router.post("/assign-instructor", verifyAdmin, async (req, res) => {
	try {
		const { userId, instructorId } = req.body;

		if (!userId || !instructorId) {
			return res.status(400).json({ message: "User ID and Instructor ID are required" });
		}

		// Verify instructor exists and is active
		const instructor = await Instructor.findById(instructorId);
		if (!instructor) {
			return res.status(404).json({ message: "Instructor not found" });
		}

		if (!instructor.active) {
			return res.status(400).json({ message: "Instructor is not active" });
		}

		// Update user with assigned instructor
		const user = await User.findByIdAndUpdate(
			userId,
			{ assignedInstructor: instructorId },
			{ new: true }
		).populate({
			path: "assignedInstructor",
			select: "name expertise email",
			options: { strictPopulate: false }
		});

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json({
			message: "Instructor assigned successfully",
			user,
		});
	} catch (error) {
		console.error("Assign instructor error:", error);
		res.status(500).json({ message: "Server error", details: error.message });
	}
});

// Create instructor (admin adds instructor)
router.post("/instructors", verifyAdmin, async (req, res) => {
	try {
		const { name, email, expertise, bio, avatar } = req.body;

		if (!name || !email || !expertise) {
			return res.status(400).json({ message: "Name, email, and expertise are required" });
		}

		const existingInstructor = await Instructor.findOne({ email });
		if (existingInstructor) {
			return res.status(400).json({ message: "Instructor with this email already exists" });
		}

		const instructor = new Instructor({
			name,
			email,
			expertise,
			bio: bio || "",
			avatar: avatar || "",
			active: true,
			approved: true, // Admin-created instructors are pre-approved
			// No password, no OTP - instructor will set password when they first login
		});

		await instructor.save();

		res.status(201).json({
			message: "Instructor created successfully. They can now set their password using the forgot password option.",
			instructor: {
				_id: instructor._id,
				name: instructor.name,
				email: instructor.email,
				expertise: instructor.expertise,
				active: instructor.active,
				approved: instructor.approved,
			},
		});
	} catch (error) {
		console.error("Create instructor error:", error);
		res.status(500).json({ message: "Server error" });
	}
});

// Get all registered instructors
router.get("/instructors", verifyAdmin, async (req, res) => {
	try {
		const instructors = await Instructor.find()
			.select("-password")
			.sort({ createdAt: -1 });
		res.json(instructors);
	} catch (error) {
		console.error("Get instructors error:", error);
		res.status(500).json({ message: "Server error" });
	}
});

// Approve instructor
router.put("/instructors/:id/approve", verifyAdmin, async (req, res) => {
	try {
		const { id } = req.params;

		const instructor = await Instructor.findByIdAndUpdate(
			id,
			{ approved: true },
			{ new: true }
		).select("-password");

		if (!instructor) {
			return res.status(404).json({ message: "Instructor not found" });
		}

		res.json({
			message: "Instructor approved successfully",
			instructor,
		});
	} catch (error) {
		console.error("Approve instructor error:", error);
		res.status(500).json({ message: "Server error" });
	}
});

// Deactivate instructor
router.put("/instructors/:id/deactivate", verifyAdmin, async (req, res) => {
	try {
		const { id } = req.params;

		const instructor = await Instructor.findByIdAndUpdate(
			id,
			{ active: false },
			{ new: true }
		).select("-password");

		if (!instructor) {
			return res.status(404).json({ message: "Instructor not found" });
		}

		res.json({
			message: "Instructor deactivated successfully",
			instructor,
		});
	} catch (error) {
		console.error("Deactivate instructor error:", error);
		res.status(500).json({ message: "Server error" });
	}
});

// Activate instructor
router.put("/instructors/:id/activate", verifyAdmin, async (req, res) => {
	try {
		const { id } = req.params;

		const instructor = await Instructor.findByIdAndUpdate(
			id,
			{ active: true },
			{ new: true }
		).select("-password");

		if (!instructor) {
			return res.status(404).json({ message: "Instructor not found" });
		}

		res.json({
			message: "Instructor activated successfully",
			instructor,
		});
	} catch (error) {
		console.error("Activate instructor error:", error);
		res.status(500).json({ message: "Server error" });
	}
});

// Delete instructor
router.delete("/instructors/:id", verifyAdmin, async (req, res) => {
	try {
		const { id } = req.params;

		// Check if any users are assigned to this instructor
		const assignedUsers = await User.find({ assignedInstructor: id });
		
		if (assignedUsers.length > 0) {
			// Optionally, you can either:
			// 1. Prevent deletion
			// return res.status(400).json({ 
			//   message: `Cannot delete instructor. ${assignedUsers.length} student(s) are assigned to this instructor.` 
			// });
			
			// 2. Or unassign students first (recommended)
			await User.updateMany(
				{ assignedInstructor: id },
				{ $unset: { assignedInstructor: "" } }
			);
		}

		const instructor = await Instructor.findByIdAndDelete(id);

		if (!instructor) {
			return res.status(404).json({ message: "Instructor not found" });
		}

		res.json({ 
			message: "Instructor deleted successfully",
			unassignedStudents: assignedUsers.length 
		});
	} catch (error) {
		console.error("Delete instructor error:", error);
		res.status(500).json({ message: "Server error", details: error.message });
	}
});

export default router;
