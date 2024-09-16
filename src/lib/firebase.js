// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-78ba9.firebaseapp.com",
  projectId: "reactchat-78ba9",
  storageBucket: "reactchat-78ba9.appspot.com",
  messagingSenderId: "1082717921030",
  appId: "1:1082717921030:web:1c608b79eba780573e4887"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth() // auth part
export const db = getFirestore() // maintain the chat.
export const storage = getStorage() // store the img url