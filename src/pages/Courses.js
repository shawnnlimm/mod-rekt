import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CourseSearchbar from "../components/Courses/CourseSearchbar";
import CourseDisplay from "../components/Courses/CourseDisplay";

const Courses = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="mt-20">
      <ToastContainer />
      <CourseSearchbar setSearch={setSearch} />
      <CourseDisplay search={search} />
    </div>
  );
};

export default Courses;
