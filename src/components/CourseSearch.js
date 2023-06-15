import React from "react";
import { useState, useEffect } from "react";
import { courseData } from "../data/CourseData";
import { useAuth } from "../context/AuthContext";
import {
  doc,
  getDoc,
  setDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { fireStoreDB } from "../config/firebase";

const CourseSearch = ({ userModules, setUserModules }) => {
  const [search, setSearch] = useState("");
  const { currentUserId, currentUsername } = useAuth();

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

  const fetchUserModules = async () => {
    const modulesQuery = query(
      collection(fireStoreDB, "users"),
      where("username", "==", currentUsername)
    );

    try {
      const querySnapshot = await getDocs(modulesQuery);
      const userModulesData = [];

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const dayMap = userData.timetable;
        Object.keys(dayMap).forEach((day) => {
          const moduleCodeMap = dayMap[day];
          Object.entries(moduleCodeMap).forEach(([moduleCode, timeslot]) => {
            userModulesData.push([day, moduleCode, timeslot]);
          });
        });
      });

      setUserModules(userModulesData);
    } catch (err) {
      console.log("Error fetching user modules", err);
    }
  };

  useEffect(() => {
    fetchUserModules();
  }, [currentUsername]);

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
        </div>
      </form>
      <div className="flex justify-center">
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

export default CourseSearch;
