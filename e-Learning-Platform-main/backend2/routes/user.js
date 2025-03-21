const express = require("express");
const router = express.Router();
const User = require("../models/users");

// Get logged-in user ID
router.get("/get-user", async (req, res) => {
    try {
      console.log("Request received at /api/get-user"); // Debug log
  
      const userId = req.user?.id; // Example - depends on your auth setup
  
      if (!userId) {
        console.error("User ID not found in request");
        return res.status(400).json({ error: "User ID not found" });
      }
  
      res.json({ userId });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
  
module.exports = router;
