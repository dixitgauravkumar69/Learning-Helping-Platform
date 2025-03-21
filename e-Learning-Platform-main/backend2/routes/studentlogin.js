const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

const router = express.Router();

// Student Login Route
router.post("/student/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const student = await Student.findOne({ Email: email });

    if (!student) {
      return res.status(401).json({ message: "Student not found" });
    }

    const isMatch = await bcrypt.compare(password, student.Password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: student._id, role: "student" },
      "your_jwt_secret", // Replace with a real secret key
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true, secure: true });
    res.status(200).json({ message: "Student login successful", token });
  } catch (error) {
    console.error("Student Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
