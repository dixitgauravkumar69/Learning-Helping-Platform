import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist/webpack";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const PDFViewer = () => {
  const { courseId } = useParams();
  const [pdfUrl, setPdfUrl] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const viewerRef = useRef(null);

  // Fetch PDF
  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const response = await axios.get(`/api/teacher/course/${courseId}`);
        if (response.data.pdfUrl) {
          setPdfUrl(`http://localhost:8000${response.data.pdfUrl}`);
        } else {
          console.error("PDF file not found.");
        }
      } catch (error) {
        console.error("Error fetching course PDF:", error);
      }
    };

    fetchPDF();
  }, [courseId]);

  // Render PDF
  useEffect(() => {
    if (pdfUrl) {
      const renderPDF = async () => {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        setTotalPages(pdf.numPages);

        const renderPage = async (pageNumber) => {
          const page = await pdf.getPage(pageNumber);
          const viewport = page.getViewport({ scale: 1.8 });
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          viewerRef.current.innerHTML = "";
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
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-5xl">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          📘 Course PDF Viewer
        </h2>

        {/* PDF Viewer */}
        <div
          ref={viewerRef}
          className="border border-gray-300 rounded-lg overflow-hidden shadow-md bg-gray-200 p-3"
          style={{ maxHeight: "700px", overflowY: "auto" }}
        >
          {/* PDF content will render here */}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-6">
          <button
            className={`flex items-center px-6 py-3 rounded-lg font-medium text-white transition ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-md"
            }`}
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            <FiChevronLeft className="mr-2 text-xl" />
            Previous
          </button>

          <p className="text-lg font-semibold text-gray-700">
            Page {currentPage} of {totalPages}
          </p>

          <button
            className={`flex items-center px-6 py-3 rounded-lg font-medium text-white transition ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-md"
            }`}
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Next <FiChevronRight className="ml-2 text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
