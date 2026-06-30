// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB65a29ROatJVzTNM2lmL8Pq849VLS0BPg",
  authDomain: "chat-app-577f7.firebaseapp.com",
  projectId: "chat-app-577f7",
  storageBucket: "chat-app-577f7.firebasestorage.app",
  messagingSenderId: "874103785633",
  appId: "1:874103785633:web:f6551d5eaa78c4c3cf08e0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);