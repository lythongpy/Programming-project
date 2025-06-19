import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAWTHevFbHalnq50dGujqOLzG6o7M8eKV4',
  authDomain: 'pe-project-fcd86.firebaseapp.com',
  projectId: 'pe-project-fcd86',
  storageBucket: 'pe-project-fcd86.appspot.com',
  messagingSenderId: '688402531584',
  appId: '1:688402531584:web:38ed62bc16ffb30d15dfe5',
  measurementId: 'G-ZQ2F8C2MDF'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 
export { firebaseConfig };