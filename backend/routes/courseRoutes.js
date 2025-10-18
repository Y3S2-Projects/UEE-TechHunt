const express = require("express");
const router = express.Router();
const { getCourses, createCourse } = require("../controllers/courseController");

// Maps GET /api/courses to the getCourses controller
router.route("/").get(getCourses);

// Maps POST /api/courses to the createCourse controller
router.route("/").post(createCourse);

module.exports = router;