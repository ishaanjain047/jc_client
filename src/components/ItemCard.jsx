const ItemCard = ({ item, isShortlisted, toggleShortlist }) => {
  // Fields to exclude from display (we'll handle them specially)
  const excludeFields = ["id", "product_name"];

  return (
    <div
      className={`relative h-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
        isShortlisted
          ? "border-2 border-green-500 bg-green-50"
          : "border border-gray-200"
      } rounded-lg overflow-hidden shadow-md group`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {item.product_name || "Unknown Product"}
          </h3>
          <button
            onClick={toggleShortlist}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200 ${
              isShortlisted
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-500"
            }`}
          >
            {isShortlisted ? "★" : "☆"}
          </button>
        </div>

        <div className="space-y-2">
          {Object.entries(item).map(([key, value]) => {
            // Skip excluded fields
            if (excludeFields.includes(key)) return null;

            // Format the key for display
            const formattedKey = key
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());

            return (
              <div key={key} className="text-sm">
                <span className="font-medium text-gray-700">
                  {formattedKey}:
                </span>{" "}
                <span className="text-gray-600 break-words">{value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
