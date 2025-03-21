import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist/webpack";

const PDFViewer = () => {
  const { courseId } = useParams(); 
  const [pdfUrl, setPdfUrl] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const viewerRef = useRef(null);

  // Fetch PDF and saved progress
  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const response = await axios.get(`/api/teacher/course/${courseId}`);
        if (response.data.pdfUrl) {
          setPdfUrl(`http://localhost:8000${response.data.pdfUrl}`);
          fetchProgress(); // Fetch progress after loading PDF
        } else {
          console.error("PDF file not found.");
        }
      } catch (error) {
        console.error("Error fetching course PDF:", error);
      }
    };

    const fetchProgress = async () => {
      try {
        const progressRes = await axios.get(`http://localhost:8000/api/get-progress/${courseId}`);
        if (progressRes.data.success) {
          const savedProgress = progressRes.data.progressPercentage || 0;
          if (savedProgress > 0) {
            const savedPage = Math.ceil((savedProgress / 100) * totalPages);
            setCurrentPage(savedPage > 0 ? savedPage : 1);
          }
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    fetchPDF();
  }, [courseId, totalPages]);

  // Render PDF
  useEffect(() => {
    if (pdfUrl) {
      const renderPDF = async () => {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        setTotalPages(pdf.numPages);

        const renderPage = async (pageNumber) => {
          const page = await pdf.getPage(pageNumber);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          viewerRef.current.innerHTML = '';
          viewerRef.current.appendChild(canvas);

          page.render({ canvasContext: ctx, viewport: viewport });
        };

        renderPage(currentPage);
      };

      renderPDF();
    }
  }, [pdfUrl, currentPage]);

  // Handle Previous and Next button clicks
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      updateProgress(newPage);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      updateProgress(newPage);
    }
  };

  // Update progress in the database
  const updateProgress = async (newPage) => {
    const progressPercentage = totalPages > 0 ? (newPage / totalPages) * 100 : 0;
  
    if (!courseId) {
      console.error("Error: courseId is undefined while updating progress!");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/update-progress", {
        courseId,
        progressPercentage: progressPercentage.toFixed(2),
      });

      console.log("Progress updated successfully");
    } catch (error) {
      console.error("Error updating progress:", error.response?.data || error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
        Course PDF Viewer
      </h2>

      <div
        ref={viewerRef}
        style={{ maxHeight: "900px", overflowY: "scroll", border: "none" }}
      >
        {/* PDF content will render here */}
      </div>

      {/* Progress Display */}
      <div className="mt-4 text-center">
        <p className="text-lg font-semibold">
          Page {currentPage} of {totalPages}
        </p>
        <div className="mt-2">
          <div className="bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-500 h-2.5 rounded-full"
              style={{ width: `${(currentPage / totalPages) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm mt-1">{((currentPage / totalPages) * 100).toFixed(2)}% completed</p>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PDFViewer;
