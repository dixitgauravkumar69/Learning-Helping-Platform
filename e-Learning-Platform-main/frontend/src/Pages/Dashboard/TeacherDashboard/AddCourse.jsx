import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiFileText } from "react-icons/fi";

function AddCourse() {
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("courseName", courseName);
    formData.append("courseDescription", courseDescription);
    formData.append("courseFile", file);

    try {
      const response = await fetch("http://localhost:8000/api/teacher/addCourse", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        navigate("/Teacher/Dashboard/:ID");
      } else {
        setError(result.message || "Failed to add course");
      }
    } catch (error) {
      setError("Error uploading course. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 text-center">Add New Course</h2>
        <p className="text-center text-gray-500 mb-6">Upload course details and PDF file</p>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Course Name */}
          <div>
            <label className="text-gray-600 font-medium block mb-1">Course Name</label>
            <div className="relative">
              <FiFileText className="absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                required
                className="w-full pl-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter course name"
              />
            </div>
          </div>

          {/* Course Description */}
          <div>
            <label className="text-gray-600 font-medium block mb-1">Course Description</label>
            <textarea
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter course description"
              rows="3"
            ></textarea>
          </div>

          {/* File Upload */}
          <div>
            <label className="text-gray-600 font-medium block mb-1">Upload Course File</label>
            <div className="relative">
              <FiUpload className="absolute left-3 top-3 text-gray-500" />
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                required
                className="w-full pl-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Add Course
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCourse;
