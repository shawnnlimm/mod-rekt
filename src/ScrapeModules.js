import axios from "axios";
import React from "react";
import { fireStoreDB } from "./config/firebase";
import { collection, addDoc } from "firebase/firestore";

const ScrapeModules = () => {
  async function addModulesToFirestore(modulesArray) {
    const dataToAdd = {
      courses: [],
    };

    const promises = modulesArray.map(async (module) => {
      const courseCode = module[0];
      const day = module[1];
      const startTime = module[2];
      const endTime = module[3];
      const type = module[4];
      const courseCredits = module[5];

      const newData = {
        courseId: courseCode,
        courseCredits: courseCredits,
        timetable: {
          day: day,
          startTime: startTime,
          endTime: endTime,
          lessonType: type,
          numOfStudents: 0,
        },
      };

      dataToAdd.courses.push(newData);
    });

    try {
      const results = await Promise.all(promises);
      const collectionDocRef = await addDoc(
        collection(fireStoreDB, "courses"),
        dataToAdd
      );
      console.log("Document added successfully:", collectionDocRef.id);
      console.log("All documents added successfully:", results);
      return collectionDocRef;
    } catch (error) {
      console.error("Error adding documents:", error);
    }
  }

  const getMods = () => {
    axios
      .get("https://api.nusmods.com/v2/2023-2024/moduleList.json")
      .then((response) => {
        const moduleList = response.data.slice(0, 5);

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
              moduleCodeList.push([
                moduleCode,
                day,
                classes[j].startTime,
                classes[j].endTime,
                type,
                moduleCredit,
              ]);
            }
          });
        });

        Promise.all(axiosRequests)
          .then(() => {
            //console.log(moduleCodeList);
            //console.log(moduleCodeList.length);
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

  /*
  return (
    <div>
      <button onClick={getMods}>Get Mods</button>
    </div>
  );
  */
};

export default ScrapeModules;
