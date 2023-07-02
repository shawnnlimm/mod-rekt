import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1z70S9jjyzBRFTyyTa6-0YBZWTL7r1Eg",
  authDomain: "modrekt-c681f.firebaseapp.com",
  projectId: "modrekt-c681f",
  storageBucket: "modrekt-c681f.appspot.com",
  messagingSenderId: "328709065549",
  appId: "1:328709065549:web:145e8e78bb70c2b7c88504",
  measurementId: "G-81TL7GEGY7",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const fireStoreDB = getFirestore(app);
