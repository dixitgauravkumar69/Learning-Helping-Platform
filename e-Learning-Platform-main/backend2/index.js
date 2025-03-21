const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path=require('path');
const Teachersignup = require("./routes/teacherSignup");
const Studentsignup = require("./routes/studentSignup");
const teacherLoginRoutes = require("./routes/teacherlogin"); 
const studentLoginRoutes = require("./routes/studentlogin"); 
const teacherroute=require('./routes/Teacherroutes');
const SeePdf=require('./routes/SeePdf');
const course=require('./routes/course');
const progress=require('./routes/progress');
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const natural = require("natural");
const _ = require("lodash");
const nlp = require("compromise");
const Quiz=require("./models/quizgenerator");
// const UploadQuiz=require("./routes/uploadquiz");
const app = express();
const PORT = 8000;

// Middleware
app.use(
    cors({
      origin: "http://localhost:5173", // Adjust if frontend is hosted elsewhere
      credentials: true, // Allow credentials (cookies, auth headers)
    })
  );
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());

// Database Connection
mongoose.connect("mongodb://localhost:27017/NewlearningPlateform", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Routes
app.use("/api", Teachersignup);
app.use("/api", Studentsignup);
app.use("/api", teacherLoginRoutes);
app.use("/api", studentLoginRoutes);
app.use("/api",course);
app.use("/api",progress);
app.use("/api/teacher",teacherroute);
app.use("/api/teacher",SeePdf);
// app.use("/api/quiz",UploadQuiz);
// Multer Storage Setup
const upload = multer({ dest: "upload1/" });

// Function to generate different types of questions
function generateQuestions(text) {
    const sentences = text.split(".").filter(s => s.trim().length > 10); // Extract meaningful sentences
    const tokenizer = new natural.WordTokenizer();

    let questions = [];
    let usedSentences = new Set();

    for (let i = 0; i < 10; i++) {
        let sentence = sentences[Math.floor(Math.random() * sentences.length)];
        if (!sentence || usedSentences.has(sentence)) continue;

        usedSentences.add(sentence);
        let words = tokenizer.tokenize(sentence);

        let questionType = _.sample(["wh", "fill", "trueFalse", "mcq"]);

        if (questionType === "wh") {
            let whWord = _.sample(["What", "Who", "When", "Where", "Why", "How"]);
            let question = `${whWord} ${sentence}?`;
            let answer = sentence;
            questions.push({ type: "WH", question, options: [], answer });
        }

        else if (questionType === "fill") {
            let wordToRemove = words[Math.floor(Math.random() * words.length)];
            let question = sentence.replace(wordToRemove, "______");
            let options = _.shuffle([
                wordToRemove,
                words[Math.floor(Math.random() * words.length)],
                words[Math.floor(Math.random() * words.length)],
                words[Math.floor(Math.random() * words.length)]
            ]);
            questions.push({ type: "Fill in the Blank", question, options, answer: wordToRemove });
        }

        else if (questionType === "trueFalse") {
            let question = sentence;
            let isTrue = Math.random() > 0.5;
            let answer = isTrue ? "True" : "False";
            questions.push({ type: "True/False", question, options: ["True", "False"], answer });
        }

        else if (questionType === "mcq") {
            let keyword = words[Math.floor(Math.random() * words.length)];
            let question = `What is '${keyword}' related to in this context?`;
            let options = _.shuffle([
                sentence,
                "A random incorrect answer",
                "Another wrong choice",
                "Completely unrelated option"
            ]);
            questions.push({ type: "MCQ", question, options, answer: sentence });
        }
    }

    return questions;
}

// Upload & Process PDF Route
app.post("/upload", upload.single("pdf"), async (req, res) => {
    try {
        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await pdfParse(dataBuffer);
        const extractedText = data.text;

        // Generate diverse questions
        const questions = generateQuestions(extractedText);

        // Save quiz in DB
        const quiz = new Quiz({ title: req.file.originalname, questions });
        await quiz.save();

        res.json({ quizId: quiz._id, questions });
    } catch (error) {
        console.error("Error processing PDF:", error);
        res.status(500).json({ error: "Failed to process PDF" });
    }
});

// Fetch Quizzes from DB
app.get("/quizzes", async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.json(quizzes);
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        res.status(500).json({ error: "Failed to fetch quizzes" });
    }
});


app.get("/api/quiz", async (req, res) => {
    try {
      const quizzes = await Quiz.find();
      res.status(200).json(quizzes);
    } catch (error) {
      console.error("❌ Error fetching quizzes:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

app.get("/", (req, res) => {  
    res.send("Welcome to New Learning Plateform Server----");
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
