const Course = require("../models/courseModel");

/**
 * @desc    Get all courses
 * @route   GET /api/courses
 * @access  Public
 */
exports.getCourses = async (req, res) => {
  try {
    // Find all courses and sort by the newest ones first
    const courses = await Course.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      error: "Server Error: Could not fetch courses.",
    });
  }
};

/**
 * @desc    Create a new course
 * @route   POST /api/courses
 * @access  Public (can be protected later)
 */
exports.createCourse = async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json({
            success: true,
            data: course,
        });
    } catch (error) {
        console.error("Error creating course:", error);
        // Handle MongoDB validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        }
        res.status(500).json({
            success: false,
            error: "Server Error: Could not create course.",
        });
    }
};