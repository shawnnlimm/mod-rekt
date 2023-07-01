import React from "react";

const CourseSearchbar = ({ setSearch }) => {
  return (
    <form className="flex justify-center my-10 font-mono">
      <div className="flex w-1/3">
        <input
          className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 font-mono focus:ring-blue-500 flex-grow"
          type="text"
          placeholder="Search courses to add"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </form>
  );
};

export default CourseSearchbar;
