import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [studentId, setStudentId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
    const id = localStorage.getItem("studentId");
    setStudentId(id);
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("/api/teacher/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-4xl font-bold text-gray-900 text-center mb-8">
        Explore Our Courses
      </h2>
      {courses.length === 0 ? (
        <p className="text-center text-gray-600">No courses available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white shadow-md rounded-xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <div className="p-6 flex flex-col h-full">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  {course.courseName}
                </h3>
                <p className="text-gray-600 flex-grow">{course.courseDescription}</p>
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => navigate(`/view-course/${course._id}`)}
                    className="flex items-center bg-blue-600 text-white w-full px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    <FiEye className="mr-2" /> View Course
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
