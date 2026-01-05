import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	expertise: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
	},
	active: {
		type: Boolean,
		default: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.model("Mentor", mentorSchema);
