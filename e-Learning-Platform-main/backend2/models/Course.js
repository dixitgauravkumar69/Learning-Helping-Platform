const mongoose = require('mongoose');

// Define the course schema
const courseSchema = new mongoose.Schema({
  
  courseName: {
    type: String,
    required: true,
  },
  courseDescription: {
    type: String,
    required: true,
  },
  courseFile: {
    filename: String,
    filePath: String,
    fileSize: Number,
  },
  dateUploaded: {
    type: Date,
    default: Date.now,
  },
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
