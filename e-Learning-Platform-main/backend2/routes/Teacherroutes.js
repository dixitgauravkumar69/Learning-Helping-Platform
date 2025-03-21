const express = require('express');
const multer = require('multer');
const path = require('path');
const Course = require('../models/Course');
const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/'); // Ensure you have an 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Route to fetch all courses
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    if (!courses.length) {
      return res.status(404).json({ message: 'No courses found' });
    }
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// Route to add a new course (Without teacherId)
router.post('/addCourse', upload.single('courseFile'), async (req, res) => {
    try {
      console.log('Received request to add course:', req.body);
      console.log('Received file:', req.file);
  
      const { courseName, courseDescription } = req.body;
      if (!courseName || !courseDescription || !req.file) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const { filename, path: filePath, size: fileSize } = req.file;
  
      const newCourse = new Course({
        courseName,
        courseDescription,
        courseFile: { filename, filePath, fileSize },
      });
  
      await newCourse.save();
      console.log('Course saved successfully:', newCourse);
  
      res.status(201).json({ message: 'Course added successfully', course: newCourse });
    } catch (error) {
      console.error('Error adding course:', error);
      res.status(500).json({ message: 'Error adding course', error: error.message });
    }
  });

  
// Get a course by ID and return the PDF URL
router.get("/course/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.courseFile || !course.courseFile.filePath) {
      return res.status(404).json({ message: "PDF file not available" });
    }

    res.json({ pdfUrl: `/uploads/${course.courseFile.filename}` }); // Send PDF URL
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/deleteCourse/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Remove PDF file (if stored locally)
    if (course.pdfPath) {
      const filePath = path.join(__dirname, "../uploads", course.pdfPath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete course from DB
    await Course.findByIdAndDelete(req.params.id);

    res.json({ message: "Course and PDF deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error });
  }
});

  

module.exports = router;
