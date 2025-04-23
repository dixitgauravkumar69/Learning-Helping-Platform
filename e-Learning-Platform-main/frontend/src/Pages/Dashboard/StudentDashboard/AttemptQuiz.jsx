import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./AttemptQuiz.css"; // Custom CSS file for styling

const AttemptQuiz = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) return console.error("Quiz ID is missing");
      try {
        const res = await axios.get(`http://localhost:8000/api/FetchQuiz/${quizId}`);
        setQuiz(res.data);
      } catch (err) {
        console.error("Failed to load quiz:", err);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleChange = (qIndex, option) => {
    if (!submitted) {
      setAnswers({ ...answers, [qIndex]: option });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let correct = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.answer) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  if (!quiz) return <p className="loading-text">Loading quiz...</p>;

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">{quiz.title}</h2>
      <form onSubmit={handleSubmit}>
        {quiz.questions.map((q, index) => (
          <div key={index} className="quiz-card">
            <p className="quiz-question">{index + 1}. {q.question}</p>
            <div className="options-group">
              {q.options.map((option, i) => (
                <button
                  type="button"
                  key={i}
                  className={`option-button ${answers[index] === option ? "selected" : ""}`}
                  onClick={() => handleChange(index, option)}
                  disabled={submitted}
                >
                  {String.fromCharCode(65 + i)}. {option}
                </button>
              ))}
            </div>
          </div>
        ))}

        {!submitted ? (
          <button type="submit" className="submit-button">
            Submit Quiz
          </button>
        ) : (
          <div className="result-text">
            Your Score: {score} / {quiz.questions.length}
          </div>
        )}
      </form>
    </div>
  );
};

export default AttemptQuiz;
