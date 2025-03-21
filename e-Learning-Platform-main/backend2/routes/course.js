const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// Get course ID based on course name or slug
router.get("/get-course/:courseId", async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.courseId });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json({ courseId: course._id });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
