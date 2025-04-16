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
module.exports=router;