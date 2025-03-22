import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import UploadPDF from "./components/UploadPDF";
import ItemsDisplay from "./components/ItemsDisplay";

function App() {
  const [processedData, setProcessedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shortlistedItems, setShortlistedItems] = useState([]);

  const handleDataProcessed = (data) => {
    setProcessedData(data);
  };

  const toggleShortlist = (itemId) => {
    setShortlistedItems((prevItems) => {
      if (prevItems.includes(itemId)) {
        return prevItems.filter((id) => id !== itemId);
      } else {
        return [...prevItems, itemId];
      }
    });
  };

  const clearShortlist = () => {
    setShortlistedItems([]);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />

        <div className="container mx-auto px-4 py-6">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  {!processedData && (
                    <UploadPDF
                      onDataProcessed={handleDataProcessed}
                      setLoading={setLoading}
                    />
                  )}

                  {processedData && (
                    <ItemsDisplay
                      data={processedData}
                      shortlistedItems={shortlistedItems}
                      toggleShortlist={toggleShortlist}
                      clearShortlist={clearShortlist}
                      onReset={() => setProcessedData(null)}
                    />
                  )}
                </>
              }
            />
          </Routes>
        </div>

        {loading && (
          <div className="fixed inset-0 bg-white bg-opacity-80 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <h4 className="text-xl font-semibold mb-2">Processing PDF...</h4>
              <p className="text-gray-600">
                This may take a minute or two depending on the file size.
              </p>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
