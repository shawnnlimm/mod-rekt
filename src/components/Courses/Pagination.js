import React from "react";

const Pagination = ({ totalCourses, coursesPerPage, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalCourses / coursesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <ul className="flex justify-center space-x-4">
        {pageNumbers.map((num) => (
          <li key={num} className="inline-flex items-center">
            <button onClick={() => paginate(num)} className="text-black">
              {num}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pagination;
