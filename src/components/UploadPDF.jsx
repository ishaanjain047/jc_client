import { useState } from "react";
import axios from "axios";

const UploadPDF = ({ onDataProcessed, setLoading }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError(null);
    } else if (selectedFile) {
      setFile(null);
      setError("Please select a valid PDF file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("pdf_file", file);

    try {
      setLoading(true);
      setError(null);

      // Upload and process the PDF
      const response = await axios.post(
        "http://127.0.0.1:5000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // If we get the data directly in the upload response, use it
        if (response.data.data) {
          onDataProcessed(response.data.data);
        } else {
          // Try the get-data endpoint as fallback
          try {
            const dataResponse = await axios.get(
              "http://127.0.0.1:5000/api/get-data",
              { withCredentials: true }
            );

            if (dataResponse.data.success) {
              onDataProcessed(dataResponse.data.data);
            } else {
              setError(
                dataResponse.data.error || "Failed to fetch processed data"
              );
            }
          } catch (dataErr) {
            console.error("Error fetching data:", dataErr);
            setError("Failed to retrieve processed data");
          }
        }
      } else {
        setError(response.data.error || "Failed to process PDF");
      }
    } catch (err) {
      console.error("Error details:", err.response || err);
      setError(
        err.response?.data?.error ||
          "An error occurred while processing the file"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mb-8">
      <div className="w-full max-w-2xl">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-semibold mb-4">
              Upload Supplier Rate List
            </h2>
            <p className="text-gray-600 mb-6">
              Upload a PDF file to extract structured data of products and
              prices.
            </p>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="pdfFile"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  PDF File
                </label>
                <input
                  type="file"
                  id="pdfFile"
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Only PDF files are supported.
                </p>
              </div>

              <button
                type="submit"
                disabled={!file}
                className={`${
                  file
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                } text-white py-2 px-6 rounded-md text-sm font-medium transition-colors duration-200`}
              >
                Process PDF
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPDF;
