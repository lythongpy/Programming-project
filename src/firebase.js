import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBQ6Nf2ChTjmw2VRul7Rj0ZQtuLBBhMaBY",
    authDomain: "online-appointment-5af85.firebaseapp.com",
    projectId: "online-appointment-5af85",
    storageBucket: "online-appointment-5af85.firebasestorage.app",
    messagingSenderId: "1092926390854",
    appId: "1:1092926390854:web:96bb28e4eaabff043d0047",
    measurementId: "G-3VGQ26B817"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
