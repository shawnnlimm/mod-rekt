import React, { useEffect, useState } from "react";
import { useModuleContext } from "../../context/UserModuleContext";

const FriendTimetable = () => {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = [
    "0800",
    "0830",
    "0900",
    "0930",
    "1000",
    "1030",
    "1100",
    "1130",
    "1200",
    "1230",
    "1300",
    "1330",
    "1400",
    "1430",
    "1500",
    "1530",
    "1600",
    "1630",
    "1700",
    "1730",
    "1800",
    "1830",
    "1900",
    "1930",
    "2000",
    "2030",
    "2100",
    "2130",
  ];
  const { friendModules } = useModuleContext();
  const [timetableData, setTimetableData] = useState([]);
  const occupiedSlots = [];

  const getRowSpan = (moduleCode) => {
    let count = 0;
    timetableData.forEach((event) => {
      if (event[1] === moduleCode) {
        count = Math.ceil(
          (parseInt(event[2].split(" - ")[1], 10) -
            parseInt(event[2].split(" - ")[0], 10)) /
            50
        );
      }
    });
    return count;
  };

  const slotIsTaken = (occupiedSlots, day, timeSlot) => {
    if (occupiedSlots.length === 0) {
      return false;
    }
    for (let i = 0; i < occupiedSlots.length; i++) {
      if (occupiedSlots[i][0] === day) {
        if (occupiedSlots[i][1].includes(timeSlot)) {
          return true;
        }
      }
    }
    return false;
  };

  useEffect(() => {
    setTimetableData(friendModules);
  }, [friendModules]);

  return (
    <div>
      <div className="flex justify-center items-center mt-20 font-mono">
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
                {daysOfWeek.map((day) => {
                  const moduleEvent = timetableData.find(
                    (event) =>
                      event[0] === day &&
                      event[2].split(" - ")[0].includes(timeSlot)
                  );
                  if (moduleEvent) {
                    const takenSlots = timeSlots.filter(
                      (slot) =>
                        slot >= moduleEvent[2].split(" - ")[0] &&
                        slot < moduleEvent[2].split(" - ")[1]
                    );
                    occupiedSlots.push([day, takenSlots]);
                    const rowspan = getRowSpan(moduleEvent[1]);
                    return (
                      <td
                        key={`${day}-${timeSlot}`}
                        rowSpan={rowspan}
                        className="border border-gray-300 py-2 px-4 text-center hover:font-bold"
                      >
                        {moduleEvent[1]} {moduleEvent[3]}
                      </td>
                    );
                  } else if (slotIsTaken(occupiedSlots, day, timeSlot)) {
                    return null;
                  } else {
                    return (
                      <td
                        key={`${day}-${timeSlot}`}
                        className="border border-gray-300 py-2 px-4 text-center"
                      ></td>
                    );
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FriendTimetable;
