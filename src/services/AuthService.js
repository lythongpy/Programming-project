import { auth, db } from '../firebase/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

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
    } else {
      return null;
    }
  }
}

const authService = new AuthService();
export default  authService;
