import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import "./Generatequiz.css"; // Import CSS for styling

const API_BASE_URL = "http://localhost:8000"; // Your backend server

const App = () => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".pdf",
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;
      const formData = new FormData();
      formData.append("pdf", acceptedFiles[0]);

      setLoading(true);
      try {
        const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setQuiz(response.data);
      } catch (error) {
        console.error("Error uploading PDF", error);
      }
      setLoading(false);
    },
  });

  // Function to upload quiz to student database
  const uploadQuizToStudent = async () => {
    // if (!quiz || !quiz.questions.length) {
    //   alert("No quiz available to upload!");
    //   return;
    // }

    // setUploading(true);
    // try {
    //   const response = await axios.post(`${API_BASE_URL}/api/quiz/save-quiz`, {
    //     title: "Generated Quiz", // Modify title as needed
    //     questions: quiz.questions,
    //   });

    //   alert("Quiz uploaded successfully!");
    //   console.log("Quiz saved:", response.data);
    // } catch (error) {
    //   console.error("Error uploading quiz:", error);
    //   alert("Failed to upload quiz.");
    // }
    // setUploading(false);
    console.log("Quiz uploaded successfully!");
  };

  return (
    <div className="container">
      <h1>PDF to Quiz Generator</h1>

      <div {...getRootProps()} className="upload-box">
        <input {...getInputProps()} />
        <p>Drag & drop a PDF here, or click to select a file</p>
      </div>

      {loading && <p className="loading-text">Processing PDF...</p>}

      {quiz && (
        <div className="quiz-container">
          <h2>Generated Quiz</h2>
          {quiz.questions.map((q, index) => (
            <div key={index} className="quiz-item">
              <p><strong>{index + 1}. {q.question}</strong></p>
              <ul>
                {q.options.map((option, i) => (
                  <li key={i}>- {option}</li>
                ))}
              </ul>
              <p className="correct-answer"><strong>Correct Answer:</strong> {q.answer}</p>
            </div>
          ))}

          {/* Upload Quiz Button */}
          <button
            className="upload-button"
            onClick={uploadQuizToStudent}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Quiz to Student"}
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
