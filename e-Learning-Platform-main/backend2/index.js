const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const natural = require("natural");
const _ = require("lodash");

// Models & Routes
const studentdoc= require("./routes/studentdoc");
const Quiz = require("./models/quizgenerator");
const Teachersignup = require("./routes/teacherSignup");
const Studentsignup = require("./routes/studentSignup");
const teacherLoginRoutes = require("./routes/teacherlogin");
const studentLoginRoutes = require("./routes/studentlogin");
const teacherroute = require("./routes/Teacherroutes");
const SeePdf = require("./routes/SeePdf");
const course = require("./routes/course");
const progress = require("./routes/progress");
const FetchQuiz = require("./routes/fetchquiz");
const studentquiz = require("./routes/fetchquiz");
const UploadQuiz = require("./routes/uploadquiz");
const { title } = require("process");

const app = express();
const PORT = 8000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Database Connection
mongoose
  .connect("mongodb://localhost:27017/NewlearningPlateform", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Multer Storage Setup
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = "uploads/";
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

// Generate Questions Function
function generateQuestions(text) {
  const sentences = text.split(".").filter((s) => s.trim().length > 10);
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
      questions.push({ type: "WH", question, options: [], answer: sentence });
    } else if (questionType === "fill") {
      let wordToRemove = words[Math.floor(Math.random() * words.length)];
      let question = sentence.replace(wordToRemove, "______");
      let options = _.shuffle([
        wordToRemove,
        words[Math.floor(Math.random() * words.length)],
        words[Math.floor(Math.random() * words.length)],
        words[Math.floor(Math.random() * words.length)],
      ]);
      questions.push({
        type: "Fill in the Blank",
        question,
        options,
        answer: wordToRemove,
      });
    } else if (questionType === "trueFalse") {
      let isTrue = Math.random() > 0.5;
      questions.push({
        type: "True/False",
        question: sentence,
        options: ["True", "False"],
        answer: isTrue ? "True" : "False",
      });
    } else if (questionType === "mcq") {
      let keyword = words[Math.floor(Math.random() * words.length)];
      let question = `What is '${keyword}' related to in this context?`;
      let options = _.shuffle([
        sentence,
        "A random incorrect answer",
        "Another wrong choice",
        "Completely unrelated option",
      ]);
      questions.push({ type: "MCQ", question, options, answer: sentence });
    }
  }

  return questions;
}

// Process PDF Function
const processPDF = async (pdfPath, title) => {
  const buffer = fs.readFileSync(pdfPath);
  const data = await pdfParse(buffer);
  const text = data.text;
  const questions = generateQuestions(text);
  const newQuiz = new Quiz({ title, questions });
  await newQuiz.save();
  return newQuiz;
};

// Routes
app.use("/api", Teachersignup);
app.use("/api", Studentsignup);
app.use("/api/Student", studentdoc);
app.use("/api", teacherLoginRoutes);
app.use("/api", studentLoginRoutes);
app.use("/api", course);
app.use("/api", progress);
app.use("/api/teacher", teacherroute);
app.use("/api/teacher", SeePdf);
app.use("/api", FetchQuiz);
app.use("/api", UploadQuiz);
app.use("/api", studentquiz);

// Upload PDF Route
app.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file || !req.body.title) {
      return res.status(400).json({ error: "PDF and title are required." });
    }

    const quiz = await processPDF(req.file.path, req.body.title);
    res.status(200).json({
      message: "Quiz generated successfully",
      quizId: quiz._id,
      title: quiz.title,
      questions: quiz.questions,
    });
  } catch (error) {
    console.error("Error in /upload:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// Fetch All Quizzes
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


app.get('/api/FetchQuiz/:id', async (req, res) => {
  try {
    const quizId = req.params.id;
    console.log("Fetching quiz with ID:", quizId);
    const quiz = await Quiz.findById(quizId); // Assuming you're using MongoDB
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found!" });
    }
    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch quiz." });
  }
});



// Base Route
app.get("/", (req, res) => {
  res.send("Welcome to New Learning Plateform Server----");
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
