import { useState } from "react";
import ItemCard from "./ItemCard";

const ItemsDisplay = ({
  data,
  shortlistedItems,
  toggleShortlist,
  clearShortlist,
  onReset,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Extract items from data
  const items = data?.structured_data?.items || [];

  // Filter items based on search query
  const filteredItems = items.filter((item) => {
    // If no search query, return all items
    if (!searchQuery.trim()) return true;

    // Search in all fields of the item
    return Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Get shortlisted items
  const shortlistedItemsData = items.filter((item) =>
    shortlistedItems.includes(item.id)
  );

  // Handle export of shortlisted items
  const handleExport = () => {
    if (shortlistedItemsData.length === 0) {
      alert("Your shortlist is empty.");
      return;
    }

    // Create a JSON blob and download it
    const dataStr = JSON.stringify(shortlistedItemsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    // Create a temporary link and click it
    const link = document.createElement("a");
    link.href = url;
    link.download = "shortlisted_items.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold">Processed Items</h3>
        <button
          onClick={onReset}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
        >
          Upload Another PDF
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("all")}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === "all"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              All Items
              <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                {items.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("shortlist")}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === "shortlist"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Shortlisted
              <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                {shortlistedItems.length}
              </span>
            </button>
          </nav>
        </div>
      </div>

      {/* All Items Tab Content */}
      {activeTab === "all" && (
        <div>
          <div className="sticky top-0 bg-white py-4 border-b mb-6 z-10">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="flex-1 mb-4 md:mb-0 md:mr-4">
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">Showing:</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full mr-2">
                  {filteredItems.length}
                </span>
                <span>of</span>
                <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full ml-2">
                  {items.length}
                </span>
                <span className="ml-2">items</span>
              </div>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-blue-700">
              No items match your search criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  isShortlisted={shortlistedItems.includes(item.id)}
                  toggleShortlist={() => toggleShortlist(item.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Shortlist Tab Content */}
      {activeTab === "shortlist" && (
        <div>
          <div className="mb-6">
            <button
              onClick={clearShortlist}
              disabled={shortlistedItems.length === 0}
              className={`mr-2 px-4 py-2 border border-red-300 rounded-md ${
                shortlistedItems.length > 0
                  ? "text-red-700 hover:bg-red-50"
                  : "text-gray-400 cursor-not-allowed border-gray-200"
              } transition-colors duration-200`}
            >
              Clear Shortlist
            </button>
            <button
              onClick={handleExport}
              disabled={shortlistedItems.length === 0}
              className={`px-4 py-2 border border-blue-300 rounded-md ${
                shortlistedItems.length > 0
                  ? "text-blue-700 hover:bg-blue-50"
                  : "text-gray-400 cursor-not-allowed border-gray-200"
              } transition-colors duration-200`}
            >
              Export Shortlist
            </button>
          </div>

          {shortlistedItems.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                Your shortlist is empty. Click on items to add them to your
                shortlist.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shortlistedItemsData.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  isShortlisted={true}
                  toggleShortlist={() => toggleShortlist(item.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemsDisplay;
