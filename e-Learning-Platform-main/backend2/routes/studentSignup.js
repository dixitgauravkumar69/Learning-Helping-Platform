const express = require("express");
const bcrypt = require("bcryptjs");
const Student = require("../models/Student"); // Make sure to create a Student model

const router = express.Router();

// Student Signup
router.post("/student/signup", async (req, res) => {
  const { Firstname, Lastname, Email, Password } = req.body;

  try {
    let student = await Student.findOne({ Email });
    if (student) {
      return res.status(400).json({ message: "Student already registered" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
    student = new Student({
      Firstname,
      Lastname,
      Email,
      Password: hashedPassword,
    });

    await student.save();
    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    console.error("Error in student signup:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
