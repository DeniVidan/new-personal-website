// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZUvBeseLTjox90m2yzt-mFf3lWF0T1y8",
  authDomain: "new-deni.firebaseapp.com",
  projectId: "new-deni",
  storageBucket: "new-deni.firebasestorage.app",
  messagingSenderId: "454894944259",
  appId: "1:454894944259:web:bbff5192cd707f06374e36",
  measurementId: "G-6GXQ4XBB9G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);