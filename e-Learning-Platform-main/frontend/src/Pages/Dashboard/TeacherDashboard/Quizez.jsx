import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Quizez = () => {
  const [Quizes, setQuizes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchQuize();
  }, []);

  const handleUpload = async (quizId) => {
    try {
      const res = await axios.post(`/api/uploadQuiz/${quizId}`);
      
      console.log("Upload Response:", res.data); 
      console.log("visibleToStudents:", res.data.visibleToStudents); 
  
      alert("Quiz uploaded successfully!");
    } catch (err) {
      console.error("Upload Error:", err.response?.data || err.message);
      alert("Upload failed. Please try again.");
    }
  };
  
  
  const fetchQuize = async () => {
    try {
      const response = await axios.get("/api/FetchQuiz");
      setQuizes(response.data);
    } catch (error) {
      console.error("Error fetching quizes:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-4xl font-bold text-gray-900 text-center mb-8">
        Generated quizes are--
      </h2>
      {Quizes.length === 0 ? (
        <p className="text-center text-gray-600">
          No quiz available at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Quizes.map((Quiz) => (
            <div
              key={Quiz._id}
              className="bg-white shadow-md rounded-xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <div className="p-6 flex flex-col h-full">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  {Quiz.title}
                </h3>

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => handleUpload(Quiz._id)}
                    className="flex items-center bg-blue-600 text-white w-full px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    <FiEye className="mr-2" /> Upload Quiz
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

export default Quizez;
