const mongoose = require("mongoose");
const QuizSchema = new mongoose.Schema({
    title: String,
    questions: Array,
    visibleToStudents: {
        type: Boolean,
        default: false,
      },
});

module.exports = mongoose.model("Quizgenerator",QuizSchema);    