import axios from "axios";
import React from "react";
import { fireStoreDB } from "./config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const ScrapeModules = () => {
  async function addModulesToFirestore(modulesArray) {
    const dataToAdd = {
      courses: [],
    };

    // Modules array is an array of courses containing: [[CS1101S, Monday, 1200, 1500, Lecture, 4, LG12], ...]

    const promises = modulesArray.map((module) => {
      const courseCode = module[0];
      const day = module[1];
      const startTime = module[2];
      const endTime = module[3];
      const type = module[4];
      const courseCredits = module[5];
      const classNo = module[6];

      const newData = {
        courseId: courseCode,
        courseCredits: courseCredits,
        day: day,
        startTime: startTime,
        endTime: endTime,
        lessonType: type,
        numOfStudents: 0,
        classNo: classNo,
      };

      dataToAdd.courses.push(newData);
      return 1;
    });

    try {
      const results = await Promise.all(promises);

      /*
        Adding courseId to courseList collection
      */

      /*const courseListDocRef = doc(
        fireStoreDB,
        "courseList",
        "jO84KwqXFZ8j0fKz5vyc"
      );
      const courseListDocSnapshot = await getDoc(courseListDocRef);
      const courseListMap = courseListDocSnapshot.data().courseListMap;
      for (let i = 0; i < dataToAdd.courses.length; i++) {
        courseListMap[`${dataToAdd.courses[i].courseId}`] =
          dataToAdd.courses[i].courseId;
      }
      await setDoc(
        courseListDocRef,
        { courseListMap: courseListMap },
        { merge: true }
      );

      /* 
        Adding courseInfo to courseInfo collection
      */

      const courseInfoDocRef = doc(
        fireStoreDB,
        "courseInfo",
        "Q7P2stJFfiIuYpQnz994"
      );
      const courseInfoDocSnapshot = await getDoc(courseInfoDocRef);
      const courseInfoMap = courseInfoDocSnapshot.data().courseInfoMap;

      for (let i = 0; i < dataToAdd.courses.length; i++) {
        const courseCode = dataToAdd.courses[i].courseId;
        const courseCredits = dataToAdd.courses[i].courseCredits;
        const classNo = dataToAdd.courses[i].classNo;
        const day = dataToAdd.courses[i].day;
        const startTime = dataToAdd.courses[i].startTime;
        const endTime = dataToAdd.courses[i].endTime;
        const lessonType = dataToAdd.courses[i].lessonType;
        const numOfStudents = dataToAdd.courses[i].numOfStudents;
        if (courseCode in courseInfoMap) {
          const courseTimetableArray = courseInfoMap[courseCode].timetable;
          courseTimetableArray.push({
            classNo: classNo,
            day: day,
            startTime: startTime,
            endTime: endTime,
            lessonType: lessonType,
            numOfStudents: numOfStudents,
          });
        } else {
          courseInfoMap[courseCode] = {
            courseCredits: courseCredits,
            timetable: [
              {
                classNo: classNo,
                day: day,
                startTime: startTime,
                endTime: endTime,
                lessonType: lessonType,
                numOfStudents: numOfStudents,
              },
            ],
          };
        }
      }

      await setDoc(
        courseInfoDocRef,
        { courseInfoMap: courseInfoMap },
        { merge: true }
      );

      console.log("All documents added successfully:", results);
      return results;
    } catch (error) {
      console.error("Error adding documents:", error);
    }
  }

  const getMods = () => {
    axios
      .get("https://api.nusmods.com/v2/2023-2024/moduleList.json")
      .then((response) => {
        const moduleList = response.data.slice(1000, 2000); // [0-1000 DONE, 1000-2000, 2000-3000, 3000-4000, 4000-5000, 5000-6000, 6000-7000]

        const moduleCodeList = [];

        const axiosRequests = moduleList.map((module) => {
          const moduleCode = module.moduleCode;
          const endPoint = `https://api.nusmods.com/v2/2023-2024/modules/${moduleCode}.json`;

          return axios.get(endPoint).then((response) => {
            const moduleData = response.data;
            const moduleCredit = moduleData.moduleCredit;
            const semesterData = moduleData.semesterData[0];
            const classes = semesterData.timetable;
            for (let j = 0; j < classes.length; j++) {
              const day = classes[j].day;
              const type = classes[j].lessonType;
              const classNo = classes[j].classNo;
              moduleCodeList.push([
                moduleCode,
                day,
                classes[j].startTime,
                classes[j].endTime,
                type,
                moduleCredit,
                classNo,
              ]);
            }
          });
        });

        Promise.all(axiosRequests)
          .then(() => {
            addModulesToFirestore(moduleCodeList);
          })
          .catch((error) => {
            // Handle any errors during the requests
            console.error(error);
          });
      })
      .catch((error) => {
        // Handle any errors during the initial request
        console.error(error);
      });
  };

  // Make a GET request to the API endpoint

  /*return (
    <div>
      <button onClick={getMods}>Get Mods</button>
    </div>
  ); */
};

export default ScrapeModules;
