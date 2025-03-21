const express = require("express");
const router = express.Router();
const Dumy = require("../models/Dummy");
const Course = require("../models/Course");
const User = require("../models/users");

// Update progress in the Dumy database
router.post("/update-progress", async (req, res) => {
  const { courseId,  progressPercentage } = req.body;

  if (!courseId) {
    return res.status(400).json({ error: "Missing courseId or userId" });
  }

  try {
    // Validate that the user and course exist in MongoDB
   
    const courseExists = await Course.findById(courseId);

    if (!courseExists) {
      return res.status(404).json({ error: "User or Course not found" });
    }

    // Find or create progress entry
    let progressEntry = await Dumy.findOne({ Courseid: courseId});

    if (progressEntry) {
      // Update existing progress
      progressEntry.ProgressPer = progressPercentage;
      await progressEntry.save();
    } else {
      // Create a new progress entry
      progressEntry = new Dumy({
        Courseid: courseId,
        ProgressPer: progressPercentage,
      });
      await progressEntry.save();
    }

    res.json({ success: true, message: "Progress updated", progressEntry });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/get-progress/:courseId", async (req, res) => {
  const { courseId } = req.params;

  if (!courseId) {
    return res.status(400).json({ error: "Missing courseId" });
  }

  try {
    // Fetch progress from the database
    const progressEntry = await Dumy.findOne({ Courseid: courseId });

    if (!progressEntry) {
      return res.json({ success: true, progressPercentage: 0 }); // Default to 0% if no progress found
    }

    res.json({ success: true, progressPercentage: progressEntry.ProgressPer });
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
