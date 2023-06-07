import React, { useState } from "react";

const Test = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = [
    "0800",
    "0900",
    "1000",
    "1100",
    "1200",
    "1300",
    "1400",
    "1500",
    "1600",
    "1700",
    "1800",
  ];

  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchValue(value);

    // Perform search in your database based on the searchValue
    // Retrieve the suggestions for the module codes

    // Simulating the response from the database
    const moduleCodes = ["COMP101", "MATH202", "PHYS301"];

    // Filter the module codes based on the searchValue
    const filteredModules = moduleCodes.filter((moduleCode) =>
      moduleCode.toLowerCase().includes(value.toLowerCase())
    );

    // Set the filtered suggestions
    setSuggestions(filteredModules);
  };

  const handleAddModule = (moduleCode) => {
    setSelectedModules((prevModules) => [...prevModules, moduleCode]);
    setSearchValue("");
    setSuggestions([]);
  };

  const handleRemoveModule = (moduleCode) => {
    setSelectedModules((prevModules) =>
      prevModules.filter((module) => module !== moduleCode)
    );
  };

  return (
    <div className="p-4">
      {/* Header */}
      <h2 className="text-xl font-bold mb-4 text-center">Weekly Timetable</h2>

      {/* Search */}
      <div className="flex items-center space-x-4 mb-4">
        <input
          type="text"
          value={searchValue}
          onChange={handleSearch}
          className="p-2 border border-gray-300 rounded w-full"
          placeholder="Search module code"
        />
        <button
          onClick={() => handleAddModule(searchValue)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Module
        </button>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <ul className="list-disc list-inside mb-4">
          {suggestions.map((moduleCode) => (
            <li key={moduleCode}>{moduleCode}</li>
          ))}
        </ul>
      )}

      {/* Selected Modules */}
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">Selected Modules</h3>
        <ul className="list-disc list-inside">
          {selectedModules.map((moduleCode) => (
            <li key={moduleCode} className="flex items-center space-x-2">
              <span>{moduleCode}</span>
              <button
                onClick={() => handleRemoveModule(moduleCode)}
                className="text-red-500"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Timetable */}
      <div className="flex justify-center items-center h-screen">
        <table className="table-auto border border-gray-300 w-2/3">
          <thead>
            <tr>
              <th className="border border-gray-300"></th>
              {days.map((day) => (
                <th
                  key={day}
                  className="border border-gray-300 py-10 px-10 uppercase text-center"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((timeSlot) => (
              <tr key={timeSlot}>
                <td className="border border-gray-300 py-4 px-4">{timeSlot}</td>
                {days.map((day) => (
                  <td
                    key={day}
                    className="border border-gray-300 py-2 px-4 text-center"
                  >
                    {/* Render module events here */}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Test;
