import React from "react";
import { useState } from "react";
import { courseData } from "../data/CourseData";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { fireStoreDB } from "../config/firebase";
import { useModuleContext } from "../context/UserModuleContext";

const Courses = () => {
  const [search, setSearch] = useState("");
  const { currentUserId } = useAuth();
  const { fetchUserModules } = useModuleContext();

  const handleAdd = async (course) => {
    try {
      const day = course.day;
      const courseId = course.courseId;
      const timeslot = course.timeslot;
      const type = course.type;
      const userDocRef = doc(fireStoreDB, "users", currentUserId);
      const userDocSnapshot = await getDoc(userDocRef);
      const userDayMap = userDocSnapshot.data().timetable;
      userDayMap[day][courseId + " " + type] = timeslot;
      await setDoc(userDocRef, { timetable: userDayMap }, { merge: true });
      console.log("Course added successfully.");
      fetchUserModules();
    } catch (err) {
      console.log("Error adding course to fireStoreDb", err);
    }
  };

  const handleRemove = async (course) => {
    try {
      const day = course.day;
      const courseId = course.courseId;
      const type = course.type;
      const userDocRef = doc(fireStoreDB, "users", currentUserId);
      const userDocSnapshot = await getDoc(userDocRef);
      const userDayMap = { ...userDocSnapshot.data() };
      delete userDayMap.timetable[day][courseId + " " + type];
      await setDoc(userDocRef, userDayMap);
      console.log("Course removed successfully.");
      fetchUserModules();
    } catch (err) {
      console.log("Error removing course from fireStoreDb", err);
    }
  };

  return (
    <div className="mt-20">
      <form className="flex justify-center my-10 font-mono">
        <div className="flex w-1/3">
          <input
            className="border border-gray-300 rounded-l py-2 px-4 focus:outline-none focus:ring-2 font-mono  focus:ring-blue-500 flex-grow"
            type="text"
            placeholder="Search courses to add"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </form>
      <div className="flex justify-center font-mono">
        <table className="w-1/3">
          <thead>
            <tr className="text-lg">
              <th>CourseId</th>
              <th>Day</th>
              <th>Timeslot</th>
              <th>Type</th>
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
                  <td>{course.day}</td>
                  <td>{course.timeslot}</td>
                  <td>{course.type}</td>
                  <td>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                      type="button"
                      onClick={() => handleAdd(course)}
                    >
                      Add
                    </button>
                  </td>
                  <td>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                      type="button"
                      onClick={() => handleRemove(course)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Courses;
