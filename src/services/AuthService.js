import { auth, db } from '../firebase/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  deleteDoc
} from 'firebase/firestore';

class AuthService {
  async register({ email, password, name, role }) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    await setDoc(doc(db, 'users', uid), {
      name,
      email,
      role
    });

    return userCredential;
  }

  async login({ email, password }) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }

  async getUserRole(uid) {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data().role;
    }
    return null;
  }

  async getAllUsers() {
    const snapshot = await getDocs(collection(db, 'users'));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  async deleteUser(uid) {
    await deleteDoc(doc(db, 'users', uid));
  }

  getCurrentUserId() {
    return auth.currentUser?.uid || null;
  }

  async getUserProfile(uid) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  }

  async updateUserProfile(uid, data) {
    const docRef = doc(db, "users", uid);
    await setDoc(docRef, data, { merge: true });
  }

  async getAllClients() {
    const snapshot = await getDocs(collection(db, "users"));
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(user => user.role === "client");
  }
}

const authService = new AuthService();
export default authService;
