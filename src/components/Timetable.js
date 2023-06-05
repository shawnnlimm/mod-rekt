import React from "react";

const Timetable = () => {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const renderDaysOfWeek = () => {
    return daysOfWeek.map((day) => (
      <div
        key={day}
        className="text-center text-gray-500 uppercase font-semibold"
      >
        {day}
      </div>
    ));
  };
  return (
    <div className="p-4 bg-white rounded ml-20 mr-20 shadow">
      <div className="flex justify-center mb-4">
        <h2 className="text-lg font-bold">Week View Calendar</h2>
        {/* Add navigation buttons or controls if needed */}
      </div>
      <div className="grid grid-cols-5 gap-4 ">
        {renderDaysOfWeek()}
        {/* Render the rest of the week calendar content */}
      </div>
    </div>
  );
};

export default Timetable;
