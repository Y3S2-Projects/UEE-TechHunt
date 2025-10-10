const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a course title"],
    trim: true,
  },
  description: {
    type: String,
    // required: [true, "Please add a description"],
  },
  thumbnail: {
    type: String,
    // required: [true, "Please add a thumbnail URL"],
  },
  instructor: {
    type: String,
    // required: [true, "Please add an instructor name"],
  },
  contact: {
    type: String,
    required: [true, "Please add a contact number"],
  },
  email: {
    type: String,
    // required: [true, "Please add an email"],
  },
  students: {
    type: String, // Kept as string to accommodate "12.5k" format
    // required: [true, "Please add the number of students"],
  },
  rating: {
    type: Number,
    // required: [true, "Please add a rating"],
    min: 0,
    max: 5,
  },
  level: {
    type: String,
    required: [true, "Please specify the course level"],
    enum: ["Beginner", "Intermediate", "Advanced"],
  },
  createdAt: {
      type: Date,
      default: Date.now,
  }
});

module.exports = mongoose.model("Course", courseSchema);