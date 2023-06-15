import React, { useEffect, useState } from "react";
import { useModuleContext } from "../context/UserModuleContext";

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
  const { userModules } = useModuleContext();
  const [timetableData, setTimetableData] = useState([]);

  useEffect(() => {
    setTimetableData(userModules);
  }, [userModules]);

  return (
    <div>
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
                    {timetableData.map((event) => {
                      const eventStartTime = event[2].split(" - ")[0]; // Extract the start time from the duration
                      const eventEndTime = event[2].split(" - ")[1]; // Extract the end time from the duration
                      if (
                        event[0] === day &&
                        timeSlot >= eventStartTime &&
                        timeSlot <= eventEndTime
                      ) {
                        return <div key={`${event[1]}`}>{event[1]}</div>;
                      }
                      return null;
                    })}
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

export default Timetable;
