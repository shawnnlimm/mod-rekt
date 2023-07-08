import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { fireStoreDB } from "../../config/firebase";
import { useModuleContext } from "../../context/UserModuleContext";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

const CourseDisplay = ({ search }) => {
  const [courseData, setCourseData] = useState([]);
  const { currentUserId } = useAuth();
  const { fetchUserModules, userModules } = useModuleContext();
  const [itemOffset, setItemOffset] = useState(0);
  const coursesPerPage = 10;
  const endOffset = itemOffset + coursesPerPage;
  const filteredItems = courseData.filter((course) => {
    const searchLower = search.toLowerCase();
    const courseIdLower = course[0].toLowerCase();
    return searchLower === "" ? true : courseIdLower.includes(searchLower);
  });
  const currentItems = filteredItems.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(
    courseData.filter((course) => {
      const searchLower = search.toLowerCase();
      const courseIdLower = course[0].toLowerCase();
      return searchLower === "" ? course : courseIdLower.includes(searchLower);
    }).length / coursesPerPage
  );

  const handlePageClick = (event) => {
    const newOffset = (event.selected * coursesPerPage) % courseData.length;
    setItemOffset(newOffset);
  };

  async function getCourseData() {
    const courseDataStore = [];
    const courseCollectionRef = collection(fireStoreDB, "courseInfo");
    const courseDocSnapshot = await getDocs(courseCollectionRef);
    const courseDataMap = courseDocSnapshot.docs[0].data().courseInfoMap;
    Object.keys(courseDataMap).forEach((courseID) => {
      const course = courseDataMap[courseID];
      const courseCredits = course.courseCredits;
      const timetableMap = course.timetable[0];
      const day = timetableMap.day;
      const startTime = timetableMap.startTime;
      const endTime = timetableMap.endTime;
      const lessonType = timetableMap.lessonType;
      const numOfStudents = timetableMap.numOfStudents;
      courseDataStore.push([
        courseID,
        courseCredits,
        day,
        startTime,
        endTime,
        lessonType,
        numOfStudents,
      ]);
    });
    courseDataStore.sort((a, b) => a[0].localeCompare(b[0]));
    setCourseData(courseDataStore);
  }

  const handleAdd = async (course) => {
    try {
      const day = course[2];
      const courseId = course[0];
      const startTime = course[3];
      const endTime = course[4];
      const type = course[5];
      const userDocRef = doc(fireStoreDB, "users", currentUserId);
      const userDocSnapshot = await getDoc(userDocRef);
      const userDayMap = userDocSnapshot.data().timetable;
      const timetableDayData = userDayMap[day];

      function isScheduled(start, end) {
        let isOverlap = false;
        Object.values(timetableDayData).forEach((timeslot) => {
          const startTime = timeslot.split(" - ")[0];
          const endTime = timeslot.split(" - ")[1];
          if (start >= startTime && start <= endTime) {
            isOverlap = true;
          } else if (end >= startTime && end <= endTime) {
            isOverlap = true;
          }
        });
        return isOverlap;
      }

      if (isScheduled(startTime, endTime)) {
        toast.error("There is already a course in that timeslot!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        userDayMap[day][courseId + " " + type] = startTime + " - " + endTime;
        await setDoc(userDocRef, { timetable: userDayMap }, { merge: true });

        const courseCollectionRef = collection(fireStoreDB, "courseInfo");
        const courseDocSnapshot = await getDocs(courseCollectionRef);
        const docRef = courseDocSnapshot.docs[0].ref;
        const courseInfoMap = courseDocSnapshot.docs[0].data().courseInfoMap;
        courseInfoMap[courseId].timetable[0].numOfStudents += 1;
        await updateDoc(docRef, { courseInfoMap });

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
      }
      fetchUserModules();
    } catch (err) {
      console.log("Error adding course to fireStoreDb", err);
    }
  };

  const handleRemove = async (course) => {
    try {
      const day = course[2];
      const courseId = course[0];
      const startTime = course[3];
      const endTime = course[4];
      const type = course[5];
      const userDocRef = doc(fireStoreDB, "users", currentUserId);
      const userDocSnapshot = await getDoc(userDocRef);
      const userDayMap = { ...userDocSnapshot.data() };

      if (
        userDayMap.timetable[day][courseId + " " + type] ===
        startTime + " - " + endTime
      ) {
        delete userDayMap.timetable[day][courseId + " " + type];
        await setDoc(userDocRef, userDayMap);

        const courseCollectionRef = collection(fireStoreDB, "courseInfo");
        const courseDocSnapshot = await getDocs(courseCollectionRef);
        const docRef = courseDocSnapshot.docs[0].ref;
        const courseInfoMap = courseDocSnapshot.docs[0].data().courseInfoMap;
        courseInfoMap[courseId].timetable[0].numOfStudents -= 1;
        await updateDoc(docRef, { courseInfoMap });

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
    const day = course[2];
    const courseId = course[0];
    const startTime = course[3];
    const endTime = course[4];
    const type = course[5];
    for (let i = 0; i < userModules.length; i++) {
      const [userDay, userModuleCodeAndType, userTimeslot] = userModules[i];
      if (
        day === userDay &&
        courseId + " " + type === userModuleCodeAndType &&
        startTime + " - " + endTime === userTimeslot
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
    <div>
      <div className="flex justify-center font-mono">
        <table className="w-full">
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
            {currentItems
              .filter((course) => {
                const searchLower = search.toLowerCase();
                const courseIdLower = course[0].toLowerCase();
                return searchLower === ""
                  ? course
                  : courseIdLower.includes(searchLower);
              })
              .map((course) => (
                <tr>
                  <td>{course[0]}</td>
                  <td>{course[2]}</td>
                  <td>{course[3] + " - " + course[4]}</td>
                  <td>{course[5]}</td>
                  <td>{course[6]}</td>
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
      <div>
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          containerClassName="flex justify-center my-4"
          pageLinkClassName="mx-2 px-3 py-2 bg-blue-300 hover:bg-blue-600 rounded-lg"
          activeLinkClassName="bg-grey-200 text-white"
          previousLinkClassName="mx-2 px-3 py-2 bg-blue-400 hover:bg-blue-600 rounded-lg"
          nextLinkClassName="mx-2 px-3 py-2 bg-blue-400 hover:bg-blue-600 rounded-lg"
          breakClassName="mx-2"
        />
      </div>
    </div>
  );
};

export default CourseDisplay;
