import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB65a29ROatJVzTNM2lmL8Pq849VLS0BPg",
  authDomain: "chat-app-577f7.firebaseapp.com",
  databaseURL: "https://chat-app-577f7-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "chat-app-577f7",
  storageBucket: "chat-app-577f7.firebasestorage.app",
  messagingSenderId: "874103785633",
  appId: "1:874103785633:web:f6551d5eaa78c4c3cf08e0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);