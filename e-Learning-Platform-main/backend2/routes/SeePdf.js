// Assuming you're using Express
const express = require('express');
const router = express.Router();
const Course = require('../models/Course'); // Adjust the path to your Course model

// Get course by ID
router.get('/courses/:courseId', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
