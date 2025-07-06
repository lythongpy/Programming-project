import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions"; // ✅

const firebaseConfig = {
  apiKey: "AIzaSyBPb2eZ1JbW6PraxEoJvCagcvEud-zLfkY",
  authDomain: "final-e9d1a.firebaseapp.com",
  projectId: "final-e9d1a",
  storageBucket: "final-e9d1a.firebasestorage.app",
  messagingSenderId: "275854869666",
  appId: "1:275854869666:web:b5094bcd7aaf08dbe143fb",
  measurementId: "G-5199Z92Y3K"
};

const app = initializeApp(firebaseConfig); // ✅ must come first

// ✅ THEN export all services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app); // ✅ your fix
export { firebaseConfig };
