import express from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import Mentor from "../models/Mentor.js";

const router = express.Router();

// Email configuration - Gmail SMTP Relay
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 25,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // App Password ONLY
  },
  requireTLS: false,
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
		expiresIn: "34h",
	});
};

// Function to send OTP email
const sendOTPEmail = async (email, otp, mentorName = "Mentor") => {
	console.log(`\n📧 sendOTPEmail called for: ${email}, OTP: ${otp}`);
	
	const mailOptions = {
		from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
		to: email,
		subject: "YuganthaAI - Password Setup OTP",
		html: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
				<h2>Password Setup - YuganthaAI</h2>
				<p>Hello ${mentorName},</p>
				<p>Please use the OTP below to set your password:</p>
				
				<div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
					<p style="margin: 0; color: #666; font-size: 14px;">Your OTP (valid for 10 minutes):</p>
					<p style="margin: 10px 0; font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #333;">${otp}</p>
				</div>
				
				<p>Go to the password setup page and enter this OTP along with your new password.</p>
				<p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/mentor/forgot-password" style="color: #007bff; text-decoration: none;">Set Your Password</a></p>
				
				<p style="color: #666; font-size: 12px; margin-top: 30px;">
					This OTP will expire in 10 minutes.
				</p>
			</div>
		`,
	};

	try {
		console.log(`🔧 Transporter config - From: ${mailOptions.from}, To: ${mailOptions.to}`);
		const info = await transporter.sendMail(mailOptions);
		console.log(`✅ OTP email sent successfully to ${email}`);
		console.log(`📧 Message ID: ${info.messageId}`);
		return true;
	} catch (error) {
		console.error(`❌ Failed to send OTP email to ${email}`);
		console.error(`Error Code: ${error.code}`);
		console.error(`Error Message: ${error.message}`);
		console.error(`Full Error:`, error);
		throw new Error(`Failed to send OTP email: ${error.message}`);
	}
};

// @route   POST /api/mentor-auth/forgot-password
// @desc    Request password reset/setup
// @access  Public
router.post(
	"/forgot-password",
	[body("email").isEmail().withMessage("Please enter a valid email")],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log("❌ Validation errors:", errors.array());
			return res.status(400).json({ errors: errors.array() });
		}

		const { email } = req.body;
		console.log(`\n📧 Forgot Password Request for: ${email}`);

		try {
			console.log("🔍 Searching for mentor with email:", email);
			const mentor = await Mentor.findOne({ email });

			if (!mentor) {
				console.log("❌ Mentor not found for email:", email);
				return res.status(404).json({ message: "Mentor not found" });
			}

			console.log("✅ Mentor found:", mentor.name);

			// Generate OTP for password reset
			const otp = Math.floor(100000 + Math.random() * 900000).toString();
			const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

			console.log(`📝 Generating OTP: ${otp}`);
			mentor.resetToken = otp;
			mentor.resetTokenExpiry = otpExpiry;
			const savedMentor = await mentor.save();
			console.log("✅ OTP saved to database");

			// Send OTP email
			console.log(`📤 Sending OTP email to ${email}...`);
			await sendOTPEmail(email, otp, mentor.name);

			console.log(`✅ OTP email sent successfully to ${email}`);
			res.json({
				message: "OTP sent to your email. Check your inbox.",
			});
		} catch (error) {
			console.error("❌ Error in forgot-password endpoint:", error.message);
			console.error("Full error:", error);
			res.status(500).json({
				message: "Server error",
				error: error.message,
			});
		}
	}
);

// @route   POST /api/mentor-auth/reset-password
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
			const mentor = await Mentor.findOne({ email });

			if (!mentor) {
				return res.status(404).json({ message: "Mentor not found" });
			}

			// Check if OTP is valid and not expired
			if (mentor.resetToken !== otp || !mentor.resetTokenExpiry) {
				return res.status(400).json({ message: "Invalid OTP" });
			}

			if (new Date() > mentor.resetTokenExpiry) {
				return res.status(400).json({ message: "OTP has expired" });
			}

			// Hash password before saving
			const bcrypt = (await import("bcryptjs")).default;
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);

			// Reset password
			mentor.password = hashedPassword;
			mentor.resetToken = undefined;
			mentor.resetTokenExpiry = undefined;
			await mentor.save();

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

// @route   POST /api/mentor-auth/login
// @desc    Login mentor
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
			const bcrypt = (await import("bcryptjs")).default;

			// Check if mentor exists
			const mentor = await Mentor.findOne({ email });
			if (!mentor) {
				return res.status(401).json({ message: "Invalid credentials" });
			}

			// Check if mentor has set password
			if (!mentor.password) {
				return res.status(401).json({ 
					message: "Please set your password using the registration email" 
				});
			}

			// Check if mentor is active
			if (!mentor.active) {
				return res.status(401).json({ message: "Mentor account is deactivated" });
			}

			// Check password
			const isMatch = await bcrypt.compare(password, mentor.password);
			if (!isMatch) {
				return res.status(401).json({ message: "Invalid credentials" });
			}

			res.json({
				mentor: {
					_id: mentor._id,
					name: mentor.name,
					email: mentor.email,
					expertise: mentor.expertise,
					approved: mentor.approved,
				},
				token: generateToken(mentor._id),
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
