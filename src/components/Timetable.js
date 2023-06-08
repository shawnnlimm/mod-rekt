import React from "react";

const Timetable = () => {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
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

  return (
    <div className="flex justify-center items-center h-screen">
      <table className="table-auto border border-gray-300 w-2/3">
        <thead>
          <tr>
            <th className="border border-gray-300"></th>
            {daysOfWeek.map((day) => (
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
              <td className="border border-gray-300 py-4 px-4 text-center">
                {timeSlot}
              </td>
              {daysOfWeek.map((day) => (
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
  );
};

export default Timetable;
