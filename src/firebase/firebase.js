import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAWTHevFbHalnq50dGujqOLzG6o7M8eKV4',
  authDomain: 'YOUR_Ppe-project-fcd86.firebaseapp.comROJECT.firebaseapp.com',
  projectId: 'pe-project-fcd86',
  storageBucket: 'pe-project-fcd86.firebasestorage.app.appspot.com',
  messagingSenderId: '688402531584',
  appId: '1:688402531584:web:38ed62bc16ffb30d15dfe5',
  measurementId: "G-ZQ2F8C2MDF"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
