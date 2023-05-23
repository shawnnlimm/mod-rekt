import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDzrS61BWPaR9h9koylQzJSFiT0keZETqY",
  authDomain: "mod-rekt.firebaseapp.com",
  projectId: "mod-rekt",
  storageBucket: "mod-rekt.appspot.com",
  messagingSenderId: "982004405037",
  appId: "1:982004405037:web:0491106515065b9df5b9a4",
  measurementId: "G-3K6T9KZCYQ",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);