const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Teacher = require("../models/users");

const router = express.Router();

// Teacher Login Route
router.post("/teacher/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const teacher = await Teacher.findOne({ Email: email });

    if (!teacher) {
      return res.status(401).json({ message: "Teacher not found" });
    }

    const isMatch = await bcrypt.compare(password, teacher.Password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: teacher._id, role: "teacher" },
      "your_jwt_secret", // Replace with a real secret key
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true, secure: true });
    res.status(200).json({ message: "Teacher login successful", token });
  } catch (error) {
    console.error("Teacher Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
