import { useState, useEffect } from "react";
import { fetchBusinesses } from "./services/api";

function App() {
  const [businesses, setBusinesses] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    vibe: "",
    price_max: "",
    services: [],
  });

  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [chatVisible, setChatVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");

  useEffect(() => {
    fetchBusinesses(filters).then(setBusinesses);
    setCurrentPage(1); // Reset to page 1 whenever filters change
  }, [filters]);

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleNaturalSearch = (e) => {
    const input = e.target.value.toLowerCase();
    let category = "";
    if (input.includes("yoga")) category = "Yoga";
    else if (input.includes("gym")) category = "Gym";
    else if (input.includes("pilates")) category = "Pilates";
    else if (input.includes("boxing")) category = "Boxing";

    let price_max = "";
    if (input.includes("cheap")) price_max = 40;
    else if (input.includes("moderate")) price_max = 60;
    else if (input.includes("expensive")) price_max = 100;

    let services = [];
    if (input.includes("sauna")) services.push("Sauna");
    if (input.includes("pt")) services.push("PT");
    if (input.includes("group classes")) services.push("Group Classes");

    setFilters({ ...filters, category, price_max, services });
  };

  const recommend = (goal) => {
    let vibe = "";
    if (goal === "Strength") vibe = "Performance & Intensity";
    else if (goal === "Relaxation") vibe = "Calm & Wellness";
    else if (goal === "Community") vibe = "Community & Support";

    fetchBusinesses({ vibe }).then((res) => {
      if (res.length > 0) {
        setModalContent(
          `Top recommendation: ${res[0].name} (${res[0].category}, ${res[0].location})`
        );
      } else {
        setModalContent("No recommendation found for this goal.");
      }
      setModalVisible(true);
    });
  };

  const handleChat = () => {
    const input = chatInput.toLowerCase();
    let response = "";

    if (input.includes("gym") && input.includes("sydney")) {
      response =
        businesses
          .filter((b) => b.category === "Gym" && b.location === "Sydney")
          .map((b) => b.name)
          .join(", ") || "No gyms found in Sydney.";
    } else if (input.includes("yoga") && input.includes("sauna")) {
      response =
        businesses
          .filter((b) => b.category === "Yoga" && b.services.includes("Sauna"))
          .map((b) => b.name)
          .join(", ") || "No yoga studios with sauna found.";
    } else {
      response =
        "Sorry, I didn't understand. Try: 'Yoga in Sydney' or 'Gym in Melbourne'";
    }

    setChatResponse(response);
    setChatInput("");
  };

  const getRelatedCategories = (business, allBusinesses) => {
    const related = allBusinesses
      .filter((b) => b.category === business.category && b.id !== business.id)
      .map((b) => b.name)
      .slice(0, 3);
    return related;
  };

  const totalPages = Math.ceil(businesses.length / itemsPerPage);
  const paginatedBusinesses = businesses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Pagination rendering function
  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-md text-white ${
            currentPage === i
              ? "bg-primary"
              : "bg-primary/40 hover:bg-primary/60"
          } transition`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark">
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-subtle-light dark:border-subtle-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-primary">
              <h1 className="text-2xl font-bold">GymLink</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="p-6 bg-background-light dark:bg-subtle-dark rounded-lg shadow-sm space-y-6">
              <h2 className="text-xl font-bold mb-4">Search & Filter</h2>
              <input
                type="text"
                placeholder="Search for fitness businesses..."
                className="w-full px-4 py-3 rounded-lg border border-subtle-light dark:border-subtle-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary transition placeholder-placeholder-light dark:placeholder-placeholder-dark"
                value={filters.search}
                onChange={handleSearchChange}
              />
              <input
                type="text"
                placeholder="Natural Language Search"
                className="w-full px-4 py-3 rounded-lg border border-subtle-light dark:border-subtle-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary transition placeholder-placeholder-light dark:placeholder-placeholder-dark"
                onChange={handleNaturalSearch}
              />
              <select
                value={filters.category || "All Categories"}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    category: e.target.value === "All Categories" ? "" : e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-lg border border-subtle-light dark:border-subtle-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary transition"
              >
                <option>All Categories</option>
                <option>Gym</option>
                <option>Yoga</option>
                <option>Boxing</option>
                <option>Pilates</option>
              </select>
              <select
                value={filters.vibe || "Any Vibe"}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    vibe: e.target.value === "Any Vibe" ? "" : e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-lg border border-subtle-light dark:border-subtle-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary transition"
              >
                <option>Any Vibe</option>
                <option>Performance & Intensity</option>
                <option>Calm & Wellness</option>
                <option>Community & Support</option>
              </select>
              <input
                type="number"
                placeholder="Max Price"
                value={filters.price_max}
                onChange={(e) => setFilters({ ...filters, price_max: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-subtle-light dark:border-subtle-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary transition placeholder-placeholder-light dark:placeholder-placeholder-dark"
              />
            </div>

            <div className="p-6 bg-background-light dark:bg-subtle-dark rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4">Recommendations</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => recommend("Strength")}
                  className="flex-grow px-4 py-2 rounded-full text-sm font-semibold bg-primary/20 hover:bg-primary/30 text-primary transition-colors"
                >
                  Strength
                </button>
                <button
                  onClick={() => recommend("Relaxation")}
                  className="flex-grow px-4 py-2 rounded-full text-sm font-semibold bg-primary/20 hover:bg-primary/30 text-primary transition-colors"
                >
                  Relaxation
                </button>
                <button
                  onClick={() => recommend("Community")}
                  className="flex-grow px-4 py-2 rounded-full text-sm font-semibold bg-primary/20 hover:bg-primary/30 text-primary transition-colors"
                >
                  Community
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedBusinesses.length === 0 ? (
                <p>No businesses found.</p>
              ) : (
                paginatedBusinesses.map((b) => {
                  const relatedCategories = getRelatedCategories(b, businesses);
                  return (
                    <div
                      key={b.id}
                      className="bg-background-light dark:bg-subtle-dark rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold">{b.name}</h3>
                          <span className="text-lg font-semibold text-primary">${b.price}/week</span>
                        </div>
                        <div className="space-y-3 text-sm text-placeholder-light dark:text-placeholder-dark">
                          <div className="flex items-center gap-2">
                            <span className="material-icons">self_improvement</span>
                            <p>Category: {b.category}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="material-icons">location_on</span>
                            <p>Location: {b.location}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="material-icons">spa</span>
                            <p>Vibe: {b.vibe}</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="material-icons mt-0.5">fitness_center</span>
                            <div>
                              <p className="font-medium text-text-light dark:text-text-dark">Services</p>
                              <ul className="list-disc list-inside mt-1">
                                {b.services.map((s, i) => (
                                  <li key={i}>{s}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      {relatedCategories.length > 0 && (
                        <div className="mt-6 border-t border-subtle-light dark:border-subtle-dark pt-4">
                          <h4 className="text-sm font-semibold mb-2 text-text-light dark:text-text-dark">You might also like:</h4>
                          <div className="flex flex-wrap gap-2">
                            {relatedCategories.map((name, i) => (
                              <a
                                key={i}
                                className="text-xs bg-primary/20 hover:bg-primary/30 text-primary font-medium px-2.5 py-1 rounded-full transition-colors"
                                href="#"
                              >
                                {name}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-6 gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-primary text-white rounded-md disabled:bg-gray-400"
              >
                Prev
              </button>
              {renderPagination()}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-primary text-white rounded-md disabled:bg-gray-400"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Chatbot Button */}
      <button
        onClick={() => setChatVisible((prev) => !prev)}
        className="fixed bottom-6 right-6 bg-primary rounded-full p-4 text-white shadow-lg hover:bg-primary/80 transition duration-200"
      >
        <span className="material-icons">chat_bubble</span>
      </button>

      {/* Chat Interface */}
      {chatVisible && (
        <div className="fixed bottom-6 right-6 bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-lg w-80 max-w-full z-20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-center">Chatbot</h2>
            <button
              onClick={() => setChatVisible(false)} // Close the chat window
              className="text-xl font-bold text-primary"
            >
              X
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Ask a question..."
              className="w-full px-4 py-3 rounded-lg border border-subtle-light dark:border-subtle-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary transition placeholder-placeholder-light dark:placeholder-placeholder-dark"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button
              onClick={handleChat}
              className="w-full px-4 py-3 rounded-lg bg-primary text-background-dark font-bold hover:opacity-90 transition-opacity"
            >
              Ask
            </button>
            {chatResponse && (
              <p className="mt-2 text-sm text-text-light dark:text-text-dark">
                <strong>Answer:</strong> {chatResponse}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">Recommendation</h2>
            <p className="text-lg mb-4">{modalContent}</p>
            <button
              onClick={() => setModalVisible(false)}
              className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
