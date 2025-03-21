import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEye, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get("/api/teacher/courses");
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course and its PDF?")) return;

    try {
      await axios.delete(`/api/teacher/deleteCourse/${id}`);
      setCourses((prevCourses) => prevCourses.filter((course) => course._id !== id));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Available Courses</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-center text-gray-600">No courses available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {courses.map(({ _id, courseName, courseDescription }) => (
            <div
              key={_id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 hover:scale-105 border"
            >
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800">{courseName}</h3>
                <p className="text-gray-600 mt-2">{courseDescription}</p>
                <div className="mt-4 flex justify-between items-center">
                  <Link
                    to={`/view-courses/${_id}`}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    <FiEye className="mr-2" />
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(_id)}
                    className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    <FiTrash2 className="mr-2" />
                    Delete
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
