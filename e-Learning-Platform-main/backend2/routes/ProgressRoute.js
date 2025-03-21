const express = require("express");
const router = express.Router();
const CourseProgress = require("../models/Dummy"); // Ensure you import the correct model

router.post("/update-progress", async (req, res) => {
  try {
    console.log("Received update progress request:", req.body); // Debugging log

    const { courseId, progressPercentage } = req.body;

    if (!courseId || progressPercentage === undefined) {
      return res.status(400).json({ error: "Missing courseId or progressPercentage" });
    }

    // Ensure courseId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: "Invalid courseId format" });
    }

    // Update or insert progress without userId
    const result = await CourseProgress.findOneAndUpdate(
      { courseId }, // No userId
      { progress: progressPercentage },
      { new: true, upsert: true }
    );

    console.log("Progress updated successfully:", result);
    res.json({ message: "Progress updated successfully", result });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
