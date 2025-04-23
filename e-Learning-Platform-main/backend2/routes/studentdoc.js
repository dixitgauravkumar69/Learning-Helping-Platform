// routes/studentRoutes.js
const express = require('express');
const Student = require('../models/Student');  // Import the Student model
const router = express.Router();

// Route to get student document by ID
router.get('/StudentDocument/:ID', async (req, res) => {
  try {
    const { ID } = req.params; // Get the ID from the URL
    const student = await Student.findById(ID); // Use Mongoose's findById to query the database

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ data: student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
