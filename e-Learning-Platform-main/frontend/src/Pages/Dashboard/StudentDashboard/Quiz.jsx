import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom"; // include useParams
import { FiPlay } from "react-icons/fi";

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();
  const { ID } = useParams(); // get student ID from route

  useEffect(() => {
    fetchVisibleQuizzes();
  }, []);

  const fetchVisibleQuizzes = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/FetchQuiz");
      setQuizzes(res.data);
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
    }
  };

  const handleAttempt = (quizId) => {
    if (!quizId) {
      console.error("Invalid quizId");
      return; // Exit early if quizId is undefined or null
    }

    const cleanQuizId = quizId.trim(); // Ensure quiz ID is clean from any extra spaces or characters
    console.log("Attempting quiz with ID:", cleanQuizId);

    // Check if ID is valid
    if (cleanQuizId && cleanQuizId.length > 0) {
      navigate(`/Student/Dashboard/AttemptQuiz/${cleanQuizId}`);
    } else {
      console.error("Invalid Quiz ID:", cleanQuizId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Available Quizzes
      </h2>

      {quizzes.length === 0 ? (
        <p className="text-center text-gray-600">
          No quizzes available to attempt.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {quiz.title}
                </h3>
                <p className="text-gray-600">
                  {quiz.description || "No description provided."}
                </p>
              </div>

              <button
                onClick={() => handleAttempt(quiz._id)}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center px-4 py-2 rounded-lg transition"
              >
                <FiPlay className="mr-2" /> Attempt
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Quiz;
