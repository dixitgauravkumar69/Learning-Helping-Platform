const express = require("express");
const router = express.Router();
const Quiz = require("../models/quizgenerator");

router.post("/uploadQuiz/:quizId", async (req, res) => {
  try {
    const updated = await Quiz.findByIdAndUpdate(
      req.params.quizId,
      { visibleToStudents: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json({
      message: "Quiz uploaded successfully",
      visibleToStudents: updated.visibleToStudents, 
      quiz: updated, 
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});


module.exports = router;
