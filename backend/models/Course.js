import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true,
	},
	description: {
		type: String,
		required: true,
	},
	instructor: {
		type: String,
		required: true,
	},
	rating: {
		type: Number,
		default: 0,
		min: 0,
		max: 5,
	},
	students: {
		type: Number,
		default: 0,
	},
	lessons: {
		type: Number,
		default: 0,
	},
	duration: {
		type: String,
		default: "",
	},
	level: {
		type: String,
		enum: ["Beginner", "Intermediate", "Advanced"],
		default: "Beginner",
	},
	category: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		default: "",
	},
	thumbnail: {
		type: String,
		default: "",
	},
	videoUrl: {
		type: String,
		default: "",
	},
	videoPublicId: {
		type: String,
		default: "",
	},
	videos: [
		{
			title: String,
			url: String,
			publicId: String,
			duration: String,
			order: Number,
		},
	],
	price: {
		type: String,
		default: "Free",
	},
	isFree: {
		type: Boolean,
		default: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
