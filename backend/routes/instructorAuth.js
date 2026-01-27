import express from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import Instructor from "../models/Instructor.js";

const router = express.Router();

// Email configuration - Gmail SMTP
const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASSWORD,
	},
	tls: {
		rejectUnauthorized: false
	}
});

// Verify transporter configuration on startup
transporter.verify((error, success) => {
	if (error) {
		console.log('❌ Email transporter verification failed:', error.message);
		console.log('EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET');
		console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***SET***' : 'NOT SET');
	} else {
		console.log('✅ Email server is ready to send messages');
	}
});

// Generate JWT Token
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "2h",
	});
};

// Function to send OTP email
const sendOTPEmail = async (email, otp, instructorName = "Instructor") => {
	const mailOptions = {
		from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
		to: email,
		subject: "YuganthaAI - Password Setup OTP",
		html: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
				<h2>Password Setup - YuganthaAI</h2>
				<p>Hello ${instructorName},</p>
				<p>Please use the OTP below to set your password:</p>
				
				<div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
					<p style="margin: 0; color: #666; font-size: 14px;">Your OTP (valid for 10 minutes):</p>
					<p style="margin: 10px 0; font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #333;">${otp}</p>
				</div>
				
				<p>Go to the password setup page and enter this OTP along with your new password.</p>
				<p><a href="http://localhost:3000/instructor/forgot-password" style="color: #007bff; text-decoration: none;">Set Your Password</a></p>
				
				<p style="color: #666; font-size: 12px; margin-top: 30px;">
					This OTP will expire in 10 minutes.
				</p>
			</div>
		`,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log(`✅ OTP email sent successfully to ${email}`);
		console.log(`📧 Message ID: ${info.messageId}`);
		return true;
	} catch (error) {
		console.error(`❌ Failed to send OTP email to ${email}:`, error.message);
		throw new Error(`Failed to send OTP email: ${error.message}`);
	}
};

// @route   POST /api/instructor-auth/register
// @desc    Register new instructor (without password)
// @access  Public
router.post(
	"/register",
	[
		body("name").trim().notEmpty().withMessage("Name is required"),
		body("email").isEmail().withMessage("Please enter a valid email"),
		body("expertise").trim().notEmpty().withMessage("Expertise is required"),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, expertise } = req.body;

		try {
			// Check if instructor exists
			const instructorExists = await Instructor.findOne({ email });
			if (instructorExists) {
				return res.status(400).json({ message: "Instructor already exists" });
			}

			// Create instructor without password (will be set via forgot password)
			const instructor = await Instructor.create({
				name,
				email,
				expertise,
				approved: false,
			});

			if (instructor) {
				// Generate OTP for password setup
				const otp = Math.floor(100000 + Math.random() * 900000).toString();
				const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

				// Store OTP and expiry
				instructor.resetToken = otp;
				instructor.resetTokenExpiry = otpExpiry;
				await instructor.save();

				// Send OTP email
				await sendOTPEmail(email, otp);

				res.status(201).json({
					message: "Registration successful. Check your email for OTP to set password.",
					_id: instructor._id,
					email: instructor.email,
				});
			}
		} catch (error) {
			res.status(500).json({
				message: "Server error",
				error: error.message,
			});
		}
	}
);

// @route   POST /api/instructor-auth/setup-password
// @desc    Set password using OTP
// @access  Public
router.post(
	"/setup-password",
	[
		body("email").isEmail().withMessage("Please enter a valid email"),
		body("otp").notEmpty().withMessage("OTP is required"),
		body("password")
			.isLength({ min: 6 })
			.withMessage("Password must be at least 6 characters"),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, otp, password } = req.body;

		try {
			const instructor = await Instructor.findOne({ email });

			if (!instructor) {
				return res.status(404).json({ message: "Instructor not found" });
			}

			// Check if OTP is valid and not expired
			if (instructor.resetToken !== otp || !instructor.resetTokenExpiry) {
				return res.status(400).json({ message: "Invalid OTP" });
			}

			if (new Date() > instructor.resetTokenExpiry) {
				return res.status(400).json({ message: "OTP has expired" });
			}

			// Set password
			instructor.password = password;
			instructor.resetToken = undefined;
			instructor.resetTokenExpiry = undefined;
			await instructor.save();

			res.json({
				message: "Password set successfully. You can now login.",
			});
		} catch (error) {
			res.status(500).json({
				message: "Server error",
				error: error.message,
			});
		}
	}
);

// @route   POST /api/instructor-auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post(
	"/forgot-password",
	[body("email").isEmail().withMessage("Please enter a valid email")],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email } = req.body;

		try {
			const instructor = await Instructor.findOne({ email });

			if (!instructor) {
				return res.status(404).json({ message: "Instructor not found" });
			}

			// Generate OTP for password reset
			const otp = Math.floor(100000 + Math.random() * 900000).toString();
			const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

			instructor.resetToken = otp;
			instructor.resetTokenExpiry = otpExpiry;
			await instructor.save();

			// Send OTP email
			await sendOTPEmail(email, otp, instructor.name);

			res.json({
				message: "OTP sent to your email. Check your inbox.",
			});
		} catch (error) {
			res.status(500).json({
				message: "Server error",
				error: error.message,
			});
		}
	}
);

// @route   POST /api/instructor-auth/reset-password
// @desc    Reset password using OTP
// @access  Public
router.post(
	"/reset-password",
	[
		body("email").isEmail().withMessage("Please enter a valid email"),
		body("otp").notEmpty().withMessage("OTP is required"),
		body("password")
			.isLength({ min: 6 })
			.withMessage("Password must be at least 6 characters"),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, otp, password } = req.body;

		try {
			const instructor = await Instructor.findOne({ email });

			if (!instructor) {
				return res.status(404).json({ message: "Instructor not found" });
			}

			// Check if OTP is valid and not expired
			if (instructor.resetToken !== otp || !instructor.resetTokenExpiry) {
				return res.status(400).json({ message: "Invalid OTP" });
			}

			if (new Date() > instructor.resetTokenExpiry) {
				return res.status(400).json({ message: "OTP has expired" });
			}

			// Reset password
			instructor.password = password;
			instructor.resetToken = undefined;
			instructor.resetTokenExpiry = undefined;
			await instructor.save();

			res.json({
				message: "Password reset successfully. You can now login.",
			});
		} catch (error) {
			res.status(500).json({
				message: "Server error",
				error: error.message,
			});
		}
	}
);

// @route   POST /api/instructor-auth/login
// @desc    Login instructor
// @access  Public
router.post(
	"/login",
	[
		body("email").isEmail().withMessage("Please enter a valid email"),
		body("password").notEmpty().withMessage("Password is required"),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password } = req.body;

		try {
			// Check if instructor exists
			const instructor = await Instructor.findOne({ email });
			if (!instructor) {
				return res.status(401).json({ message: "Invalid credentials" });
			}

			// Check if instructor has set password
			if (!instructor.password) {
				return res.status(401).json({ 
					message: "Please set your password using the registration email" 
				});
			}

			// Check if instructor is active
			if (!instructor.active) {
				return res.status(401).json({ message: "Instructor account is deactivated" });
			}

			// Check password
			const isMatch = await instructor.comparePassword(password);
			if (!isMatch) {
				return res.status(401).json({ message: "Invalid credentials" });
			}

			res.json({
				_id: instructor._id,
				name: instructor.name,
				email: instructor.email,
				expertise: instructor.expertise,
				approved: instructor.approved,
				token: generateToken(instructor._id),
			});
		} catch (error) {
			res.status(500).json({
				message: "Server error",
				error: error.message,
			});
		}
	}
);

export default router;
