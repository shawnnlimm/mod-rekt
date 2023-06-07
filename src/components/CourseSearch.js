import React from "react";
import { useState } from "react";
import { courseData } from "../data/CourseData";

const CourseSearch = () => {
  const [search, setSearch] = useState("");
  const handleAdd = () => {};
  return (
    <div>
      <form className="flex justify-center my-10">
        <div className="flex w-1/3">
          <input
            className="border border-gray-300 rounded-l py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
            type="text"
            placeholder="Search courses to add"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-r"
            type="add"
            onClick={handleAdd}
          >
            Add
          </button>
        </div>
      </form>
      <div className="flex justify-center">
        <table className="w-1/3">
          <thead>
            <tr className="text-lg">
              <th>CourseId</th>
              <th>Timeslot</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {courseData
              .filter((course) => {
                return search.toLowerCase() === ""
                  ? course
                  : course.courseId.toLowerCase().includes(search);
              })
              .map((course) => (
                <tr key={course.courseId}>
                  <td>{course.courseId}</td>
                  <td>{course.timeslot}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseSearch;
