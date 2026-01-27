import mongoose from "mongoose";

const mentorshipSessionSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	instructorId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Instructor",
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	date: {
		type: String,
		required: true,
	},
	time: {
		type: String,
		required: true,
	},
	notes: {
		type: String,
		default: "",
	},
	meetingLink: {
		type: String,
		default: "",
	},
	status: {
		type: String,
		enum: ["upcoming", "completed", "cancelled"],
		default: "upcoming",
	},
	bookedDate: {
		type: Date,
		default: Date.now,
	},
}, {
	timestamps: true,
});

export default mongoose.model("MentorshipSession", mentorshipSessionSchema);
