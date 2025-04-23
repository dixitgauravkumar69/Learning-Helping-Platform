const express=require('express');
const router=express.Router();
const Quiz=require('../models/quizgenerator.js');

router.get('/Fetchquiz',async(req,res)=>{   
    try{
        const quizzes=await Quiz.find();
        res.status(200).json(quizzes);
    }catch(error){
        console.error("❌ Error fetching quizzes:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//Fatch quiz by students..
router.get("/FetchQuiz", async (req, res) => {
    try {
      const visibleQuizzes = await Quiz.find({ visibleToStudents: true });
      res.json(visibleQuizzes);
    } catch (err) {
      res.status(500).json({ message: "Error fetching quizzes" });
    }
  });
module.exports=router;