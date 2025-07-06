import { auth, db } from "../firebase/firebase";
import {
  deleteUser as firebaseDeleteUser,
  getAuth,
} from "firebase/auth";

import {
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  getDocs,
  collection,
} from "firebase/firestore";

const AdminService = {
  async deleteUserOrClient(id, role) {
    // Step 1: Delete Firebase Auth (optional fallback)
    try {
      const userDoc = await getDoc(doc(db, "users", id));
      if (userDoc.exists()) {
        const email = userDoc.data().email;
        const userAuth = getAuth();
        const user = await userAuth.getUserByEmail?.(email);
        if (user) await firebaseDeleteUser(user);
      }
    } catch (err) {
      console.warn("⚠️ Skipped Firebase Auth delete:", err.message);
    }

    // Step 2: Delete Firestore user + profile
    const profilePath = role === "client" ? "client_profiles" : "user_profiles";
    await deleteDoc(doc(db, "users", id));
    await deleteDoc(doc(db, profilePath, id));

    // Step 3: Scan and clean appointments
    const appointments = await getDocs(collection(db, "appointments"));

    for (const snap of appointments.docs) {
      const appt = snap.data();
      const apptId = snap.id;

      const userMatch = appt.userId === id;
      const clientMatch = appt.client?.id === id;

      if (!userMatch && !clientMatch) continue;

      const [userDocCheck, clientDocCheck] = await Promise.all([
        appt.userId ? getDoc(doc(db, "users", appt.userId)) : { exists: () => false },
        appt.client?.id ? getDoc(doc(db, "users", appt.client.id)) : { exists: () => false },
      ]);

      const userGone = !userDocCheck.exists();
      const clientGone = !clientDocCheck.exists();

      const shouldDelete = appt.status !== "Completed" || (userGone && clientGone);

      if (shouldDelete) {
        await deleteDoc(doc(db, "appointments", apptId));
      } else {
        const updates = {};
        if (userMatch) updates.bookedBy = "deleted User";
        if (clientMatch) updates["client.name"] = "deleted Client";
        if (Object.keys(updates).length > 0) {
          await updateDoc(doc(db, "appointments", apptId), updates);
        }
      }
    }

    console.log(`✅ Deleted ${role} ${id} and cleaned up appointments.`);
  },
};

export default AdminService;
