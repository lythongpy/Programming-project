import { auth, db, firebaseConfig } from '../firebase/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
} from 'firebase/auth';

import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';

import { initializeApp } from 'firebase/app';

// 👉 Create a secondary Firebase app for account creation
const secondaryApp = initializeApp(firebaseConfig, 'Secondary');
const secondaryAuth = getAuth(secondaryApp);

class AuthService {
  // ✅ Register new user without logging out admin
  async register({ email, password, name, role }) {
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    const uid = userCredential.user.uid;

    await setDoc(doc(db, 'users', uid), {
      name,
      email,
      role,
      createdAt: serverTimestamp()
    });

    // Optional: immediately sign out secondary auth session
    await secondaryAuth.signOut();

    return userCredential;
  }

  // ✅ Login
  async login({ email, password }) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }

  // ✅ Logout
  logout() {
    signOut(auth);
    localStorage.clear();
  }

  // ✅ Get current Firebase auth user
  getCurrentUser() {
    return auth.currentUser || null;
  }

  // ✅ Get current UID
  getCurrentUserId() {
    return auth.currentUser ? auth.currentUser.uid : null;
  }

  // ✅ Get user role from Firestore
  async getUserRole(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      return userDoc.exists() ? userDoc.data().role : null;
    } catch (err) {
      console.error("Error getting user role:", err);
      return null;
    }
  }

  // ✅ Get all users
  async getAllUsers() {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (err) {
      console.error("Error fetching users:", err);
      return [];
    }
  }

  // ✅ Get user Firestore profile
  async getUserProfile(uid) {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (err) {
      console.error("Error fetching user profile:", err);
      return null;
    }
  }

  // ✅ Update Firestore user data
  async updateUserProfile(uid, data) {
    try {
      if (!uid || typeof uid !== 'string') {
        throw new Error("Invalid UID passed to updateUserProfile.");
      }

      const docRef = doc(db, "users", uid);
      await setDoc(docRef, data, { merge: true });
      return true;
    } catch (err) {
      console.error("❌ Failed to update user:", err);
      throw err;
    }
  }

  // ✅ Get all clients
  async getAllClients() {
    try {
      const snapshot = await getDocs(collection(db, "users"));
      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.role === "client");
    } catch (err) {
      console.error("Error fetching clients:", err);
      return [];
    }
  }

  // ✅ Subscribe to all users in real time (admin view)
  subscribeToAllUsersRealtime(callback) {
    return onSnapshot(collection(db, "users"), (snapshot) => {
      const userList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(userList);
    });
  }
}

const authService = new AuthService();
export default authService;