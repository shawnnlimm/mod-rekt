import { collection, getDocs } from "firebase/firestore";
import { fireStoreDB } from "../config/firebase";

let courseData = [];

async function getCourseData() {
  const courseCollectionRef = collection(fireStoreDB, "courses");
  const querySnapshot = await getDocs(courseCollectionRef);
  courseData = querySnapshot.docs.map((doc) => doc.data());
}

getCourseData();

export { courseData };
