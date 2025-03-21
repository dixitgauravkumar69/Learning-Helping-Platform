const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users"); // Make sure you have a User model

const router = express.Router();

// Signup route
router.post("/teacher/signup", async (req, res) => {
  try {
    const { Firstname, Lastname, Email, Password, userType } = req.body;

    // Validate required fields
    if (!Firstname || !Lastname || !Email || !Password || !userType) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check for existing user
    const existingUser = await User.findOne({ Email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    // Create new user
    const newUser = new User({
      Firstname,
      Lastname,
      Email,
      Password: hashedPassword,
      userType,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, "your_jwt_secret", {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "User registered successfully.", token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;
