import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  doc,
  getDoc,
  setDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { fireStoreDB } from "../../config/firebase";
import { useModuleContext } from "../../context/UserModuleContext";
import { toast } from "react-toastify";

const CourseDisplay = ({ search }) => {
  const [courseData, setCourseData] = useState([]);
  const { currentUserId } = useAuth();
  const { fetchUserModules, userModules } = useModuleContext();

  async function getCourseData() {
    const courseCollectionRef = collection(fireStoreDB, "courses");
    const querySnapshot = await getDocs(courseCollectionRef);
    setCourseData(querySnapshot.docs.map((doc) => doc.data()));
  }

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

      for (let i = 0; i < courseData.length; i++) {
        if (
          courseData[i].courseId === courseId &&
          courseData[i].day === day &&
          courseData[i].timeslot === timeslot &&
          courseData[i].type === type
        ) {
          const querySnapshot = await getDocs(
            query(
              collection(fireStoreDB, "courses"),
              where("courseId", "==", courseId),
              where("day", "==", day),
              where("timeslot", "==", timeslot),
              where("type", "==", type)
            )
          );
          const courseUniqueId = querySnapshot.docs[0].id;
          const courseDocRef = doc(fireStoreDB, "courses", courseUniqueId);
          const courseDocSnapshot = await getDoc(courseDocRef);
          const courseInfo = courseDocSnapshot.data();
          await setDoc(
            courseDocRef,
            { numOfStudents: courseInfo.numOfStudents + 1 },
            { merge: true }
          );
        }
      }

      getCourseData();

      toast.success("Course added successfully!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      fetchUserModules();
    } catch (err) {
      console.log("Error adding course to fireStoreDb", err);
    }
  };

  const handleRemove = async (course) => {
    try {
      const day = course.day;
      const courseId = course.courseId;
      const timeslot = course.timeslot;
      const type = course.type;
      const userDocRef = doc(fireStoreDB, "users", currentUserId);
      const userDocSnapshot = await getDoc(userDocRef);
      const userDayMap = { ...userDocSnapshot.data() };

      if (userDayMap.timetable[day][courseId + " " + type] === timeslot) {
        delete userDayMap.timetable[day][courseId + " " + type];
        await setDoc(userDocRef, userDayMap);

        for (let i = 0; i < courseData.length; i++) {
          if (
            courseData[i].courseId === courseId &&
            courseData[i].day === day &&
            courseData[i].timeslot === timeslot &&
            courseData[i].type === type
          ) {
            const querySnapshot = await getDocs(
              query(
                collection(fireStoreDB, "courses"),
                where("courseId", "==", courseId),
                where("day", "==", day),
                where("timeslot", "==", timeslot),
                where("type", "==", type)
              )
            );
            const courseUniqueId = querySnapshot.docs[0].id;
            const courseDocRef = doc(fireStoreDB, "courses", courseUniqueId);
            const courseDocSnapshot = await getDoc(courseDocRef);
            const courseInfo = courseDocSnapshot.data();
            await setDoc(
              courseDocRef,
              { numOfStudents: courseInfo.numOfStudents - 1 },
              { merge: true }
            );
          }
        }

        getCourseData();

        toast.success("Course removed successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        fetchUserModules();
      }
    } catch (err) {
      console.log("Error removing course from fireStoreDb", err);
    }
  };

  function isCourseAdded(course) {
    const day = course.day;
    const courseId = course.courseId;
    const timeslot = course.timeslot;
    const type = course.type;
    for (let i = 0; i < userModules.length; i++) {
      const [userDay, userModuleCodeAndType, userTimeslot] = userModules[i];
      if (
        day === userDay &&
        courseId + " " + type === userModuleCodeAndType &&
        timeslot === userTimeslot
      ) {
        return true;
      }
    }
    return false;
  }

  useEffect(() => {
    getCourseData();
  }, [setCourseData]);

  return (
    <div className="flex justify-center font-mono">
      <table className="w-1/3">
        <thead>
          <tr className="text-lg">
            <th>CourseId</th>
            <th>Day</th>
            <th>Timeslot</th>
            <th>Type</th>
            <th>Students Selected</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {courseData
            .filter((course) => {
              const searchLower = search.toLowerCase();
              const courseIdLower = course.courseId.toLowerCase();
              return searchLower === ""
                ? course
                : courseIdLower.includes(searchLower);
            })
            .map((course) => (
              <tr key={course.courseId}>
                <td>{course.courseId}</td>
                <td>{course.day}</td>
                <td>{course.timeslot}</td>
                <td>{course.type}</td>
                <td>{course.numOfStudents}</td>
                <td>
                  {isCourseAdded(course) ? (
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                      type="button"
                      onClick={() => handleRemove(course)}
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                      type="button"
                      onClick={() => handleAdd(course)}
                    >
                      Add
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseDisplay;
