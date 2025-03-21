import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // Backend server

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/quiz`);
        setQuizzes(response.data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="quiz-container">
      <h2>Available Quizzes</h2>
      {loading ? (
        <p>Loading quizzes...</p>
      ) : quizzes.length > 0 ? (
        quizzes.map((quiz, index) => (
          <div key={index} className="quiz-item">
            <h3>{quiz.title}</h3>
            {quiz.questions.map((q, i) => (
              <div key={i}>
                <p><strong>{i + 1}. {q.question}</strong></p>
                <ul>
                  {q.options.map((option, j) => (
                    <li key={j}>{option}</li>
                  ))}
                </ul>
                <p><strong>Correct Answer:</strong> {q.answer}</p>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No quizzes available.</p>
      )}
    </div>
  );
};

export default Quiz;
