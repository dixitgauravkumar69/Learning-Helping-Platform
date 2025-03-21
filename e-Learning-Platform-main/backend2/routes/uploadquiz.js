const express=require('express');
const router=express.Router();
app.post("/save-quiz", async (req, res) => {
    try {
      const { title, questions } = req.body;
  
      if (!title || !questions || !questions.length) {
        return res.status(400).json({ error: "Invalid quiz data" });
      }
  
      const newQuiz = new Quiz({ title, questions });
      await newQuiz.save();
  
      res.status(201).json({ message: "Quiz saved successfully!", quiz: newQuiz });
    } catch (error) {
      console.error("❌ Error saving quiz:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  module.exports=router;