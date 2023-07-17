import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/Authentication/AuthContext";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { fireStoreDB } from "../../config/firebase";
import { useModuleContext } from "../../context/UserModules/UserModuleContext";
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
      const timetableArray = course.timetable;
      for (let i = 0; i < timetableArray.length; i++) {
        const day = timetableArray[i].day;
        const startTime = timetableArray[i].startTime;
        const endTime = timetableArray[i].endTime;
        const lessonType = timetableArray[i].lessonType;
        const numOfStudents = timetableArray[i].numOfStudents;
        const classNo = timetableArray[i].classNo;
        courseDataStore.push([
          courseID,
          courseCredits,
          day,
          startTime,
          endTime,
          lessonType,
          classNo,
          numOfStudents,
        ]);
      }
    });
    courseDataStore.sort((a, b) => {
      const courseIdA = a[0];
      const courseIdB = b[0];
      const courseIdComparison = courseIdA.localeCompare(courseIdB);

      if (courseIdComparison !== 0) {
        return courseIdComparison;
      }

      const daysOfWeek = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      const dayA = a[2];
      const dayB = b[2];
      const dayComparison = daysOfWeek.indexOf(dayA) - daysOfWeek.indexOf(dayB);

      if (dayComparison !== 0) {
        return dayComparison;
      }

      const startTimeA = a[3];
      const startTimeB = b[3];
      const startTimeComparison = startTimeA - startTimeB;

      if (startTimeComparison !== 0) {
        return startTimeA - startTimeB;
      }

      const classNoA = a[6];
      const classNoB = b[6];
      return classNoA.localeCompare(classNoB);
    });
    setCourseData(courseDataStore);
  }

  const handleAdd = async (course) => {
    try {
      const courseId = course[0];
      const day = course[2];
      const startTime = course[3];
      const endTime = course[4];
      const type = course[5];
      const classNo = course[6];
      const userDocRef = doc(fireStoreDB, "users", currentUserId);
      const userDocSnapshot = await getDoc(userDocRef);
      const userDayMap = userDocSnapshot.data().timetable;
      const timetableDayData = userDayMap[day];

      function isScheduled(start, end) {
        let isOverlap = false;
        Object.values(timetableDayData).forEach((timeslot) => {
          const startTime = timeslot[0].split(" - ")[0];
          const endTime = timeslot[0].split(" - ")[1];
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
        userDayMap[day][courseId + " " + type] = [
          startTime + " - " + endTime,
          classNo,
        ];
        await setDoc(userDocRef, { timetable: userDayMap }, { merge: true });
        const courseCollectionRef = collection(fireStoreDB, "courseInfo");
        const courseDocSnapshot = await getDocs(courseCollectionRef);
        const docRef = courseDocSnapshot.docs[0].ref;
        const courseInfoMap = courseDocSnapshot.docs[0].data().courseInfoMap;
        const courseTimetableArray = courseInfoMap[courseId].timetable;
        for (let i = 0; i < courseTimetableArray.length; i++) {
          if (
            courseTimetableArray[i].classNo === classNo &&
            courseTimetableArray[i].startTime === startTime &&
            courseTimetableArray[i].endTime === endTime
          ) {
            courseTimetableArray[i].numOfStudents += 1;
          }
        }
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
      const courseId = course[0];
      const day = course[2];
      const startTime = course[3];
      const endTime = course[4];
      const type = course[5];
      const classNo = course[6];
      const userDocRef = doc(fireStoreDB, "users", currentUserId);
      const userDocSnapshot = await getDoc(userDocRef);
      const userDayMap = { ...userDocSnapshot.data() };

      if (
        userDayMap.timetable[day][courseId + " " + type][0] ===
          startTime + " - " + endTime &&
        userDayMap.timetable[day][courseId + " " + type][1] === classNo
      ) {
        delete userDayMap.timetable[day][courseId + " " + type];
        await setDoc(userDocRef, userDayMap);

        const courseCollectionRef = collection(fireStoreDB, "courseInfo");
        const courseDocSnapshot = await getDocs(courseCollectionRef);
        const docRef = courseDocSnapshot.docs[0].ref;
        const courseInfoMap = courseDocSnapshot.docs[0].data().courseInfoMap;
        const courseTimetableArray = courseInfoMap[courseId].timetable;
        for (let i = 0; i < courseTimetableArray.length; i++) {
          if (
            courseTimetableArray[i].classNo === classNo &&
            courseTimetableArray[i].startTime === startTime &&
            courseTimetableArray[i].endTime === endTime
          ) {
            courseTimetableArray[i].numOfStudents -= 1;
          }
        }
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
    const courseId = course[0];
    const day = course[2];
    const startTime = course[3];
    const endTime = course[4];
    const type = course[5];
    const classNo = course[6];
    for (let i = 0; i < userModules.length; i++) {
      const [userDay, userModuleCodeAndType, userTimeslot, classChosen] =
        userModules[i];
      if (
        day === userDay &&
        courseId + " " + type === userModuleCodeAndType &&
        startTime + " - " + endTime === userTimeslot &&
        classChosen === classNo
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
              <th>Course Code</th>
              <th>Day</th>
              <th>Timeslot</th>
              <th>Type</th>
              <th>Class</th>
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
                  <td>{course[7]}</td>
                  <td>
                    {isCourseAdded(course) ? (
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded"
                        type="button"
                        onClick={() => handleRemove(course)}
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded"
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
          pageLinkClassName="font-mono mx-2 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg"
          activeLinkClassName="bg-grey-200 text-white"
          previousLinkClassName="font-mono mx-2 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg"
          nextLinkClassName="font-mono mx-2 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg"
          breakClassName="mx-2"
        />
      </div>
    </div>
  );
};

export default CourseDisplay;
